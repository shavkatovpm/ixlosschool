import { CATEGORIES, DEGREES, type Category, type Degree, type TeacherRecord } from "../content/teachers";
import { CONTENT_LOCALES, LOCALE_NAMES, type Localized } from "../content/shared";

export const EDUCATION_SLOTS = 3;
export const CREDENTIAL_SLOTS = 3;

const clean = (value: string | undefined) => (value ?? "").trim().replace(/\s+/g, " ");

function localized(values: Record<string, string>, prefix: string, max: number): Localized {
  const result = {} as Localized;
  for (const locale of CONTENT_LOCALES) result[locale] = clean(values[`${prefix}_${locale}`]).slice(0, max);
  return result;
}

/** Validates the teacher form (everything except the photo, which the action handles). */
export function parseTeacherForm(values: Record<string, string>): { value?: Omit<TeacherRecord, "slug" | "photo">; errors?: Record<string, string> } {
  const errors: Record<string, string> = {};

  const nameLatin = clean(values.nameLatin);
  if (nameLatin.length < 3 || nameLatin.length > 80) errors.nameLatin = "Ism-familiya lotin yozuvida, 3–80 belgi bo'lsin.";
  else if (/[Ѐ-ӿ]/.test(nameLatin)) errors.nameLatin = "Bu maydonga lotin harflarida yozing (kirill alohida maydonda).";
  const nameCyrillic = clean(values.nameCyrillic);
  if (nameCyrillic.length < 3 || nameCyrillic.length > 80) errors.nameCyrillic = "Ism-familiya kirill yozuvida, 3–80 belgi bo'lsin.";
  else if (!/[Ѐ-ӿ]/.test(nameCyrillic)) errors.nameCyrillic = "Bu maydonga kirill harflarida yozing (ruscha sahifalar uchun).";

  let experienceYears: number | null = null;
  const yearsRaw = clean(values.experienceYears);
  if (yearsRaw) {
    const years = Number(yearsRaw);
    if (!Number.isInteger(years) || years < 0 || years > 60) errors.experienceYears = "Ish staji 0–60 oralig'ida butun son bo'lsin.";
    else experienceYears = years;
  }

  const category = (CATEGORIES as readonly string[]).includes(values.category) ? (values.category as Category) : null;

  const focusRaw = localized(values, "focus", 60);
  const focus = focusRaw.uz || focusRaw.ru || focusRaw.en ? focusRaw : null;
  if (focus && !focus.uz) errors.focus_uz = "Yo'nalish o'zbekcha kiritilishi shart (boshqa tillar bo'sh qolsa shu ishlatiladi).";

  const education: TeacherRecord["education"] = [];
  for (let i = 1; i <= EDUCATION_SLOTS; i++) {
    const institution = localized(values, `edu${i}`, 120);
    if (!institution.uz && !institution.ru && !institution.en) continue;
    if (!institution.uz) errors[`edu${i}_uz`] = "O'quv yurti nomi o'zbekcha kiritilishi shart (boshqa tillar bo'sh qolsa shu ishlatiladi).";
    const degreeValue = values[`edu${i}_degree`];
    education.push({ degree: (DEGREES as readonly string[]).includes(degreeValue) ? (degreeValue as Degree) : null, institution });
  }

  const credentials: TeacherRecord["credentials"] = [];
  for (let i = 1; i <= CREDENTIAL_SLOTS; i++) {
    const label = localized(values, `cred${i}_label`, 80);
    const value = clean(values[`cred${i}_value`]).slice(0, 80);
    if (!value && !label.uz && !label.ru && !label.en) continue;
    if (!value) errors[`cred${i}_value`] = "Qiymatni kiriting (masalan C1, B+, F1–F7).";
    for (const locale of CONTENT_LOCALES) {
      if (!label[locale]) errors[`cred${i}_label_${locale}`] = `Nomi ${LOCALE_NAMES[locale].toLowerCase()} tilida ham kiritilsin.`;
    }
    credentials.push({ label, value });
  }

  if (Object.keys(errors).length) return { errors };
  return { value: { nameLatin, nameCyrillic, experienceYears, category, focus, education, credentials } };
}
