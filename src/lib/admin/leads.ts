import { getDb, type Row } from "./db";
import { addDays, dayStart } from "./analytics";

// Applications are an archive of what the site form received (the admissions team works from Telegram),
// so there is deliberately no status/notes workflow here.
export type Lead = {
  id: number;
  createdAt: number;
  name: string;
  phone: string;
  grade: string;
  locale: string;
  source: string;
  medium: string;
  campaign: string;
  landing: string;
  device: string;
};

const toLead = (row: Row): Lead => ({
  id: Number(row.id),
  createdAt: Number(row.created_at),
  name: String(row.name),
  phone: String(row.phone),
  grade: String(row.grade),
  locale: String(row.locale),
  source: String(row.source ?? ""),
  medium: String(row.medium ?? ""),
  campaign: String(row.campaign ?? ""),
  landing: String(row.landing ?? ""),
  device: String(row.device ?? ""),
});

export type NewLead = {
  name: string;
  phone: string;
  grade: string;
  locale: string;
  source?: string;
  medium?: string;
  campaign?: string;
  landing?: string;
  device?: string;
};

export function insertLead(lead: NewLead) {
  const now = Date.now();
  getDb()
    .prepare(
      `INSERT INTO leads (created_at, updated_at, name, phone, grade, locale, source, medium, campaign, landing, device)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(now, now, lead.name, lead.phone, lead.grade, lead.locale, lead.source ?? "", lead.medium ?? "", lead.campaign ?? "", lead.landing ?? "", lead.device ?? "");
}

export type LeadFilter = {
  q?: string;
  /** Inclusive Tashkent calendar days, YYYY-MM-DD. */
  from?: string;
  to?: string;
  source?: string;
  locale?: string;
  grade?: string;
};

export const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

function where(filter: LeadFilter) {
  const clauses: string[] = [];
  const params: unknown[] = [];
  if (filter.q) {
    const like = `%${filter.q.replace(/[\\%_]/g, "\\$&")}%`;
    clauses.push("(name LIKE ? ESCAPE '\\' OR phone LIKE ? ESCAPE '\\')");
    params.push(like, like);
  }
  if (filter.from && DAY_RE.test(filter.from)) {
    clauses.push("created_at >= ?");
    params.push(dayStart(filter.from));
  }
  if (filter.to && DAY_RE.test(filter.to)) {
    clauses.push("created_at < ?");
    params.push(dayStart(addDays(filter.to, 1)));
  }
  if (filter.source) {
    clauses.push("source = ?");
    params.push(filter.source === "unknown" ? "" : filter.source);
  }
  if (filter.locale) {
    clauses.push("locale = ?");
    params.push(filter.locale);
  }
  if (filter.grade) {
    clauses.push("grade = ?");
    params.push(filter.grade);
  }
  return { sql: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "", params };
}

export function listLeads(filter: LeadFilter, limit: number, offset: number) {
  const { sql, params } = where(filter);
  const db = getDb();
  const total = Number(db.prepare(`SELECT COUNT(*) AS c FROM leads ${sql}`).get(...params)?.c ?? 0);
  const rows = db
    .prepare(`SELECT * FROM leads ${sql} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`)
    .all(...params, limit, offset)
    .map(toLead);
  return { rows, total };
}

export function allLeads(filter: LeadFilter = {}) {
  const { sql, params } = where(filter);
  return getDb()
    .prepare(`SELECT * FROM leads ${sql} ORDER BY created_at DESC, id DESC`)
    .all(...params)
    .map(toLead);
}

export function leadsTotal() {
  return Number(getDb().prepare("SELECT COUNT(*) AS c FROM leads").get()?.c ?? 0);
}

export function recentLeads(limit: number) {
  return getDb().prepare("SELECT * FROM leads ORDER BY created_at DESC, id DESC LIMIT ?").all(limit).map(toLead);
}

/** Sources that appear on stored leads, for the filter dropdown. "" (no attribution) is reported as "unknown". */
export function leadSources() {
  return getDb()
    .prepare("SELECT source, COUNT(*) AS c FROM leads GROUP BY source ORDER BY c DESC")
    .all()
    .map((r) => ({ source: String(r.source) || "unknown", count: Number(r.c) }));
}

export function leadGrades() {
  return getDb()
    .prepare("SELECT grade, COUNT(*) AS c FROM leads GROUP BY grade")
    .all()
    .map((r) => ({ grade: String(r.grade), count: Number(r.c) }))
    .sort((a, b) => Number(a.grade) - Number(b.grade));
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
