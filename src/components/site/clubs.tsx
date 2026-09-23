import { useTranslations } from "next-intl";
import Image from "next/image";
import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";

const illustrations = ["abacus", "chess", "arabic", "robotics", "coding", "speech", "football", "judo"];
const cardColors = ["bg-neutral", "bg-surface", "bg-tint-d", "bg-neutral", "bg-surface", "bg-tint-d", "bg-neutral", "bg-surface"];

export function Clubs() {
  const t = useTranslations("clubs");
  const nav = useTranslations("nav");
  const items = t.raw("items") as string[];

  return (
    <section id="togaraklar" className="wrap pb-20 pt-20 sm:pb-24 sm:pt-24 lg:pb-32 lg:pt-28">
      <SectionHead index="06" label={nav("clubs")}>
        {t("titleA")} <span className="text-moss">{t("titleEm")}</span>
      </SectionHead>

      <ul className="mt-14 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:mt-16 lg:grid-cols-4 lg:gap-5">
        {items.map((club, i) => (
          <li key={club}>
            <Reveal delay={(i % 4) * 80} className="h-full">
              <div className={`group relative flex h-full min-h-[240px] cursor-default flex-col text-ink justify-between overflow-hidden rounded-[22px] border border-line p-6 motion-safe:transition-[border-color,box-shadow] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-brand hover:shadow-[0_24px_40px_-24px_rgba(22,62,50,0.18)] sm:min-h-[272px] sm:p-7 ${cardColors[i]}`}>
                <span className="font-display text-[14px] font-bold tabular-nums text-moss opacity-100 group-hover:opacity-100 group-active:opacity-100 motion-safe:transition-opacity motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative my-3 flex h-28 items-center justify-center sm:h-32">
                  <span aria-hidden className="pointer-events-none absolute h-24 w-24 rounded-full bg-paper/45 ring-1 ring-white/30 sm:h-28 sm:w-28" />
                  <Image
                    src={`/illustrations/club-${illustrations[i]}-warm.webp`}
                    alt=""
                    width={160}
                    height={160}
                    sizes="(min-width: 640px) 160px, 144px"
                    className="pointer-events-none relative h-36 w-36 select-none object-contain opacity-55 group-hover:opacity-100 group-active:opacity-100 motion-safe:transition-[translate,rotate,opacity] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:rotate-3 sm:h-40 sm:w-40"
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
