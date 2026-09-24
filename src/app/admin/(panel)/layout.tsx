import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, LogOut, UserRound, Users } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { logoutAction } from "../actions";

const nav = [
  { href: "/admin", label: "Bosh sahifa", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Arizalar", icon: Users },
  { href: "/admin/account", label: "Hisob", icon: UserRound },
] as const;

const linkClass =
  "flex min-h-11 items-center gap-3 rounded-[12px] px-4 text-[15px] font-semibold transition-colors hover:bg-tint-a";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  if (session.mustChangePassword) redirect("/admin/account");

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block lg:px-6 lg:py-7">
          <div>
            <p className="font-display text-[20px] font-extrabold tracking-tight">Ixlos School</p>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-khaki-deep">Admin panel</p>
          </div>
          <form action={logoutAction} className="lg:hidden">
            <button type="submit" aria-label="Chiqish" className="flex h-11 w-11 items-center justify-center rounded-full border border-line">
              <LogOut size={18} aria-hidden />
            </button>
          </form>
        </div>
        <nav aria-label="Admin menyu" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:px-4 lg:pb-0">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={linkClass}>
              <Icon size={18} aria-hidden />
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden px-6 pb-6 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:block">
          <p className="truncate text-[13px] text-ink/70">{session.email}</p>
          <form action={logoutAction} className="mt-3">
            <button type="submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border border-line text-[14px] font-semibold transition-colors hover:bg-tint-a">
              <LogOut size={16} aria-hidden />
              Chiqish
            </button>
          </form>
        </div>
      </aside>
      <main className="px-5 py-8 sm:px-8 lg:px-12 lg:py-12">{children}</main>
    </div>
  );
}
