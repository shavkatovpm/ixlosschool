"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { YoutubeIcon } from "./social-icons";
import { youtubeShortUrl } from "@/lib/testimonials";
import styles from "./testimonial-wall.module.css";

export type WallItem = { id: string; thumb: string; chip: string; title: string; description: string };

export type WallLabels = {
  region: string;
  play: string;
  close: string;
  prev: string;
  next: string;
  youtube: string;
  apply: string;
};

const railArrow =
  "flex h-12 w-12 items-center justify-center rounded-full border border-ink/25 transition-all duration-300 hover:border-highlight hover:bg-highlight hover:text-brand-deep";

export function TestimonialWall({ items, labels, locale }: { items: WallItem[]; labels: WallLabels; locale: string }) {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pressedBackdrop = useRef(false);
  const total = items.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (active === null || !dialog || dialog.open) return;
    dialog.showModal();
    closeRef.current?.focus();
  }, [active]);

  const close = () => dialogRef.current?.close();
  const go = (dir: 1 | -1) => setActive((i) => (i === null ? i : (i + dir + total) % total));

  const scrollRail = (dir: 1 | -1) => {
    const rail = railRef.current;
    const card = rail?.firstElementChild;
    if (!rail || !card) return;
    const step = card.getBoundingClientRect().width + 20;
    rail.scrollBy({ left: dir * step * 2, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const isBackdrop = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    const target = e.target as HTMLElement;
    return target === e.currentTarget || "backdrop" in target.dataset;
  };

  // Only a press *and* release on empty space closes; a text selection or drag that ends there must not.
  const onDialogPointerDown = (e: React.PointerEvent<HTMLDialogElement>) => {
    pressedBackdrop.current = isBackdrop(e);
  };

  const onDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (pressedBackdrop.current && isBackdrop(e)) close();
    pressedBackdrop.current = false;
  };

  const onDialogKey = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  const current = active === null ? null : items[active];

  return (
    <>
      <div className="relative">
        <div role="region" aria-label={labels.region} className="mt-12 sm:mt-14">
          <ul
            ref={railRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-[clamp(20px,4.5vw,56px)] px-[clamp(20px,4.5vw,56px)] pb-3 [scrollbar-width:none] sm:gap-5 xl:mx-auto xl:grid xl:max-w-[1480px] xl:grid-cols-5 xl:gap-6 xl:overflow-visible xl:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item, i) => (
              <li key={item.id} className="w-[min(64vw,250px)] shrink-0 snap-start xl:w-auto xl:min-w-0">
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-label={`${labels.play}: ${item.title}`}
                  onClick={() => setActive(i)}
                  className="group block w-full text-left"
                >
                  <span className="relative block aspect-[9/16] overflow-hidden rounded-[22px] bg-brand-deep">
                    <Image
                      src={item.thumb}
                      alt=""
                      fill
                      unoptimized={item.thumb.startsWith("/media/")}
                      draggable={false}
                      sizes="(min-width: 1280px) 260px, (min-width: 640px) 250px, 64vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <span
                      aria-hidden
                      className="absolute bottom-3 right-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-brand-deep shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:scale-110 group-hover:bg-white"
                    >
                      <Play size={22} fill="currentColor" strokeWidth={0} className="ml-0.5" />
                    </span>
                  </span>
                  <span className="mt-4 block text-[11px] font-bold uppercase tracking-[0.12em] text-highlight">{item.chip}</span>
                  <span className="mt-1.5 block font-display text-[16px] font-bold leading-snug tracking-tight text-on-brand [text-wrap:balance]">
                    {item.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="wrap mt-6 hidden justify-end gap-2 md:flex xl:hidden">
          <button type="button" aria-label={labels.prev} onClick={() => scrollRail(-1)} className={railArrow}>
            <ChevronLeft size={20} aria-hidden />
          </button>
          <button type="button" aria-label={labels.next} onClick={() => scrollRail(1)} className={railArrow}>
            <ChevronRight size={20} aria-hidden />
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="testimonial-title"
        aria-describedby="testimonial-desc"
        className={styles.dialog}
        data-backdrop=""
        onClose={() => setActive(null)}
        onPointerDown={onDialogPointerDown}
        onClick={onDialogClick}
        onKeyDown={onDialogKey}
      >
        {current ? (
          <div className={styles.shell} data-backdrop="">
            <div className={styles.top} data-backdrop="">
              <div className={styles.meta} data-backdrop="">
                <span className={styles.counter}>
                  {(active ?? 0) + 1} / {total}
                </span>
                <span className={styles.chip}>{current.chip}</span>
              </div>
              <div className={styles.tools} data-backdrop="">
                <a
                  href={youtubeShortUrl(current.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={labels.youtube}
                  className={`${styles.iconButton} ${styles.youtubeButton}`}
                >
                  <YoutubeIcon size={22} />
                  <span className={styles.youtubeLabel}>{labels.youtube}</span>
                </a>
                <button ref={closeRef} type="button" aria-label={labels.close} onClick={close} className={styles.iconButton}>
                  <X size={22} aria-hidden />
                </button>
              </div>
            </div>

            <div className={styles.stage} data-backdrop="">
              <button type="button" aria-label={labels.prev} onClick={() => go(-1)} className={`${styles.iconButton} ${styles.sideNav}`}>
                <ChevronLeft size={26} aria-hidden />
              </button>

              <div className={styles.frame}>
                <Image src={current.thumb} alt="" fill unoptimized={current.thumb.startsWith("/media/")} sizes="(min-width: 640px) 506px, 100vw" />
                <iframe
                  key={current.id}
                  src={`https://www.youtube-nocookie.com/embed/${current.id}?autoplay=1&playsinline=1&rel=0&modestbranding=1&hl=${locale}`}
                  title={current.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>

              <button type="button" aria-label={labels.next} onClick={() => go(1)} className={`${styles.iconButton} ${styles.sideNav}`}>
                <ChevronRight size={26} aria-hidden />
              </button>
            </div>

            <div className={styles.foot} data-backdrop="">
              <h3 id="testimonial-title" className={styles.title} aria-live="polite">
                {current.title}
              </h3>
              <p id="testimonial-desc" className="sr-only">{current.description}</p>
              <div className={styles.actions}>
                <button type="button" aria-label={labels.prev} onClick={() => go(-1)} className={`${styles.iconButton} ${styles.bottomNav}`}>
                  <ChevronLeft size={22} aria-hidden />
                </button>
                <a href="#ariza" onClick={close} className={`${styles.textButton} ${styles.apply}`}>
                  {labels.apply}
                </a>
                <button type="button" aria-label={labels.next} onClick={() => go(1)} className={`${styles.iconButton} ${styles.bottomNav}`}>
                  <ChevronRight size={22} aria-hidden />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
