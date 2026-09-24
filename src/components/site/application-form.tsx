"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, GraduationCap, Loader2, Phone, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { applicationFormSchema, type ApplicationFormValues } from "@/lib/application";
import { readAttribution, trackingAllowed } from "@/lib/attribution";
import { CONTACT } from "@/lib/contact";
import { trackLead } from "@/lib/track";
import styles from "./admissions.module.css";

const grades = Array.from({ length: 11 }, (_, i) => String(i + 1));

type Props = {
  /** "modal" drops the inner heading. */
  variant?: "card" | "modal";
  onSuccess?: () => void;
};

export function ApplicationForm({ variant = "card", onSuccess }: Props) {
  const t = useTranslations("admissions");
  const locale = useLocale();
  const id = useId();
  const inModal = variant === "modal";
  const [status, setStatus] = useState<"idle" | "success" | "error" | "rateLimited">("idle");
  const successRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const onSubmit = async (values: ApplicationFormValues) => {
    setStatus("idle");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale, attr: trackingAllowed() ? readAttribution() : undefined }),
        signal: controller.signal,
      });
      if (res.status === 429) { setStatus("rateLimited"); return; }
      if (!res.ok) throw new Error("request failed");
      const result = await res.json();
      if (result.ok !== true) throw new Error("request not accepted");
      setStatus("success");
      onSuccess?.();
      reset();
      // Analytics must never turn an accepted application into a visible failure.
      try { trackLead(); } catch { /* Optional analytics may be blocked. */ }
    } catch {
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
    }
  };

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className={styles.success}>
        <span className={styles.successIcon}><Check size={30} strokeWidth={2} aria-hidden /></span>
        <h3>{t("successTitle")}</h3>
        <p>{t("success")}</p>
        <a className={styles.successPhone} href={`tel:${CONTACT.phones[0]}`}><Phone size={17} aria-hidden />{CONTACT.phonesDisplay[0]}</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={isSubmitting} aria-labelledby={inModal ? undefined : `${id}-form-title`} aria-label={inModal ? t("formTitle") : undefined}>
      {inModal ? null : (
        <div className={styles.formHeading}>
          <h3 id={`${id}-form-title`}>{t("formTitle")}</h3>
        </div>
      )}
      <fieldset disabled={isSubmitting} className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor={`${id}-name`}>{t("nameLabel")}</label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}><UserRound size={19} strokeWidth={1.7} aria-hidden /></span>
            <input id={`${id}-name`} type="text" autoComplete="name" required maxLength={100} placeholder={t("namePlaceholder")} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-error` : undefined} {...register("name")} />
          </div>
          {errors.name ? <p id={`${id}-name-error`} className={styles.fieldError} role="alert">{t("nameError")}</p> : null}
        </div>
        <div className={styles.field}>
          <label htmlFor={`${id}-phone`}>{t("phoneLabel")}</label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}><Phone size={19} strokeWidth={1.7} aria-hidden /></span>
            <input id={`${id}-phone`} type="tel" inputMode="tel" autoComplete="tel" required maxLength={25} placeholder={t("phonePlaceholder")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${id}-phone-error` : undefined} {...register("phone")} />
          </div>
          {errors.phone ? <p id={`${id}-phone-error`} className={styles.fieldError} role="alert">{t("phoneError")}</p> : null}
        </div>
        <div className={styles.field}>
          <label htmlFor={`${id}-grade`}>{t("gradeLabel")}</label>
          <div className={`${styles.inputWrap} ${styles.selectWrap}`}>
            <span className={styles.inputIcon}><GraduationCap size={20} strokeWidth={1.7} aria-hidden /></span>
            <select id={`${id}-grade`} defaultValue="" required aria-invalid={!!errors.grade} aria-describedby={errors.grade ? `${id}-grade-error` : undefined} {...register("grade")}>
              <option value="" disabled>{t("gradePlaceholder")}</option>
              {grades.map((g) => <option key={g} value={g}>{t("gradeOption", { grade: g })}</option>)}
            </select>
            <ChevronDown className={styles.selectChevron} size={18} aria-hidden />
          </div>
          {errors.grade ? <p id={`${id}-grade-error`} className={styles.fieldError} role="alert">{t("gradeError")}</p> : null}
        </div>
        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" {...register("company")} />
        {status === "error" || status === "rateLimited" ? (
          <div role="alert" className={styles.errorBanner}>
            <p>{t(status === "rateLimited" ? "rateLimited" : "error")}</p>
            <a href={`tel:${CONTACT.phones[0]}`}>{t("callLabel")}: {CONTACT.phonesDisplay[0]}</a>
          </div>
        ) : null}
        <button type="submit" disabled={isSubmitting} className={styles.submit}>
          {isSubmitting ? <Loader2 size={19} className="animate-spin" aria-hidden /> : null}
          {t(isSubmitting ? "submitting" : "submit")}
        </button>
      </fieldset>
      <a href={`tel:${CONTACT.phones[0]}`} className={styles.mobileContact} aria-label={`${t("callLabel")}: ${CONTACT.phonesDisplay[0]}`}><Phone size={16} aria-hidden />{CONTACT.phonesDisplay[0]}</a>
    </form>
  );
}
