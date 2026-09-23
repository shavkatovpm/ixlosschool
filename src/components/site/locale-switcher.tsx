"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Flag } from "./flags";

const LABELS: Record<string, string> = {
  uz: "O'zbekcha",
  ru: "Русский",
  en: "English",
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    const active = routing.locales.indexOf(locale as (typeof routing.locales)[number]);
    items.current[Math.max(active, 0)]?.focus();

    const onPointer = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, locale]);

  const choose = (loc: string) => {
    setOpen(false);
    trigger.current?.focus();
    if (loc !== locale) router.replace(pathname, { locale: loc, scroll: false });
  };

  const onMenuKey = (e: React.KeyboardEvent, index: number) => {
    const last = routing.locales.length - 1;
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      trigger.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      items.current[index === last ? 0 : index + 1]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items.current[index === 0 ? last : index - 1]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items.current[last]?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={root} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-label={`${t("language")}: ${LABELS[locale]}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="flex h-11 items-center gap-1.5 rounded-[14px] px-2.5 text-[12px] font-bold uppercase opacity-75 transition-opacity duration-300 hover:opacity-100 min-[1200px]:gap-2 min-[1200px]:rounded-[11px] min-[1200px]:px-3.5 min-[1200px]:text-[13px]"
      >
        <span className="hidden min-[1200px]:inline-flex"><Flag locale={locale} /></span>
        <span className="inline">{locale}</span>
        <ChevronDown
          size={16}
          aria-hidden
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={t("language")}
          className="anim-menu absolute right-0 top-[calc(100%+10px)] z-50 w-[210px] rounded-[16px] border border-line bg-paper p-2 shadow-[0_24px_60px_-12px_rgba(22,46,37,0.3)]"
        >
          {routing.locales.map((loc, i) => {
            const active = loc === locale;
            return (
              <button
                key={loc}
                ref={(el) => {
                  items.current[i] = el;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                lang={loc}
                onClick={() => choose(loc)}
                onKeyDown={(e) => onMenuKey(e, i)}
                className={`flex h-12 w-full items-center gap-3 rounded-[10px] px-3 text-left text-[15px] font-semibold transition-colors duration-200 ${
                  active ? "bg-tint-a" : "hover:bg-tint-e focus-visible:bg-tint-e"
                }`}
              >
                <Flag locale={loc} />
                <span className="flex-1">{LABELS[loc]}</span>
                {active ? <Check size={16} className="text-brand" aria-hidden /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
