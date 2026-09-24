import { DAY_RE, type LeadFilter } from "./leads";

/** Turns untrusted query-string values into a safe filter (used by the list page and the CSV export). */
export function filterFrom(sp: Record<string, string | undefined>): LeadFilter {
  const day = (value?: string) => (value && DAY_RE.test(value) ? value : undefined);
  return {
    q: (sp.q ?? "").trim().slice(0, 60) || undefined,
    from: day(sp.from),
    to: day(sp.to),
    source: (sp.source ?? "").slice(0, 60) || undefined,
    locale: ["uz", "ru", "en"].includes(sp.locale ?? "") ? sp.locale : undefined,
    grade: /^(?:[1-9]|10|11)$/.test(sp.grade ?? "") ? sp.grade : undefined,
  };
}
