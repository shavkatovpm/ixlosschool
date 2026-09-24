import { adminEnabled } from "./admin/config";
import { getDb } from "./admin/db";

// Values edited in the admin panel. The public site must never fail because of the database, so reads
// return null (= "use the built-in default") on any problem, and are skipped entirely where there is no panel.

export function readSetting<T>(key: string): T | null {
  if (!adminEnabled()) return null;
  try {
    const row = getDb().prepare("SELECT value FROM settings WHERE key = ?").get(key);
    return row ? (JSON.parse(String(row.value)) as T) : null;
  } catch (error) {
    console.error(`[settings] could not read "${key}":`, error);
    return null;
  }
}

export function writeSetting(key: string, value: unknown) {
  getDb()
    .prepare(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    )
    .run(key, JSON.stringify(value), Date.now());
}

export function settingUpdatedAt(key: string): number | null {
  if (!adminEnabled()) return null;
  try {
    const row = getDb().prepare("SELECT updated_at FROM settings WHERE key = ?").get(key);
    return row ? Number(row.updated_at) : null;
  } catch {
    return null;
  }
}
