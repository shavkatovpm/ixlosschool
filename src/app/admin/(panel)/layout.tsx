import { redirect } from "next/navigation";
import { LogOut, GraduationCap } from "lucide-react";
import { AdminNav } from "@/components/admin/nav";
import { requireAdmin } from "@/lib/admin/auth";
import { logoutAction } from "../actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  if (session.mustChangePassword) redirect("/admin/account");

  return (
    <div className="admin-shell min-h-screen lg:grid lg:grid-cols-[288px_1fr]">
      <aside className="admin-sidebar border-b border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block lg:px-6 lg:py-7">
          <div className="admin-brand">
            <span className="admin-brand-mark"><GraduationCap size={24} aria-hidden /></span>
            <div>
              <p className="font-display text-[20px] font-extrabold tracking-tight">Ixlos School</p>
              <p className="admin-brand-caption text-[12px] font-bold uppercase tracking-[0.14em] text-khaki-deep">Admin panel</p>
            </div>
          </div>
          <form action={logoutAction} className="lg:hidden">
            <button type="submit" aria-label="Chiqish" className="flex h-11 w-11 items-center justify-center rounded-full border border-line">
              <LogOut size={18} aria-hidden />
            </button>
          </form>
        </div>
        <AdminNav />
        <div className="mt-auto hidden px-6 pb-6 pt-8 lg:block">
          <p className="admin-profile-email truncate text-[13px] text-ink/70">{session.email}</p>
          <form action={logoutAction} className="mt-3">
            <button type="submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border border-line text-[14px] font-semibold transition-colors hover:bg-tint-a">
              <LogOut size={16} aria-hidden />
              Chiqish
            </button>
          </form>
        </div>
      </aside>
      <main className="admin-main min-w-0">
        {children}
      </main>
    </div>
  );
}
