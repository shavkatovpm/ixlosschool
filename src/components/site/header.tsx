import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ApplyTrigger } from "./apply-modal";
import { Brand } from "./brand";
import { HeaderShell } from "./header-shell";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";

const links = [
  { href: "/#dastur", key: "program" },
  { href: "/teachers", key: "teachers" },
  { href: "/results", key: "results" },
  { href: "/#savol-javob", key: "faq" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const items = links.map((l) => ({ href: l.href, label: t(l.key) }));

  return (
    <HeaderShell>
      <div className="wrap flex h-[64px] items-center gap-2 !px-3 sm:h-[72px] min-[1200px]:h-[96px] min-[1200px]:!px-[clamp(20px,4.5vw,56px)] min-[1200px]:group-data-[scrolled=true]:h-[76px] transition-[height] duration-300 min-[1440px]:gap-4">
        <Link href="/" className="anim-fade shrink-0" aria-label="Ixlos School">
          <Brand variant="header" />
        </Link>

        <nav aria-label={t("mainLabel")} className="ml-auto hidden items-center gap-2.5 text-[14px] min-[1200px]:flex min-[1366px]:gap-4 font-semibold">
          {items.map((l) => (
            <Link key={l.href} href={l.href} className="link-underline whitespace-nowrap opacity-75 transition-opacity hover:opacity-100">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 min-[1200px]:ml-0 min-[1200px]:gap-2 min-[1440px]:gap-3">
          <LocaleSwitcher />
          <ApplyTrigger
            className="group/cta hidden h-12 shrink-0 cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-[10px] bg-brand px-4 text-[14px] min-[1440px]:px-6 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-soft hover:shadow-[0_10px_24px_-8px_rgba(22,62,50,0.55)] active:translate-y-0 min-[1200px]:inline-flex"
          >
            {t("apply")}
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
              aria-hidden
            />
          </ApplyTrigger>
          <MobileMenu links={items} cta={t("apply")} label={t("menu")} />
        </div>
      </div>
    </HeaderShell>
  );
}
