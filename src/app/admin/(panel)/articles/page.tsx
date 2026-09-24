import Link from "next/link";
import { CircleAlert, CircleCheck, ExternalLink, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Empty, PageHeader, primaryButton } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/admin/leads";
import { listArticles } from "@/lib/content/articles";
import { CONTENT_LOCALES } from "@/lib/content/shared";
import { deleteArticleAction, toggleArticleAction } from "./actions";

const iconButton =
  "flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:bg-tint-a";

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ e?: string; id?: string }> }) {
  const { e, id } = await searchParams;
  const rows = listArticles();

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Maqolalar"
        text="Saytdagi blog. Maqola uch tilda yoziladi va qidiruv tizimlariga (Google, Yandex) hamda AI yordamchilariga avtomatik taqdim etiladi. Chop etilmagan maqola (qoralama) saytda ko'rinmaydi."
        actions={
          <Link href="/admin/articles/new" className={primaryButton}>
            <Plus size={16} aria-hidden />
            Yangi maqola
          </Link>
        }
      />

      {e === "incomplete" ? (
        <p role="alert" className="flex items-center gap-2 rounded-[12px] bg-danger-bg px-4 py-3 text-[14px] font-semibold text-danger">
          <CircleAlert size={18} aria-hidden />
          Maqolani chop etib bo&apos;lmadi: uch tildagi sarlavha, tavsif va matn to&apos;liq bo&apos;lishi kerak.{" "}
          {id ? (
            <Link href={`/admin/articles/${id}`} className="underline">
              Tahrirlash
            </Link>
          ) : null}
        </p>
      ) : null}

      {rows.length === 0 ? (
        <Empty>Hali maqola yo&apos;q. «Yangi maqola» bilan birinchisini yozing. Mavzular ro&apos;yxati: loyihadagi docs/blog-reja.md.</Empty>
      ) : (
        <ul className="divide-y divide-line rounded-[22px] bg-surface">
          {rows.map((row) => {
            const live = row.status === "published";
            const title = row.title.uz || row.title.ru || row.title.en || "(sarlavhasiz)";
            return (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
                <div className="min-w-0 flex-1 basis-64">
                  <p className="text-[16px] font-bold leading-snug">{title}</p>
                  <p className="mt-1 text-[12.5px] text-ink/60">
                    /blog/{row.slug} · {live && row.publishedAt ? `chop etilgan ${formatDateTime(row.publishedAt).slice(0, 10)}` : `o'zgartirilgan ${formatDateTime(row.updatedAt).slice(0, 10)}`}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${live ? "bg-brand text-on-brand" : "bg-tint-b text-ink/70"}`}>{live ? "Chop etilgan" : "Qoralama"}</span>
                    {CONTENT_LOCALES.map((l) => (
                      <span key={l} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-bold uppercase ${row.title[l] && row.body[l] ? "bg-tint-a text-brand" : "bg-danger-bg text-danger"}`} title={row.title[l] && row.body[l] ? "Tayyor" : "To'ldirilmagan"}>
                        {row.title[l] && row.body[l] ? <CircleCheck size={11} aria-hidden /> : <CircleAlert size={11} aria-hidden />}
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {live ? (
                    <a href={`/uz/blog/${row.slug}`} target="_blank" rel="noopener noreferrer" aria-label="Saytda ko'rish" title="Saytda ko'rish" className={iconButton}>
                      <ExternalLink size={16} aria-hidden />
                    </a>
                  ) : null}
                  <form action={toggleArticleAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="status" value={live ? "draft" : "published"} />
                    <button type="submit" aria-label={live ? "Qoralamaga qaytarish" : "Chop etish"} title={live ? "Qoralamaga qaytarish" : "Chop etish"} className={iconButton}>
                      {live ? <Eye size={16} aria-hidden /> : <EyeOff size={16} aria-hidden />}
                    </button>
                  </form>
                  <Link href={`/admin/articles/${row.id}`} aria-label="Tahrirlash" title="Tahrirlash" className={iconButton}>
                    <Pencil size={16} aria-hidden />
                  </Link>
                  <form action={deleteArticleAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <ConfirmButton message="Maqola butunlay o'chirilsinmi? Bu amalni qaytarib bo'lmaydi." label="O'chirish" className={`${iconButton} text-danger`}>
                      <Trash2 size={16} aria-hidden />
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
