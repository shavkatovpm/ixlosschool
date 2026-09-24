import Link from "next/link";
import { ExternalLink, Phone } from "lucide-react";
import { BarChart, BarList } from "@/components/admin/charts";
import { Chip, Empty, PageHeader, Panel, Stat } from "@/components/admin/ui";
import {
  currentVisitors,
  dailySeries,
  lastBotVisits,
  rangeOf,
  sources,
  topPages,
  totals,
  trackingStartedAt,
} from "@/lib/admin/analytics";
import { formatAgo, pageLabel, sourceWithMedium } from "@/lib/admin/format";
import { formatDateTime, leadsTotal, recentLeads } from "@/lib/admin/leads";
import { requirePanel } from "@/lib/admin/panel";

export default async function DashboardPage() {
  await requirePanel();
  const { current, previous } = rangeOf(7);
  const now = totals(current);
  const before = totals(previous);
  const series = dailySeries(rangeOf(14).current);
  const pages = topPages(current, 5);
  const sourceRows = sources(current, 5);
  const leads = recentLeads(5);
  const crawlers = lastBotVisits();
  const started = trackingStartedAt();
  const live = currentVisitors();
  const searchBot = crawlers.find((c) => c.kind === "search");
  const aiBot = crawlers.find((c) => c.kind === "ai");

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        title="Dashboard"
        text="Saytning oxirgi 7 kunlik holati (oldingi 7 kun bilan solishtirilgan)."
        actions={
          <a
            href="/uz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-brand underline-offset-4 hover:underline"
          >
            <ExternalLink size={16} aria-hidden />
            Saytni ochish
          </a>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Tashrifchilar" value={now.visitors} compare={{ current: now.visitors, previous: before.visitors }} hint="7 kun" tone="a" />
        <Stat label="Sahifa ko'rishlari" value={now.views} compare={{ current: now.views, previous: before.views }} hint="7 kun" tone="b" />
        <Stat label="Yangi arizalar" value={now.leads} compare={{ current: now.leads, previous: before.leads }} hint={`jami ${leadsTotal()}`} tone="c" />
        <Stat label="Hozir saytda" value={live} hint="oxirgi 5 daqiqa" tone="d" />
      </div>

      {!started ? (
        <Empty>
          Statistika saytning yangi versiyasi ishga tushgandan keyin yig&apos;ila boshlaydi. Shundan keyin bu yerda tashrifchilar, manbalar va arizalar ko&apos;rinadi.
        </Empty>
      ) : null}

      <Panel
        title="Oxirgi 14 kun"
        hint="Kunlik tashrifchilar"
        action={
          <Link href="/admin/traffic" className="text-[13px] font-semibold text-brand underline-offset-4 hover:underline">
            Batafsil →
          </Link>
        }
      >
        <BarChart label="Tashrifchilar" points={series.map((d) => ({ day: d.day, value: d.visitors }))} height={170} />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="So'nggi arizalar" action={<Link href="/admin/leads" className="text-[13px] font-semibold text-brand underline-offset-4 hover:underline">Hammasi →</Link>}>
          {leads.length ? (
            <ul className="divide-y divide-line/60">
              {leads.map((lead) => (
                <li key={lead.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-[15px] font-bold">{lead.name}</p>
                    <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand hover:underline">
                      <Phone size={13} aria-hidden />
                      {lead.phone}
                    </a>
                  </div>
                  <div className="text-right text-[12px] text-ink/65">
                    <p>{formatDateTime(lead.createdAt)}</p>
                    <p>
                      {lead.grade}-sinf {lead.source ? <Chip>{sourceWithMedium(lead.source, "")}</Chip> : null}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>Hali ariza yo&apos;q.</Empty>
          )}
        </Panel>

        <Panel title="Qayerdan kelishdi" hint="Oxirgi 7 kun, tashrifchilar soni">
          {sourceRows.length ? (
            <BarList
              rows={sourceRows.map((s) => ({
                key: `${s.source}-${s.medium}`,
                label: sourceWithMedium(s.source, s.medium),
                value: s.visitors,
                sub: s.leads ? `${s.leads} ariza` : undefined,
              }))}
            />
          ) : (
            <Empty>Hali ma&apos;lumot yo&apos;q.</Empty>
          )}
        </Panel>

        <Panel title="Eng ko'p ko'rilgan sahifalar" hint="Oxirgi 7 kun">
          {pages.length ? (
            <BarList rows={pages.map((p) => ({ key: p.key, label: pageLabel(p.key), value: p.visitors, sub: `${p.views} ko'rish` }))} />
          ) : (
            <Empty>Hali ma&apos;lumot yo&apos;q.</Empty>
          )}
        </Panel>

        <Panel title="Qidiruv va AI botlari" hint="Sayt topilishi (SEO/GEO) belgisi: robotlar sahifalarni o'qiyaptimi">
          <dl className="space-y-3 text-[14px]">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="font-semibold">Qidiruv tizimlari (Google, Yandex, Bing…)</dt>
              <dd className="text-right text-ink/75">{searchBot ? `${searchBot.bot} · ${formatAgo(searchBot.last)}` : "hali kelmagan"}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="font-semibold">AI dasturlar (ChatGPT, Claude, Perplexity…)</dt>
              <dd className="text-right text-ink/75">{aiBot ? `${aiBot.bot} · ${formatAgo(aiBot.last)}` : "hali kelmagan"}</dd>
            </div>
          </dl>
          <Link href="/admin/traffic" className="mt-4 inline-block text-[13px] font-semibold text-brand underline-offset-4 hover:underline">
            Barcha botlar →
          </Link>
        </Panel>
      </div>

      {started ? (
        <p className="text-[12px] text-ink/60">Statistika {formatDateTime(started).slice(0, 10)} dan beri yig&apos;ilmoqda. Vaqt: Toshkent.</p>
      ) : null}
    </div>
  );
}
