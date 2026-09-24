"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { readAttribution, trackingAllowed } from "@/lib/attribution";

// First-party page-view counter: no cookies, no IP or user agent stored (see src/lib/admin/analytics.ts).
// Respects "Do Not Track" / Global Privacy Control, and the owner can exclude their own device in the admin panel.
export function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!trackingAllowed()) return;
    const attr = readAttribution();
    const payload = JSON.stringify({ p: pathname, r: attr.ref, us: attr.us, um: attr.um, uc: attr.uc });
    try {
      if (!navigator.sendBeacon?.("/api/t", new Blob([payload], { type: "application/json" }))) throw new Error("no beacon");
    } catch {
      fetch("/api/t", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
