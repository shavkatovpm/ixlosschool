"use client";

import { useFormState } from "./form";

/**
 * An optional group of fields, collapsed while empty (collapsed fields are still submitted). It opens by itself when
 * it has content, or when the last save came back with an error inside it, so a message is never hidden.
 */
export function OptionalBlock({ prefix, open, summary, children }: { prefix: string; open: boolean; summary: string; children: React.ReactNode }) {
  const state = useFormState();
  const touched =
    Object.keys(state.errors ?? {}).some((key) => key.startsWith(prefix)) ||
    Object.entries(state.values ?? {}).some(([key, value]) => key.startsWith(prefix) && key !== `${prefix}degree` && value.trim() !== "");
  if (open || touched) return <div key={state.nonce}>{children}</div>;
  return (
    <details key={state.nonce} className="[&[open]>summary]:hidden">
      <summary className="cursor-pointer rounded-[14px] bg-surface px-5 py-3 text-[15px] font-semibold text-brand transition-colors hover:bg-tint-b">+ {summary} qo&apos;shish</summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}
