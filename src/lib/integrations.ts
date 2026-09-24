import { readSetting } from "./settings";

// Analytics tags and search-engine verification codes, edited in the admin panel ("Sozlamalar").
// Environment variables remain as a fallback so nothing changes for deployments without a panel.

export type Integrations = {
  gaId: string;
  ymId: string;
  googleVerification: string;
  yandexVerification: string;
};

export const GA_ID_RE = /^G-[A-Z0-9]{4,20}$/;
export const YM_ID_RE = /^\d{5,12}$/;
export const VERIFICATION_RE = /^[A-Za-z0-9_-]{10,100}$/;

export const INTEGRATIONS_KEY = "integrations";

export function getIntegrations(): Integrations {
  const saved = readSetting<Partial<Integrations>>(INTEGRATIONS_KEY);
  return {
    gaId: saved?.gaId ?? process.env.NEXT_PUBLIC_GA_ID ?? "",
    ymId: saved?.ymId ?? process.env.NEXT_PUBLIC_YM_ID ?? "",
    googleVerification: saved?.googleVerification ?? process.env.GOOGLE_SITE_VERIFICATION ?? "",
    yandexVerification: saved?.yandexVerification ?? process.env.YANDEX_VERIFICATION ?? "",
  };
}
