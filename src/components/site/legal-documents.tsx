"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Download, FileText, X } from "lucide-react";

export type LegalDoc = {
  key: string;
  title: string;
  alt: string;
  thumb: { src: string; width: number; height: number };
  full: { src: string; width: number; height: number };
  pdf: string;
};

export type LegalLabels = { heading: string; view: string; close: string; pdf: string };

/**
 * Registration certificate and licence in the footer: small previews that open the full scan in a dialog,
 * with the original PDF available. The large image is only loaded once a document is opened.
 */
export function LegalDocuments({ docs, labels }: { docs: LegalDoc[]; labels: LegalLabels }) {
  const [active, setActive] = useState<LegalDoc | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!active || !element || element.open) return;
    element.showModal();
    closeButton.current?.focus();
  }, [active]);

  const close = () => dialog.current?.close();

  return (
    <section aria-labelledby="legal-docs-title">
      <h2 id="legal-docs-title" className="text-[12px] font-bold uppercase tracking-[0.14em] text-khaki-deep">
        {labels.heading}
      </h2>
      <ul className="mt-4 flex flex-wrap gap-4">
        {docs.map((doc) => (
          <li key={doc.key}>
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={(event) => {
                opener.current = event.currentTarget;
                setActive(doc);
              }}
              className="group flex w-full max-w-[340px] items-center gap-4 rounded-[18px] border border-line bg-surface p-3 pr-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_18px_34px_-22px_rgba(22,46,37,0.55)]"
            >
              <Image
                src={doc.thumb.src}
                width={doc.thumb.width}
                height={doc.thumb.height}
                alt=""
                unoptimized
                loading="lazy"
                className="h-[88px] w-auto shrink-0 rounded-[8px] border border-line object-cover object-top"
              />
              <span className="min-w-0">
                <span className="block text-[14px] font-bold leading-snug text-ink">{doc.title}</span>
                <span className="mt-1.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand group-hover:underline">
                  <FileText size={14} aria-hidden />
                  {labels.view}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={active?.title}
        onClose={() => {
          setActive(null);
          opener.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="m-auto max-h-[calc(100dvh-24px)] w-[min(760px,calc(100vw-24px))] max-w-none overflow-hidden rounded-[24px] border-0 bg-surface p-0 text-ink shadow-[0_32px_90px_rgba(16,45,37,0.45)] backdrop:bg-[rgb(16_45_37/0.6)] backdrop:backdrop-blur-sm"
      >
        {active ? (
          <div className="flex max-h-[calc(100dvh-24px)] flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
              <p className="min-w-0 truncate text-[15px] font-bold">{active.title}</p>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={active.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[13px] font-semibold transition-colors hover:bg-tint-a"
                >
                  <Download size={15} aria-hidden />
                  {labels.pdf}
                </a>
                <button
                  ref={closeButton}
                  type="button"
                  onClick={close}
                  aria-label={labels.close}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-tint-b transition-colors hover:bg-tint-a"
                >
                  <X size={18} aria-hidden />
                </button>
              </div>
            </div>
            <div className="min-h-0 overflow-y-auto overscroll-contain bg-tint-b p-3 sm:p-5">
              <Image
                src={active.full.src}
                width={active.full.width}
                height={active.full.height}
                alt={active.alt}
                unoptimized
                className="mx-auto h-auto w-full max-w-[640px] rounded-[10px] bg-white shadow-[0_8px_30px_-12px_rgba(22,46,37,0.5)]"
              />
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
