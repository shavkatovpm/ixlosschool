"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChartNoAxesCombined,
  CircleHelp,
  GraduationCap,
  LayoutDashboard,
  MessageSquareQuote,
  Newspaper,
  Settings,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

type Item = { href: string; label: string; icon: LucideIcon; soon?: boolean };
type Group = { title: string; items: Item[] };

// Sections that are not built yet are shown disabled, so the panel's full structure is visible from day one.
const GROUPS: Group[] = [
  {
    title: "Asosiy",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/traffic", label: "Trafik", icon: ChartNoAxesCombined },
      { href: "/admin/leads", label: "Leadlar", icon: Users },
    ],
  },
  {
    title: "Kontent",
    items: [
      { href: "/admin/teachers", label: "Ustozlar", icon: GraduationCap, soon: true },
      { href: "/admin/articles", label: "Maqolalar", icon: Newspaper, soon: true },
      { href: "/admin/testimonials", label: "O'quvchilar fikri", icon: MessageSquareQuote },
      { href: "/admin/faq", label: "FAQ", icon: CircleHelp },
    ],
  },
  {
    title: "Sayt",
    items: [
      { href: "/admin/center", label: "Markaz ma'lumotlari", icon: Building2 },
      { href: "/admin/settings", label: "Sozlamalar", icon: Settings },
    ],
  },
];

const ACCOUNT: Item = { href: "/admin/account", label: "Hisob", icon: UserRound };

const base = "flex min-h-11 shrink-0 items-center gap-3 rounded-[12px] px-4 text-[15px] font-semibold transition-colors";

export function AdminNav() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`));

  const renderItem = ({ href, label, icon: Icon, soon }: Item) =>
    soon ? (
      <span key={href} aria-disabled="true" className={`${base} cursor-default text-ink/45`}>
        <Icon size={18} aria-hidden />
        {label}
        <span className="ml-auto hidden shrink-0 whitespace-nowrap rounded-full bg-tint-b px-2 py-0.5 text-[11px] font-bold text-ink/55 lg:inline">Tez orada</span>
      </span>
    ) : (
      <Link
        key={href}
        href={href}
        aria-current={isActive(href) ? "page" : undefined}
        className={`${base} ${isActive(href) ? "bg-brand text-on-brand" : "hover:bg-tint-a"}`}
      >
        <Icon size={18} aria-hidden />
        {label}
      </Link>
    );

  return (
    <nav aria-label="Admin menyu" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:overflow-visible lg:px-4 lg:pb-0">
      {GROUPS.map((group) => (
        <div key={group.title} className="flex gap-1 lg:mt-5 lg:block lg:space-y-1 first:lg:mt-0">
          <p className="hidden px-4 pb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-khaki-deep lg:block">{group.title}</p>
          {group.items.map(renderItem)}
        </div>
      ))}
      <div className="flex gap-1 lg:mt-5 lg:block lg:border-t lg:border-line lg:pt-4">{renderItem(ACCOUNT)}</div>
    </nav>
  );
}
