import { BarChart, BarList } from "@/components/admin/charts";
import { ExcludeDevice } from "@/components/admin/exclude-device";
import { DateFilter } from "@/components/admin/date-filter";
import { Empty, PageShell, Panel, Stat } from "@/components/admin/ui";
import {
  bots,
  browsers,
  campaigns,
  devices,
  languages,
  sources,
  topPages,
  totals,
  trackingStartedAt,
} from "@/lib/admin/analytics";
import { DEVICE_LABEL, LOCALE_LABEL, formatAgo, pageLabel, sourceWithMedium } from "@/lib/admin/format";
import { formatDateTime } from "@/lib/admin/leads";
import { BOT_KIND_LABEL } from "@/lib/analytics-shared";
import { chartSeries } from "@/lib/admin/chart-series";
import { requirePanel } from "@/lib/admin/panel";
import { availableMonths, describePeriod, resolvePeriod } from "@/lib/admin/period";

export default async function TrafficPage({ searchParams }: { searchParams: Promise<{ p?: string; m?: string }> }) {
  await requirePanel();
  const sp = await searchParams;
  const period = resolvePeriod(sp);
  const current = period.range;

  const now = totals(current);
  const before = period.previous ? totals(period.previous) : null;
  const chart = chartSeries(period);
  const pages = topPages(current, 8);
  const sourceRows = sources(current, 8);
  const langRows = languages(current);
  const deviceRows = devices(current);
  const browserRows = browsers(current);
  const campaignRows = campaigns(current);
  const botRows = bots(current);
  const started = trackingStartedAt();

  const perVisit = now.visitors ? (now.views / now.visitors).toFixed(1) : "—";
  const conversion = now.visitors ? `${((now.leads / now.visitors) * 100).toFixed(1)}%` : "—";
  const conversionBefore = before?.visitors ? (before.leads / before.visitors) * 100 : 0;
  const noData = now.views === 0;

  return (
    <PageShell
      width="6xl"
      title="Trafik"
      text="Kim, qayerdan kelgan, nimani ko'rgan va nechtasi ariza qoldirgan."
      stacked
      actions={<DateFilter base="/admin/traffic" period={period} months={availableMonths()} />}
    >
      {noData ? (
        <Empty>
          {started
            ? "Tanlangan davrda tashrif yo'q."
            : "Statistika saytning yangi versiyasi ishga tushgandan keyin yig'ila boshlaydi. Ma'lumot to'planishi bilan shu yerda ko'rinadi."}
        </Empty>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Tashrifchilar" value={now.visitors} compare={before ? { current: now.visitors, previous: before.visitors } : undefined} hint="kunlik noyob" tone="a" />
        <Stat label="Sahifa ko'rishlari" value={now.views} compare={before ? { current: now.views, previous: before.views } : undefined} tone="b" />
        <Stat label="Ariza qoldirganlar" value={now.leads} compare={before ? { current: now.leads, previous: before.leads } : undefined} tone="c" />
        <Stat
          label="Konversiya"
          value={conversion}
          hint={`tashrifga ${perVisit} sahifa`}
          compare={before ? { current: Math.round(now.visitors ? (now.leads / now.visitors) * 1000 : 0), previous: Math.round(conversionBefore * 10) } : undefined}
          tone="d"
        />
      </div>

      <Panel
        title={chart.unit === "soat" ? "Soatlar bo'yicha tashrifchilar" : chart.unit === "hafta" ? "Haftalar bo'yicha tashrifchilar" : "Kunlar bo'yicha tashrifchilar"}
        hint={`${describePeriod(period)} · Toshkent vaqti bilan`}
      >
        <BarChart label="Tashrifchilar" points={chart.points.map((d) => ({ day: d.day, label: d.label, value: d.visitors }))} />
        {now.leads > 0 ? (
          <div className="mt-4 border-t border-line/60 pt-4">
            <p className="mb-1 text-[13px] font-semibold text-ink/75">Arizalar</p>
            <BarChart label="Arizalar" color="var(--color-danger)" height={110} points={chart.points.map((d) => ({ day: d.day, label: d.label, value: d.leads }))} />
          </div>
        ) : null}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Eng ko'p ko'rilgan sahifalar" hint="Tashrifchilar soni bo'yicha">
          {pages.length ? (
            <BarList rows={pages.map((p) => ({ key: p.key, label: pageLabel(p.key), value: p.visitors, sub: `${p.views} ko'rish` }))} />
          ) : (
            <Empty>Hali ma&apos;lumot yo&apos;q.</Empty>
          )}
        </Panel>
        <Panel title="Qayerdan kelishdi" hint="Manba, kanal va ulardan kelgan arizalar">
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
        <Panel title="Til bo'yicha">
          {langRows.length ? (
            <BarList rows={langRows.map((l) => ({ key: l.key, label: LOCALE_LABEL[l.key] ?? l.key, value: l.visitors }))} />
          ) : (
            <Empty>Hali ma&apos;lumot yo&apos;q.</Empty>
          )}
        </Panel>
        <Panel title="Qurilma va brauzer">
          {deviceRows.length ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <BarList rows={deviceRows.map((d) => ({ key: d.key, label: DEVICE_LABEL[d.key] ?? d.key, value: d.visitors }))} />
              <BarList rows={browserRows.slice(0, 5).map((b) => ({ key: b.key, label: b.key, value: b.visitors }))} />
            </div>
          ) : (
            <Empty>Hali ma&apos;lumot yo&apos;q.</Empty>
          )}
        </Panel>
      </div>

      {campaignRows.length ? (
        <Panel title="Reklama kampaniyalari (UTM)" hint="Havolalarga ?utm_source=…&utm_campaign=… qo'shilganda ko'rinadi">
          <BarList rows={campaignRows.map((c) => ({ key: c.key, label: c.key, value: c.visitors, sub: `${c.views} ko'rish` }))} />
        </Panel>
      ) : null}

      <Panel
        title="Qidiruv tizimlari va AI botlari"
        hint="Google, Yandex, ChatGPT, Perplexity va boshqa robotlar sahifalaringizni qachon o'qigani. Saytni topilishi (SEO/GEO) shu yerdan tekshiriladi."
      >
        {botRows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[14px]">
              <thead className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60">
                <tr>
                  <th scope="col" className="pb-2 pr-3">Bot</th>
                  <th scope="col" className="pb-2 pr-3">Turi</th>
                  <th scope="col" className="pb-2 pr-3 text-right">So&apos;rovlar</th>
                  <th scope="col" className="pb-2 pr-3 text-right">Sahifalar</th>
                  <th scope="col" className="pb-2">Oxirgi marta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {botRows.map((b) => (
                  <tr key={`${b.bot}-${b.kind}`}>
                    <td className="py-2.5 pr-3 font-semibold">{b.bot}</td>
                    <td className="py-2.5 pr-3 text-ink/75">{BOT_KIND_LABEL[b.kind as keyof typeof BOT_KIND_LABEL] ?? b.kind}</td>
                    <td className="py-2.5 pr-3 text-right tabular-nums">{b.hits}</td>
                    <td className="py-2.5 pr-3 text-right tabular-nums">{b.pages}</td>
                    <td className="py-2.5 text-ink/75" title={formatDateTime(b.last)}>{formatAgo(b.last)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>
            Tanlangan davrda robot tashrifi qayd etilmagan. Google va boshqalar saytni birinchi marta o&apos;qiganda shu yerda paydo bo&apos;ladi.
          </Empty>
        )}
      </Panel>

      <Panel title="Maxfiylik" hint="Bu statistika sayt ichida yuritiladi va tashrifchilar haqida shaxsiy ma'lumot saqlamaydi.">
        <ul className="mb-5 list-disc space-y-1 pl-5 text-[14px] leading-[1.6] text-ink/75">
          <li>Cookie ishlatilmaydi; IP manzil va brauzerning to&apos;liq yozuvi saqlanmaydi (faqat qurilma turi va brauzer nomi).</li>
          <li>&quot;Tashrifchi&quot; har kuni yangidan hisoblanadigan tasodifiy kalitli belgi: kecha kelgan odam bugun boshqa hisoblanadi.</li>
          <li>&quot;Do Not Track&quot; yoqilgan brauzerlar hisobga olinmaydi. Ma&apos;lumotlar 13 oydan keyin o&apos;chiriladi.</li>
          <li>&quot;To&apos;g&apos;ridan-to&apos;g&apos;ri&quot; — havolasiz kelganlar. Telegram va Instagram ilovalari ko&apos;pincha manbani bermaydi, ular ham shu yerga tushadi.</li>
        </ul>
        <ExcludeDevice />
      </Panel>
    </PageShell>
  );
}
