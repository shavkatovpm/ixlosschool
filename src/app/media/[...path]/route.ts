import fs from "node:fs";
import { Readable } from "node:stream";
import { uploadFile } from "@/lib/admin/uploads";

export const dynamic = "force-dynamic";

// Serves images uploaded in the admin panel. File names are random and never reused, so they can be cached for good.
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const file = uploadFile(path);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(Readable.toWeb(fs.createReadStream(file)) as ReadableStream, {
    headers: {
      "Content-Type": "image/webp",
      "Content-Length": String(fs.statSync(file).size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
