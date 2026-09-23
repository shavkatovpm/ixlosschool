import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { ApplyTrigger } from "./apply-modal";

type Stage = { range: string; title: string; copy: string };

const rise = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/*
 * Desktop starts at one viewport tall but can grow for translated copy and text zoom.
 * Touch layouts remain content-sized so browser toolbar changes cannot resize the hero.
 */
export function Hero() {
  const t = useTranslations("hero");
  const c = useTranslations("curriculum");
  const contents = t.raw("contents") as string[];
  const stages = c.raw("stages") as Stage[];
  const contentHrefs = ["#nega-biz", "#dastur", "#hayot"];

  return (
    <section className="wrap pb-6 pt-4 sm:pt-6 fit:flex fit:min-h-[max(480px,calc(100svh-97px))] fit:flex-col fit:pb-[clamp(12px,2.2vh,28px)] fit:pt-[clamp(6px,1.2vh,20px)]">
      <div
        className="anim-fade flex items-center justify-between gap-4 pb-6 fit:shrink-0 fit:pb-[clamp(8px,1.8vh,24px)]"
        style={rise(100)}
      >
        <span className="eyebrow text-khaki-deep">{t("eyebrowLeft")}</span>
        <span className="hidden text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/75 sm:block">
          {t("eyebrowRight")}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr] lg:gap-6 fit:min-h-0 fit:flex-1 fit:grid-rows-1">
        <div
          className="hero-primary-card on-dark anim-rise relative flex flex-col overflow-hidden rounded-[28px] bg-brand p-6 text-on-brand min-[375px]:py-8 sm:p-12 fit:min-h-0 fit:px-[clamp(28px,3.4vw,56px)] fit:py-[clamp(20px,4.4vh,56px)]"
          style={rise(150)}
        >
          <Image
            src="/illustrations/hero-knowledge.webp"
            alt=""
            fill
            preload
            sizes="(min-width: 1280px) 704px, (min-width: 1024px) 60vw, 100vw"
            className="pointer-events-none select-none object-cover object-right-bottom opacity-55"
          />
          <div aria-hidden className="hero-knowledge-shade pointer-events-none absolute inset-0" />

          <div className="relative flex flex-1 flex-col justify-between gap-6 sm:gap-10 fit:gap-[clamp(10px,2vh,28px)]">
            <h1 className="font-display text-[clamp(1.5rem,6.8vw,3.75rem)] font-extrabold leading-[1.12] tracking-[-0.035em] sm:text-[clamp(2rem,4.2vw,3.75rem)] fit:text-[clamp(1.75rem,min(4vw,6.5vh),3.75rem)] short:text-[clamp(1.625rem,min(3.7vw,5.8vh),3rem)]">
              <span className="anim-rise block text-[1.3em]" style={rise(350)}>
                {t("line1Pre")} <span className="text-lime">{t("line1Em")}</span>
              </span>
              <span className="anim-rise block" style={rise(480)}>
                {t("line2")}
              </span>
              <span className="anim-rise block text-gold" style={rise(610)}>
                {t("line3")}
              </span>
            </h1>

            <div className="max-sm:flex max-sm:flex-1 max-sm:flex-col">
              <div className="anim-rise max-w-md max-sm:my-auto fit:max-w-[34rem]" style={rise(780)}>
                <p className="text-[18px] leading-[1.7] text-on-brand-muted max-sm:text-[16px] max-sm:leading-[1.55] fit:text-[clamp(15px,2.3vh,18px)] fit:leading-[1.55]">
                  {t("lead")}
                </p>
                <p className="mt-3 text-[18px] font-semibold leading-[1.6] text-on-brand max-sm:mt-2 max-sm:text-[16px] max-sm:leading-[1.55] fit:mt-[clamp(2px,0.6vh,8px)] fit:text-[clamp(15px,2.3vh,18px)] fit:leading-[1.55]">
                  {t("leadStrong")}
                </p>
              </div>

              <ApplyTrigger
                className="anim-rise group cursor-pointer mx-auto mt-7 max-sm:relative max-sm:-top-[90px] flex min-h-14 w-fit max-w-full items-center gap-4 rounded-[12px] bg-khaki px-5 py-3 text-center text-[15px] font-bold text-ink sm:px-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_-10px_rgba(0,0,0,0.45)] active:translate-y-0 sm:mx-0 sm:mt-10 sm:inline-flex fit:mt-[clamp(12px,2.6vh,32px)] fit:min-h-[clamp(46px,6.4vh,56px)]"
                style={rise(900)}
              >
                {t("cta")}
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </ApplyTrigger>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:gap-6 fit:min-h-0 fit:gap-[clamp(10px,2vh,24px)]">
          <div
            className="anim-rise relative flex flex-1 flex-col overflow-hidden rounded-[28px] bg-khaki p-8 sm:p-10 fit:min-h-0 fit:p-[clamp(20px,3.4vh,40px)]"
            style={rise(300)}
          >
            <Image
              src="/illustrations/hero-dialogue.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 440px, 100vw"
              className="pointer-events-none select-none object-cover object-right-bottom opacity-55"
            />
            <div aria-hidden className="hero-dialogue-shade pointer-events-none absolute inset-0" />
            <span className="eyebrow relative text-khaki-deep">{t("quoteLabel")}</span>
            <p className="relative mb-10 mt-10 font-display text-[clamp(1.75rem,2.5vw,2.375rem)] font-bold leading-[1.2] tracking-tight text-moss text-balance fit:my-[clamp(12px,2.4vh,40px)] fit:text-[clamp(1.25rem,min(2.5vw,3.9vh),2.375rem)]">
              {t("quoteA")} <strong className="text-ink">{t("quoteAStrong")}</strong> {t("quoteB")}{" "}
              <strong className="text-ink">{t("quoteBStrong")}</strong>
            </p>
            <div className="relative mt-auto flex items-center justify-between gap-4 border-t border-line pt-6 fit:pt-[clamp(10px,1.8vh,24px)]">
              <span className="max-w-[200px] text-[12px] font-bold uppercase leading-[1.5] tracking-[0.1em] text-khaki-deep">
                {t("quoteFoot")}
              </span>
            </div>
          </div>

          <nav
            className="anim-rise relative overflow-hidden rounded-[24px] bg-tint-a px-7 py-2 sm:px-8 short:hidden"
            aria-label="Mundarija"
            style={rise(450)}
          >
            <Image
              src="/illustrations/hero-progress.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 440px, 100vw"
              className="pointer-events-none select-none object-cover object-right-bottom opacity-55"
            />
            <div aria-hidden className="hero-progress-shade pointer-events-none absolute inset-0" />
            {contents.map((label, i) => (
              <a
                key={label}
                href={contentHrefs[i]}
                className="group relative flex items-center gap-5 border-b border-line py-5 text-[16px] font-semibold last:border-0 fit:py-[clamp(9px,1.9vh,20px)]"
              >
                <small className="w-6 text-[12px] font-bold text-moss">0{i + 1}</small>
                <span className="flex-1 transition-transform duration-300 group-hover:translate-x-1">{label}</span>
                <ArrowUpRight
                  size={18}
                  className="opacity-40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                  aria-hidden
                />
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div
        className="anim-rise mt-5 grid grid-cols-1 overflow-hidden rounded-[24px] border border-line bg-neutral sm:grid-cols-3 lg:mt-6 fit:mt-[clamp(10px,2vh,24px)] fit:shrink-0"
        style={rise(600)}
      >
        {stages.map((stage, i) => (
          <a
            key={stage.range}
            href="#dastur"
            className={`group flex items-center gap-4 p-6 transition-colors duration-300 hover:bg-tint-a sm:gap-6 sm:p-8 fit:px-[clamp(20px,2.4vw,32px)] fit:py-[clamp(10px,2.2vh,32px)] ${
              i > 0 ? "border-t border-line sm:border-l sm:border-t-0" : ""
            }`}
          >
            <span className="whitespace-nowrap font-display text-[34px] font-extrabold leading-none tracking-tight sm:text-[40px] fit:text-[clamp(28px,4.6vh,40px)]">
              {stage.range}
              <small className="mt-2 block text-[12px] font-bold tracking-[0.12em] text-moss fit:mt-[clamp(3px,0.8vh,8px)]">
                {t("gradeUnit")}
              </small>
            </span>
            <strong className="min-w-0 flex-1 text-[15px] font-bold leading-snug [overflow-wrap:anywhere] hyphens-auto sm:text-[16px]">
              {stage.title}
            </strong>
            <ArrowUpRight
              size={20}
              className="shrink-0 opacity-40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
              aria-hidden
            />
          </a>
        ))}
      </div>
    </section>
  );
}
