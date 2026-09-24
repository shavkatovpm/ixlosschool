import { adminEnabled } from "../admin/config";
import { getDb, type Row } from "../admin/db";
import { testimonialVideos } from "../testimonials";
import { defaultTestimonialText } from "./defaults";
import { isCustomized, markCustomized, type ContentLocale, type Localized } from "./shared";
import { moveRow } from "./order";

export type TestimonialRow = {
  id: number;
  position: number;
  published: boolean;
  youtubeId: string;
  thumb: string;
  uploadDate: string;
  chip: Localized;
  title: Localized;
  description: Localized;
};

/** A video as the public pages use it, texts already in the page language. */
export type PublicTestimonial = {
  id: string;
  thumb: string;
  uploadDate: string;
  chip: string;
  title: string;
  description: string;
};

export type TestimonialInput = Omit<TestimonialRow, "id" | "position">;

const FLAG = "testimonials";

const toRow = (r: Row): TestimonialRow => ({
  id: Number(r.id),
  position: Number(r.position),
  published: Number(r.published) === 1,
  youtubeId: String(r.youtube_id),
  thumb: String(r.thumb),
  uploadDate: String(r.upload_date),
  chip: { uz: String(r.chip_uz), ru: String(r.chip_ru), en: String(r.chip_en) },
  title: { uz: String(r.title_uz), ru: String(r.title_ru), en: String(r.title_en) },
  description: { uz: String(r.desc_uz), ru: String(r.desc_ru), en: String(r.desc_en) },
});

export const testimonialsCustomized = () => isCustomized(FLAG);

export function listTestimonials(): TestimonialRow[] {
  return getDb().prepare("SELECT * FROM testimonials ORDER BY position, id").all().map(toRow);
}

export function getTestimonialRow(id: number): TestimonialRow | null {
  const row = getDb().prepare("SELECT * FROM testimonials WHERE id = ?").get(id);
  return row ? toRow(row) : null;
}

export function youtubeIdTaken(youtubeId: string, exceptId: number | null) {
  const row = getDb().prepare("SELECT id FROM testimonials WHERE youtube_id = ?").get(youtubeId);
  return row !== undefined && Number(row.id) !== exceptId;
}

const inLocale = (t: TestimonialRow, locale: ContentLocale): PublicTestimonial => ({
  id: t.youtubeId,
  thumb: t.thumb,
  uploadDate: t.uploadDate,
  chip: t.chip[locale],
  title: t.title[locale],
  description: t.description[locale],
});

/** The five videos that shipped with the site (see lib/testimonials.ts and messages/*.json). */
export function defaultTestimonials(): Omit<TestimonialRow, "id" | "position" | "published">[] {
  return testimonialVideos.map((video) => {
    const text = defaultTestimonialText(video.key);
    return { youtubeId: video.id, thumb: video.thumb, uploadDate: video.uploadDate, ...text };
  });
}

export function publicTestimonials(locale: ContentLocale): PublicTestimonial[] {
  const fallback = () => defaultTestimonials().map((t) => inLocale({ ...t, id: 0, position: 0, published: true }, locale));
  if (!adminEnabled()) return fallback();
  try {
    if (!testimonialsCustomized()) return fallback();
    return listTestimonials()
      .filter((t) => t.published)
      .map((t) => inLocale(t, locale));
  } catch (error) {
    console.error("[testimonials] could not read entries:", error);
    return fallback();
  }
}

export function startTestimonialsEditing() {
  if (testimonialsCustomized()) return;
  const db = getDb();
  const now = Date.now();
  const insert = db.prepare(
    `INSERT INTO testimonials (position, published, youtube_id, thumb, upload_date,
       chip_uz, title_uz, desc_uz, chip_ru, title_ru, desc_ru, chip_en, title_en, desc_en, updated_at)
     VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  db.exec("BEGIN");
  try {
    defaultTestimonials().forEach((t, i) =>
      insert.run(i + 1, t.youtubeId, t.thumb, t.uploadDate, t.chip.uz, t.title.uz, t.description.uz, t.chip.ru, t.title.ru, t.description.ru, t.chip.en, t.title.en, t.description.en, now),
    );
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  markCustomized(FLAG);
}

export function saveTestimonial(id: number | null, input: TestimonialInput) {
  const db = getDb();
  const now = Date.now();
  const { chip, title, description } = input;
  if (id === null) {
    const position = Number(db.prepare("SELECT COALESCE(MAX(position), 0) + 1 AS p FROM testimonials").get()?.p ?? 1);
    db.prepare(
      `INSERT INTO testimonials (position, published, youtube_id, thumb, upload_date,
         chip_uz, title_uz, desc_uz, chip_ru, title_ru, desc_ru, chip_en, title_en, desc_en, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(position, input.published ? 1 : 0, input.youtubeId, input.thumb, input.uploadDate, chip.uz, title.uz, description.uz, chip.ru, title.ru, description.ru, chip.en, title.en, description.en, now);
    return;
  }
  db.prepare(
    `UPDATE testimonials SET published = ?, youtube_id = ?, thumb = ?, upload_date = ?,
       chip_uz = ?, title_uz = ?, desc_uz = ?, chip_ru = ?, title_ru = ?, desc_ru = ?, chip_en = ?, title_en = ?, desc_en = ?, updated_at = ?
     WHERE id = ?`,
  ).run(input.published ? 1 : 0, input.youtubeId, input.thumb, input.uploadDate, chip.uz, title.uz, description.uz, chip.ru, title.ru, description.ru, chip.en, title.en, description.en, now, id);
}

export const moveTestimonial = (id: number, direction: "up" | "down") => moveRow("testimonials", id, direction);

export function setTestimonialPublished(id: number, published: boolean) {
  getDb().prepare("UPDATE testimonials SET published = ?, updated_at = ? WHERE id = ?").run(published ? 1 : 0, Date.now(), id);
}

export function deleteTestimonial(id: number) {
  getDb().prepare("DELETE FROM testimonials WHERE id = ?").run(id);
}
