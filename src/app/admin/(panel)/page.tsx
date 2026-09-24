import Link from "next/link";
import { formatDateTime, leadsInLastDays, leadsToday, listLeads, statusCounts, STATUS_LABEL, LEAD_STATUSES } from "@/lib/admin/leads";

export default function DashboardPage() {
  const counts = statusCounts();
  const today = leadsToday();
  const week = leadsInLastDays(7);
  const { rows: recent } = listLeads({}, 6, 0);

  const cards = [
    { label: "Yangi (ko'rilmagan)", value: counts.new, href: "/admin/leads?status=new" },
    { label: "Bugun kelgan", value: today },
    { label: "Oxirgi 7 kun", value: week },
    { label: "Jami arizalar", value: counts.all, href: "/admin/leads" },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-[32px] font-extrabold tracking-tight">Bosh sahifa</h1>
      <p className="mt-2 text-[16px] text-ink/75">Saytdan kelgan arizalar qisqacha.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => {
          const body = (
            <>
              <p className="text-[13px] font-semibold text-ink/75">{card.label}</p>
              <p className="mt-2 font-display text-[40px] font-extrabold leading-none tabular-nums">{card.value}</p>
            </>
          );
          return card.href ? (
            <Link key={card.label} href={card.href} className="rounded-[22px] bg-tint-a p-6 transition-colors hover:bg-tint-c">
              {body}
            </Link>
          ) : (
            <div key={card.label} className="rounded-[22px] bg-tint-b p-6">
              {body}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {LEAD_STATUSES.map((status) => (
          <Link
            key={status}
            href={`/admin/leads?status=${status}`}
            className="rounded-full border border-line px-4 py-2 text-[13px] font-semibold transition-colors hover:bg-tint-a"
          >
            {STATUS_LABEL[status]}: {counts[status]}
          </Link>
        ))}
      </div>

      <h2 className="mt-12 font-display text-[22px] font-bold tracking-tight">Oxirgi arizalar</h2>
      {recent.length === 0 ? (
        <p className="mt-4 rounded-[22px] bg-surface p-6 text-[15px] text-ink/75">
          Hali ariza yo&apos;q. Saytdagi forma orqali kelgan arizalar shu yerda ko&apos;rinadi.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-line rounded-[22px] bg-surface">
          {recent.map((lead) => (
            <li key={lead.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
              <div>
                <p className="font-semibold">{lead.name}</p>
                <p className="text-[14px] text-ink/70">
                  {lead.phone} · {lead.grade}-sinf
                </p>
              </div>
              <div className="text-right text-[13px] text-ink/70">
                <p>{formatDateTime(lead.createdAt)}</p>
                <p className="font-semibold text-ink">{STATUS_LABEL[lead.status]}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
