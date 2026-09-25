import { createHash, randomBytes } from "node:crypto";
import { getDb } from "./db";
import {
  classifySource,
  detectBot,
  parseBrowser,
  parseDevice,
  type BotInfo,
} from "../analytics-shared";

// First-party, cookieless statistics. Nothing that identifies a person is stored: a "visitor" is
// sha256(today's random salt + IP + user agent), and the salt of past days is deleted, so a hash can
// neither be reversed nor linked to the same person on another day.

const TZ_OFFSET_MS = 5 * 3600 * 1000; // Asia/Tashkent has no daylight saving
const DAY_MS = 86_400_000;
const RETENTION_DAYS = 400;

export const LOCALES = ["uz", "ru", "en"] as const;

export const dayOf = (timestamp: number) => new Date(timestamp + TZ_OFFSET_MS).toISOString().slice(0, 10);
export const today = () => dayOf(Date.now());
export const addDays = (day: string, delta: number) => new Date(Date.parse(`${day}T00:00:00Z`) + delta * DAY_MS).toISOString().slice(0, 10);
/** Start of a Tashkent calendar day, as a UTC timestamp. */
export const dayStart = (day: string) => Date.parse(`${day}T00:00:00Z`) - TZ_OFFSET_MS;

function saltFor(day: string) {
  const db = getDb();
  const existing = db.prepare("SELECT salt FROM daily_salts WHERE day = ?").get(day)?.salt;
  if (typeof existing === "string") return existing;
  const salt = randomBytes(16).toString("hex");
  db.prepare("INSERT OR IGNORE INTO daily_salts (day, salt) VALUES (?, ?)").run(day, salt);
  db.prepare("DELETE FROM daily_salts WHERE day < ?").run(addDays(day, -1));
  return String(db.prepare("SELECT salt FROM daily_salts WHERE day = ?").get(day)?.salt);
}

/** "/uz/results/" -> { locale: "uz", path: "/results" }; the home page is "/". Null for anything that is not a site page. */
export function normalizePagePath(raw: string): { locale: string; path: string } | null {
  const clean = raw.split(/[?#]/)[0];
  const match = /^\/(uz|ru|en)(\/[a-z0-9\-_/]*)?$/i.exec(clean);
  if (!match || clean.length > 160) return null;
  const path = (match[2] ?? "").replace(/\/+$/, "").toLowerCase();
  return { locale: match[1].toLowerCase(), path: path || "/" };
}

let lastPrune = 0;
function maybePrune() {
  const now = Date.now();
  if (now - lastPrune < DAY_MS) return;
  lastPrune = now;
  getDb().prepare("DELETE FROM pageviews WHERE at < ?").run(now - RETENTION_DAYS * DAY_MS);
}

type ViewInput = {
  path: string;
  ip: string;
  userAgent: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

/**
 * Records one page view from a browser (sent by the site's beacon). Crawlers are ignored here: the proxy already
 * logs their requests, and counting them twice would inflate the bot table.
 */
export function recordPageview(input: ViewInput) {
  const page = normalizePagePath(input.path);
  if (!page || detectBot(input.userAgent)) return false;
  const now = Date.now();
  const day = dayOf(now);
  const attribution = classifySource(input);
  const visitor = createHash("sha256").update(`${saltFor(day)}|${input.ip}|${input.userAgent}`).digest("hex").slice(0, 24);
  getDb()
    .prepare(
      `INSERT INTO pageviews (at, day, path, locale, visitor, source, medium, campaign, device, browser, kind)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'human')`,
    )
    .run(
      now,
      day,
      page.path,
      page.locale,
      visitor,
      attribution.source,
      attribution.medium,
      attribution.campaign,
      parseDevice(input.userAgent),
      parseBrowser(input.userAgent),
    );
  maybePrune();
  return true;
}

/** Records a crawler request seen by the proxy (crawlers do not run the browser beacon). */
export function recordBotHit(pathname: string, bot: BotInfo) {
  const page = normalizePagePath(pathname);
  if (!page) return;
  const now = Date.now();
  getDb()
    .prepare(
      `INSERT INTO pageviews (at, day, path, locale, kind, bot, bot_kind, source, medium)
       VALUES (?, ?, ?, ?, 'bot', ?, ?, 'bot', 'bot')`,
    )
    .run(now, dayOf(now), page.path, page.locale, bot.name, bot.kind);
  maybePrune();
}

// ---- reading ---------------------------------------------------------------------------------

export type Range = { from: string; to: string };

/** A range of `days` days ending today, and the equally long range right before it (for the "vs previous" deltas). */
export function rangeOf(days: number): { current: Range; previous: Range } {
  const to = today();
  const from = addDays(to, -(days - 1));
  return { current: { from, to }, previous: { from: addDays(from, -days), to: addDays(from, -1) } };
}

export function eachDay(range: Range) {
  const days: string[] = [];
  for (let d = range.from; d <= range.to; d = addDays(d, 1)) days.push(d);
  return days;
}

const num = (value: unknown) => Number(value ?? 0);

export type Totals = { views: number; visitors: number; leads: number };

export function totals(range: Range): Totals {
  const db = getDb();
  const v = db
    .prepare(
      `SELECT COUNT(*) AS views, COUNT(DISTINCT day || visitor) AS visitors
       FROM pageviews WHERE kind = 'human' AND day BETWEEN ? AND ?`,
    )
    .get(range.from, range.to);
  const l = db.prepare("SELECT COUNT(*) AS c FROM leads WHERE created_at >= ? AND created_at < ?").get(dayStart(range.from), dayStart(addDays(range.to, 1)));
  return { views: num(v?.views), visitors: num(v?.visitors), leads: num(l?.c) };
}

export type DayPoint = { day: string; views: number; visitors: number; leads: number };

export function dailySeries(range: Range): DayPoint[] {
  const db = getDb();
  const views = new Map(
    db
      .prepare(
        `SELECT day, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors
         FROM pageviews WHERE kind = 'human' AND day BETWEEN ? AND ? GROUP BY day`,
      )
      .all(range.from, range.to)
      .map((r) => [String(r.day), r]),
  );
  const leadDays = new Map<string, number>();
  for (const r of db
    .prepare("SELECT created_at FROM leads WHERE created_at >= ? AND created_at < ?")
    .all(dayStart(range.from), dayStart(addDays(range.to, 1)))) {
    const d = dayOf(num(r.created_at));
    leadDays.set(d, (leadDays.get(d) ?? 0) + 1);
  }
  return eachDay(range).map((day) => ({
    day,
    views: num(views.get(day)?.views),
    visitors: num(views.get(day)?.visitors),
    leads: leadDays.get(day) ?? 0,
  }));
}

export type Counted = { key: string; views: number; visitors: number };

function grouped(column: "path" | "locale" | "device" | "browser" | "campaign", range: Range, limit: number, extra = ""): Counted[] {
  return getDb()
    .prepare(
      `SELECT ${column} AS key, COUNT(*) AS views, COUNT(DISTINCT day || visitor) AS visitors
       FROM pageviews WHERE kind = 'human' AND day BETWEEN ? AND ? ${extra}
       GROUP BY ${column} ORDER BY visitors DESC, views DESC LIMIT ?`,
    )
    .all(range.from, range.to, limit)
    .map((r) => ({ key: String(r.key), views: num(r.views), visitors: num(r.visitors) }));
}

export const topPages = (range: Range, limit = 10) => grouped("path", range, limit);
export const languages = (range: Range) => grouped("locale", range, 5);
export const devices = (range: Range) => grouped("device", range, 5);
export const browsers = (range: Range) => grouped("browser", range, 8);
export const campaigns = (range: Range) => grouped("campaign", range, 10, "AND campaign != ''");

export type SourceRow = { source: string; medium: string; views: number; visitors: number; leads: number };

export function sources(range: Range, limit = 10): SourceRow[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT source, medium, COUNT(*) AS views, COUNT(DISTINCT day || visitor) AS visitors
       FROM pageviews WHERE kind = 'human' AND day BETWEEN ? AND ?
       GROUP BY source, medium ORDER BY visitors DESC, views DESC LIMIT ?`,
    )
    .all(range.from, range.to, limit);
  const leadBySource = new Map(
    db
      .prepare(
        `SELECT source, COUNT(*) AS c FROM leads
         WHERE created_at >= ? AND created_at < ? AND source != '' GROUP BY source`,
      )
      .all(dayStart(range.from), dayStart(addDays(range.to, 1)))
      .map((r) => [String(r.source), num(r.c)]),
  );
  return rows.map((r) => ({
    source: String(r.source),
    medium: String(r.medium),
    views: num(r.views),
    visitors: num(r.visitors),
    leads: leadBySource.get(String(r.source)) ?? 0,
  }));
}

export type BotRow = { bot: string; kind: string; hits: number; pages: number; last: number };

export function bots(range: Range): BotRow[] {
  return getDb()
    .prepare(
      `SELECT bot, bot_kind, COUNT(*) AS hits, COUNT(DISTINCT path || locale) AS pages, MAX(at) AS last
       FROM pageviews WHERE kind = 'bot' AND day BETWEEN ? AND ?
       GROUP BY bot, bot_kind ORDER BY hits DESC LIMIT 30`,
    )
    .all(range.from, range.to)
    .map((r) => ({ bot: String(r.bot), kind: String(r.bot_kind), hits: num(r.hits), pages: num(r.pages), last: num(r.last) }));
}

/** When each named crawler family was last seen (any time), for the dashboard. */
export function lastBotVisits() {
  return getDb()
    .prepare(
      `SELECT bot_kind, bot, MAX(at) AS last FROM pageviews
       WHERE kind = 'bot' AND bot_kind IN ('search', 'ai') GROUP BY bot_kind, bot ORDER BY last DESC`,
    )
    .all()
    .map((r) => ({ kind: String(r.bot_kind), bot: String(r.bot), last: num(r.last) }));
}

export function trackingStartedAt(): number | null {
  const first = getDb().prepare("SELECT MIN(at) AS first FROM pageviews").get()?.first;
  return first == null ? null : num(first);
}

export function currentVisitors(minutes = 5) {
  const since = Date.now() - minutes * 60_000;
  return num(
    getDb().prepare("SELECT COUNT(DISTINCT visitor) AS c FROM pageviews WHERE kind = 'human' AND at >= ?").get(since)?.c,
  );
}

export type HourPoint = { hour: number; views: number; visitors: number; leads: number };

/** One Tashkent calendar day split into 24 hours (used by the "Bugun" view). */
export function hourlySeries(day: string): HourPoint[] {
  const db = getDb();
  const views = new Map(
    db
      .prepare(
        `SELECT CAST(((at + ?) / 3600000) % 24 AS INTEGER) AS hour, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors
         FROM pageviews WHERE kind = 'human' AND day = ? GROUP BY hour`,
      )
      .all(TZ_OFFSET_MS, day)
      .map((r) => [num(r.hour), r]),
  );
  const leads = new Map<number, number>();
  for (const r of db
    .prepare("SELECT created_at FROM leads WHERE created_at >= ? AND created_at < ?")
    .all(dayStart(day), dayStart(addDays(day, 1)))) {
    const hour = Math.floor(((num(r.created_at) + TZ_OFFSET_MS) / 3_600_000) % 24);
    leads.set(hour, (leads.get(hour) ?? 0) + 1);
  }
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    views: num(views.get(hour)?.views),
    visitors: num(views.get(hour)?.visitors),
    leads: leads.get(hour) ?? 0,
  }));
}

/** The first day with any recorded page view or application (Tashkent), or null on a fresh database. */
export function firstDataDay(): string | null {
  const db = getDb();
  const view = db.prepare("SELECT MIN(day) AS d FROM pageviews WHERE kind = 'human'").get()?.d;
  const lead = db.prepare("SELECT MIN(created_at) AS t FROM leads").get()?.t;
  const days = [view == null ? null : String(view), lead == null ? null : dayOf(num(lead))].filter((d): d is string => Boolean(d));
  return days.length ? days.sort()[0] : null;
}
