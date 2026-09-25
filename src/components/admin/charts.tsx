import { formatDay } from "@/lib/admin/format";

type Point = { day: string; value: number; /** Shown instead of the formatted day (hours, weeks). */ label?: string };

type ChartProps = { points: Point[]; label: string; color?: string; height?: number };

function ChartSvg({ points, label, color, height, width, className }: Required<ChartProps> & { width: number; className: string }) {
  const pad = { top: 12, right: 8, bottom: 24, left: 34 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = Math.max(1, ...points.map((p) => p.value));
  const niceMax = max <= 4 ? max : Math.ceil(max / 4) * 4;
  const step = innerW / Math.max(1, points.length);
  const barW = Math.max(2, Math.min(28, step * 0.68));
  const total = points.reduce((sum, p) => sum + p.value, 0);
  const ticks = [0, 0.5, 1].map((f) => Math.round(niceMax * f));
  const labelEvery = Math.max(1, Math.ceil(points.length / (width < 500 ? 4 : 6)));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${label}: jami ${total}`} className={`h-auto w-full ${className}`}>
      {ticks.map((tick) => {
        const y = pad.top + innerH - (tick / niceMax) * innerH;
        return (
          <g key={tick}>
            <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="var(--color-line)" strokeOpacity={0.5} strokeDasharray={tick === 0 ? undefined : "3 4"} />
            <text x={pad.left - 6} y={y + 4} textAnchor="end" fontSize={11} fill="var(--color-khaki-deep)">
              {tick}
            </text>
          </g>
        );
      })}
      {points.map((p, i) => {
        const h = (p.value / niceMax) * innerH;
        const x = pad.left + i * step + (step - barW) / 2;
        return (
          <g key={p.day}>
            <rect x={x} y={pad.top + innerH - h} width={barW} height={Math.max(h, p.value > 0 ? 2 : 0)} rx={Math.min(4, barW / 3)} fill={color}>
              <title>{`${p.label ?? formatDay(p.day)}: ${p.value}`}</title>
            </rect>
            {i % labelEvery === 0 ? (
              <text x={x + barW / 2} y={height - 6} textAnchor="middle" fontSize={11} fill="var(--color-khaki-deep)">
                {p.label ?? formatDay(p.day)}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Daily bar chart drawn as inline SVG (no chart library). Two drawings share one dataset: a narrower one for phones,
 * so the axis text stays readable there. Values are read via each bar's <title> and the summary label.
 */
export function BarChart({ points, label, color = "var(--color-brand)", height = 180 }: ChartProps) {
  return (
    <>
      <ChartSvg points={points} label={label} color={color} height={height} width={640} className="hidden sm:block" />
      <ChartSvg points={points} label={label} color={color} height={height + 20} width={360} className="sm:hidden" />
    </>
  );
}

export type BarRow = { key: string; label: string; value: number; sub?: string };

/** Horizontal share bars for "top N" lists. */
export function BarList({ rows, unit = "" }: { rows: BarRow[]; unit?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.key}>
          <div className="flex items-baseline justify-between gap-3 text-[14px]">
            <span className="min-w-0 truncate font-semibold">{row.label}</span>
            <span className="shrink-0 tabular-nums text-ink/80">
              <span className="font-bold text-ink">{row.value}</span>
              {unit ? ` ${unit}` : ""}
              {row.sub ? <span className="ml-2 text-[12px] text-ink/60">{row.sub}</span> : null}
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-tint-b">
            <div className="h-full rounded-full bg-brand" style={{ width: `${Math.max(3, (row.value / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
