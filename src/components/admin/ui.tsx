import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

export function PageHeader({ title, text, actions }: { title: string; text?: string; actions?: React.ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[30px] font-extrabold tracking-tight sm:text-[34px]">{title}</h1>
        {text ? <p className="mt-2 max-w-2xl text-[15px] leading-[1.65] text-ink/75">{text}</p> : null}
      </div>
      {actions}
    </header>
  );
}

export function Panel({
  title,
  hint,
  action,
  children,
  className = "",
}: {
  title?: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[22px] bg-surface p-5 sm:p-6 ${className}`}>
      {title ? (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-[17px] font-bold tracking-tight">{title}</h2>
            {hint ? <p className="mt-0.5 text-[13px] leading-[1.5] text-ink/65">{hint}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export const percentChange = (current: number, previous: number) =>
  previous === 0 ? (current === 0 ? 0 : null) : Math.round(((current - previous) / previous) * 100);

export function Delta({ current, previous }: { current: number; previous: number }) {
  const change = percentChange(current, previous);
  if (change === null) return <span className="text-[12px] font-semibold text-ink/60">yangi</span>;
  if (change === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-ink/60">
        <Minus size={13} aria-hidden />
        o&apos;zgarmagan
      </span>
    );
  }
  const up = change > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[12px] font-bold ${up ? "text-brand" : "text-danger"}`}>
      {up ? <ArrowUpRight size={14} aria-hidden /> : <ArrowDownRight size={14} aria-hidden />}
      {up ? "+" : ""}
      {change}%
    </span>
  );
}

export function Stat({
  label,
  value,
  compare,
  hint,
  tone = "a",
}: {
  label: string;
  value: string | number;
  compare?: { current: number; previous: number };
  hint?: string;
  tone?: "a" | "b" | "c" | "d";
}) {
  const bg = { a: "bg-tint-a", b: "bg-tint-b", c: "bg-tint-c", d: "bg-tint-d" }[tone];
  return (
    <div className={`rounded-[20px] p-5 ${bg}`}>
      <p className="text-[13px] font-semibold text-ink/75">{label}</p>
      <p className="mt-2 font-display text-[30px] font-extrabold leading-none tracking-tight tabular-nums">{value}</p>
      <div className="mt-2 flex min-h-5 items-center gap-2">
        {compare ? <Delta {...compare} /> : null}
        {hint ? <span className="text-[12px] text-ink/65">{hint}</span> : null}
      </div>
    </div>
  );
}

export function RangeTabs({ base, days, options = [7, 30, 90] }: { base: string; days: number; options?: number[] }) {
  return (
    <nav aria-label="Davr" className="inline-flex rounded-full bg-surface p-1">
      {options.map((option) => (
        <Link
          key={option}
          href={`${base}?days=${option}`}
          aria-current={option === days ? "true" : undefined}
          className={`inline-flex h-9 items-center rounded-full px-4 text-[13px] font-bold transition-colors ${
            option === days ? "bg-brand text-on-brand" : "text-ink/75 hover:bg-tint-b"
          }`}
        >
          {option} kun
        </Link>
      ))}
    </nav>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-[14px] bg-tint-b px-4 py-4 text-[14px] leading-[1.6] text-ink/75">{children}</p>;
}

export function Chip({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "brand" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${
        tone === "brand" ? "bg-brand text-on-brand" : "bg-tint-b text-ink/80"
      }`}
    >
      {children}
    </span>
  );
}

export const fieldClass =
  "h-11 rounded-[12px] border border-field-line bg-surface px-3 text-[14px] outline-none transition-colors focus:border-brand";
export const primaryButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[12px] bg-brand px-5 text-[14px] font-bold text-on-brand transition-colors hover:bg-brand-soft";
export const ghostButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line px-5 text-[14px] font-semibold transition-colors hover:bg-tint-a";
