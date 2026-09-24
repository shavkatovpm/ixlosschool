import { BadgeCheck, GraduationCap } from "lucide-react";
import type { TeacherFact } from "@/lib/content/teachers";

export type { TeacherFact };

export function FactIcon({ kind, size = 18 }: { kind: TeacherFact["kind"]; size?: number }) {
  const Icon = kind === "education" ? GraduationCap : BadgeCheck;
  return <Icon size={size} aria-hidden />;
}

/** Dark glass badge in the photo's top-left corner: years of experience. */
export function ExperienceBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="absolute left-4 top-4 rounded-[16px] border border-white/15 bg-brand-deep/85 px-3.5 py-2.5 text-white backdrop-blur-md">
      <span className="block font-display text-[22px] font-extrabold leading-none tracking-tight">{value}</span>
      <span className="mt-1.5 block text-[10.5px] font-bold uppercase tracking-[0.14em] text-gold">{label}</span>
    </div>
  );
}

export function TeacherChips({
  focus,
  category,
  className = "",
}: {
  focus?: string;
  category?: string;
  className?: string;
}) {
  if (!focus && !category) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {focus ? (
        <span className="rounded-full bg-lime px-3 py-1 text-[12.5px] font-bold text-ink">{focus}</span>
      ) : null}
      {category ? (
        <span className="rounded-full bg-khaki px-3 py-1 text-[12.5px] font-bold text-ink">{category}</span>
      ) : null}
    </div>
  );
}
