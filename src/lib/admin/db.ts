import fs from "node:fs";
import path from "node:path";
import { migrate } from "./schema.mjs";

export type Row = Record<string, unknown>;
export interface Statement {
  run(...params: unknown[]): { changes: number | bigint; lastInsertRowid: number | bigint };
  get(...params: unknown[]): Row | undefined;
  all(...params: unknown[]): Row[];
}
export interface Database {
  exec(sql: string): void;
  prepare(sql: string): Statement;
  close(): void;
}

const globalForDb = globalThis as unknown as { __ixlosDb?: Database; __ixlosDbInode?: number | bigint };

// Node's built-in SQLite (no native module to ship). Loaded at runtime so bundlers never try to resolve it.
// The handle is reopened if the file was deleted or replaced (e.g. restored from a backup) underneath it.
export function getDb(): Database {
  const file = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "ixlos.db");
  const inode = fs.existsSync(file) ? fs.statSync(file).ino : undefined;
  if (globalForDb.__ixlosDb && inode !== undefined && globalForDb.__ixlosDbInode === inode) return globalForDb.__ixlosDb;

  try {
    globalForDb.__ixlosDb?.close();
  } catch {
    // The old handle is already unusable; nothing to release.
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const sqlite = process.getBuiltinModule("node:sqlite") as unknown as { DatabaseSync: new (file: string) => Database };
  const db = new sqlite.DatabaseSync(file);
  migrate(db);
  globalForDb.__ixlosDb = db;
  globalForDb.__ixlosDbInode = fs.statSync(file).ino;
  return db;
}
