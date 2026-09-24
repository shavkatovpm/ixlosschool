import { Field } from "./form";
import { CONTENT_LOCALES, LOCALE_NAMES, type Localized } from "@/lib/content/shared";

export type LocaleFieldSpec = {
  key: string;
  label: string;
  multiline?: number;
  maxLength?: number;
  hint?: string;
  counter?: { soft: number; max?: number };
};

/** One block per language (Uzbek, Russian, English) with the same fields: every text on the site must exist in all three. */
export function LocaleFields({ fields, values }: { fields: LocaleFieldSpec[]; values?: Record<string, Localized> }) {
  return (
    <div className="grid gap-4 lg:grid-cols-1">
      {CONTENT_LOCALES.map((locale) => (
        <fieldset key={locale} className="rounded-[22px] bg-surface p-5 sm:p-6">
          <legend className="sr-only">{LOCALE_NAMES[locale]}</legend>
          <h2 aria-hidden className="font-display text-[17px] font-bold tracking-tight">
            {LOCALE_NAMES[locale]} <span className="ml-1 rounded-full bg-tint-b px-2 py-0.5 text-[11px] font-bold uppercase text-ink/70">{locale}</span>
          </h2>
          <div className="mt-4 space-y-4">
            {fields.map((field) => (
              <Field
                key={field.key}
                name={`${field.key}_${locale}`}
                label={field.label}
                defaultValue={values?.[field.key]?.[locale] ?? ""}
                required
                multiline={field.multiline}
                maxLength={field.maxLength}
                hint={field.hint}
                counter={field.counter}
              />
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
