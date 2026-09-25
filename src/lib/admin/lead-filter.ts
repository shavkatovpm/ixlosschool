import type { LeadFilter } from "./leads";
import { resolvePeriod, type Period } from "./period";

type Query = Record<string, string | undefined>;

/**
 * The date part of the leads filter. Default is the current month; a search (name/phone) without an explicit period
 * looks through every application, so an older lead can still be found by its phone number.
 */
export function leadPeriod(sp: Query): Period {
  const searching = (sp.q ?? "").trim() !== "";
  return resolvePeriod({ p: sp.p, m: sp.m }, searching && !sp.p ? "all" : "month");
}

/** Turns untrusted query-string values into a safe filter (used by the list page and the CSV export). */
export function filterFrom(sp: Query): LeadFilter {
  const period = leadPeriod(sp);
  return {
    q: (sp.q ?? "").trim().slice(0, 60) || undefined,
    from: period.preset === "all" ? undefined : period.range.from,
    to: period.preset === "all" ? undefined : period.range.to,
    source: (sp.source ?? "").slice(0, 60) || undefined,
    locale: ["uz", "ru", "en"].includes(sp.locale ?? "") ? sp.locale : undefined,
    grade: /^(?:[1-9]|10|11)$/.test(sp.grade ?? "") ? sp.grade : undefined,
  };
}
