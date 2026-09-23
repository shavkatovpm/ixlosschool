import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { featuredResults } from "@/lib/results";
import { Reveal } from "./reveal";
import { ResultCard } from "./result-card";
import { SectionHead } from "./section-head";
import { TeachersCarousel } from "./teachers-carousel";

// Mobile shares the teachers carousel behavior; desktop keeps its four-column grid.
export function ResultsPreview() {
  const t = useTranslations("results");
  const nav = useTranslations("nav");

  const slides = (hidden: boolean) => featuredResults.map((result) => (
    <Link
      key={result.slug}
      href="/results"
      tabIndex={hidden ? -1 : undefined}
      draggable={false}
      className="block w-[clamp(300px,29vw,400px)] shrink-0 rounded-[26px]"
    >
      <ResultCard result={result} alt={hidden ? "" : t("alt.featured")} />
    </Link>
  ));

  return (
    <section id="natijalar" className="bg-tint-a py-14 sm:py-16 lg:py-20">
      <div className="lg:hidden">
        <TeachersCarousel
          head={
            <SectionHead index="04" label={nav("results")}>
              {t("titleA")} <span className="text-moss">{t("titleEm")}</span>
            </SectionHead>
          }
          action={
            <Link href="/results" className="group inline-flex h-12 items-center gap-2.5 rounded-full border border-ink/20 px-6 text-[15px] font-semibold transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white">
              {t("all")}
              <ArrowUpRight size={17} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          }
          copy={slides(true)}
          label={nav("results")}
          prevLabel={t("prev")}
          nextLabel={t("next")}
        >
          {slides(false)}
        </TeachersCarousel>
      </div>
      <div className="hidden lg:block">
        <div className="wrap">
          <SectionHead index="04" label={nav("results")}>
            {t("titleA")} <span className="text-moss">{t("titleEm")}</span>
          </SectionHead>
        </div>

        <ul className="mx-auto mt-10 grid max-w-[1480px] grid-cols-2 gap-4 px-[clamp(20px,4.5vw,56px)] sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {featuredResults.map((result, i) => (
            <li key={result.slug}>
              <Reveal delay={(i % 4) * 90} className="h-full">
                <ResultCard result={result} alt={t("alt.featured")} priority={i < 2} />
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={220} className="wrap mt-8 flex justify-center">
          <Link
            href="/results"
            className="group inline-flex h-14 items-center gap-2.5 rounded-full border border-ink/20 px-7 text-[15px] font-semibold transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white"
          >
            {t("all")}
            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
