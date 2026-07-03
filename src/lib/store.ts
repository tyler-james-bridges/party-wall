import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export type Photo = {
  id: string;
  filename: string;
  caption: string;
  uploadedBy: string;
  /** ISO month (YYYY-MM) the memory is from, for the timeline */
  memoryMonth: string;
  createdAt: string;
};

const DATA_DIR = process.env.PARTY_WALL_DATA_DIR ?? path.join(process.cwd(), "data");
const PHOTOS_DIR = path.join(DATA_DIR, "photos");
const INDEX_FILE = path.join(DATA_DIR, "photos.json");

async function ensureDirs() {
  await fs.mkdir(PHOTOS_DIR, { recursive: true });
}

let indexLock: Promise<unknown> = Promise.resolve();

function withIndexLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = indexLock.then(fn, fn);
  indexLock = run.catch(() => undefined);
  return run;
}

export async function listPhotos(): Promise<Photo[]> {
  try {
    const raw = await fs.readFile(INDEX_FILE, "utf8");
    return JSON.parse(raw) as Photo[];
  } catch {
    return [];
  }
}

export async function addPhoto(input: {
  buffer: Buffer;
  extension: string;
  caption: string;
  uploadedBy: string;
  memoryMonth: string;
}): Promise<Photo> {
  await ensureDirs();
  const id = crypto.randomUUID();
  const filename = `${id}${input.extension}`;
  await fs.writeFile(path.join(PHOTOS_DIR, filename), input.buffer);
  const photo: Photo = {
    id,
    filename,
    caption: input.caption,
    uploadedBy: input.uploadedBy,
    memoryMonth: input.memoryMonth,
    createdAt: new Date().toISOString(),
  };
  await withIndexLock(async () => {
    const photos = await listPhotos();
    photos.push(photo);
    await fs.writeFile(INDEX_FILE, JSON.stringify(photos, null, 2));
  });
  return photo;
}

export async function readPhotoFile(filename: string): Promise<Buffer | null> {
  const safe = path.basename(filename);
  try {
    return await fs.readFile(path.join(PHOTOS_DIR, safe));
  } catch {
    return null;
  }
}
