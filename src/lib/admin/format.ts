import { MEDIUM_LABEL, sourceLabel } from "../analytics-shared";

const MONTHS = ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"];

/** "2026-09-24" -> "24 sen" */
export function formatDay(day: string) {
  const [, month, date] = day.split("-").map(Number);
  return `${date} ${MONTHS[month - 1] ?? ""}`;
}

export const mediumLabel = (medium: string) => MEDIUM_LABEL[medium] ?? medium;

export function sourceWithMedium(source: string, medium: string) {
  if (!source || source === "unknown") return "Noma'lum";
  return medium && medium !== "direct" && medium !== "bot" ? `${sourceLabel(source)} · ${mediumLabel(medium)}` : sourceLabel(source);
}

export const LOCALE_LABEL: Record<string, string> = { uz: "O'zbekcha", ru: "Ruscha", en: "Inglizcha" };
export const DEVICE_LABEL: Record<string, string> = { mobile: "Telefon", desktop: "Kompyuter", tablet: "Planshet" };

export const PAGE_LABEL: Record<string, string> = {
  "/": "Bosh sahifa",
  "/admissions": "Qabul",
  "/teachers": "Ustozlar",
  "/results": "Natijalar",
  "/contact": "Aloqa",
};
export const pageLabel = (path: string) => PAGE_LABEL[path] ?? path;

export function formatAgo(timestamp: number, now = Date.now()) {
  const minutes = Math.max(0, Math.round((now - timestamp) / 60_000));
  if (minutes < 1) return "hozirgina";
  if (minutes < 60) return `${minutes} daqiqa oldin`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} soat oldin`;
  return `${Math.round(hours / 24)} kun oldin`;
}
