import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimationGallery from "./animation-gallery";
import styles from "./logo.module.css";

export const metadata: Metadata = {
  title: "Logo | Ixlos School",
  description: "Ixlos School rasmiy logotipi va rang variantlari.",
};

const variants = [
  { name: "Asosiy yashil", file: "/brand/ixlos-school.svg", color: "#175C2B", surface: "light" },
  { name: "To‘q ko‘k", file: "/brand/ixlos-school-navy.svg", color: "#10233F", surface: "light" },
  { name: "Oltin", file: "/brand/ixlos-school-gold.svg", color: "#C8A45A", surface: "dark" },
  { name: "Oq", file: "/brand/ixlos-school-white.svg", color: "#FFFFFF", surface: "green" },
] as const;

export default function LogoPage() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <Link className={styles.back} href="/">← Bosh sahifa</Link>
        <p className={styles.eyebrow}>Brand assets · 2026</p>
        <h1>Ixlos School logotipi</h1>
        <p className={styles.lead}>Rasmiy logotipning original holati va turli fonlar uchun tayyorlangan SVG rang variantlari.</p>
      </header>

      <section className={styles.originalSection} aria-labelledby="original-title">
        <div className={styles.sectionHeading}>
          <div><span>01</span><h2 id="original-title">Original</h2></div>
          <p>Manba fayl · PNG · 3601 × 3601 px</p>
        </div>
        <div className={styles.originalCard}>
          <div className={styles.originalVisual}>
            <Image src="/brand/ixlos-school-original.png" alt="Ixlos School original yashil logosi" width={3601} height={3601} priority />
          </div>
          <div className={styles.originalInfo}>
            <div><span className={styles.swatch} /><p>Asosiy rang</p><strong>#175C2B</strong></div>
            <a href="/brand/ixlos-school-original.png" download>PNG yuklab olish <span>↓</span></a>
          </div>
        </div>
      </section>

      <section className={styles.variantsSection} aria-labelledby="variants-title">
        <div className={styles.sectionHeading}>
          <div><span>02</span><h2 id="variants-title">SVG ranglar</h2></div>
          <p>Masshtablanganda sifatini yo‘qotmaydi</p>
        </div>
        <div className={styles.grid}>
          {variants.map((variant) => (
            <article className={styles.card} key={variant.name}>
              <div className={`${styles.preview} ${styles[variant.surface]}`}>
                <Image src={`${variant.file}?v=2`} alt={`Ixlos School — ${variant.name}`} width={3601} height={3601} />
                <span className={styles.corner}>IS</span>
              </div>
              <div className={styles.cardFooter}>
                <div><h3>{variant.name}</h3><p>{variant.color}</p></div>
                <a href={variant.file} download aria-label={`${variant.name} SVG faylini yuklab olish`}>↓</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <AnimationGallery />

      <footer className={styles.footer}><p>IXLOS SCHOOL</p><span>Rasmiy vizual identifikatsiya</span></footer>
    </main>
  );
}
