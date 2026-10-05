import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import uz from "../../messages/uz.json";
import { toCyrillicDeep } from "../lib/cyrillic.mjs";
import { routing } from "./routing";

// Cyrillic Uzbek has no message file of its own: it is messages/uz.json in the other script, converted once.
let uzCyrillic: typeof uz | undefined;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: locale === "uz-cyrl" ? (uzCyrillic ??= toCyrillicDeep(uz)) : (await import(`../../messages/${locale}.json`)).default,
  };
});
