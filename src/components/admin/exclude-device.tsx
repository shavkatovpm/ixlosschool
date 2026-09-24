"use client";

import { useSyncExternalStore } from "react";

const KEY = "ixlos_ignore";
const EVENT = "ixlos-ignore-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

const snapshot = (): boolean | null => {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

// Marks this browser so the site's own counter skips it (stored only in this browser's localStorage).
export function ExcludeDevice() {
  const excluded = useSyncExternalStore(subscribe, snapshot, () => null);

  const toggle = () => {
    try {
      if (excluded) window.localStorage.removeItem(KEY);
      else window.localStorage.setItem(KEY, "1");
      window.dispatchEvent(new Event(EVENT));
    } catch {
      // Storage blocked: nothing to persist.
    }
  };

  if (excluded === null) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="max-w-xl text-[14px] leading-[1.6] text-ink/75">
        {excluded
          ? "Bu qurilma statistikadan chiqarilgan: saytni shu brauzerda ochsangiz hisobga olinmaydi."
          : "O'zingiz saytni ko'rib turganingizda statistikaga qo'shilib qolmasligi uchun bu qurilmani hisobdan chiqarib qo'yishingiz mumkin."}
      </p>
      <button
        type="button"
        onClick={toggle}
        className="inline-flex h-11 items-center rounded-full border border-line px-5 text-[14px] font-semibold transition-colors hover:bg-tint-a"
      >
        {excluded ? "Hisobga qaytarish" : "Bu qurilmani chiqarish"}
      </button>
    </div>
  );
}
