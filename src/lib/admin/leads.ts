import { getDb, type Row } from "./db";

// Applications are an archive of what the site form received (the admissions team works from Telegram),
// so there is deliberately no status/notes workflow here.
export type Lead = {
  id: number;
  createdAt: number;
  name: string;
  phone: string;
  grade: string;
  locale: string;
};

const toLead = (row: Row): Lead => ({
  id: Number(row.id),
  createdAt: Number(row.created_at),
  name: String(row.name),
  phone: String(row.phone),
  grade: String(row.grade),
  locale: String(row.locale),
});

export function insertLead(lead: { name: string; phone: string; grade: string; locale: string }) {
  const now = Date.now();
  getDb()
    .prepare("INSERT INTO leads (created_at, updated_at, name, phone, grade, locale) VALUES (?, ?, ?, ?, ?, ?)")
    .run(now, now, lead.name, lead.phone, lead.grade, lead.locale);
}

function where(q?: string) {
  if (!q) return { sql: "", params: [] as unknown[] };
  const like = `%${q.replace(/[\\%_]/g, "\\$&")}%`;
  return { sql: "WHERE name LIKE ? ESCAPE '\\' OR phone LIKE ? ESCAPE '\\'", params: [like, like] };
}

export function listLeads(q: string | undefined, limit: number, offset: number) {
  const { sql, params } = where(q);
  const db = getDb();
  const total = Number(db.prepare(`SELECT COUNT(*) AS c FROM leads ${sql}`).get(...params)?.c ?? 0);
  const rows = db
    .prepare(`SELECT * FROM leads ${sql} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`)
    .all(...params, limit, offset)
    .map(toLead);
  return { rows, total };
}

export function allLeads() {
  return getDb().prepare("SELECT * FROM leads ORDER BY created_at DESC, id DESC").all().map(toLead);
}

export function leadsTotal() {
  return Number(getDb().prepare("SELECT COUNT(*) AS c FROM leads").get()?.c ?? 0);
}

const TASHKENT = "Asia/Tashkent";
export function formatDateTime(timestamp: number) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TASHKENT,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(timestamp);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("day")}.${get("month")}.${get("year")} ${get("hour")}:${get("minute")}`;
}
