"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// A new page always opens at its very top. Next already scrolls there, but its result depends on how the browser
// treats scroll padding and smooth scrolling; this makes the outcome the same everywhere. Section links
// (/uz#dastur) and the back/forward buttons keep their own positions.
export function ScrollTop() {
  const pathname = usePathname();
  const first = useRef(true);
  const history = useRef(false);

  useEffect(() => {
    const onPop = () => {
      history.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (history.current) {
      history.current = false;
      return;
    }
    if (window.location.hash) return;
    const frame = requestAnimationFrame(() => {
      if (window.scrollY !== 0) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
