import { Brand } from "./brand";
import { ArrowUp, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CONTACT, LEGAL } from "@/lib/contact";
import { InstagramIcon, YoutubeIcon } from "./social-icons";

const links = [
  { href: "/#nega-biz", key: "why" },
  { href: "/#dastur", key: "program" },
  { href: "/teachers", key: "teachers" },
  { href: "/results", key: "results" },
  { href: "/#hayot", key: "life" },
  { href: "/#togaraklar", key: "clubs" },
  { href: "/#savol-javob", key: "faq" },
  { href: "/contact", key: "contact" },
] as const;

const socialLinkClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink/80 transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="wrap pb-10 pt-14 sm:pt-16">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_1fr_auto] md:items-start">
        <div>
          <Brand variant="footer" />
          <p className="mt-5 max-w-xs text-[16px] leading-[1.7] text-ink/80">{t("tagline")}</p>

          <div className="mt-6 flex flex-col gap-2 text-[15px] leading-[1.6] text-ink/75">
            <a href={`tel:${CONTACT.phones[0]}`} className="w-fit font-semibold text-ink transition-colors hover:text-brand">
              {CONTACT.phonesDisplay[0]}
            </a>
            <address className="max-w-xs not-italic">{CONTACT.address}</address>
            <p className="text-ink/75">
              {t("hours")}: {CONTACT.hours}
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <a href={CONTACT.telegramUrl} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className={socialLinkClass}>
              <Send size={17} aria-hidden />
            </a>
            <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={socialLinkClass}>
              <InstagramIcon size={17} />
            </a>
            <a href={CONTACT.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={socialLinkClass}>
              <YoutubeIcon size={17} />
            </a>
          </div>
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

      <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-ink/75">
        <p className="max-w-4xl leading-[1.7]">
          {t("legal", { taxId: LEGAL.taxIdDisplay })}{" "}
          {t("license", { number: LEGAL.licenseNumber, date: LEGAL.licenseDateDisplay })}
        </p>
        <p>
          © {year} Ixlos School. {t("rights")}
        </p>
      </div>
      </div>
    </footer>
  );
}
