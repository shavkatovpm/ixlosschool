import fs from "node:fs";
import path from "node:path";
import { getDb } from "./db";
import { databaseSize } from "./backup";

/** Release id written by scripts/deploy-droplet.sh (absent locally). */
export function releaseId() {
  try {
    return fs.readFileSync(path.join(process.cwd(), "RELEASE"), "utf8").trim() || "—";
  } catch {
    return "lokal / noma'lum";
  }
}

export function systemInfo() {
  const db = getDb();
  const count = (table: string) => Number(db.prepare(`SELECT COUNT(*) AS c FROM ${table}`).get()?.c ?? 0);
  return {
    release: releaseId(),
    node: process.version,
    dbSize: databaseSize(),
    leads: count("leads"),
    pageviews: count("pageviews"),
    schemaVersion: Number(db.prepare("SELECT MAX(version) AS v FROM schema_version").get()?.v ?? 0),
    uptimeMinutes: Math.round(process.uptime() / 60),
  };
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
