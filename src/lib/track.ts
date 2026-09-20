declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    ym?: (...args: unknown[]) => void;
  }
}

export function trackLead() {
  window.gtag?.("event", "generate_lead");
  const ymId = Number(process.env.NEXT_PUBLIC_YM_ID);
  if (ymId) window.ym?.(ymId, "reachGoal", "lead");
}
