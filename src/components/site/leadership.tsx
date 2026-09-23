import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "./reveal";
import styles from "./leadership.module.css";

export function Leadership() {
  const t = useTranslations("leadership");

  return (
    <section id="rahbariyat" aria-labelledby="leadership-name" className="wrap py-14 sm:py-20 lg:py-24">
      <Reveal>
        <div className={styles.panel}>
          <div className={styles.portrait}>
            <Image
              src="/leadership/maxsuma-ashirmetova.webp"
              alt={t("photoAlt")}
              fill
              sizes="(min-width: 1280px) 480px, (min-width: 768px) 42vw, 92vw"
              className={styles.photo}
            />
            <div aria-hidden className={styles.photoShade} />
            <span className={styles.photoCaption}>IXLOS SCHOOL <span aria-hidden> / </span> {t("portraitLabel")}</span>
          </div>

          <div className={styles.content}>
            <p className={styles.eyebrow}><span aria-hidden />{t("eyebrow")}</p>
            <h2 id="leadership-name" className={styles.name}>
              {t("surname")}<br /><span>{t("givenName")}</span>
            </h2>
            <p className={styles.role}>{t("role")}</p>
            <p className={styles.bio}>{t("bio")}</p>

            <div className={styles.experience}>
              <span className={styles.years}>25</span>
              <div>
                <p className={styles.yearsLabel}>{t("yearsLabel")}</p>
                <p className={styles.yearsNote}>{t("yearsNote")}</p>
              </div>
            </div>

            <dl className={styles.credentials}>
              <div>
                <dt>DipIFR</dt>
                <dd>{t("dipifr")}</dd>
              </div>
              <div>
                <dt>ACCA <span>F1–F9</span></dt>
                <dd>{t("acca")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
