import Link from "next/link";
import { ExternalLink, UserRound, Users } from "lucide-react";
import { leadsTotal } from "@/lib/admin/leads";

export default function DashboardPage() {
  const sections = [
    { href: "/admin/leads", icon: Users, title: "Arizalar", text: `Saytdagi forma orqali kelgan arizalar arxivi va CSV (${leadsTotal()} ta).` },
    { href: "/admin/account", icon: UserRound, title: "Hisob", text: "Email va parolni o'zgartirish." },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-[32px] font-extrabold tracking-tight">Bosh sahifa</h1>
      <p className="mt-2 text-[16px] text-ink/75">Ixlos School saytini boshqarish paneli.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sections.map(({ href, icon: Icon, title, text }) => (
          <Link key={href} href={href} className="rounded-[22px] bg-tint-a p-6 transition-colors hover:bg-tint-c">
            <Icon size={22} aria-hidden />
            <h2 className="mt-4 font-display text-[20px] font-bold tracking-tight">{title}</h2>
            <p className="mt-1 text-[14px] leading-[1.6] text-ink/75">{text}</p>
          </Link>
        ))}
      </div>

      <a
        href="/uz"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-brand underline-offset-4 hover:underline"
      >
        <ExternalLink size={16} aria-hidden />
        Saytni ochish
      </a>
    </div>
  );
}
