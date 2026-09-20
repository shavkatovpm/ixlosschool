"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SPEED = 42; // px per second while drifting on its own
const IDLE_RESUME_MS = 8000; // drift restarts this long after the visitor stops touching it
const CARD_GAP = 20;

type Props = {
  head: React.ReactNode;
  action: React.ReactNode;
  /** The duplicate set that makes the loop seamless (aria-hidden). */
  copy: React.ReactNode;
  children: React.ReactNode;
  label: string;
  prevLabel: string;
  nextLabel: string;
};

/**
 * Cards drift right-to-left forever (CSS animation, so it stays smooth). The moment the visitor
 * touches, drags, scrolls sideways or tabs into it, the drift is swapped for ordinary native
 * scrolling at the exact same position. It pauses while hovered and starts again after a while.
 * Because the two card sets are identical, positions are interchangeable modulo one set width.
 */
export function TeachersCarousel({ head, action, copy, children, label, prevLabel, nextLabel }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<(dir: 1 | -1) => void>(() => {});

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const set = setRef.current;
    if (!viewport || !track || !set) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover)").matches;

    let setWidth = 0;
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    let idleTimer = 0;
    let scrollTimer = 0;

    const measure = () => {
      setWidth = set.getBoundingClientRect().width;
      track.style.setProperty("--marquee-duration", `${setWidth / SPEED}s`);
    };

    const canDrift = () => !reduceMotion && setWidth > viewport.clientWidth + 1;

    const resumeAuto = () => {
      if (!canDrift()) {
        track.dataset.mode = "manual";
        return;
      }
      const position = ((viewport.scrollLeft % setWidth) + setWidth) % setWidth;
      track.style.setProperty("--marquee-delay", `${-(position / SPEED)}s`);
      viewport.scrollLeft = 0;
      track.dataset.mode = "auto";
    };

    const armResume = () => {
      window.clearTimeout(idleTimer);
      if (!canDrift()) return;
      idleTimer = window.setTimeout(() => {
        const busy = dragging || (canHover && viewport.matches(":hover")) || viewport.matches(":focus-within");
        if (busy) armResume();
        else resumeAuto();
      }, IDLE_RESUME_MS);
    };

    const enterManual = () => {
      if (track.dataset.mode === "auto") {
        const shift = -new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
        track.dataset.mode = "manual";
        viewport.scrollLeft = shift;
      }
      armResume();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      enterManual();
      if (e.pointerType === "mouse") {
        dragging = true;
        moved = false;
        startX = e.clientX;
        startLeft = viewport.scrollLeft;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        viewport.setPointerCapture(e.pointerId);
        viewport.dataset.dragging = "true";
      }
      if (moved) viewport.scrollLeft = startLeft - dx;
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      viewport.dataset.dragging = "false";
      if (viewport.hasPointerCapture(e.pointerId)) viewport.releasePointerCapture(e.pointerId);
      armResume();
    };

    // A drag must not count as a click on the card underneath.
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) enterManual();
    };

    // Once scrolling settles, slide back into the middle of the doubled track (looks identical),
    // so there is always room to keep going in both directions.
    const onScroll = () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        if (track.dataset.mode !== "manual" || dragging || !setWidth) return;
        const min = Math.min(400, Math.max(0, setWidth - viewport.clientWidth));
        let position = viewport.scrollLeft;
        while (position < min) position += setWidth;
        while (position >= min + setWidth) position -= setWidth;
        if (position !== viewport.scrollLeft) viewport.scrollLeft = position;
      }, 180);
    };

    const step = (dir: 1 | -1) => {
      enterManual();
      const card = set.firstElementChild;
      const distance = (card ? card.getBoundingClientRect().width : 300) + CARD_GAP;
      const left = viewport.scrollLeft;
      if (dir === -1 && left < distance) viewport.scrollLeft = left + setWidth;
      if (dir === 1 && left + viewport.clientWidth + distance > viewport.scrollWidth) viewport.scrollLeft = left - setWidth;
      viewport.scrollBy({ left: dir * distance, behavior: reduceMotion ? "auto" : "smooth" });
    };
    stepRef.current = step;

    const visibility = new IntersectionObserver(([entry]) => {
      track.dataset.visible = entry.isIntersecting ? "true" : "false";
    });
    const resize = new ResizeObserver(() => {
      measure();
      if (track.dataset.mode === "auto" && !canDrift()) track.dataset.mode = "manual";
    });

    measure();
    resumeAuto();
    visibility.observe(viewport);
    resize.observe(set);
    resize.observe(viewport);

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("click", onClickCapture, true);
    viewport.addEventListener("wheel", onWheel, { passive: true });
    viewport.addEventListener("focusin", enterManual);
    viewport.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(idleTimer);
      window.clearTimeout(scrollTimer);
      visibility.disconnect();
      resize.disconnect();
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", endDrag);
      viewport.removeEventListener("pointercancel", endDrag);
      viewport.removeEventListener("click", onClickCapture, true);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("focusin", enterManual);
      viewport.removeEventListener("scroll", onScroll);
    };
  }, []);

  const arrow =
    "flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white";

  return (
    <>
      <div className="wrap flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        {head}
        <div className="hidden items-center gap-2 md:flex">
          <button type="button" aria-label={prevLabel} onClick={() => stepRef.current(-1)} className={arrow}>
            <ChevronLeft size={20} aria-hidden />
          </button>
          <button type="button" aria-label={nextLabel} onClick={() => stepRef.current(1)} className={arrow}>
            <ChevronRight size={20} aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        role="region"
        aria-label={label}
        className="teachers-viewport mt-6 select-none overflow-x-auto overflow-y-hidden overscroll-x-contain py-8 pl-[clamp(20px,4.5vw,56px)] [mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)] [scrollbar-width:none] sm:mt-8 [&::-webkit-scrollbar]:hidden"
      >
        <div ref={trackRef} data-mode="idle" className="teachers-track flex w-max">
          <div ref={setRef} className="flex shrink-0 gap-5 pr-5">
            {children}
          </div>
          <div aria-hidden className="flex shrink-0 gap-5 pr-5">
            {copy}
          </div>
        </div>
      </div>

      <div className="wrap mt-4 flex justify-center">{action}</div>
    </>
  );
}
