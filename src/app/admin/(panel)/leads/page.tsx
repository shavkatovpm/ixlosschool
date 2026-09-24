import Link from "next/link";
import { Download, Phone } from "lucide-react";
import { updateLeadAction } from "../../actions";
import { formatDateTime, isLeadStatus, LEAD_STATUSES, listLeads, statusCounts, STATUS_LABEL } from "@/lib/admin/leads";

const PAGE_SIZE = 25;
const field =
  "h-11 rounded-[12px] border border-field-line bg-surface px-3 text-[14px] outline-none transition-colors focus:border-brand";

type SearchParams = { status?: string; q?: string; page?: string };

export default async function LeadsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const status = isLeadStatus(sp.status) ? sp.status : undefined;
  const q = (sp.q ?? "").trim().slice(0, 60);
  const page = Math.max(1, Math.floor(Number(sp.page)) || 1);
  const { rows, total } = listLeads({ status, q: q || undefined }, PAGE_SIZE, (page - 1) * PAGE_SIZE);
  const counts = statusCounts();
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const href = (next: { status?: string; page?: number }) => {
    const params = new URLSearchParams();
    const s = "status" in next ? next.status : status;
    if (s) params.set("status", s);
    if (q) params.set("q", q);
    if (next.page && next.page > 1) params.set("page", String(next.page));
    const query = params.toString();
    return `/admin/leads${query ? `?${query}` : ""}`;
  };

  const tabs = [{ value: undefined, label: "Hammasi", count: counts.all }, ...LEAD_STATUSES.map((s) => ({ value: s as string | undefined, label: STATUS_LABEL[s], count: counts[s] }))];

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] font-extrabold tracking-tight">Arizalar</h1>
          <p className="mt-2 text-[16px] text-ink/75">Saytdagi forma orqali kelgan arizalar. Holat va izohni o&apos;zgartirib saqlang.</p>
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

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = tab.value === status;
          return (
            <Link
              key={tab.label}
              href={href({ status: tab.value })}
              aria-current={active ? "page" : undefined}
              className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
                active ? "border-brand bg-brand text-white" : "border-line hover:bg-tint-a"
              }`}
            >
              {tab.label} · {tab.count}
            </Link>
          );
        })}
      </div>

      <form action="/admin/leads" className="mt-5 flex gap-2">
        {status ? <input type="hidden" name="status" value={status} /> : null}
        <input name="q" defaultValue={q} placeholder="Ism, telefon yoki izoh bo'yicha qidirish" maxLength={60} className={`${field} w-full max-w-md`} />
        <button type="submit" className="h-11 rounded-[12px] bg-brand px-5 text-[14px] font-bold text-white transition-colors hover:bg-brand-soft">
          Qidirish
        </button>
      </form>

      {rows.length === 0 ? (
        <p className="mt-8 rounded-[22px] bg-surface p-6 text-[15px] text-ink/75">Arizalar topilmadi.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {rows.map((lead) => (
            <li key={lead.id} className="rounded-[22px] bg-surface p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[18px] font-bold">{lead.name}</p>
                  <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className="mt-1 inline-flex min-h-8 items-center gap-2 text-[15px] font-semibold text-brand underline-offset-4 hover:underline">
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
              </div>
              <form action={updateLeadAction} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input type="hidden" name="id" value={lead.id} />
                <select name="status" defaultValue={lead.status} aria-label="Holat" className={`${field} sm:w-56`}>
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                <input name="note" defaultValue={lead.note} placeholder="Izoh" aria-label="Izoh" maxLength={1000} className={`${field} sm:flex-1`} />
                <button type="submit" className="h-11 rounded-[12px] border border-brand px-5 text-[14px] font-bold text-brand transition-colors hover:bg-brand hover:text-white">
                  Saqlash
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 ? (
        <nav aria-label="Sahifalar" className="mt-8 flex items-center justify-between text-[14px] font-semibold">
          {page > 1 ? <Link href={href({ page: page - 1 })}>← Oldingi</Link> : <span />}
          <span className="text-ink/70">
            {page} / {pages}
          </span>
          {page < pages ? <Link href={href({ page: page + 1 })}>Keyingi →</Link> : <span />}
        </nav>
      ) : null}
    </div>
  );
}
