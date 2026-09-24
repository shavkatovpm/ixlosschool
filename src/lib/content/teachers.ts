import { adminEnabled } from "../admin/config";
import { getDb, type Row } from "../admin/db";
import { teachers as builtIn } from "../teachers";
import { categoryLabels, credentialLabel, credentialValue, degreeLabels, focusLabels, institutionLabels } from "./defaults";
import { moveRow } from "./order";
import { isCustomized, markCustomized, type ContentLocale, type Localized } from "./shared";

export const DEGREES = ["bachelor", "master", "bachelorMaster"] as const;
export type Degree = (typeof DEGREES)[number];
export const CATEGORIES = ["first", "highest"] as const;
export type Category = (typeof CATEGORIES)[number];

export type TeacherRecord = {
  slug: string;
  photo: string;
  nameLatin: string;
  nameCyrillic: string;
  experienceYears: number | null;
  category: Category | null;
  focus: Localized | null;
  education: { degree: Degree | null; institution: Localized }[];
  credentials: { label: Localized; value: string }[];
};

export type TeacherRow = TeacherRecord & { id: number; position: number; published: boolean };

export type TeacherFact = { kind: "education" | "credential"; label: string; value: string };

/** A teacher as the public pages use it, every text already in the page language. */
export type PublicTeacher = {
  slug: string;
  photo: string;
  name: string;
  experienceYears?: number;
  focus?: string;
  category?: string;
  facts: TeacherFact[];
  institutions: string[];
};

const FLAG = "teachers";

const toRow = (r: Row): TeacherRow => {
  const data = JSON.parse(String(r.data)) as Pick<TeacherRecord, "category" | "focus" | "education" | "credentials">;
  return {
    id: Number(r.id),
    position: Number(r.position),
    published: Number(r.published) === 1,
    slug: String(r.slug),
    photo: String(r.photo),
    nameLatin: String(r.name_latin),
    nameCyrillic: String(r.name_cyrillic),
    experienceYears: r.experience_years == null ? null : Number(r.experience_years),
    category: data.category ?? null,
    focus: data.focus ?? null,
    education: data.education ?? [],
    credentials: data.credentials ?? [],
  };
};

const dataOf = (t: TeacherRecord) => JSON.stringify({ category: t.category, focus: t.focus, education: t.education, credentials: t.credentials });

/** The teachers that shipped with the site (lib/teachers.ts) as editable records. */
export function defaultTeachers(): TeacherRecord[] {
  return builtIn.map((t) => ({
    slug: t.slug,
    photo: t.photo,
    nameLatin: t.name,
    nameCyrillic: t.nameRu,
    experienceYears: t.experienceYears ?? null,
    category: t.category ?? null,
    focus: t.focus ? focusLabels(t.focus) : null,
    education: (t.education ?? []).map((e) => ({ degree: e.degree ?? null, institution: institutionLabels(e.institution) })),
    credentials: (t.credentials ?? []).map((c) => ({ label: credentialLabel(c), value: credentialValue(c) })),
  }));
}

const orFallback = (value: Localized, locale: ContentLocale) => value[locale] || value.uz;

export function resolveTeacher(t: TeacherRecord, locale: ContentLocale): PublicTeacher {
  const education = t.education.map((e) => ({ label: degreeLabels(e.degree)[locale], value: orFallback(e.institution, locale) }));
  return {
    slug: t.slug,
    photo: t.photo,
    name: locale === "ru" ? t.nameCyrillic : t.nameLatin,
    experienceYears: t.experienceYears ?? undefined,
    focus: t.focus ? orFallback(t.focus, locale) : undefined,
    category: t.category ? categoryLabels(t.category)[locale] : undefined,
    facts: [
      ...education.map((e) => ({ kind: "education" as const, ...e })),
      ...t.credentials.map((c) => ({ kind: "credential" as const, label: orFallback(c.label, locale), value: c.value })),
    ],
    institutions: education.map((e) => e.value),
  };
}

export const teachersCustomized = () => isCustomized(FLAG);

export function listTeachers(): TeacherRow[] {
  return getDb().prepare("SELECT * FROM teachers ORDER BY position, id").all().map(toRow);
}

export function getTeacherRow(id: number): TeacherRow | null {
  const row = getDb().prepare("SELECT * FROM teachers WHERE id = ?").get(id);
  return row ? toRow(row) : null;
}

export function publicTeachers(locale: ContentLocale): PublicTeacher[] {
  const fallback = () => defaultTeachers().map((t) => resolveTeacher(t, locale));
  if (!adminEnabled()) return fallback();
  try {
    if (!teachersCustomized()) return fallback();
    return listTeachers()
      .filter((t) => t.published)
      .map((t) => resolveTeacher(t, locale));
  } catch (error) {
    console.error("[teachers] could not read entries:", error);
    return fallback();
  }
}

export function startTeachersEditing() {
  if (teachersCustomized()) return;
  const db = getDb();
  const now = Date.now();
  const insert = db.prepare(
    `INSERT INTO teachers (position, published, slug, photo, name_latin, name_cyrillic, experience_years, data, updated_at)
     VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?)`,
  );
  db.exec("BEGIN");
  try {
    defaultTeachers().forEach((t, i) => insert.run(i + 1, t.slug, t.photo, t.nameLatin, t.nameCyrillic, t.experienceYears, dataOf(t), now));
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  markCustomized(FLAG);
}

/** "Dildora Baxtiyarovna" -> "dildora-baxtiyarovna" (anchor and identifier on the public page). */
export function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/['’`ʻʼ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "ustoz"
  );
}

function uniqueSlug(base: string) {
  const db = getDb();
  let slug = base;
  for (let n = 2; db.prepare("SELECT 1 FROM teachers WHERE slug = ?").get(slug); n++) slug = `${base}-${n}`;
  return slug;
}

export function saveTeacher(id: number | null, teacher: Omit<TeacherRecord, "slug">, published: boolean) {
  const db = getDb();
  const now = Date.now();
  if (id === null) {
    const position = Number(db.prepare("SELECT COALESCE(MAX(position), 0) + 1 AS p FROM teachers").get()?.p ?? 1);
    db.prepare(
      `INSERT INTO teachers (position, published, slug, photo, name_latin, name_cyrillic, experience_years, data, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(position, published ? 1 : 0, uniqueSlug(slugify(teacher.nameLatin)), teacher.photo, teacher.nameLatin, teacher.nameCyrillic, teacher.experienceYears, dataOf({ ...teacher, slug: "" }), now);
    return;
  }
  // The slug is not changed on edit: it is the link target (#slug) other pages and search results may point to.
  db.prepare(
    `UPDATE teachers SET published = ?, photo = ?, name_latin = ?, name_cyrillic = ?, experience_years = ?, data = ?, updated_at = ? WHERE id = ?`,
  ).run(published ? 1 : 0, teacher.photo, teacher.nameLatin, teacher.nameCyrillic, teacher.experienceYears, dataOf({ ...teacher, slug: "" }), now, id);
}

export const moveTeacher = (id: number, direction: "up" | "down") => moveRow("teachers", id, direction);

export function setTeacherPublished(id: number, published: boolean) {
  getDb().prepare("UPDATE teachers SET published = ?, updated_at = ? WHERE id = ?").run(published ? 1 : 0, Date.now(), id);
}

export function deleteTeacher(id: number) {
  getDb().prepare("DELETE FROM teachers WHERE id = ?").run(id);
}
