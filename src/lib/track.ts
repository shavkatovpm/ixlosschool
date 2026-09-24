declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    ym?: (...args: unknown[]) => void;
    /** Yandex Metrica counter id, set by the analytics snippet (it is editable in the admin panel, so not a build-time constant). */
    ixlosYmId?: number;
  }
}

export function trackLead() {
  window.gtag?.("event", "generate_lead");
  if (window.ixlosYmId) window.ym?.(window.ixlosYmId, "reachGoal", "lead");
}
