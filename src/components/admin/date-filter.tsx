import Link from "next/link";
import { MonthPicker } from "./month-picker";
import type { Period } from "@/lib/admin/period";
import { monthLabel } from "@/lib/admin/period";

const segment = "inline-flex h-9 items-center rounded-full px-2.5 text-[12px] font-bold whitespace-nowrap transition-colors sm:px-4 sm:text-[13px]";
const on = "bg-brand text-on-brand";
const off = "text-ink/75 hover:bg-tint-b";

/** Bugun | Shu hafta | <month> ▾ | Doimiy. Links keep the page's other filters (`keep`). */
export function DateFilter({
  base,
  period,
  months,
  keep = {},
}: {
  base: string;
  period: Period;
  months: { value: string; label: string }[];
  keep?: Record<string, string | undefined>;
}) {
  const href = (params: Record<string, string>) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(keep)) if (value) query.set(key, value);
    for (const [key, value] of Object.entries(params)) query.set(key, value);
    return `${base}?${query.toString()}`;
  };

  return (
    <nav aria-label="Davr" className="admin-range inline-flex max-w-full items-center gap-0 rounded-full p-1 sm:gap-0.5">
      <Link href={href({ p: "today" })} aria-current={period.preset === "today" ? "true" : undefined} className={`${segment} ${period.preset === "today" ? on : off}`}>
        Bugun
      </Link>
      <Link href={href({ p: "week" })} aria-current={period.preset === "week" ? "true" : undefined} className={`${segment} ${period.preset === "week" ? on : off}`}>
        Shu hafta
      </Link>
      <MonthPicker
        active={period.preset === "month"}
        label={monthLabel(period.month)}
        selected={period.month}
        options={months.map((m) => ({ ...m, href: href({ p: "month", m: m.value }) }))}
      />
      <Link href={href({ p: "all" })} aria-current={period.preset === "all" ? "true" : undefined} className={`${segment} ${period.preset === "all" ? on : off}`}>
        Doimiy
      </Link>
    </nav>
  );
}
