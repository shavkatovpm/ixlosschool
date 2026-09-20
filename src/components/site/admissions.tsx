"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { trackLead } from "@/lib/track";
import { Reveal } from "./reveal";

const schema = z.object({
  name: z.string().trim().min(2),
  phone: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, "").length >= 9),
  grade: z.string().min(1),
  company: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const grades = Array.from({ length: 11 }, (_, i) => String(i + 1));

const fieldClass =
  "h-14 w-full rounded-[12px] border border-white/15 bg-white/[0.08] px-5 text-[16px] text-white outline-none transition-all duration-300 placeholder:text-white/45 hover:bg-white/[0.12] focus:border-khaki focus:bg-white/[0.14] focus:shadow-[0_0_0_4px_rgba(232,220,175,0.18)] aria-[invalid=true]:border-[#f3b6a4]";

const labelClass = "mb-2 block text-[14px] font-semibold text-[#e2ebd2]";
const errorClass = "mt-2 text-[13px] font-medium text-[#f6c4b4]";

export function Admissions({ showMore = false }: { showMore?: boolean }) {
  const t = useTranslations("admissions");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      trackLead();
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="ariza" className="wrap py-20 sm:py-24 lg:py-32">
      <Reveal>
        <div className="on-dark relative overflow-hidden rounded-[32px] bg-brand p-8 text-[#f2f6e1] sm:p-12 lg:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(rgba(229,238,203,0.1) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
              maskImage: "linear-gradient(200deg, #000, transparent 55%)",
              WebkitMaskImage: "linear-gradient(200deg, #000, transparent 55%)",
            }}
          />
          <span
            aria-hidden
            className="anim-spin-slow pointer-events-none absolute -left-10 -top-10 text-[220px] leading-none text-[#cfdda7]/15"
          >
            ✳
          </span>

          <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div className="flex flex-col justify-center">
              <span className="eyebrow text-[#d4e0c4]">{nav("apply")}</span>
              <h2 className="section-title mt-6">
                {t("titleA")} <span className="text-[#e5d298]">{t("titleEm")}</span>
              </h2>
              <p className="mt-6 max-w-md text-[17px] leading-[1.75] text-[#d9e4c9]">{t("description")}</p>
              {showMore ? (
                <Link
                  href="/admissions"
                  className="group mt-8 inline-flex items-center gap-2.5 text-[15px] font-semibold text-khaki"
                >
                  <span className="link-underline">{t("more")}</span>
                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              ) : null}
            </div>

            <div>
              {status === "success" ? (
                <div role="status" className="anim-rise flex min-h-[320px] flex-col items-start justify-center gap-6">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-khaki text-brand">
                    <Check size={30} strokeWidth={3} />
                  </span>
                  <p className="font-display text-[26px] font-bold leading-snug">{t("success")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
                  <div>
                    <label htmlFor="apply-name" className={labelClass}>
                      {t("nameLabel")}
                    </label>
                    <input
                      id="apply-name"
                      type="text"
                      autoComplete="name"
                      placeholder={t("namePlaceholder")}
                      aria-invalid={errors.name ? true : undefined}
                      className={fieldClass}
                      {...register("name")}
                    />
                    {errors.name ? <p className={errorClass}>{t("nameError")}</p> : null}
                  </div>

                  <div>
                    <label htmlFor="apply-phone" className={labelClass}>
                      {t("phoneLabel")}
                    </label>
                    <input
                      id="apply-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder={t("phonePlaceholder")}
                      aria-invalid={errors.phone ? true : undefined}
                      className={fieldClass}
                      {...register("phone")}
                    />
                    {errors.phone ? <p className={errorClass}>{t("phoneError")}</p> : null}
                  </div>

                  <div>
                    <label htmlFor="apply-grade" className={labelClass}>
                      {t("gradeLabel")}
                    </label>
                    <select
                      id="apply-grade"
                      defaultValue=""
                      aria-invalid={errors.grade ? true : undefined}
                      className={fieldClass}
                      {...register("grade")}
                    >
                      <option value="" disabled className="text-black">
                        {t("gradePlaceholder")}
                      </option>
                      {grades.map((g) => (
                        <option key={g} value={g} className="text-black">
                          {t("gradeOption", { grade: g })}
                        </option>
                      ))}
                    </select>
                    {errors.grade ? <p className={errorClass}>{t("gradeError")}</p> : null}
                  </div>

                  {status === "error" ? (
                    <p role="alert" className="text-[14px] font-medium text-[#f6c4b4]">
                      {t("error")}
                    </p>
                  ) : null}

                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    {...register("company")}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 inline-flex h-14 items-center justify-center gap-3 rounded-[12px] bg-khaki px-8 text-[15px] font-bold text-brand transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_-10px_rgba(0,0,0,0.45)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-70"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" aria-hidden /> : null}
                    {isSubmitting ? t("submitting") : t("submit")}
                  </button>

                  <p className="text-[13px] leading-[1.6] text-[#d0dcbf]">
                    {t.rich("consent", {
                      link: (chunks) => (
                        <Link href="/privacy" className="font-semibold text-khaki underline underline-offset-4">
                          {chunks}
                        </Link>
                      ),
                    })}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
