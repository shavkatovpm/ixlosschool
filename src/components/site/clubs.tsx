import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";

const illustrations = ["abacus", "chess", "arabic", "robotics", "coding", "speech", "football", "judo"];
const cardColors = ["bg-[#f1e3da]", "bg-[#e5e9ed]", "bg-[#ece6ef]", "bg-[#f3ead7]", "bg-[#e5e9ed]", "bg-[#f1e3e5]", "bg-[#f1e3da]", "bg-[#ece6ef]"];

export function Clubs() {
  const t = useTranslations("clubs");
  const nav = useTranslations("nav");
  const items = t.raw("items") as string[];

  return (
    <section id="togaraklar" className="wrap pb-20 sm:pb-24 lg:pb-32">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHead index="04" label={nav("clubs")}>
          {t("titleA")} <span className="text-[#a66c54]">{t("titleEm")}</span>
        </SectionHead>
        <Reveal delay={150}>
          <span className="inline-flex items-center gap-2.5 rounded-full bg-[#eee5d9] px-5 py-3 text-[14px] font-bold text-[#685548]">
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#b98355]" />
            {t("badge")}
          </span>
        </Reveal>
      </div>

      <ul className="mt-14 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:mt-16 lg:grid-cols-4 lg:gap-5">
        {items.map((club, i) => (
          <li key={club}>
            <Reveal delay={(i % 4) * 80} className="h-full">
              <div className={`group relative flex h-full min-h-[240px] cursor-default flex-col text-[#463d38] justify-between overflow-hidden rounded-[22px] border border-[#d9d0c7] p-6 motion-safe:transition-[border-color,box-shadow] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#a88d7c] hover:shadow-[0_24px_40px_-24px_rgba(100,75,55,0.18)] sm:min-h-[272px] sm:p-7 ${cardColors[i]}`}>
                <div className="flex items-start justify-between">
                  <span className="font-display text-[14px] font-bold tabular-nums text-[#71645a] opacity-55 group-hover:opacity-70 group-active:opacity-70 motion-safe:transition-opacity motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="opacity-30 group-hover:opacity-70 group-active:opacity-70 motion-safe:transition-[translate,opacity] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
                <div className="relative my-3 flex h-28 items-center justify-center sm:h-32">
                  <span aria-hidden className="pointer-events-none absolute h-24 w-24 rounded-full bg-paper/45 ring-1 ring-white/30 sm:h-28 sm:w-28" />
                  <Image
                    src={`/illustrations/club-${illustrations[i]}-warm.webp`}
                    alt=""
                    width={160}
                    height={160}
                    sizes="(min-width: 640px) 160px, 144px"
                    className="pointer-events-none relative h-36 w-36 select-none object-contain opacity-55 group-hover:opacity-70 group-active:opacity-70 motion-safe:transition-[translate,rotate,opacity] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:rotate-3 sm:h-40 sm:w-40"
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
