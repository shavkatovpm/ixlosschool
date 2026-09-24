import { CONTENT_LOCALES, LOCALE_NAMES, type Localized } from "../content/shared";

/** Reads `<key>_<locale>` fields back into localized values and reports the ones that are empty or too long. */
export function readLocalized(
  values: Record<string, string>,
  key: string,
  label: string,
  limits: { min?: number; max: number },
  errors: Record<string, string>,
): Localized {
  const result = {} as Localized;
  for (const locale of CONTENT_LOCALES) {
    const name = `${key}_${locale}`;
    const text = (values[name] ?? "").trim().replace(/[ \t]+\n/g, "\n");
    result[locale] = text;
    if (!text) errors[name] = `${label} ${LOCALE_NAMES[locale].toLowerCase()} tilida ham kiritilishi shart.`;
    else if (text.length < (limits.min ?? 1)) errors[name] = `${label} kamida ${limits.min} belgi bo'lsin.`;
    else if (text.length > limits.max) errors[name] = `${label} ${limits.max} belgidan oshmasin.`;
  }
  return result;
}
