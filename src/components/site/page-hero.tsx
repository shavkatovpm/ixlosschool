import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function PageHero({
  crumb,
  eyebrow,
  title,
  lead,
}: {
  crumb: string;
  eyebrow: string;
  title: string;
  lead: string;
}) {
  const t = useTranslations("pages");

  return (
    <section className="wrap pb-16 pt-6 sm:pb-20 sm:pt-10 lg:pb-24">
      <nav aria-label="Breadcrumb" className="anim-fade text-[14px] font-medium text-ink/75">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="link-underline hover:text-ink">
              {t("home")}
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight size={14} />
          </li>
          <li aria-current="page" className="text-ink">
            {crumb}
          </li>
        </ol>
      </nav>

      <div className="anim-rise mt-10 max-w-4xl" style={{ "--d": "120ms" } as React.CSSProperties}>
        <span className="eyebrow text-khaki-deep">
          <span aria-hidden className="h-px w-10 bg-current opacity-35" />
          {eyebrow}
        </span>
        <h1 className="section-title mt-6 !text-[clamp(2.25rem,5.4vw,4.75rem)]">{title}</h1>
        <p className="mt-8 max-w-2xl text-[18px] leading-[1.75] text-ink/75">{lead}</p>
      </div>
    </section>
  );
}
