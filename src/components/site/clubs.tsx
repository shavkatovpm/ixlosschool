import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";

export function Clubs() {
  const t = useTranslations("clubs");
  const nav = useTranslations("nav");
  const items = t.raw("items") as string[];

  return (
    <section id="togaraklar" className="wrap pb-20 sm:pb-24 lg:pb-32">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHead index="04" label={nav("clubs")}>
          {t("titleA")} <span className="text-moss">{t("titleEm")}</span>
        </SectionHead>
        <Reveal delay={150}>
          <span className="inline-flex items-center gap-2.5 rounded-full bg-[#dfe8cd] px-5 py-3 text-[14px] font-bold">
            <span aria-hidden className="h-2 w-2 rounded-full bg-brand" />
            {t("badge")}
          </span>
        </Reveal>
      </div>

      <ul className="mt-14 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:mt-16 lg:grid-cols-4 lg:gap-5">
        {items.map((club, i) => (
          <li key={club}>
            <Reveal delay={(i % 4) * 80} className="h-full">
              <div className="group flex h-full min-h-[168px] cursor-default flex-col justify-between rounded-[22px] border border-[#ccd6bb] bg-[#eef0e5] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_24px_40px_-20px_rgba(23,92,43,0.55)] sm:min-h-[196px] sm:p-7">
                <div className="flex items-start justify-between">
                  <span className="font-display text-[14px] font-bold tabular-nums text-moss transition-colors duration-500 group-hover:text-[#cfdda7]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="opacity-0 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    aria-hidden
                  />
                </div>
                <span className="font-display text-[clamp(1.125rem,1.6vw,1.5rem)] font-bold leading-tight tracking-tight [overflow-wrap:anywhere]">
                  {club}
                </span>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
