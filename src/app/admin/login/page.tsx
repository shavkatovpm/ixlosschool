import { redirect } from "next/navigation";
import { loginAction } from "../actions";
import { getSession, hasAdminUser } from "@/lib/admin/auth";

const ERRORS: Record<string, string> = {
  invalid: "Email yoki parol noto'g'ri.",
  throttled: "Juda ko'p noto'g'ri urinish. 15 daqiqadan keyin qayta urinib ko'ring.",
};

const field =
  "mt-2 h-12 w-full rounded-[12px] border border-field-line bg-surface px-4 text-[16px] outline-none transition-colors focus:border-brand";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  if (await getSession()) redirect("/admin");
  const { e } = await searchParams;
  const error = e ? ERRORS[e] : undefined;
  const noAdmin = !hasAdminUser();

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-[420px] rounded-[28px] bg-surface p-8 shadow-[0_24px_60px_-28px_rgba(22,46,37,0.35)] sm:p-10">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-khaki-deep">Ixlos School</p>
        <h1 className="mt-3 font-display text-[28px] font-extrabold leading-tight tracking-tight">Admin panelga kirish</h1>

        {noAdmin ? (
          <p className="mt-6 rounded-[12px] bg-tint-a px-4 py-3 text-[14px] leading-[1.6]">
            Hali admin yaratilmagan. Serverda <code className="font-mono text-[13px]">admin:create</code> buyrug&apos;ini
            ishga tushiring (docs/admin.md).
          </p>
        ) : null}

        <form action={loginAction} className="mt-6">
          {error ? (
            <p role="alert" className="mb-4 rounded-[12px] bg-danger-bg px-4 py-3 text-[14px] text-danger">
              {error}
            </p>
          ) : null}
          <label className="block text-[14px] font-semibold">
            Email
            <input name="email" type="email" required autoComplete="username" maxLength={200} className={field} />
          </label>
          <label className="mt-5 block text-[14px] font-semibold">
            Parol
            <input name="password" type="password" required autoComplete="current-password" maxLength={200} className={field} />
          </label>
          <button
            type="submit"
            className="mt-7 h-12 w-full rounded-[12px] bg-brand text-[15px] font-bold text-white transition-colors hover:bg-brand-soft"
          >
            Kirish
          </button>
        </form>
      </div>
    </main>
  );
}
