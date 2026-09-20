import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { teachers } from "@/lib/teachers";
import { SectionHead } from "./section-head";
import { TeacherSlide } from "./teacher-slide";
import { TeachersCarousel } from "./teachers-carousel";

export function TeachersPreview() {
  const t = useTranslations("teachers");
  const nav = useTranslations("nav");

  const cards = (hidden: boolean) =>
    teachers.map((teacher) => <TeacherSlide key={teacher.slug} teacher={teacher} hidden={hidden} />);

  return (
    <section id="ustozlar" className="pb-20 sm:pb-24 lg:pb-32">
      <TeachersCarousel
        head={
          <SectionHead index="03" label={nav("teachers")}>
            {t("titleA")} <span className="text-moss">{t("titleEm")}</span>
          </SectionHead>
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
    </section>
  );
}
