import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { teacherName, type Teacher } from "@/lib/teachers";
import { teacherFacts } from "./teacher-parts";
import styles from "./teacher-poster.module.css";

/** Desktop portrait: essential information stays visible; focus/hover reveals details. */
export function TeacherPoster({ teacher }: { teacher: Teacher }) {
  const t = useTranslations("teachers");
  const locale = useLocale();
  const name = teacherName(teacher, locale);
  const facts = teacherFacts(teacher, t);
  const hasDetails = facts.length > 0 || teacher.focus || teacher.category;

  return (
    <article className={styles.card}>
      <Image
        src={teacher.photo}
        alt={t("photoAlt", { name })}
        fill
        sizes="(min-width: 1280px) 240px, 23vw"
        className={`${styles.photo} ${teacher.slug === "mukarram-rahmatillayeva" ? styles.centeredPortrait : ""}`}
      />
      <div aria-hidden className={styles.shade} />
      <div className={styles.content}>
        <h3 className={styles.name}>
          {name.split(" ").map((part, index) => <span key={index} className="block">{part}</span>)}
        </h3>
        {teacher.experienceYears ? (
          <p className={styles.experience}>
            <span>{t("experienceLabel")}</span>
            <strong>{t("experience", { years: teacher.experienceYears })}</strong>
          </p>
        ) : null}
        {hasDetails ? (
          <div className={styles.details}>
            <div className={styles.detailsInner}>
              {teacher.focus || teacher.category ? (
                <p className={styles.specialty}>
                  {[teacher.focus && t(`focus.${teacher.focus}`), teacher.category && t(`category.${teacher.category}`)].filter(Boolean).join(" · ")}
                </p>
              ) : null}
              <dl className={styles.facts}>
                {facts.map((fact) => (
                  <div key={`${fact.label}-${fact.value}`}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
