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
}

const globalForDb = globalThis as unknown as { __ixlosDb?: Database };

// Node's built-in SQLite (no native module to ship). Loaded at runtime so bundlers never try to resolve it.
export function getDb(): Database {
  if (globalForDb.__ixlosDb) return globalForDb.__ixlosDb;
  const file = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "ixlos.db");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const sqlite = process.getBuiltinModule("node:sqlite") as unknown as { DatabaseSync: new (file: string) => Database };
  const db = new sqlite.DatabaseSync(file);
  migrate(db);
  globalForDb.__ixlosDb = db;
  return db;
}
