"use client";

import { useEffect, useRef } from "react";

export function HeaderShell({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      el.dataset.scrolled = window.scrollY > 12 ? "true" : "false";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      ref={ref}
      id="top"
      data-scrolled="false"
      className="group sticky top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-300 data-[scrolled=true]:border-line data-[scrolled=true]:bg-paper/85 data-[scrolled=true]:backdrop-blur-xl"
    >
      {children}
    </header>
  );
}
