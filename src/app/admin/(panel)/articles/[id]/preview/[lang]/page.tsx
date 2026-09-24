import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/site/article-body";
import { getArticleRow, readMinutes } from "@/lib/content/articles";
import { isContentLocale, LOCALE_NAMES } from "@/lib/content/shared";

// Shows the draft the way the site will render its body (the page frame is not reproduced).
export default async function ArticlePreviewPage({ params }: { params: Promise<{ id: string; lang: string }> }) {
  const { id, lang } = await params;
  const row = getArticleRow(Number(id));
  if (!row || !isContentLocale(lang)) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-[14px] bg-highlight px-4 py-3 text-[14px] font-semibold">
        <span>
          Ko&apos;rib chiqish · {LOCALE_NAMES[lang]} · {row.status === "published" ? "chop etilgan" : "qoralama"} · {readMinutes(row.body[lang])} daqiqa o&apos;qish
        </span>
        <Link href={`/admin/articles/${row.id}`} className="underline underline-offset-4">
          Tahrirlashga qaytish
        </Link>
      </div>
      <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-tight">{row.title[lang] || "(sarlavha yo'q)"}</h1>
      <p className="mt-5 text-[18px] leading-[1.7] text-ink/75">{row.description[lang]}</p>
      <div className="mt-8">
        <ArticleBody markdown={row.body[lang]} />
      </div>
    </div>
  );
}
