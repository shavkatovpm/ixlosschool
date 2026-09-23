"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";

export function HomeLink({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <Link
      href="/#top"
      className="anim-fade shrink-0"
      aria-label="Ixlos School"
      onNavigate={(event) => {
        if (pathname !== "/") return;

        // Repeated clicks must scroll even when the URL already ends in #top.
        event.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      }}
    >
      {children}
    </Link>
  );
}
