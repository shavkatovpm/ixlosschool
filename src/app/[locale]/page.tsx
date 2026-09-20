import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata, webPageNode, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/site/json-ld";
import { Hero } from "@/components/site/hero";
import { Facts } from "@/components/site/facts";
import { WhyUs } from "@/components/site/why-us";
import { Curriculum } from "@/components/site/curriculum";
import { TeachersPreview } from "@/components/site/teachers-preview";
import { DailyLife } from "@/components/site/daily-life";
import { Clubs } from "@/components/site/clubs";
import { Faq } from "@/components/site/faq";
import { Admissions } from "@/components/site/admissions";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, title: t("title"), description: t("description") });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const meta = await getTranslations({ locale, namespace: "meta" });
  const faq = await getTranslations({ locale, namespace: "faq" });
  const faqItems = faq.raw("items") as { question: string; answer: string }[];

  return (
    <>
      <JsonLd
        graph={[
          ...webPageNode({ locale, name: meta("title"), description: meta("description") }),
          {
            "@type": "FAQPage",
            "@id": `${absoluteUrl(locale)}#faq`,
            inLanguage: locale,
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]}
      />
      <main>
        <Hero />
        <Facts />
        <WhyUs />
        <Curriculum />
        <TeachersPreview />
        <DailyLife />
        <Clubs />
        <Faq />
        <Admissions showMore />
      </main>
    </>
  );
}
