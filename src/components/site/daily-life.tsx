import { useTranslations } from "next-intl";
import { CountUp } from "./count-up";
import { Reveal } from "./reveal";

export function DailyLife() {
  const t = useTranslations("dailyLife");
  const cells = t.raw("cells") as { value: string; label: string }[];

  return (
    <section id="hayot" className="wrap pb-20 sm:pb-24 lg:pb-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] bg-sage">
          <span
            aria-hidden
            className="anim-breathe pointer-events-none absolute -right-[12%] top-[8%] h-[460px] w-[460px] rounded-full border border-[#94ad76]/50"
          />
          <span
            aria-hidden
            className="anim-breathe pointer-events-none absolute -right-[26%] top-[-6%] h-[620px] w-[620px] rounded-full border border-[#94ad76]/40"
            style={{ animationDelay: "-3s" }}
          />

          <div className="relative grid grid-cols-1 gap-12 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:p-16">
            <div>
              <span className="eyebrow text-khaki-deep">{t("label")}</span>
              <strong className="mt-8 block font-display text-[clamp(120px,20vw,240px)] font-extrabold leading-[0.82] tracking-[-0.05em] text-brand">
                <CountUp to={Number(t("big"))} />
                <em className="ml-4 text-[0.2em] font-extrabold not-italic tracking-[-0.03em]">{t("unit")}</em>
              </strong>
            </div>

            <div className="flex flex-col justify-end gap-8">
              <p className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.18] tracking-tight">
                {t("line1")}
                <br />
                {t("line2")}
                <br />
                <span className="text-moss">{t("line3")}</span>
              </p>
              <p className="max-w-md text-[16px] leading-[1.75] text-ink/75">{t("note")}</p>
              <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-khaki-deep">{t("hours")}</span>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:mt-6 lg:gap-6">
        {cells.map((cell, i) => (
          <Reveal key={cell.label} delay={i * 90}>
            <div className="h-full rounded-[22px] bg-tint-d p-6 transition-all duration-500 hover:-translate-y-1 hover:bg-tint-c sm:p-7">
              <strong className="font-display text-[28px] font-extrabold leading-none tracking-tight">{cell.value}</strong>
              <p className="mt-3 text-[14px] font-medium text-ink/65">{cell.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
