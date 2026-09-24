import Image from "next/image";
import { useTranslations } from "next-intl";
import type { PublicTeacher } from "@/lib/content/teachers";
import { ExperienceBadge, FactIcon, TeacherChips } from "./teacher-parts";

export function TeacherCard({ teacher, priority = false }: { teacher: PublicTeacher; priority?: boolean }) {
  const t = useTranslations("teachers");
  const name = teacher.name;
  const facts = teacher.facts;

  return (
    <article
      id={teacher.slug}
      className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-line bg-tint-d transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_48px_-28px_rgba(22,46,37,0.55)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-tint-a">
        <Image
          src={teacher.photo}
          alt={t("photoAlt", { name })}
          fill
          priority={priority}
          unoptimized={teacher.photo.startsWith("/media/")}
          sizes="(min-width: 1024px) 400px, (min-width: 560px) 46vw, 92vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-brand-deep via-brand-deep/70 to-transparent"
        />

        {teacher.experienceYears ? (
          <ExperienceBadge value={t("experience", { years: teacher.experienceYears })} label={t("experienceLabel")} />
        ) : null}

        <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
          <h2 className="font-display text-[clamp(1.4rem,2vw,1.75rem)] font-bold leading-[1.1] tracking-tight [overflow-wrap:anywhere]">
            {name}
          </h2>
          <TeacherChips
            focus={teacher.focus}
            category={teacher.category}
            className="mt-3.5"
          />
        </div>
      </div>

      {facts.length > 0 ? (
        <ul className="flex flex-col gap-4 p-6 sm:p-7">
          {facts.map((fact) => (
            <li key={`${fact.label}-${fact.value}`} className="flex items-start gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-[0_6px_14px_-8px_rgba(22,46,37,0.5)]">
                <FactIcon kind={fact.kind} />
              </span>
              <span className="min-w-0 pt-0.5">
                <span className="block text-[11.5px] font-bold uppercase tracking-[0.1em] text-moss">{fact.label}</span>
                <span className="mt-0.5 block text-[15px] leading-[1.5] text-ink/85">{fact.value}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
