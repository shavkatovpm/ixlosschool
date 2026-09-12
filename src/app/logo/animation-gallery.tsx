"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./animations.module.css";

const intros = [
  { name: "Gold Reveal", note: "Opacity orqali paydo bo‘lib, oltin rangga kiradi", file: "/brand/animated/intro-gold-reveal.svg" },
] as const;

const loaders = [
  { name: "Diagonal Gold", note: "Diagonal oltin nur skaneri", file: "/brand/animated/loader-04-scan-diagonal.svg" },
] as const;

function IntroCard({ item, index }: { item: (typeof intros)[number]; index: number }) {
  const [run, setRun] = useState(0);

  return (
    <article className={styles.card}>
      <div className={styles.stage} key={run}>
        <Image className={styles.animatedLogo} src={`${item.file}?v=4&run=${run}`} alt={`Ixlos School — ${item.name} intro animatsiyasi`} width={3601} height={3601} unoptimized />
      </div>
      <div className={styles.cardMeta}>
        <span>0{index + 1}</span>
        <div><h3>{item.name}</h3><p>{item.note}</p></div>
        <button type="button" onClick={() => setRun((value) => value + 1)} aria-label={`${item.name} animatsiyasini qayta ijro etish`}>↻</button>
      </div>
    </article>
  );
}

function LoaderCard({ item, index }: { item: (typeof loaders)[number]; index: number }) {
  return (
    <article className={styles.loaderCard}>
      <div className={styles.loaderStage}>
        <Image className={styles.loaderLogo} src={item.file} alt={`Ixlos School — ${item.name} loader animatsiyasi`} width={3601} height={3601} unoptimized />
      </div>
      <div className={styles.loaderMeta}><span>0{index + 1}</span><div><h3>{item.name}</h3><p>{item.note}</p></div></div>
    </article>
  );
}

export default function AnimationGallery() {
  return (
    <>
      <section className={styles.section} aria-labelledby="intro-title">
        <div className={styles.heading}>
          <div><span>03</span><h2 id="intro-title">Intro animatsiyalar</h2></div>
          <p>Tanlangan opacity va rang intro</p>
        </div>
        <div className={styles.introGrid}>{intros.map((item, index) => <IntroCard item={item} index={index} key={item.file} />)}</div>
      </section>

      <section className={styles.section} aria-labelledby="loader-title">
        <div className={styles.heading}>
          <div><span>04</span><h2 id="loader-title">Loader animatsiyalar</h2></div>
          <p>Tanlangan logo scan loader</p>
        </div>
        <div className={styles.loaderGrid}>{loaders.map((item, index) => <LoaderCard item={item} index={index} key={item.file} />)}</div>
      </section>
    </>
  );
}
