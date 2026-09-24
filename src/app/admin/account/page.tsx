import Link from "next/link";
import { LogOut } from "lucide-react";
import { changeAccountAction, logoutAction } from "../actions";
import { MIN_PASSWORD_LENGTH, requireAdmin } from "@/lib/admin/auth";

const MESSAGES: Record<string, string> = {
  wrong_current: "Joriy parol noto'g'ri.",
  mismatch: "Yangi parollar bir-biriga mos kelmadi.",
  short: `Yangi parol kamida ${MIN_PASSWORD_LENGTH} belgidan iborat bo'lishi kerak.`,
  weak: "Parol email nomini o'z ichiga olmasligi kerak.",
  same: "Yangi parol joriy paroldan farq qilishi kerak.",
  email_invalid: "Email noto'g'ri.",
  email_taken: "Bu email band.",
};

const field =
  "mt-2 h-12 w-full rounded-[12px] border border-field-line bg-surface px-4 text-[16px] outline-none transition-colors focus:border-brand";

// Outside the (panel) group on purpose: an account with a temporary password lands here and can go nowhere else.
export default async function AccountPage({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const session = await requireAdmin();
  const { e } = await searchParams;
  const error = e ? MESSAGES[e] : undefined;

  return (
    <main className="mx-auto max-w-[560px] px-5 py-10 sm:py-16">
      <div className="flex items-center justify-between gap-4">
        <p className="font-display text-[20px] font-extrabold tracking-tight">Ixlos School · Admin</p>
        <form action={logoutAction}>
          <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-[14px] font-semibold transition-colors hover:bg-tint-a">
            <LogOut size={16} aria-hidden />
            Chiqish
          </button>
        </form>
      </div>

      <div className="mt-8 rounded-[28px] bg-surface p-8 shadow-[0_24px_60px_-28px_rgba(22,46,37,0.35)] sm:p-10">
        <h1 className="font-display text-[28px] font-extrabold leading-tight tracking-tight">
          {session.mustChangePassword ? "Yangi parol o'rnating" : "Hisob"}
        </h1>
        <p className="mt-3 text-[15px] leading-[1.7] text-ink/75">
          {session.mustChangePassword
            ? "Sizga vaqtinchalik parol berilgan. Davom etish uchun o'zingizning parolingizni o'rnating (vaqtinchalik parol shundan keyin ishlamaydi)."
            : "Email va parolni shu yerda o'zgartirishingiz mumkin. Parol o'zgargach boshqa qurilmalardagi sessiyalar tugatiladi."}
        </p>

        <form action={changeAccountAction} className="mt-6">
          {error ? (
            <p role="alert" className="mb-4 rounded-[12px] bg-danger-bg px-4 py-3 text-[14px] text-danger">
              {error}
            </p>
          ) : null}
          <label className="block text-[14px] font-semibold">
            Email
            <input name="email" type="email" required defaultValue={session.email} autoComplete="username" maxLength={200} className={field} />
          </label>
          <label className="mt-5 block text-[14px] font-semibold">
            Joriy parol
            <input name="currentPassword" type="password" required autoComplete="current-password" maxLength={200} className={field} />
          </label>
          <label className="mt-5 block text-[14px] font-semibold">
            Yangi parol (kamida {MIN_PASSWORD_LENGTH} belgi)
            <input name="newPassword" type="password" required minLength={MIN_PASSWORD_LENGTH} autoComplete="new-password" maxLength={200} className={field} />
          </label>
          <label className="mt-5 block text-[14px] font-semibold">
            Yangi parolni qayta kiriting
            <input name="confirmPassword" type="password" required minLength={MIN_PASSWORD_LENGTH} autoComplete="new-password" maxLength={200} className={field} />
          </label>
          <button type="submit" className="mt-7 h-12 w-full rounded-[12px] bg-brand text-[15px] font-bold text-white transition-colors hover:bg-brand-soft">
            Saqlash
          </button>
        </form>

        {!session.mustChangePassword ? (
          <Link href="/admin" className="mt-6 inline-block text-[14px] font-semibold text-brand underline-offset-4 hover:underline">
            ← Panelga qaytish
          </Link>
        ) : null}
      </div>
    </main>
  );
}
