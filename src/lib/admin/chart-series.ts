import { addDays, dailySeries, hourlySeries } from "./analytics";
import { formatDay } from "./format";
import type { Period } from "./period";

export type ChartPoint = { day: string; label?: string; visitors: number; leads: number };

/**
 * Points for the traffic charts: hours for "Bugun", days for up to ~3 months, weeks (Monday to Sunday) for longer
 * stretches such as "Doimiy". `unit` names the bucket for headings.
 */
export function chartSeries(period: Period): { unit: "soat" | "kun" | "hafta"; points: ChartPoint[] } {
  if (period.preset === "today") {
    return {
      unit: "soat",
      points: hourlySeries(period.range.from).map((h) => ({ day: `h${h.hour}`, label: `${String(h.hour).padStart(2, "0")}:00`, visitors: h.visitors, leads: h.leads })),
    };
  }
  const daily = dailySeries(period.range);
  if (daily.length <= 92) return { unit: "kun", points: daily.map((d) => ({ day: d.day, visitors: d.visitors, leads: d.leads })) };

  const weeks = new Map<string, ChartPoint>();
  for (const d of daily) {
    const weekday = new Date(`${d.day}T00:00:00Z`).getUTCDay();
    const monday = addDays(d.day, -((weekday + 6) % 7));
    const week = weeks.get(monday) ?? { day: monday, label: `${formatDay(monday)} haftasi`, visitors: 0, leads: 0 };
    week.visitors += d.visitors;
    week.leads += d.leads;
    weeks.set(monday, week);
  }
  return { unit: "hafta", points: [...weeks.values()] };
}
