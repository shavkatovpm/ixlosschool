import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export const metadata = { title: "404", robots: { index: false, follow: false } };

export default function NotFound() {
  const t = useTranslations("pages.notFound");

  return (
    <main className="wrap py-24 sm:py-32">
      <span className="font-display text-[clamp(96px,18vw,200px)] font-extrabold leading-none tracking-[-0.05em] text-brand">
        404
      </span>
      <h1 className="section-title mt-8 max-w-2xl">{t("title")}</h1>
      <p className="mt-6 max-w-md text-[18px] leading-[1.75] text-ink/75">{t("text")}</p>
      <Link
        href="/"
        className="mt-10 inline-flex h-14 items-center rounded-[12px] bg-brand px-8 text-[15px] font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-soft"
      >
        {t("cta")}
      </Link>
    </main>
  );
}
