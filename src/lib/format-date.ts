const INTL_LOCALE: Record<string, string> = { uz: "uz-Latn", ru: "ru-RU", en: "en-GB" };

/** "24 September 2026" in the page language, Tashkent calendar day. */
export function formatDate(timestamp: number, locale: string) {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale] ?? "en-GB", { dateStyle: "long", timeZone: "Asia/Tashkent" }).format(timestamp);
}

export const isoDate = (timestamp: number) => new Date(timestamp).toISOString();
