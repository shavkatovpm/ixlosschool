"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

type Option = { value: string; label: string; href: string };

/** The "month" segment of the date filter: shows the month and opens a list of months to switch to. */
export function MonthPicker({ active, label, selected, options }: { active: boolean; label: string; selected: string; options: Option[] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={listId}
        aria-current={active ? "true" : undefined}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex h-9 items-center gap-1 rounded-full pl-2.5 pr-2 text-[12px] font-bold whitespace-nowrap transition-colors sm:gap-1.5 sm:pl-4 sm:pr-3 sm:text-[13px] ${active ? "bg-brand text-on-brand" : "text-ink/75 hover:bg-tint-b"}`}
      >
        {label}
        <ChevronDown size={15} aria-hidden className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <ul id={listId} className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 z-50 max-h-[320px] w-[210px] overflow-y-auto rounded-[18px] border border-white bg-white/95 p-1.5 shadow-[0_18px_50px_-18px_rgba(22,46,37,0.5)] backdrop-blur-xl">
          {options.map((option, index) => (
            <li key={option.value}>
              <Link
                href={option.href}
                onClick={() => setOpen(false)}
                aria-current={option.value === selected && active ? "true" : undefined}
                className={`flex min-h-10 items-center justify-between gap-2 rounded-[12px] px-3 text-[14px] font-semibold transition-colors ${option.value === selected && active ? "bg-tint-b text-brand" : "hover:bg-tint-b"}`}
              >
                <span>
                  {option.label}
                  {index === 0 ? <span className="ml-1.5 text-[11px] font-bold text-ink/50">joriy</span> : null}
                </span>
                {option.value === selected && active ? <Check size={15} aria-hidden /> : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
