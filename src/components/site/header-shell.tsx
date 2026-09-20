"use client";

import { useEffect, useRef } from "react";

/*
 * The header floats (fixed) and shrinks once the page is scrolled. A fixed header takes no space in
 * the layout, so the spacer below reserves its resting height (76px + 1px border on phones,
 * 96px + 1px from `sm`). Changing the header's own size therefore never moves the page content,
 * which is what used to make the page jitter around the scroll threshold.
 * The spacer also carries id="top" so "back to top" links land at the very top of the document.
 */
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
    <div id="top" className="h-[77px] sm:h-[97px]">
      <header
        ref={ref}
        data-scrolled="false"
        className="group fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-300 data-[scrolled=true]:border-line data-[scrolled=true]:bg-paper/85 data-[scrolled=true]:backdrop-blur-xl"
      >
        {children}
      </header>
    </div>
  );
}
