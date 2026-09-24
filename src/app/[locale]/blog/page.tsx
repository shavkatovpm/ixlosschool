import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Admissions } from "@/components/site/admissions";
import { ArticleCard } from "@/components/site/article-card";
import { JsonLd } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { publishedArticles } from "@/lib/content/articles";
import type { ContentLocale } from "@/lib/content/shared";
import { SITE_URL, absoluteUrl, buildMetadata, webPageNode } from "@/lib/seo";

const PATH = "/blog";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.blog" });
  return buildMetadata({ locale, path: PATH, title: t("metaTitle"), description: t("metaDescription") });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const articles = publishedArticles(locale as ContentLocale);
  // No articles yet: the page does not exist (a thin page would only hurt search results).
  if (articles.length === 0) notFound();

  const t = await getTranslations({ locale, namespace: "pages.blog" });
  const home = await getTranslations({ locale, namespace: "pages" });
  const pageUrl = absoluteUrl(locale, PATH);

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
          {
            "@type": "Blog",
            "@id": `${pageUrl}#blog`,
            url: pageUrl,
            name: t("h1"),
            inLanguage: locale,
            publisher: { "@id": `${SITE_URL}/#school` },
            blogPost: articles.map((a) => ({ "@id": `${absoluteUrl(locale, `${PATH}/${a.slug}`)}#article` })),
          },
        ]}
      />
      <PageHero crumb={t("eyebrow")} eyebrow={t("eyebrow")} title={t("h1")} lead={t("lead")} />

      <section className="wrap pb-20 sm:pb-24 lg:pb-28">
        <ul className="grid grid-cols-1 gap-5 min-[640px]:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {articles.map((article, i) => (
            <li key={article.slug}>
              <Reveal delay={(i % 3) * 90} className="h-full">
                <ArticleCard article={article} priority={i < 3} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <Admissions showMore />
    </main>
  );
}
