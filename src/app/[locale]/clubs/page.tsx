import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Admissions } from "@/components/site/admissions";
import { Faq } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { SchoolFacts, type Fact } from "@/components/site/school-facts";
import { SectionHead } from "@/components/site/section-head";
import { ApplyButton, RelatedTopics, faqNode } from "@/components/site/topic-page";
import { Link } from "@/i18n/navigation";
import { absoluteUrl, buildMetadata, webPageNode } from "@/lib/seo";
import { CLUBS_PATH, clubOrder, topics } from "@/lib/topics";

const cardColors = ["bg-tint-b", "bg-tint-d", "bg-tint-a", "bg-tint-b", "bg-tint-d", "bg-tint-a", "bg-tint-b", "bg-tint-d"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.clubs" });
  return buildMetadata({ locale, path: CLUBS_PATH, title: t("metaTitle"), description: t("metaDescription") });
}

export default async function ClubsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.clubs" });
  const names = await getTranslations({ locale, namespace: "pages.topics" });
  const shared = await getTranslations({ locale, namespace: "pages.topic" });
  const pages = await getTranslations({ locale, namespace: "pages" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const pageUrl = absoluteUrl(locale, CLUBS_PATH);
  const faq = t.raw("faq") as { question: string; answer: string }[];
  const clubs = clubOrder.map((key) => ({
    key,
    path: topics[key].path,
    art: topics[key].art,
    // The IT club has no page of its own: it is described on the IT track page.
    name: key === "it" ? t("itName") : names(`${key}.name`),
    blurb: t(`blurbs.${key}`),
  }));
  const applyButton = <ApplyButton label={nav("apply")} />;

  return (
    <main>
      <JsonLd
        graph={[
          ...webPageNode({
            locale,
            path: CLUBS_PATH,
            name: t("h1"),
            description: t("metaDescription"),
            breadcrumb: [
              { name: pages("home"), path: "" },
              { name: t("eyebrow"), path: CLUBS_PATH },
            ],
          }),
          {
            "@type": "ItemList",
            "@id": `${pageUrl}#clubs`,
            name: t("h1"),
            itemListElement: clubs.map((club, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: club.name,
              url: absoluteUrl(locale, club.path),
            })),
          },
          faqNode(pageUrl, locale, faq),
        ]}
      />
      <PageHero crumb={t("eyebrow")} eyebrow={t("eyebrow")} title={t("h1")} lead={t("lead")}>
        {applyButton}
      </PageHero>

      <div className="bg-surface py-16 sm:py-20 lg:py-24">
        <section className="wrap">
          <SectionHead label={t("listLabel")}>
            {t("listTitleA")} <span className="text-moss">{t("listTitleEm")}</span>
          </SectionHead>
          <ul className="mt-12 grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-4">
            {clubs.map((club, i) => (
              <li key={club.key}>
                <Reveal delay={(i % 4) * 80} className="h-full">
                  <Link
                    href={club.path}
                    className={`group flex h-full flex-col rounded-[24px] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_50px_-24px_rgba(22,46,37,0.35)] sm:p-7 ${cardColors[i]}`}
                  >
                    <Image src={club.art} alt="" width={160} height={160} sizes="128px" className="h-28 w-28 select-none object-contain sm:h-32 sm:w-32" />
                    <h3 className="mt-5 font-display text-[22px] font-bold leading-tight tracking-tight [overflow-wrap:anywhere]">{club.name}</h3>
                    <p className="mt-2 text-[15px] leading-[1.65] text-ink/75">{club.blurb}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[14px] font-semibold text-brand">
                      {t("more")}
                      <ArrowUpRight size={16} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal>
            <div className="mt-10">{applyButton}</div>
          </Reveal>
        </section>
      </div>

      <div className="bg-tint-d">
        <SchoolFacts title={t("factsTitle")} facts={t.raw("facts") as Fact[]} />
      </div>

      <section className="wrap py-16 sm:py-20 lg:py-24">
        <SectionHead label={shared("relatedLabel")}>
          {shared("relatedTitleA")} <span className="text-moss">{shared("relatedTitleEm")}</span>
        </SectionHead>
        <Reveal delay={100} className="mt-10">
          <RelatedTopics locale={locale} />
          <p className="mt-10 max-w-2xl text-[17px] leading-[1.75] text-ink/75">
            {shared("moreHint")}{" "}
            <Link href="/admissions" className="font-semibold text-brand underline underline-offset-4">
              {shared("admissionsLink")}
            </Link>
          </p>
        </Reveal>
      </section>

      <Faq
        items={faq}
        index=""
        label={shared("faqLabel")}
        title={
          <>
            {t("faqTitleA")} <span className="text-moss">{t("faqTitleEm")}</span>
          </>
        }
      />

      <div className="bg-surface">
        <Admissions showPhone={false} />
      </div>
    </main>
  );
}
