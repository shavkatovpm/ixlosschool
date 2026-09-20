import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Brand } from "./brand";
import { HeaderShell } from "./header-shell";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";

const links = [
  { href: "/#nega-biz", key: "why" },
  { href: "/#dastur", key: "program" },
  { href: "/teachers", key: "teachers" },
  { href: "/#hayot", key: "life" },
  { href: "/#togaraklar", key: "clubs" },
  { href: "/#savol-javob", key: "faq" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const items = links.map((l) => ({ href: l.href, label: t(l.key) }));

  return (
    <HeaderShell>
      <div className="wrap flex h-[76px] items-center gap-3 transition-[height] duration-300 group-data-[scrolled=true]:h-[68px] sm:h-[96px] sm:gap-4 sm:group-data-[scrolled=true]:h-[76px] min-[1200px]:gap-4 xl:gap-10">
        <Link href="/" className="anim-fade shrink-0" aria-label="Ixlos School">
          <Brand variant="header" />
        </Link>

        <nav aria-label={t("mainLabel")} className="ml-auto hidden items-center gap-4 text-[14px] min-[1200px]:flex min-[1280px]:gap-7 font-semibold">
          {items.map((l) => (
            <Link key={l.href} href={l.href} className="link-underline whitespace-nowrap opacity-75 transition-opacity hover:opacity-100">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3 min-[1200px]:ml-0">
          <LocaleSwitcher />
          <Link
            href="/#ariza"
            className="group/cta hidden h-12 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-[10px] bg-brand px-5 text-[14px] xl:px-6 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-soft hover:shadow-[0_10px_24px_-8px_rgba(23,92,43,0.55)] active:translate-y-0 sm:inline-flex"
          >
            {t("apply")}
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <MobileMenu links={items} cta={t("apply")} label={t("menu")} />
        </div>
      </div>
    </HeaderShell>
  );
}
