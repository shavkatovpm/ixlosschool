import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { langTag } from "@/i18n/routing";
import { getContact, getLegal } from "@/lib/center";
import type { PublicLocale } from "@/lib/content/shared";
import { publicTeachers } from "@/lib/content/teachers";
import { SITE_URL, absoluteUrl, buildMetadata, webPageNode } from "@/lib/seo";
import { CLUBS_PATH, clubKeys, programKeys, topics, type TopicKey } from "@/lib/topics";
import { Admissions } from "./admissions";
import { ApplyTrigger } from "./apply-modal";
import { Faq } from "./faq";
import { JsonLd } from "./json-ld";
import { PageHero } from "./page-hero";
import { Reveal } from "./reveal";
import { SchoolFacts, type Fact } from "./school-facts";
import { SectionHead } from "./section-head";
import { TeacherCard } from "./teacher-card";

const bgs = ["bg-tint-a", "bg-tint-b", "bg-tint-c", "bg-tint-d"];
const linkClass = "font-semibold text-brand underline underline-offset-4";
const chipClass =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-5 text-[15px] font-semibold transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-white";

export function ApplyButton({ label }: { label: string }) {
  return (
    <ApplyTrigger className="group inline-flex min-h-14 cursor-pointer items-center gap-3 rounded-[12px] bg-brand px-7 text-[15px] font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-soft hover:shadow-[0_10px_24px_-8px_rgba(22,62,50,0.55)] active:translate-y-0">
      {label}
      <ArrowUpRight size={18} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </ApplyTrigger>
  );
}

export function faqNode(url: string, locale: string, items: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    inLanguage: langTag(locale),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Links to the other track and club pages: the internal linking that lets readers and crawlers reach every page. */
export async function RelatedTopics({ locale, current }: { locale: string; current?: TopicKey }) {
  const shared = await getTranslations({ locale, namespace: "pages.topic" });
  const names = await getTranslations({ locale, namespace: "pages.topics" });
  const groups = [
    { label: shared("programsLabel"), keys: programKeys },
    { label: shared("clubsLabel"), keys: clubKeys },
  ];

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <div key={group.label}>
          <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-moss">{group.label}</h3>
          <ul className="mt-4 flex flex-wrap gap-3">
            {group.keys
              .filter((key) => key !== current)
              .map((key) => (
                <li key={key}>
                  <Link href={topics[key].path} className={chipClass}>
                    {names(`${key}.name`)}
                  </Link>
                </li>
              ))}
            {group.keys === clubKeys ? (
              <li>
                <Link href={CLUBS_PATH} className={chipClass}>
                  {shared("allClubs")}
                  <ArrowUpRight size={16} aria-hidden />
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
      ))}
    </div>
  );
}

export async function topicMetadata(locale: string, topic: TopicKey): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `pages.topics.${topic}` });
  return buildMetadata({ locale, path: topics[topic].path, title: t("metaTitle"), description: t("metaDescription") });
}

export async function TopicPage({ locale, topic }: { locale: string; topic: TopicKey }) {
  const config = topics[topic];
  const t = await getTranslations({ locale, namespace: `pages.topics.${topic}` });
  const shared = await getTranslations({ locale, namespace: "pages.topic" });
  const pages = await getTranslations({ locale, namespace: "pages" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const pageUrl = absoluteUrl(locale, config.path);
  const cards = t.raw("cards") as { tag: string; title: string; text: string }[];
  const faq = t.raw("faq") as { question: string; answer: string }[];
  const isClub = config.kind === "club";
  const legal = getLegal();
  const facts = [
    ...(t.raw("facts") as Fact[]),
    { label: shared("addressLabel"), value: getContact().address },
    // The tracks make claims about diplomas and programmes, so they carry the licence they rest on.
    ...(isClub
      ? []
      : [
          {
            label: pages("contact.licenseLabel"),
            value: pages("contact.licenseValue", { number: legal.licenseNumber, date: legal.licenseDateDisplay }),
          },
        ]),
  ];
  // If the profile is unpublished in the panel, the teacher block is simply left out.
  const teacherSlug = "teacher" in config ? config.teacher : undefined;
  const teacher = teacherSlug ? publicTeachers(locale as PublicLocale).find((item) => item.slug === teacherSlug) : undefined;
  const applyButton = <ApplyButton label={nav("apply")} />;

  return (
    <main>
      <JsonLd
        graph={[
          ...webPageNode({
            locale,
            path: config.path,
            name: t("h1"),
            description: t("metaDescription"),
            breadcrumb: [
              { name: pages("home"), path: "" },
              ...(isClub ? [{ name: pages("clubs.eyebrow"), path: CLUBS_PATH }] : []),
              { name: t("eyebrow"), path: config.path },
            ],
          }),
          ...(t.has("courseName")
            ? [
                {
                  "@type": "Course",
                  "@id": `${pageUrl}#course`,
                  name: t("courseName"),
                  description: t("courseDescription"),
                  inLanguage: langTag(locale),
                  provider: { "@id": `${SITE_URL}/#school` },
                },
              ]
            : []),
          faqNode(pageUrl, locale, faq),
        ]}
      />
      <PageHero
        crumb={t("eyebrow")}
        parent={isClub ? { label: pages("clubs.eyebrow"), href: CLUBS_PATH } : undefined}
        eyebrow={t("eyebrow")}
        title={t("h1")}
        lead={t("lead")}
        art={config.art}
      >
        {applyButton}
      </PageHero>

      {/* Each block sits on its own background band so the page reads as distinct steps. */}
      <div className="bg-surface py-16 sm:py-20 lg:py-24">
        <section className="wrap">
          <SectionHead label={t("sectionLabel")}>
            {t("titleA")} <span className="text-moss">{t("titleEm")}</span>
          </SectionHead>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
            {cards.map((card, i) => (
              <Reveal key={card.title} delay={(i % 2) * 110}>
                <article className={`h-full rounded-[28px] p-8 sm:p-10 ${bgs[i % bgs.length]}`}>
                  <span className="font-display text-[15px] font-bold tabular-nums text-moss">{card.tag}</span>
                  <h3 className="mt-5 font-display text-[26px] font-bold leading-tight tracking-tight">{card.title}</h3>
                  <p className="mt-4 text-[16px] leading-[1.75] text-ink/75">{card.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-10">{applyButton}</div>
          </Reveal>
        </section>
      </div>

      <div className="bg-tint-d">
        <SchoolFacts title={t("factsTitle")} facts={facts} />
      </div>

      <div className="wrap flex flex-col gap-16 py-16 sm:py-20 lg:gap-24 lg:py-24">
        {teacher ? (
          <section className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_minmax(0,400px)] lg:items-center lg:gap-20">
            <div>
              <SectionHead label={shared("teacherLabel")}>
                {t("teacherTitleA")} <span className="text-moss">{t("teacherTitleEm")}</span>
              </SectionHead>
              <Reveal delay={100}>
                <p className="mt-8 max-w-xl text-[17px] leading-[1.75] text-ink/75">{t("teacherText")}</p>
                <p className="mt-6">
                  <Link href="/teachers" className={linkClass}>
                    {shared("teachersLink")}
                  </Link>
                </p>
              </Reveal>
            </div>
            <Reveal delay={150}>
              <TeacherCard teacher={teacher} />
            </Reveal>
          </section>
        ) : null}

        <section>
          <SectionHead label={shared("relatedLabel")}>
            {shared("relatedTitleA")} <span className="text-moss">{shared("relatedTitleEm")}</span>
          </SectionHead>
          <Reveal delay={100} className="mt-10">
            <RelatedTopics locale={locale} current={topic} />
            <p className="mt-10 max-w-2xl text-[17px] leading-[1.75] text-ink/75">
              {shared("moreHint")}{" "}
              <Link href="/admissions" className={linkClass}>
                {shared("admissionsLink")}
              </Link>
            </p>
            {isClub ? null : (
              <p className="mt-3 max-w-2xl text-[17px] leading-[1.75] text-ink/75">
                {shared("resultsHint")}{" "}
                <Link href="/results" className={linkClass}>
                  {shared("resultsLink")}
                </Link>
              </p>
            )}
          </Reveal>
        </section>
      </div>

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
