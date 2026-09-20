import { useTranslations } from "next-intl";
import Image from "next/image";
import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";

const bgs = ["bg-tint-a", "bg-tint-b", "bg-tint-c", "bg-tint-d"];
const illustrations = ["why-specialization", "why-certificates", "why-groups", "why-safety"];

export function WhyUs() {
  const t = useTranslations("whyUs");
  const nav = useTranslations("nav");
  const items = t.raw("items") as { title: string; description: string }[];

  return (
    <section id="nega-biz" className="wrap py-20 sm:py-24 lg:py-32">
      <SectionHead index="01" label={nav("why")}>
        {t("titleA")} <span className="text-moss">{t("titleEm")}</span> {t("titleB")}
      </SectionHead>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 md:grid-cols-2 lg:gap-6">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={(i % 2) * 110}>
            <article
              className={`group relative flex h-full min-h-[280px] flex-col justify-between gap-10 overflow-hidden rounded-[28px] p-8 transition-shadow duration-500 hover:shadow-[inset_0_0_0_1.5px_rgba(23,92,43,0.3),0_22px_44px_-30px_rgba(23,60,36,0.4)] sm:p-10 ${bgs[i]}`}
            >
              {/* Hover: the title underline draws in and a thin ring appears; the card itself never moves. */}
              <div className="relative flex min-h-28 items-start justify-between gap-6 sm:min-h-32">
                <span className="font-display text-[64px] font-extrabold leading-none tracking-tight text-brand opacity-55 group-hover:opacity-70 group-active:opacity-70 motion-safe:transition-opacity motion-safe:duration-500">
                  0{i + 1}
                </span>
                <Image
                  src={`/illustrations/${illustrations[i]}.webp`}
                  alt=""
                  width={160}
                  height={160}
                  sizes="(min-width: 640px) 160px, 128px"
                  className="pointer-events-none -mr-2 -mt-4 h-32 w-32 shrink-0 select-none object-contain opacity-55 group-hover:opacity-70 group-active:opacity-70 motion-safe:transition-[transform,opacity] motion-safe:duration-500 motion-safe:group-hover:-translate-y-1 sm:-mr-3 sm:h-40 sm:w-40"
                />
              </div>
              <div className="relative">
                <h3 className="font-display text-[24px] font-bold leading-tight tracking-tight">
                  <span className="box-decoration-clone bg-[linear-gradient(var(--color-brand),var(--color-brand))] bg-[length:0%_2px] bg-[position:0_100%] bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_2px]">
                    {item.title}
                  </span>
                </h3>
                <p className="mt-3 max-w-md text-[16px] leading-[1.7] text-ink/75">{item.description}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
