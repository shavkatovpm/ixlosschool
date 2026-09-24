// First-touch attribution kept in sessionStorage for the length of the visit (never persisted across sessions).
// Sent with every page-view beacon and with the application form so a lead can be traced to its source.

export type Attribution = { ref: string; us: string; um: string; uc: string; lp: string };
const KEY = "ixlos_attr";
const EMPTY: Attribution = { ref: "", us: "", um: "", uc: "", lp: "" };

/** False when the visitor asked not to be tracked (Do Not Track / Global Privacy Control) or the owner excluded this device. */
export function trackingAllowed(): boolean {
  try {
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.doNotTrack === "1" || nav.globalPrivacyControl) return false;
    if (window.localStorage.getItem("ixlos_ignore") === "1") return false;
  } catch {
    // Storage may be blocked; that is not an opt-out.
  }
  return true;
}

export function readAttribution(): Attribution {
  try {
    const stored = window.sessionStorage.getItem(KEY);
    if (stored) return { ...EMPTY, ...(JSON.parse(stored) as Partial<Attribution>) };
  } catch {
    // Storage unavailable or corrupted: fall through and compute from this page.
  }
  const params = new URLSearchParams(window.location.search);
  const attr: Attribution = {
    ref: document.referrer.slice(0, 300),
    us: (params.get("utm_source") ?? "").slice(0, 60),
    um: (params.get("utm_medium") ?? "").slice(0, 60),
    uc: (params.get("utm_campaign") ?? "").slice(0, 80),
    lp: window.location.pathname.slice(0, 160),
  };
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(attr));
  } catch {
    // Not persisted; the attribution then only covers this page.
  }
  return attr;
}
