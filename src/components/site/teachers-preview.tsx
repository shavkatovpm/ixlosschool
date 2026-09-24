import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ContentLocale } from "@/lib/content/shared";
import { publicTeachers } from "@/lib/content/teachers";
import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";
import { TeacherSlide } from "./teacher-slide";
import { TeacherPoster } from "./teacher-poster";
import { TeachersCarousel } from "./teachers-carousel";

export function TeachersPreview() {
  const t = useTranslations("teachers");
  const nav = useTranslations("nav");
  const page = useTranslations("pages.teachers");
  const teachers = publicTeachers(useLocale() as ContentLocale);
  if (teachers.length === 0) return null;
  const years = Math.max(0, ...teachers.map((teacher) => teacher.experienceYears ?? 0));
  const badge = years > 0 ? t("badge", { count: teachers.length, years }) : t("badgeCount", { count: teachers.length });

  const cards = (hidden: boolean) =>
    teachers.map((teacher) => <TeacherSlide key={teacher.slug} teacher={teacher} hidden={hidden} />);

  return (
    <section id="ustozlar" className="bg-tint-a py-14 sm:py-16 lg:bg-paper lg:py-16">
      <div className="mx-auto hidden max-w-[1480px] px-10 lg:block xl:px-16">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-extrabold uppercase tracking-tight text-ink">{page("h1")}</h2>
          <p className="mt-3 text-xl text-moss">{badge}</p>
        </div>
        <ul className="grid grid-cols-4 justify-center gap-7 xl:grid-cols-5 xl:gap-8">
          {teachers.slice(0, 10).map((teacher) => (
            <li key={teacher.slug} className="mx-auto w-full max-w-[240px]">
              <Link href={`/teachers#${teacher.slug}`} className="block h-full rounded-[20px]">
                <TeacherPoster teacher={teacher} />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <Link href="/teachers" className="inline-flex items-center gap-3 rounded-full bg-brand px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-soft">
            {t("all")}<ArrowUpRight size={20} aria-hidden />
          </Link>
        </div>
      </div>
      <div className="lg:hidden">
        <TeachersCarousel
          head={
            <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:gap-6">
              <SectionHead index="03" label={nav("teachers")}>
                {t("titleA")} <span className="text-moss">{t("titleEm")}</span>
              </SectionHead>
              <Reveal delay={150}>
                <span className="inline-flex items-center gap-2.5 rounded-full bg-khaki px-5 py-3 text-[14px] font-bold">
                  <span aria-hidden className="h-2 w-2 rounded-full bg-brand" />
                  {badge}
                </span>
              </Reveal>
            </div>
          }
          action={
            <Link
              href="/teachers"
              className="group inline-flex h-12 items-center gap-2.5 rounded-full border border-ink/20 px-6 text-[15px] font-semibold transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white"
            >
              {t("all")}
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          }
          copy={cards(true)}
          label={nav("teachers")}
          prevLabel={t("prev")}
          nextLabel={t("next")}
        >
          {cards(false)}
        </TeachersCarousel>
      </div>
    </section>
  );
}
