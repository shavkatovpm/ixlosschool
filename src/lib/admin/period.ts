import { addDays, firstDataDay, today, type Range } from "./analytics";

// The date filter shared by Trafik and Leadlar: Bugun / Shu hafta / a month (the current one unless another is picked) / Doimiy.
// Weeks start on Monday; everything is a Tashkent calendar day.

export type Preset = "today" | "week" | "month" | "all";

export type Period = {
  preset: Preset;
  /** "YYYY-MM": the selected month, or the current one. */
  month: string;
  range: Range;
  /** The equally long stretch right before the range, for "vs previous" comparisons. Null for all-time. */
  previous: Range | null;
  /** Number of calendar days in the range. */
  days: number;
};

const MONTHS = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export const monthName = (month: string) => MONTHS[Number(month.slice(5, 7)) - 1] ?? month;

/** "Sentabr" for the current year, "Avgust 2025" otherwise. */
export const monthLabel = (month: string) => (month.slice(0, 4) === today().slice(0, 4) ? monthName(month) : `${monthName(month)} ${month.slice(0, 4)}`);

const lastDayOfMonth = (month: string) => {
  const [year, m] = month.split("-").map(Number);
  return new Date(Date.UTC(year, m, 0)).toISOString().slice(0, 10);
};

const dayCount = (range: Range) => Math.round((Date.parse(`${range.to}T00:00:00Z`) - Date.parse(`${range.from}T00:00:00Z`)) / 86_400_000) + 1;
const before = (range: Range): Range => {
  const days = dayCount(range);
  return { from: addDays(range.from, -days), to: addDays(range.from, -1) };
};

export function resolvePeriod(input: { p?: string; m?: string }, fallback: Preset = "month"): Period {
  const now = today();
  const currentMonth = now.slice(0, 7);
  const preset = (["today", "week", "month", "all"] as const).find((x) => x === input.p) ?? fallback;
  const month = input.m && MONTH_RE.test(input.m) && input.m <= currentMonth ? input.m : currentMonth;

  let range: Range;
  if (preset === "today") range = { from: now, to: now };
  else if (preset === "week") {
    const weekday = new Date(`${now}T00:00:00Z`).getUTCDay(); // 0 = Sunday
    range = { from: addDays(now, -((weekday + 6) % 7)), to: now };
  } else if (preset === "month") {
    const last = lastDayOfMonth(month);
    range = { from: `${month}-01`, to: last < now ? last : now };
  } else range = { from: firstDataDay() ?? addDays(now, -29), to: now };

  return { preset, month, range, previous: preset === "all" ? null : before(range), days: dayCount(range) };
}

/** Months to choose from: the current month back to the first month with data (at most three years). */
export function availableMonths(): { value: string; label: string }[] {
  const now = today();
  const first = firstDataDay() ?? now;
  const months: { value: string; label: string }[] = [];
  let [year, month] = now.slice(0, 7).split("-").map(Number);
  const [firstYear, firstMonth] = first.slice(0, 7).split("-").map(Number);
  while ((year > firstYear || (year === firstYear && month >= firstMonth)) && months.length < 36) {
    const value = `${year}-${String(month).padStart(2, "0")}`;
    months.push({ value, label: monthLabel(value) });
    month -= 1;
    if (month === 0) {
      month = 12;
      year -= 1;
    }
  }
  return months;
}

export function describePeriod(period: Period) {
  const { preset, range } = period;
  if (preset === "today") return "Bugun";
  if (preset === "all") return "Butun davr";
  const f = (day: string) => `${Number(day.slice(8, 10))} ${monthName(day.slice(0, 7)).toLowerCase()}`;
  return preset === "week" ? `Shu hafta: ${f(range.from)} – ${f(range.to)}` : `${monthLabel(period.month)}: ${f(range.from)} – ${f(range.to)}`;
}
