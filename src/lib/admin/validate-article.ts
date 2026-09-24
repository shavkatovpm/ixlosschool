import { CONTENT_LOCALES, LOCALE_NAMES, type Localized } from "../content/shared";
import { slugify } from "../content/teachers";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ARTICLE_LIMITS = { title: 70, description: 200, body: 40000 } as const;
export const PUBLISH_MIN = { title: 5, description: 30, body: 300 } as const;

export type ParsedArticle = {
  slug: string;
  title: Localized;
  description: Localized;
  body: Localized;
};

/** Everything a language needs before an article may go live. Returns the field errors (empty = complete). */
export function publishErrors(article: Pick<ParsedArticle, "title" | "description" | "body">): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const locale of CONTENT_LOCALES) {
    const name = LOCALE_NAMES[locale].toLowerCase();
    if (article.title[locale].length < PUBLISH_MIN.title) errors[`title_${locale}`] = `Chop etish uchun sarlavha ${name} tilida ham kerak.`;
    if (article.description[locale].length < PUBLISH_MIN.description) errors[`description_${locale}`] = `Chop etish uchun qisqa tavsif (kamida ${PUBLISH_MIN.description} belgi) ${name} tilida ham kerak.`;
    if (article.body[locale].length < PUBLISH_MIN.body) errors[`body_${locale}`] = `Chop etish uchun matn (kamida ${PUBLISH_MIN.body} belgi) ${name} tilida ham kerak.`;
  }
  return errors;
}

/** Field-level checks that apply to drafts too (length limits, slug). Completeness is checked separately when publishing. */
export function parseArticleForm(values: Record<string, string>): { value?: ParsedArticle; errors?: Record<string, string> } {
  const errors: Record<string, string> = {};
  const title = {} as Localized;
  const description = {} as Localized;
  const body = {} as Localized;

  for (const locale of CONTENT_LOCALES) {
    title[locale] = (values[`title_${locale}`] ?? "").trim().replace(/\s+/g, " ");
    description[locale] = (values[`description_${locale}`] ?? "").trim().replace(/\s+/g, " ");
    body[locale] = (values[`body_${locale}`] ?? "").replace(/\r\n?/g, "\n").trim();
    if (title[locale].length > ARTICLE_LIMITS.title) errors[`title_${locale}`] = `Sarlavha ${ARTICLE_LIMITS.title} belgidan oshmasin.`;
    if (description[locale].length > ARTICLE_LIMITS.description) errors[`description_${locale}`] = `Tavsif ${ARTICLE_LIMITS.description} belgidan oshmasin.`;
    if (body[locale].length > ARTICLE_LIMITS.body) errors[`body_${locale}`] = `Matn ${ARTICLE_LIMITS.body} belgidan oshmasin.`;
  }

  let slug = (values.slug ?? "").trim().toLowerCase();
  if (!slug && title.uz) slug = slugify(title.uz);
  if (!slug) errors.slug = "Havola nomi (slug) kerak: o'zbekcha sarlavhani kiriting yoki o'zingiz yozing.";
  else if (slug.length < 3 || slug.length > 80 || !SLUG_RE.test(slug)) errors.slug = "Havola nomi 3–80 belgi: faqat kichik lotin harflari, raqamlar va tire (masalan maktab-tanlash).";

  if (!title.uz && !title.ru && !title.en) errors.title_uz = "Kamida bitta tilda sarlavha kiriting.";

  if (Object.keys(errors).length) return { errors };
  return { value: { slug, title, description, body } };
}
