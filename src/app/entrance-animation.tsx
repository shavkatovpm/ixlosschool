"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./entrance-animation.module.css";

const EXIT_DELAY = 2600;
const REMOVE_DELAY = 3000;

export default function EntranceAnimation() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const exitTimer = window.setTimeout(() => setLeaving(true), reducedMotion ? 350 : EXIT_DELAY);
    const removeTimer = window.setTimeout(() => setVisible(false), reducedMotion ? 450 : REMOVE_DELAY);
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!visible) document.body.style.overflow = "";
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={`${styles.overlay} ${leaving ? styles.leaving : ""}`} aria-label="Ixlos School kirish animatsiyasi">
      <Image
        className={styles.logo}
        src="/brand/animated/intro-gold-reveal.svg?home=4"
        alt="Ixlos School"
        width={3601}
        height={3601}
        priority
        unoptimized
      />
    </div>
  );
}
