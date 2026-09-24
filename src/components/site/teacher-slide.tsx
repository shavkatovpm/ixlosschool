import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { PublicTeacher } from "@/lib/content/teachers";
import { ExperienceBadge, TeacherChips } from "./teacher-parts";

/**
 * Card for the homepage marquee: all info sits on top of the photo.
 * `hidden` marks the duplicate set that makes the loop seamless (no focus, no alt text).
 */
export function TeacherSlide({ teacher, hidden = false }: { teacher: PublicTeacher; hidden?: boolean }) {
  const t = useTranslations("teachers");
  const name = teacher.name;
  const [first, ...rest] = teacher.facts;

  return (
    <Link
      href={`/teachers#${teacher.slug}`}
      tabIndex={hidden ? -1 : undefined}
      draggable={false}
      className="group relative block aspect-[4/5] w-[clamp(300px,29vw,400px)] shrink-0 overflow-hidden rounded-[26px] bg-paper transition-shadow duration-500 hover:shadow-[0_32px_50px_-28px_rgba(16,45,37,0.75)]"
    >
      <Image
        src={teacher.photo}
        alt={hidden ? "" : t("photoAlt", { name })}
        fill
        draggable={false}
        unoptimized={teacher.photo.startsWith("/media/")}
        sizes="400px"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
      />

      {teacher.experienceYears ? (
        <ExperienceBadge value={t("experience", { years: teacher.experienceYears })} label={t("experienceLabel")} />
      ) : null}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-deep via-brand-deep/85 to-transparent px-5 pb-5 pt-20 text-white">
        <h3 className="font-display text-[clamp(1.125rem,1.7vw,1.4rem)] font-bold leading-tight tracking-tight [overflow-wrap:anywhere]">
          {name}
        </h3>
        <TeacherChips
          focus={teacher.focus}
          category={teacher.category}
          className="mt-2.5"
        />

        {first ? (
          <p className="mt-3 line-clamp-2 text-[13.5px] leading-[1.45] text-on-brand-muted">
            <span className="font-bold text-highlight">{first.label}</span> · {first.value}
          </p>
        ) : null}

        {rest.length > 0 ? (
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
            <ul className="min-h-0 overflow-hidden">
              {rest.map((fact) => (
                <li key={`${fact.label}-${fact.value}`} className="pt-2.5 text-[13.5px] leading-[1.45] text-on-brand-muted">
                  <span className="font-bold text-highlight">{fact.label}</span> · {fact.value}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
