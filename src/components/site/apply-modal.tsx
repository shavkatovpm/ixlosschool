"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { ApplicationForm } from "./application-form";
import styles from "./apply-modal.module.css";

const ApplyModalContext = createContext<{ open: () => void } | null>(null);

export function useApplyModal() {
  const context = useContext(ApplyModalContext);
  if (!context) throw new Error("useApplyModal must be used inside ApplyModalProvider");
  return context;
}

/** Drop-in button for server components (header, hero) that need to open the application modal. */
export function ApplyTrigger({ children, ...props }: Omit<React.ComponentProps<"button">, "type" | "onClick">) {
  const { open } = useApplyModal();
  return (
    <button type="button" aria-haspopup="dialog" onClick={open} {...props}>
      {children}
    </button>
  );
}

export function ApplyModalProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  // The provider lives in the layout, so browser back/forward would otherwise leave the modal on top of another page.
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setIsOpen(false);
  }

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <ApplyModalContext.Provider value={value}>
      {children}
      <ApplyDialog open={isOpen} onClose={close} />
    </ApplyModalContext.Provider>
  );
}

function ApplyDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    element.showModal();
    // Focus the dialog itself so phones do not pop the keyboard open and hide the form.
    element.focus({ preventScroll: true });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={dialog}
      tabIndex={-1}
      aria-labelledby="apply-modal-title"
      className={styles.dialog}
      // Only the X button may dismiss this dialog: no backdrop click, and Escape is blocked
      // at both keydown and cancel (browsers close on a repeated Escape if only cancel is blocked).
      onKeyDown={(event) => { if (event.key === "Escape") event.preventDefault(); }}
      onCancel={(event) => event.preventDefault()}
      onClose={onClose}
    >
      {open ? <ApplyPanel onClose={onClose} /> : null}
    </dialog>
  );
}

function ApplyPanel({ onClose }: { onClose: () => void }) {
  const t = useTranslations("admissions");
  const nav = useTranslations("nav");
  const [sent, setSent] = useState(false);

  return (
    <>
      <div className={styles.head}>
        <span className={styles.brand}>IXLOS SCHOOL</span>
        <h2 id="apply-modal-title" className={styles.title}>{nav("apply")}</h2>
        {sent ? null : <p className={styles.lead}>{t("modalLead")}</p>}
        <button type="button" onClick={onClose} className={styles.close} aria-label={t("close")}>
          <X size={20} aria-hidden />
        </button>
      </div>
      <div className={styles.body}>
        <ApplicationForm variant="modal" onSuccess={() => setSent(true)} />
      </div>
    </>
  );
}
