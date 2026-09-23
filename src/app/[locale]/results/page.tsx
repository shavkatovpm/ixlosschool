import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Admissions } from "@/components/site/admissions";
import { JsonLd } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { ResultCard } from "@/components/site/result-card";
import { Testimonials } from "@/components/site/testimonials";
import { buildMetadata, webPageNode } from "@/lib/seo";
import { testimonialVideoNodes } from "@/lib/testimonials-ld";
import { featuredResults, ieltsResults, olympiadResults, satResults, cefrResults, type ResultCategory } from "@/lib/results";

const PATH = "/results";

const groups: { category: ResultCategory; items: typeof featuredResults; cols: string }[] = [
  { category: "featured", items: featuredResults, cols: "grid-cols-2 min-[560px]:grid-cols-2 lg:grid-cols-4" },
  { category: "ielts", items: ieltsResults, cols: "grid-cols-2 min-[560px]:grid-cols-3 lg:grid-cols-4" },
  { category: "olympiad", items: olympiadResults, cols: "grid-cols-2 min-[560px]:grid-cols-3 lg:grid-cols-4" },
  { category: "sat", items: satResults, cols: "grid-cols-2 min-[560px]:grid-cols-3 lg:grid-cols-4" },
  { category: "cefr", items: cefrResults, cols: "grid-cols-2 min-[560px]:grid-cols-3 lg:grid-cols-4" },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.results" });
  return buildMetadata({ locale, path: PATH, title: t("metaTitle"), description: t("metaDescription") });
}

export default async function ResultsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.results" });
  const home = await getTranslations({ locale, namespace: "pages" });
  const r = await getTranslations({ locale, namespace: "results" });
  const videos = await testimonialVideoNodes(locale, PATH);

  return (
    <main>
      <JsonLd
        graph={[
          ...webPageNode({
            locale,
            path: PATH,
            name: t("h1"),
            description: t("metaDescription"),
            breadcrumb: [
              { name: home("home"), path: "" },
              { name: t("eyebrow"), path: PATH },
            ],
          }),
          ...videos,
        ]}
      />
      <PageHero crumb={t("eyebrow")} eyebrow={t("eyebrow")} title={t("h1")} lead={t("lead")} />

      <div className="wrap flex flex-col gap-16 pb-20 sm:gap-20 sm:pb-24 lg:gap-24 lg:pb-28">
        {groups.map((group) => (
          <section key={group.category}>
            <Reveal>
              <h2 className="font-display text-[clamp(1.375rem,2.2vw,1.875rem)] font-bold leading-tight tracking-tight">
                {t(`sections.${group.category}`)}
              </h2>
            </Reveal>
            <ul className={`mt-7 grid gap-4 sm:gap-5 ${group.cols}`}>
              {group.items.map((result, i) => (
                <li key={result.slug}>
                  <Reveal delay={(i % 4) * 80} className="h-full">
                    <ResultCard result={result} alt={r(`alt.${group.category}`)} priority={group.category === "featured" && i < 2} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Testimonials />

      <Admissions showMore />
    </main>
  );
}
