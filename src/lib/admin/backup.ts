import fs from "node:fs";
import path from "node:path";
import { getDb } from "./db";

// Copies of the database kept next to it (same volume). They protect against a bad edit or a corrupted file; they
// do NOT replace a server-level backup (DigitalOcean Backups), because they live on the same disk.

const KEEP = 14;
const NAME_RE = /^ixlos-\d{8}-\d{6}\.db$/;

export function dbFile() {
  return process.env.DATABASE_PATH || path.join(process.cwd(), "data", "ixlos.db");
}

export function backupDir() {
  return process.env.BACKUP_DIR || path.join(path.dirname(dbFile()), "backups");
}

export type BackupInfo = { name: string; size: number; createdAt: number };

export function listBackups(): BackupInfo[] {
  const dir = backupDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => NAME_RE.test(name))
    .map((name) => {
      const stat = fs.statSync(path.join(dir, name));
      return { name, size: stat.size, createdAt: stat.mtimeMs };
    })
    .sort((a, b) => b.createdAt - a.createdAt);
}

/** Absolute path of a backup file, or null when the name is not one of ours (blocks path tricks). */
export function backupPath(name: string): string | null {
  if (!NAME_RE.test(name)) return null;
  const file = path.join(backupDir(), name);
  return fs.existsSync(file) ? file : null;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function createBackup(): BackupInfo {
  const dir = backupDir();
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const now = new Date();
  const name = `ixlos-${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}-${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}.db`;
  const file = path.join(dir, name);
  // VACUUM INTO writes a consistent, compacted copy while the site keeps running.
  getDb().exec(`VACUUM INTO '${file.replace(/'/g, "''")}'`);
  fs.chmodSync(file, 0o600);
  for (const old of listBackups().slice(KEEP)) fs.rmSync(path.join(dir, old.name), { force: true });
  const stat = fs.statSync(file);
  return { name, size: stat.size, createdAt: stat.mtimeMs };
}

const DAY_MS = 86_400_000;

/** Creates a backup if the newest one is more than a day old. */
export function backupIfDue() {
  const newest = listBackups()[0];
  if (!newest || Date.now() - newest.createdAt > DAY_MS) return createBackup();
  return null;
}

export function databaseSize() {
  try {
    return fs.statSync(dbFile()).size;
  } catch {
    return 0;
  }
}
