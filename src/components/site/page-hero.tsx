import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function PageHero({
  crumb,
  eyebrow,
  title,
  lead,
  parent,
  art,
  children,
}: {
  crumb: string;
  eyebrow: string;
  title: string;
  lead: string;
  /** A section page between "home" and this page in the breadcrumb. */
  parent?: { label: string; href: string };
  /** A decorative illustration beside the text on wide screens. */
  art?: string;
  /** Optional call to action under the lead. */
  children?: React.ReactNode;
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
          {parent ? (
            <>
              <li>
                <Link href={parent.href} className="link-underline hover:text-ink">
                  {parent.label}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight size={14} />
              </li>
            </>
          ) : null}
          <li aria-current="page" className="text-ink">
            {crumb}
          </li>
        </ol>
      </nav>

      {/* With a call to action, phones show it right under the title (before the lead) so it is on the first screen. */}
      <div className={`mt-10 ${art ? "grid items-center gap-12 xl:grid-cols-[minmax(0,1fr)_auto]" : ""}`}>
      <div
        className={`anim-rise max-w-4xl ${children ? "flex flex-col items-start" : ""}`}
        style={{ "--d": "120ms" } as React.CSSProperties}
      >
        <span className="eyebrow text-khaki-deep">
          <span aria-hidden className="h-px w-10 bg-current opacity-35" />
          {eyebrow}
        </span>
        <h1 className="section-title mt-6 !text-[clamp(2.25rem,5.4vw,4.75rem)]">{title}</h1>
        <p className={`mt-8 max-w-2xl text-[18px] leading-[1.75] text-ink/75 ${children ? "max-sm:order-last" : ""}`}>{lead}</p>
        {children ? <div className="mt-7 sm:mt-9">{children}</div> : null}
      </div>
      {art ? (
        <div aria-hidden className="anim-fade relative hidden h-[320px] w-[320px] items-center justify-center xl:flex">
          <span className="absolute h-[280px] w-[280px] rounded-full bg-tint-d" />
          <Image src={art} alt="" width={320} height={320} priority className="relative h-[300px] w-[300px] select-none object-contain" />
        </div>
      ) : null}
      </div>
    </section>
  );
}
