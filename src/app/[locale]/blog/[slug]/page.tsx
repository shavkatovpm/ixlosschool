import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Admissions } from "@/components/site/admissions";
import { ArticleBody } from "@/components/site/article-body";
import { ArticleCard } from "@/components/site/article-card";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { Link } from "@/i18n/navigation";
import { publishedArticle, publishedArticles } from "@/lib/content/articles";
import type { ContentLocale } from "@/lib/content/shared";
import { formatDate, isoDate } from "@/lib/format-date";
import { SITE_URL, absoluteUrl, buildMetadata, webPageNode } from "@/lib/seo";

type Params = { locale: string; slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = publishedArticle(slug, locale as ContentLocale);
  if (!article) return {};
  const title = article.title.length <= 45 ? `${article.title} | Ixlos School` : article.title;
  return buildMetadata({
    locale,
    path: `/blog/${slug}`,
    title,
    description: article.description,
    image: article.cover ? `${SITE_URL}${article.cover}` : undefined,
    article: { publishedTime: isoDate(article.publishedAt), modifiedTime: isoDate(article.updatedAt) },
  });
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = publishedArticle(slug, locale as ContentLocale);
  if (!article) notFound();

  const t = await getTranslations({ locale, namespace: "pages.blog" });
  const home = await getTranslations({ locale, namespace: "pages" });
  const path = `/blog/${slug}`;
  const url = absoluteUrl(locale, path);
  const others = publishedArticles(locale as ContentLocale)
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  return (
    <main>
      <JsonLd
        graph={[
          ...webPageNode({
            locale,
            path,
            name: article.title,
            description: article.description,
            breadcrumb: [
              { name: home("home"), path: "" },
              { name: t("eyebrow"), path: "/blog" },
              { name: article.title, path },
            ],
          }),
          {
            "@type": "BlogPosting",
            "@id": `${url}#article`,
            headline: article.title,
            description: article.description,
            inLanguage: locale,
            datePublished: isoDate(article.publishedAt),
            dateModified: isoDate(article.updatedAt),
            ...(article.cover ? { image: `${SITE_URL}${article.cover}` } : {}),
            mainEntityOfPage: { "@id": `${url}#webpage` },
            author: { "@id": `${SITE_URL}/#school` },
            publisher: { "@id": `${SITE_URL}/#school` },
            isPartOf: { "@id": `${absoluteUrl(locale, "/blog")}#blog` },
          },
        ]}
      />

      <article className="wrap pb-16 pt-6 sm:pb-20 sm:pt-10 lg:pb-24">
        <nav aria-label="Breadcrumb" className="anim-fade text-[14px] font-medium text-ink/75">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="link-underline hover:text-ink">
                {home("home")}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight size={14} />
            </li>
            <li>
              <Link href="/blog" className="link-underline hover:text-ink">
                {t("eyebrow")}
              </Link>
            </li>
          </ol>
        </nav>

        <header className="anim-rise mx-auto mt-10 max-w-3xl" style={{ "--d": "120ms" } as React.CSSProperties}>
          <p className="text-[14px] font-semibold text-moss">
            <time dateTime={isoDate(article.publishedAt)}>{formatDate(article.publishedAt, locale)}</time> · {t("readTime", { minutes: article.readMinutes })}
          </p>
          <h1 className="section-title mt-5 !text-[clamp(2rem,4.6vw,3.5rem)]">{article.title}</h1>
          <p className="mt-6 text-[19px] leading-[1.7] text-ink/75">{article.description}</p>
          <p className="mt-6 text-[14px] text-ink/65">
            {t("author")}
            {article.updatedAt - article.publishedAt > 24 * 3600 * 1000 ? (
              <>
                {" "}
                · {t("updated")}: <time dateTime={isoDate(article.updatedAt)}>{formatDate(article.updatedAt, locale)}</time>
              </>
            ) : null}
          </p>
        </header>

        {article.cover ? (
          <div className="relative mx-auto mt-10 aspect-[16/9] max-w-4xl overflow-hidden rounded-[28px] bg-tint-a">
            <Image src={article.cover} alt={article.title} fill priority unoptimized={article.cover.startsWith("/media/")} sizes="(min-width: 1024px) 896px, 92vw" className="object-cover" />
          </div>
        ) : null}

        <div className="mx-auto mt-10 max-w-3xl">
          <ArticleBody markdown={article.body} />
        </div>
      </article>

      {others.length > 0 ? (
        <section className="wrap pb-16 sm:pb-20">
          <h2 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-bold tracking-tight">{t("related")}</h2>
          <ul className="mt-7 grid grid-cols-1 gap-5 min-[640px]:grid-cols-2 lg:grid-cols-3">
            {others.map((a, i) => (
              <li key={a.slug}>
                <Reveal delay={i * 90} className="h-full">
                  <ArticleCard article={a} />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Admissions showMore />
    </main>
  );
}
