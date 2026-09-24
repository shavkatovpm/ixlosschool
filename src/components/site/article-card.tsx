import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/format-date";
import type { PublicArticle } from "@/lib/content/articles";

export function ArticleCard({ article, priority = false }: { article: PublicArticle; priority?: boolean }) {
  const t = useTranslations("pages.blog");
  const locale = useLocale();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-tint-b transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_48px_-28px_rgba(22,46,37,0.55)]">
      <Link href={`/blog/${article.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/9] overflow-hidden bg-tint-a">
          {article.cover ? (
            <Image
              src={article.cover}
              alt={t("coverAlt", { title: article.title })}
              fill
              priority={priority}
              unoptimized={article.cover.startsWith("/media/")}
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 46vw, 92vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div aria-hidden className="flex h-full items-center justify-center bg-brand font-logo text-[56px] text-on-brand/90">
              Ixlos
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <p className="text-[13px] font-semibold text-moss">
            <time dateTime={new Date(article.publishedAt).toISOString()}>{formatDate(article.publishedAt, locale)}</time> · {t("readTime", { minutes: article.readMinutes })}
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.25rem,1.8vw,1.5rem)] font-bold leading-[1.2] tracking-tight transition-colors group-hover:text-brand">
            {article.title}
          </h2>
          <p className="mt-3 line-clamp-3 text-[15.5px] leading-[1.7] text-ink/75">{article.description}</p>
        </div>
      </Link>
    </article>
  );
}
