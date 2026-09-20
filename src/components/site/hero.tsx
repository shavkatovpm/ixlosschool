import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";

type Stage = { range: string; title: string; copy: string };

const rise = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function Hero() {
  const t = useTranslations("hero");
  const c = useTranslations("curriculum");
  const contents = t.raw("contents") as string[];
  const stages = c.raw("stages") as Stage[];
  const contentHrefs = ["#nega-biz", "#dastur", "#hayot"];

  return (
    <section className="wrap pb-6 pt-4 sm:pt-6">
      <div className="anim-fade flex items-center justify-between gap-4 pb-6" style={rise(100)}>
        <span className="eyebrow text-khaki-deep">{t("eyebrowLeft")}</span>
        <span className="hidden text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/50 sm:block">
          {t("eyebrowRight")}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr] lg:gap-6">
        <div className="on-dark anim-rise relative overflow-hidden rounded-[28px] bg-brand p-8 text-[#f6f7e7] sm:p-12 lg:p-14" style={rise(150)}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(rgba(229,238,203,0.11) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
              maskImage: "linear-gradient(120deg, transparent 30%, #000)",
              WebkitMaskImage: "linear-gradient(120deg, transparent 30%, #000)",
            }}
          />
          <span
            aria-hidden
            className="anim-spin-slow pointer-events-none absolute -bottom-6 -right-4 hidden text-[180px] leading-none text-[#cfdda7]/25 sm:block lg:text-[220px]"
          >
            ✳
          </span>

          <div className="relative">
            <div className="flex items-center justify-between gap-4 text-[12px] font-bold uppercase tracking-[0.14em] text-[#d4e0c4]">
              <span>{t("panelLeft")}</span>
              <span className="text-right">{t("panelRight")}</span>
            </div>

            <h1 className="mt-12 font-display text-[clamp(2.5rem,7vw,5.75rem)] font-extrabold leading-[1.02] tracking-[-0.035em] sm:mt-16">
              <span className="sr-only">{t("h1Prefix")}</span>
              <span className="anim-rise block" style={rise(350)}>
                {t("line1Pre")} <span className="text-lime">{t("line1Em")}</span>
              </span>
              <span className="anim-rise block" style={rise(480)}>
                {t("line2")}
              </span>
              <span className="anim-rise block text-gold" style={rise(610)}>
                {t("line3")}
              </span>
            </h1>

            <div className="anim-rise mt-10 max-w-md sm:mt-14" style={rise(780)}>
              <p className="text-[18px] leading-[1.7] text-[#dbe6ce]">{t("lead")}</p>
              <p className="mt-3 text-[18px] font-semibold leading-[1.6] text-[#f6f7e7]">{t("leadStrong")}</p>
            </div>

            <a
              href="#ariza"
              className="anim-rise group mt-10 inline-flex h-14 items-center gap-4 rounded-[12px] bg-khaki px-8 text-[15px] font-bold text-[#183e24] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_-10px_rgba(0,0,0,0.45)] active:translate-y-0 sm:mt-12"
              style={rise(900)}
            >
              {t("cta")}
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:gap-6">
          <div className="anim-rise relative flex flex-1 flex-col overflow-hidden rounded-[28px] bg-khaki p-8 sm:p-10" style={rise(300)}>
            <span className="eyebrow text-khaki-deep">{t("quoteLabel")}</span>
            <span
              aria-hidden
              className="anim-drift pointer-events-none absolute right-8 top-2 select-none font-display text-[150px] leading-none text-[#b5a267] opacity-30"
            >
              &ldquo;
            </span>
            <p className="relative mb-10 mt-10 font-display text-[clamp(1.75rem,2.5vw,2.375rem)] font-bold leading-[1.2] tracking-tight text-[#49603a] text-balance">
              {t("quoteA")} <strong className="text-[#183e24]">{t("quoteAStrong")}</strong> {t("quoteB")}{" "}
              <strong className="text-[#183e24]">{t("quoteBStrong")}</strong>
            </p>
            <div className="mt-auto flex items-center justify-between gap-4 border-t border-[#b4ae7f] pt-6">
              <span className="max-w-[200px] text-[12px] font-bold uppercase leading-[1.5] tracking-[0.1em] text-khaki-deep">
                {t("quoteFoot")}
              </span>
              <ArrowUpRight size={24} className="shrink-0 text-khaki-deep" aria-hidden />
            </div>
          </div>

          <nav className="anim-rise rounded-[24px] bg-tint-a px-7 py-2 sm:px-8" aria-label="Mundarija" style={rise(450)}>
            {contents.map((label, i) => (
              <a
                key={label}
                href={contentHrefs[i]}
                className="group flex items-center gap-5 border-b border-line py-5 text-[16px] font-semibold last:border-0"
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

      <div className="anim-rise mt-5 grid grid-cols-1 overflow-hidden rounded-[24px] border border-[#cdd6bd] bg-[#edf0e1] sm:grid-cols-3 lg:mt-6" style={rise(600)}>
        {stages.map((stage, i) => (
          <a
            key={stage.range}
            href="#dastur"
            className={`group flex items-center gap-4 p-6 transition-colors duration-300 hover:bg-[#e1e8cb] sm:gap-6 sm:p-8 ${
              i > 0 ? "border-t border-[#cdd6bd] sm:border-l sm:border-t-0" : ""
            }`}
          >
            <span className="whitespace-nowrap font-display text-[34px] font-extrabold leading-none tracking-tight sm:text-[40px]">
              {stage.range}
              <small className="mt-2 block text-[12px] font-bold tracking-[0.12em] text-moss">{t("gradeUnit")}</small>
            </span>
            <strong className="min-w-0 flex-1 text-[15px] font-bold leading-snug [overflow-wrap:anywhere] hyphens-auto sm:text-[16px]">{stage.title}</strong>
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
