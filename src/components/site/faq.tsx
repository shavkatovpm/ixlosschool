"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";

export function Faq() {
  const t = useTranslations("faq");
  const nav = useTranslations("nav");
  const items = t.raw("items") as { question: string; answer: string }[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="savol-javob" className="bg-tint-e py-20 sm:py-24 lg:py-32">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead index="05" label={nav("faq")}>
            {t("titleA")} <span className="text-moss">{t("titleEm")}</span>
          </SectionHead>
        </div>

        <div className="border-b border-line">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.question} delay={Math.min(i, 4) * 60}>
                <div className="border-t border-line">
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7"
                    >
                      <span
                        className={`text-[clamp(1.0625rem,1.5vw,1.25rem)] font-bold leading-snug transition-colors duration-300 ${
                          isOpen ? "text-brand" : "group-hover:text-brand"
                        }`}
                      >
                        {item.question}
                      </span>
                      <span
                        aria-hidden
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                          isOpen
                            ? "rotate-45 border-brand bg-brand text-white"
                            : "border-ink/20 group-hover:border-brand group-hover:bg-brand/10"
                        }`}
                      >
                        <Plus size={18} />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-a-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-xl pb-7 text-[16px] leading-[1.75] text-ink/75">{item.answer}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
