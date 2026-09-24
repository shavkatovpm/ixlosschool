import { getDb, type Row } from "./db";

export const LEAD_STATUSES = ["new", "contacted", "exam", "accepted", "rejected"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Yangi",
  contacted: "Qo'ng'iroq qilindi",
  exam: "Imtihonga yozildi",
  accepted: "Qabul qilindi",
  rejected: "Rad etildi",
};

export const isLeadStatus = (value: unknown): value is LeadStatus => LEAD_STATUSES.includes(value as LeadStatus);

export type Lead = {
  id: number;
  createdAt: number;
  name: string;
  phone: string;
  grade: string;
  locale: string;
  status: LeadStatus;
  note: string;
};

const toLead = (row: Row): Lead => ({
  id: Number(row.id),
  createdAt: Number(row.created_at),
  name: String(row.name),
  phone: String(row.phone),
  grade: String(row.grade),
  locale: String(row.locale),
  status: isLeadStatus(row.status) ? row.status : "new",
  note: String(row.note ?? ""),
});

export function insertLead(lead: { name: string; phone: string; grade: string; locale: string }) {
  const now = Date.now();
  getDb()
    .prepare("INSERT INTO leads (created_at, updated_at, name, phone, grade, locale) VALUES (?, ?, ?, ?, ?, ?)")
    .run(now, now, lead.name, lead.phone, lead.grade, lead.locale);
}

type Filter = { status?: LeadStatus; q?: string };

function where({ status, q }: Filter) {
  const clauses: string[] = [];
  const params: unknown[] = [];
  if (status) {
    clauses.push("status = ?");
    params.push(status);
  }
  if (q) {
    clauses.push("(name LIKE ? ESCAPE '\\' OR phone LIKE ? ESCAPE '\\' OR note LIKE ? ESCAPE '\\')");
    const like = `%${q.replace(/[\\%_]/g, "\\$&")}%`;
    params.push(like, like, like);
  }
  return { sql: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "", params };
}

export function listLeads(filter: Filter, limit: number, offset: number) {
  const { sql, params } = where(filter);
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

export function statusCounts(): Record<LeadStatus | "all", number> {
  const counts = { all: 0, new: 0, contacted: 0, exam: 0, accepted: 0, rejected: 0 };
  for (const row of getDb().prepare("SELECT status, COUNT(*) AS c FROM leads GROUP BY status").all()) {
    const c = Number(row.c);
    counts.all += c;
    if (isLeadStatus(row.status)) counts[row.status] = c;
  }
  return counts;
}

function leadsSince(timestamp: number) {
  return Number(getDb().prepare("SELECT COUNT(*) AS c FROM leads WHERE created_at >= ?").get(timestamp)?.c ?? 0);
}

export const leadsToday = () => leadsSince(startOfTodayTashkent());
export const leadsInLastDays = (days: number) => leadsSince(Date.now() - days * 24 * 60 * 60 * 1000);

export function updateLead(id: number, status: LeadStatus, note: string) {
  getDb().prepare("UPDATE leads SET status = ?, note = ?, updated_at = ? WHERE id = ?").run(status, note, Date.now(), id);
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

/** Start of the current day in Tashkent (UTC+5, no DST) as a UTC timestamp. */
export function startOfTodayTashkent(now = Date.now()) {
  const offset = 5 * 60 * 60 * 1000;
  return Math.floor((now + offset) / 86_400_000) * 86_400_000 - offset;
}
