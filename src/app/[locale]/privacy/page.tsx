import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { JsonLd } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { buildMetadata, webPageNode } from "@/lib/seo";

const PATH = "/privacy";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.privacy" });
  return buildMetadata({ locale, path: PATH, title: t("metaTitle"), description: t("metaDescription") });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.privacy" });
  const home = await getTranslations({ locale, namespace: "pages" });
  const sections = t.raw("sections") as { title: string; text: string }[];

  return (
    <main>
      <JsonLd
        graph={webPageNode({
          locale,
          path: PATH,
          name: t("h1"),
          description: t("metaDescription"),
          breadcrumb: [
            { name: home("home"), path: "" },
            { name: t("h1"), path: PATH },
          ],
        })}
      />
      <PageHero crumb={t("h1")} eyebrow={t("eyebrow")} title={t("h1")} lead={t("lead")} />

      <section className="wrap pb-24 lg:pb-32">
        <div className="max-w-3xl border-t border-line">
          {sections.map((section, i) => (
            <Reveal key={section.title}>
              <div className="grid grid-cols-1 gap-3 border-b border-line py-8 sm:grid-cols-[3.5rem_1fr] sm:gap-6">
                <span className="font-display text-[15px] font-bold tabular-nums text-moss">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="font-display text-[22px] font-bold leading-tight tracking-tight">{section.title}</h2>
                  <p className="mt-3 text-[16px] leading-[1.75] text-ink/75">{section.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
          <p className="mt-8 text-[14px] text-ink/55">{t("updated")}</p>
        </div>
      </section>
    </main>
  );
}
