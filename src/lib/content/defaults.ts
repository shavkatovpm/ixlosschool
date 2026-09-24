// The site's built-in content, taken from the message files. It is what the public pages show until a section is
// customized in the admin panel, and what the panel copies into the database when editing starts.
import uz from "../../../messages/uz.json";
import ru from "../../../messages/ru.json";
import en from "../../../messages/en.json";
import type { Localized } from "./shared";

const messages = { uz, ru, en };

export function defaultFaq(): { question: Localized; answer: Localized }[] {
  return uz.faq.items.map((_, i) => ({
    question: { uz: uz.faq.items[i].question, ru: ru.faq.items[i].question, en: en.faq.items[i].question },
    answer: { uz: uz.faq.items[i].answer, ru: ru.faq.items[i].answer, en: en.faq.items[i].answer },
  }));
}

type TestimonialMessages = typeof uz.testimonials.items;
export type DefaultTestimonialKey = keyof TestimonialMessages;

export function defaultTestimonialText(key: DefaultTestimonialKey) {
  const pick = (field: "chip" | "title" | "description"): Localized => ({
    uz: messages.uz.testimonials.items[key][field],
    ru: messages.ru.testimonials.items[key][field],
    en: messages.en.testimonials.items[key][field],
  });
  return { chip: pick("chip"), title: pick("title"), description: pick("description") };
}

export type TeacherMessageKeys = {
  degreeLabel: Record<string, Localized>;
  categoryLabel: Record<string, Localized>;
};

const pickAll = (read: (m: typeof uz) => string): Localized => ({ uz: read(uz), ru: read(ru), en: read(en) });

export const degreeLabels = (degree: string | null): Localized =>
  pickAll((m) => (m.teachers.facts as Record<string, string>)[degree ?? "education"] ?? m.teachers.facts.education);

export const categoryLabels = (category: string): Localized =>
  pickAll((m) => (m.teachers.category as Record<string, string>)[category] ?? "");

export const focusLabels = (key: string): Localized => pickAll((m) => (m.teachers.focus as Record<string, string>)[key] ?? "");
export const institutionLabels = (key: string): Localized => pickAll((m) => (m.teachers.institutions as Record<string, string>)[key] ?? "");
export const credentialLabel = (key: string): Localized => pickAll((m) => (m.teachers.credentials as Record<string, { label: string }>)[key]?.label ?? "");
export const credentialValue = (key: string): string => (uz.teachers.credentials as Record<string, { value: string }>)[key]?.value ?? "";
