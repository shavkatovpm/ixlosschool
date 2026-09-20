import { useTranslations } from "next-intl";
import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";

type Stage = { range: string; title: string; copy: string };

export function Curriculum() {
  const t = useTranslations("curriculum");
  const nav = useTranslations("nav");
  const unit = useTranslations("hero")("gradeUnit");
  const stages = t.raw("stages") as Stage[];
  const [first, ...rest] = stages;

  return (
    <section id="dastur" className="wrap pb-20 sm:pb-24 lg:pb-32">
      <SectionHead index="02" label={nav("program")}>
        {t("titleA")} <span className="text-moss">{t("titleEm")}</span>
      </SectionHead>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 lg:grid-cols-2 lg:gap-6">
        <Reveal className="lg:row-span-2">
          <article className="group flex h-full min-h-[440px] flex-col justify-between gap-12 rounded-[28px] bg-brand p-8 text-[#f3f6e4] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-24px_rgba(23,92,43,0.6)] sm:p-12">
            <span className="eyebrow text-[#d4e0c4]">{t("firstTag")}</span>
            <div>
              <div className="font-display text-[clamp(96px,12vw,148px)] font-extrabold leading-[0.95] tracking-[-0.04em]">
                {first.range}
                <small className="mt-3 block text-[13px] font-bold tracking-[0.14em] text-[#cfdda7]">{unit}</small>
              </div>
              <h3 className="mt-8 font-display text-[26px] font-bold leading-tight tracking-tight">{first.title}</h3>
              <p className="mt-3 max-w-md text-[16px] leading-[1.7] text-[#dbe6ce]">{first.copy}</p>
            </div>
          </article>
        </Reveal>

        {rest.map((stage, i) => (
          <Reveal key={stage.range} delay={(i + 1) * 120}>
            <article
              className={`flex h-full flex-col gap-8 rounded-[28px] p-8 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_50px_-24px_rgba(23,60,36,0.35)] sm:p-10 ${
                i === 0 ? "bg-[#e9e0bd]" : "bg-[#d9e5c4]"
              }`}
            >
              <div className="flex items-baseline gap-3 font-display text-[64px] font-extrabold leading-none tracking-[-0.03em]">
                {stage.range}
                <small className="text-[13px] font-bold tracking-[0.14em] text-moss">{unit}</small>
              </div>
              <div>
                <h3 className="font-display text-[22px] font-bold leading-tight tracking-tight">{stage.title}</h3>
                <p className="mt-3 text-[16px] leading-[1.7] text-ink/75">{stage.copy}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
