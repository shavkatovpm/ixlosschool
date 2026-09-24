"use client";

import { useId } from "react";
import { ArrowUpRight, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ApplicationForm } from "./application-form";
import { useContact } from "./contact-context";
import { Reveal } from "./reveal";
import styles from "./admissions.module.css";

export function Admissions({ showMore = false }: { showMore?: boolean }) {
  const t = useTranslations("admissions");
  const id = useId();
  const contact = useContact();

  return (
    <section id="ariza" aria-labelledby={`${id}-title`} className="wrap -scroll-mt-16 py-16 sm:-scroll-mt-20 sm:py-20 lg:-scroll-mt-24 lg:py-24">
      <Reveal>
        <div className={styles.panel}>
          <div className={styles.intro}>
            <span className={styles.eyebrow}>IXLOS SCHOOL <span aria-hidden>·</span> {t("eyebrow")}</span>
            <h2 id={`${id}-title`} className={styles.title}>{t("titleA")} <span>{t("titleEm")}</span></h2>
            <p className={styles.description}>{t("description")}</p>
            <div className={styles.contact}>
              <p>{t("callLabel")}</p>
              <a href={`tel:${contact.phone}`}><Phone size={19} aria-hidden />{contact.phoneDisplay}</a>
              {showMore ? <Link href="/admissions" className={styles.more}>{t("more")}<ArrowUpRight size={16} aria-hidden /></Link> : null}
            </div>
          </div>

          <div className={styles.formCard}>
            <ApplicationForm />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
