import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["uz", "ru", "en"],
  defaultLocale: "uz",
  localePrefix: "always",
  // "/" always opens Uzbek; other languages only via the language switcher
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
