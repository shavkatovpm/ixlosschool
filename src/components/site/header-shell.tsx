"use client";

import { useEffect, useRef } from "react";

/* Reserve the mobile floating bar's height to prevent layout jumps.
 * Desktop retains its existing full-width header and scroll behavior. */
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
    <div id="top" className="h-[88px] sm:h-[96px] min-[1200px]:h-[97px]">
      <header
        ref={ref}
        data-scrolled="false"
        className="group fixed inset-x-3 top-3 z-50 rounded-[20px] border border-brand/10 bg-paper/95 shadow-[0_6px_24px_rgba(16,45,37,0.08)] backdrop-blur-xl transition-[background-color,border-color,backdrop-filter] duration-300 min-[1200px]:inset-x-0 min-[1200px]:top-0 min-[1200px]:rounded-none min-[1200px]:border-x-0 min-[1200px]:border-t-0 min-[1200px]:border-transparent min-[1200px]:bg-transparent min-[1200px]:shadow-none min-[1200px]:backdrop-blur-none min-[1200px]:data-[scrolled=true]:border-line min-[1200px]:data-[scrolled=true]:bg-paper/85 min-[1200px]:data-[scrolled=true]:backdrop-blur-xl"
      >
        {children}
      </header>
    </div>
  );
}
