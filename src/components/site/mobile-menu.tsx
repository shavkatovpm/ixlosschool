"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function MobileMenu({
  links,
  cta,
  label,
}: {
  links: { href: string; label: string }[];
  cta: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={root} className="relative min-[1200px]:hidden">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-[11px] border border-ink/15 bg-paper/60 transition-colors hover:bg-tint-e"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open ? (
        <nav
            id="mobile-menu"
            className="anim-menu absolute right-0 top-14 z-50 flex w-[min(320px,88vw)] flex-col rounded-[18px] border border-line bg-paper p-3 shadow-[0_24px_60px_-12px_rgba(23,60,36,0.28)]"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-[10px] px-4 py-3.5 text-[16px] font-semibold transition-colors hover:bg-tint-e"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#ariza"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-[11px] bg-brand px-5 py-4 text-center text-[15px] font-semibold text-white"
            >
              {cta}
            </Link>
        </nav>
      ) : null}
    </div>
  );
}
