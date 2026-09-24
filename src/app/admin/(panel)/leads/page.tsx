import Link from "next/link";
import { Download, Phone } from "lucide-react";
import { Chip, PageHeader, fieldClass, ghostButton, primaryButton } from "@/components/admin/ui";
import { DEVICE_LABEL, LOCALE_LABEL, sourceWithMedium } from "@/lib/admin/format";
import { filterFrom } from "@/lib/admin/lead-filter";
import { formatDateTime, leadGrades, leadSources, listLeads } from "@/lib/admin/leads";

const PAGE_SIZE = 30;

type Search = { q?: string; page?: string; from?: string; to?: string; source?: string; locale?: string; grade?: string };

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const filter = filterFrom(sp);
  const page = Math.max(1, Math.floor(Number(sp.page)) || 1);
  const { rows, total } = listLeads(filter, PAGE_SIZE, (page - 1) * PAGE_SIZE);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const sources = leadSources();
  const grades = leadGrades();
  const filtered = Object.values(filter).some(Boolean);

  const query = (target?: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filter)) if (value) params.set(key, value);
    if (target && target > 1) params.set("page", String(target));
    const text = params.toString();
    return text ? `?${text}` : "";
  };

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader
        title="Leadlar"
        text={`Saytdagi forma orqali kelgan arizalar arxivi va ular qayerdan kelgani. Arizalar bilan ishlash Telegram guruhida davom etadi.`}
        actions={
          <a href={`/admin/leads/export${query()}`} className={ghostButton}>
            <Download size={16} aria-hidden />
            CSV yuklash{filtered ? " (filtr bilan)" : ""}
          </a>
        }
      />

      <form action="/admin/leads" className="grid gap-3 rounded-[22px] bg-surface p-5 sm:grid-cols-2 lg:grid-cols-6">
        <label className="text-[13px] font-semibold lg:col-span-2">
          Ism yoki telefon
          <input name="q" defaultValue={filter.q} maxLength={60} placeholder="Qidirish" className={`${fieldClass} mt-1 w-full`} />
        </label>
        <label className="text-[13px] font-semibold">
          Qaysi sanadan
          <input type="date" name="from" defaultValue={filter.from} className={`${fieldClass} mt-1 w-full`} />
        </label>
        <label className="text-[13px] font-semibold">
          Qaysi sanagacha
          <input type="date" name="to" defaultValue={filter.to} className={`${fieldClass} mt-1 w-full`} />
        </label>
        <label className="text-[13px] font-semibold">
          Manba
          <select name="source" defaultValue={filter.source ?? ""} className={`${fieldClass} mt-1 w-full`}>
            <option value="">Hammasi</option>
            {sources.map((s) => (
              <option key={s.source} value={s.source}>
                {sourceWithMedium(s.source, "")} ({s.count})
              </option>
            ))}
          </select>
        </label>
        <label className="text-[13px] font-semibold">
          Til
          <select name="locale" defaultValue={filter.locale ?? ""} className={`${fieldClass} mt-1 w-full`}>
            <option value="">Hammasi</option>
            {Object.entries(LOCALE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[13px] font-semibold">
          Sinf
          <select name="grade" defaultValue={filter.grade ?? ""} className={`${fieldClass} mt-1 w-full`}>
            <option value="">Hammasi</option>
            {grades.map((g) => (
              <option key={g.grade} value={g.grade}>
                {g.grade}-sinf ({g.count})
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-5 lg:justify-end">
          {filtered ? (
            <Link href="/admin/leads" className={ghostButton}>
              Tozalash
            </Link>
          ) : null}
          <button type="submit" className={primaryButton}>
            Qidirish
          </button>
        </div>
      </form>

      <p className="text-[14px] font-semibold text-ink/75">
        {filtered ? `Filtr bo'yicha ${total} ta` : `Jami ${total} ta ariza`}
      </p>

      {rows.length === 0 ? (
        <p className="rounded-[22px] bg-surface p-6 text-[15px] text-ink/75">{filtered ? "Hech narsa topilmadi." : "Hali ariza yo'q."}</p>
      ) : (
        <ul className="divide-y divide-line rounded-[22px] bg-surface">
          {rows.map((lead) => (
            <li key={lead.id} className="px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
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
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Chip tone={lead.source && lead.source !== "direct" ? "brand" : "neutral"}>
                  {lead.source ? sourceWithMedium(lead.source, lead.medium) : "Manba noma'lum"}
                </Chip>
                {lead.campaign ? <Chip>Kampaniya: {lead.campaign}</Chip> : null}
                {lead.device ? <Chip>{DEVICE_LABEL[lead.device] ?? lead.device}</Chip> : null}
                {lead.landing ? <Chip>Kirgan: {lead.landing}</Chip> : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 ? (
        <nav aria-label="Sahifalar" className="flex items-center justify-between text-[14px] font-semibold">
          {page > 1 ? <Link href={`/admin/leads${query(page - 1)}`}>← Oldingi</Link> : <span />}
          <span className="text-ink/70">
            {page} / {pages}
          </span>
          {page < pages ? <Link href={`/admin/leads${query(page + 1)}`}>Keyingi →</Link> : <span />}
        </nav>
      ) : null}
    </div>
  );
}
