import fs from "node:fs";
import { Readable } from "node:stream";
import { getSession } from "@/lib/admin/auth";
import { adminEnabled } from "@/lib/admin/config";
import { backupPath } from "@/lib/admin/backup";

export const dynamic = "force-dynamic";

// The backup holds every stored application (names and phone numbers): only a signed-in admin may download it.
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  if (!adminEnabled() || !(await getSession())) return new Response("Unauthorized", { status: 401 });
  const { name } = await params;
  const file = backupPath(name);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(Readable.toWeb(fs.createReadStream(file)) as ReadableStream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Content-Length": String(fs.statSync(file).size),
      "Cache-Control": "no-store",
    },
  });
}
