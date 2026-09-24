import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { dbFile } from "./backup";

// Images uploaded in the panel are re-encoded (EXIF rotation applied, metadata dropped, resized, WebP) and kept next to
// the database, in the persistent volume, then served by /media/[...path]. Nothing the browser sends is stored as-is.

export type UploadKind = "teachers" | "testimonials" | "articles";
export const UPLOAD_KINDS: readonly UploadKind[] = ["teachers", "testimonials", "articles"];

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp", "avif"]);
const FILE_RE = /^[a-f0-9]{16,32}\.webp$/;

export const uploadDir = () => process.env.UPLOAD_DIR || path.join(path.dirname(dbFile()), "uploads");

export class UploadError extends Error {}

export type ImageOptions = { width: number; height?: number; quality?: number; position?: "centre" | "attention" };

export async function saveImageBuffer(input: Buffer, kind: UploadKind, options: ImageOptions): Promise<string> {
  let pipeline: ReturnType<typeof sharp>;
  try {
    pipeline = sharp(input, { limitInputPixels: 80_000_000 });
    const meta = await pipeline.metadata();
    if (!meta.format || !ALLOWED_FORMATS.has(meta.format)) throw new UploadError("Rasm JPG, PNG yoki WebP formatida bo'lsin.");
  } catch (error) {
    if (error instanceof UploadError) throw error;
    throw new UploadError("Fayl rasm sifatida o'qilmadi. JPG, PNG yoki WebP yuklang.");
  }
  const output = await pipeline
    .rotate()
    .resize({ width: options.width, height: options.height, fit: "cover", position: options.position ?? "attention", withoutEnlargement: !options.height })
    .webp({ quality: options.quality ?? 82 })
    .toBuffer();

  const name = `${randomBytes(12).toString("hex")}.webp`;
  const dir = path.join(uploadDir(), kind);
  fs.mkdirSync(dir, { recursive: true, mode: 0o750 });
  fs.writeFileSync(path.join(dir, name), output, { mode: 0o640 });
  return `/media/${kind}/${name}`;
}

/** Saves a file from a form; returns null when the field is empty. */
export async function saveImageFile(file: FormDataEntryValue | null, kind: UploadKind, options: ImageOptions): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("Rasm hajmi 10 MB dan oshmasin.");
  return saveImageBuffer(Buffer.from(await file.arrayBuffer()), kind, options);
}

/** Absolute path for a served upload, or null if the request is not one of ours. */
export function uploadFile(segments: string[]): string | null {
  if (segments.length !== 2) return null;
  const [kind, name] = segments;
  if (!(UPLOAD_KINDS as readonly string[]).includes(kind) || !FILE_RE.test(name)) return null;
  const file = path.join(uploadDir(), kind, name);
  return fs.existsSync(file) ? file : null;
}

/** Removes a previously uploaded file (a no-op for the site's own bundled images). */
export function deleteUpload(url: string | null | undefined) {
  if (!url?.startsWith("/media/")) return;
  const file = uploadFile(url.slice("/media/".length).split("/"));
  if (file) fs.rmSync(file, { force: true });
}
