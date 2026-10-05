import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // "uz-cyrl" is Uzbek in Cyrillic script: the same texts as "uz", converted by lib/cyrillic.mjs.
  locales: ["uz", "uz-cyrl", "ru", "en"],
  defaultLocale: "uz",
  localePrefix: "always",
  // "/" always opens Uzbek; other languages only via the language switcher
  localeDetection: false,
  // The hreflang alternates (with x-default -> /uz) are emitted in the HTML by buildMetadata(). next-intl's own HTTP
  // Link header pointed x-default at "/" (a redirect) and contradicted them, so it is switched off.
  alternateLinks: false,
});

export type AppLocale = (typeof routing.locales)[number];

/** The language tag for lang="", hreflang and JSON-LD: the URL segment is lower case, the tag is "uz-Cyrl". */
export const langTag = (locale: string) => (locale === "uz-cyrl" ? "uz-Cyrl" : locale);
