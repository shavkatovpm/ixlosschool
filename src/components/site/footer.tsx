import { Brand } from "./brand";
import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const links = [
  { href: "/#nega-biz", key: "why" },
  { href: "/#dastur", key: "program" },
  { href: "/teachers", key: "teachers" },
  { href: "/#hayot", key: "life" },
  { href: "/#togaraklar", key: "clubs" },
  { href: "/#savol-javob", key: "faq" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="wrap pb-10 pt-14 sm:pt-16">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_auto] md:items-start">
        <div>
          <Brand variant="footer" />
          <p className="mt-5 max-w-xs text-[16px] leading-[1.7] text-ink/70">{t("tagline")}</p>
        </div>

        <nav aria-label={nav("mainLabel")} className="grid grid-cols-2 gap-x-8 gap-y-4 text-[15px] font-semibold">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="link-underline w-fit opacity-75 transition-opacity hover:opacity-100">
              {nav(l.key)}
            </Link>
          ))}
          <Link href="/admissions" className="link-underline w-fit opacity-75 transition-opacity hover:opacity-100">
            {t("admissions")}
          </Link>
        </nav>

        <a
          href="#top"
          className="group inline-flex h-12 w-fit items-center gap-3 rounded-full border border-ink/20 px-6 text-[14px] font-semibold transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white"
        >
          {t("top").replace(/\s*↑$/, "")}
          <ArrowUp size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
        </a>
      </div>

      <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-ink/55 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} Ixlos School. {t("rights")}
        </p>
        <Link href="/privacy" className="link-underline w-fit hover:text-ink">
          {t("privacy")}
        </Link>
      </div>
      </div>
    </footer>
  );
}
