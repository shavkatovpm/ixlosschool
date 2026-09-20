import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { JsonLd } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { Admissions } from "@/components/site/admissions";
import { Link } from "@/i18n/navigation";
import { buildMetadata, webPageNode } from "@/lib/seo";

const PATH = "/admissions";
const bgs = ["bg-tint-a", "bg-tint-b", "bg-tint-c", "bg-tint-d", "bg-tint-a", "bg-tint-b"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.admissions" });
  return buildMetadata({ locale, path: PATH, title: t("metaTitle"), description: t("metaDescription") });
}

export default async function AdmissionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.admissions" });
  const home = await getTranslations({ locale, namespace: "pages" });
  const blocks = t.raw("blocks") as { title: string; text: string }[];

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
            { name: t("eyebrow"), path: PATH },
          ],
        })}
      />
      <PageHero crumb={t("eyebrow")} eyebrow={t("eyebrow")} title={t("h1")} lead={t("lead")} />

      <section className="wrap pb-6 sm:pb-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
          {blocks.map((block, i) => (
            <Reveal key={block.title} delay={(i % 2) * 110}>
              <article className={`h-full rounded-[28px] p-8 sm:p-10 ${bgs[i]}`}>
                <span className="font-display text-[15px] font-bold tabular-nums text-moss">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-5 font-display text-[26px] font-bold leading-tight tracking-tight">{block.title}</h2>
                <p className="mt-4 text-[16px] leading-[1.75] text-ink/75">{block.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 max-w-2xl text-[17px] leading-[1.75] text-ink/75">
            {t("formHint")}{" "}
            <Link href="/" className="font-semibold text-brand underline underline-offset-4">
              {t("homeLink")}
            </Link>
          </p>
        </Reveal>
      </section>

      <Admissions />
    </main>
  );
}
