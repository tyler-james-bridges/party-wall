import { NextRequest, NextResponse } from "next/server";
import { addPhoto, listPhotos } from "@/lib/store";

export const runtime = "nodejs";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/heic": ".heic",
};

const MAX_SIZE = 15 * 1024 * 1024;

export async function GET() {
  const photos = await listPhotos();
  return NextResponse.json({ photos });
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("photo");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No photo provided" }, { status: 400 });
  }
  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image too large (max 15MB)" }, { status: 400 });
  }
  const caption = String(form.get("caption") ?? "").slice(0, 200);
  const uploadedBy = String(form.get("uploadedBy") ?? "").slice(0, 60);
  const memoryMonth =
    String(form.get("memoryMonth") ?? "") || new Date().toISOString().slice(0, 7);

  const buffer = Buffer.from(await file.arrayBuffer());
  const photo = await addPhoto({ buffer, extension, caption, uploadedBy, memoryMonth });
  return NextResponse.json({ photo }, { status: 201 });
}
