import { NextRequest, NextResponse } from "next/server";
import { readPhotoFile } from "@/lib/store";

export const runtime = "nodejs";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".heic": "image/heic",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const buffer = await readPhotoFile(filename);
  if (!buffer) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const ext = filename.slice(filename.lastIndexOf("."));
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
