"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, CircleHelp, GraduationCap, Menu, Phone, School, Trophy, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { CONTACT } from "@/lib/contact";
import { useApplyModal } from "./apply-modal";
import styles from "./mobile-menu.module.css";

const icons = [BookOpen, GraduationCap, Trophy, CircleHelp];

export function MobileMenu({ links, cta, label }: {
  links: { href: string; label: string }[];
  cta: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const t = useTranslations("nav");
  const { open: openApply } = useApplyModal();

  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    // Native modal supplies focus trapping, Escape dismissal and focus restoration.
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1200px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <div className="min-[1200px]:hidden">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className={styles.trigger}
      >
        <Menu size={21} strokeWidth={1.8} aria-hidden />
      </button>

      <dialog
        ref={dialog}
        id="mobile-menu"
        aria-labelledby="mobile-menu-title"
        className={styles.dialog}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setOpen(false);
        }}
      >
        <div className={styles.heading}>
          <div>
            <p className={styles.brand}>IXLOS SCHOOL</p>
            <h2 id="mobile-menu-title">{label}</h2>
          </div>
          <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label={t("closeMenu")}>
            <X size={21} aria-hidden />
          </button>
        </div>

        <nav aria-label={t("mainLabel")} className={styles.navigation}>
          {links.map((link, index) => {
            const Icon = icons[index] ?? School;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={styles.link}
              >
                <span className={styles.icon}><Icon size={19} strokeWidth={1.7} aria-hidden /></span>
                {link.label}
                {active ? <span className={styles.activeDot} aria-hidden /> : null}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <button type="button" aria-haspopup="dialog" onClick={() => { setOpen(false); openApply(); }} className={styles.apply}>{cta}</button>
          <a href={`tel:${CONTACT.phones[0]}`} onClick={() => setOpen(false)} className={styles.phone} aria-label={`${t("call")}: ${CONTACT.phonesDisplay[0]}`}>
            <Phone size={17} aria-hidden />{CONTACT.phonesDisplay[0]}
          </a>
        </div>
      </dialog>
    </div>
  );
}
