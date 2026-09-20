import { useTranslations } from "next-intl";
import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";

const bgs = ["bg-tint-a", "bg-tint-b", "bg-tint-c", "bg-tint-d"];

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
              className={`group relative flex h-full min-h-[280px] flex-col justify-between gap-10 overflow-hidden rounded-[28px] p-8 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_50px_-24px_rgba(23,60,36,0.35)] sm:p-10 ${bgs[i]}`}
            >
              <span className="font-display text-[64px] font-extrabold leading-none tracking-tight text-brand transition-transform duration-500 group-hover:translate-x-1">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-display text-[24px] font-bold leading-tight tracking-tight">{item.title}</h3>
                <p className="mt-3 max-w-md text-[16px] leading-[1.7] text-ink/75">{item.description}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
