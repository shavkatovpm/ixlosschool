import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata, webPageNode, absoluteUrl, courseNodes } from "@/lib/seo";
import { testimonialVideoNodes } from "@/lib/testimonials-ld";
import { publicFaq } from "@/lib/content/faq";
import type { ContentLocale } from "@/lib/content/shared";
import { JsonLd } from "@/components/site/json-ld";
import { Hero } from "@/components/site/hero";
import { Facts } from "@/components/site/facts";
import { WhyUs } from "@/components/site/why-us";
import { Curriculum } from "@/components/site/curriculum";
import { Leadership } from "@/components/site/leadership";
import { TeachersPreview } from "@/components/site/teachers-preview";
import { ResultsPreview } from "@/components/site/results-preview";
import { Testimonials } from "@/components/site/testimonials";
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
  const faqItems = publicFaq(locale as ContentLocale);
  const videos = await testimonialVideoNodes(locale);
  const seo = await getTranslations({ locale, namespace: "seo" });
  const courses = courseNodes(locale, seo.raw("courses") as { name: string; description: string }[]);

  return (
    <>
      <JsonLd
        graph={[
          ...webPageNode({ locale, name: meta("title"), description: meta("description") }),
          ...courses,
          ...videos,
          ...(faqItems.length
            ? [
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
              ]
            : []),
        ]}
      />
      <main>
        <Hero />
        <Facts />
        <WhyUs />
        <Curriculum />
        <Leadership />
        <TeachersPreview />
        <DailyLife />
        <ResultsPreview />
        <Testimonials index="05" />
        <Clubs />
        <Faq items={faqItems} />
        <Admissions showMore />
      </main>
    </>
  );
}
