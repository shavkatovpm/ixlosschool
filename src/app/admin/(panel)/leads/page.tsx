import Link from "next/link";
import { Download, Phone } from "lucide-react";
import { formatDateTime, listLeads } from "@/lib/admin/leads";

const PAGE_SIZE = 30;
const field =
  "h-11 rounded-[12px] border border-field-line bg-surface px-3 text-[14px] outline-none transition-colors focus:border-brand";

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 60);
  const page = Math.max(1, Math.floor(Number(sp.page)) || 1);
  const { rows, total } = listLeads(q || undefined, PAGE_SIZE, (page - 1) * PAGE_SIZE);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const href = (target: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return `/admin/leads${query ? `?${query}` : ""}`;
  };

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] font-extrabold tracking-tight">Arizalar</h1>
          <p className="mt-2 max-w-xl text-[16px] leading-[1.6] text-ink/75">
            Saytdagi forma orqali kelgan arizalar arxivi ({total} ta). Arizalar Telegram guruhiga ham yuboriladi.
          </p>
        </div>
        {/* A file download, not a page: a plain anchor is intended. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/admin/leads/export"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-[14px] font-semibold transition-colors hover:bg-tint-a"
        >
          <Download size={16} aria-hidden />
          CSV yuklash
        </a>
      </div>

      <form action="/admin/leads" className="mt-8 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Ism yoki telefon bo'yicha qidirish" maxLength={60} className={`${field} w-full max-w-md`} />
        <button type="submit" className="h-11 rounded-[12px] bg-brand px-5 text-[14px] font-bold text-white transition-colors hover:bg-brand-soft">
          Qidirish
        </button>
      </form>

      {rows.length === 0 ? (
        <p className="mt-8 rounded-[22px] bg-surface p-6 text-[15px] text-ink/75">{q ? "Hech narsa topilmadi." : "Hali ariza yo'q."}</p>
      ) : (
        <ul className="mt-8 divide-y divide-line rounded-[22px] bg-surface">
          {rows.map((lead) => (
            <li key={lead.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[17px] font-bold">{lead.name}</p>
                <a
                  href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}
                  className="mt-1 inline-flex min-h-8 items-center gap-2 text-[15px] font-semibold text-brand underline-offset-4 hover:underline"
                >
                  <Phone size={15} aria-hidden />
                  {lead.phone}
                </a>
              </div>
              <div className="text-right text-[13px] text-ink/70">
                <p>{formatDateTime(lead.createdAt)}</p>
                <p>
                  {lead.grade}-sinf · {lead.locale.toUpperCase()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 ? (
        <nav aria-label="Sahifalar" className="mt-8 flex items-center justify-between text-[14px] font-semibold">
          {page > 1 ? <Link href={href(page - 1)}>← Oldingi</Link> : <span />}
          <span className="text-ink/70">
            {page} / {pages}
          </span>
          {page < pages ? <Link href={href(page + 1)}>Keyingi →</Link> : <span />}
        </nav>
      ) : null}
    </div>
  );
}
