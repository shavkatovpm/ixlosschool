import { toCyrillic } from "../cyrillic.mjs";
import { readSetting, writeSetting } from "../settings";

export const CONTENT_LOCALES = ["uz", "ru", "en"] as const;
export type ContentLocale = (typeof CONTENT_LOCALES)[number];
export type Localized = Record<ContentLocale, string>;

export const LOCALE_NAMES: Record<ContentLocale, string> = { uz: "O'zbekcha", ru: "Ruscha", en: "Inglizcha" };

export const isContentLocale = (value: string): value is ContentLocale => (CONTENT_LOCALES as readonly string[]).includes(value);

/** The languages of the public pages. Cyrillic Uzbek is not stored or edited: it is the Uzbek text in the other script. */
export type PublicLocale = ContentLocale | "uz-cyrl";

/** Returns the reader of a page language: `localizer(locale)(row.title)`. */
export const localizer = (locale: PublicLocale) =>
  locale === "uz-cyrl" ? (value: Localized) => toCyrillic(value.uz) : (value: Localized) => value[locale];

// A section (FAQ, videos, teachers) shows its built-in default content until the owner starts editing it in the panel;
// from then on the database rows are the truth (even if they are all deleted or hidden).
const flagKey = (name: string) => `${name}_customized`;
export const isCustomized = (name: string) => readSetting<boolean>(flagKey(name)) === true;
export const markCustomized = (name: string) => writeSetting(flagKey(name), true);
