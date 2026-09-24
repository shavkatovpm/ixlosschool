import { adminEnabled } from "../admin/config";
import { getDb, type Row } from "../admin/db";
import { defaultFaq } from "./defaults";
import { moveRow } from "./order";
import { isCustomized, markCustomized, type ContentLocale, type Localized } from "./shared";

export type FaqRow = {
  id: number;
  position: number;
  published: boolean;
  question: Localized;
  answer: Localized;
  updatedAt: number;
};

export type FaqInput = { question: Localized; answer: Localized; published: boolean };

const FLAG = "faq";

const toRow = (r: Row): FaqRow => ({
  id: Number(r.id),
  position: Number(r.position),
  published: Number(r.published) === 1,
  question: { uz: String(r.q_uz), ru: String(r.q_ru), en: String(r.q_en) },
  answer: { uz: String(r.a_uz), ru: String(r.a_ru), en: String(r.a_en) },
  updatedAt: Number(r.updated_at),
});

export const faqCustomized = () => isCustomized(FLAG);

export function listFaq(): FaqRow[] {
  return getDb().prepare("SELECT * FROM faq ORDER BY position, id").all().map(toRow);
}

export function getFaqRow(id: number): FaqRow | null {
  const row = getDb().prepare("SELECT * FROM faq WHERE id = ?").get(id);
  return row ? toRow(row) : null;
}

/** What the public site shows: the edited entries (published ones) or, before any editing, the built-in ones. */
export function publicFaq(locale: ContentLocale): { question: string; answer: string }[] {
  const fallback = () => defaultFaq().map((item) => ({ question: item.question[locale], answer: item.answer[locale] }));
  if (!adminEnabled()) return fallback();
  try {
    if (!faqCustomized()) return fallback();
    return listFaq()
      .filter((row) => row.published)
      .map((row) => ({ question: row.question[locale], answer: row.answer[locale] }));
  } catch (error) {
    console.error("[faq] could not read entries:", error);
    return fallback();
  }
}

/** Copies the built-in entries into the database so they can be edited. */
export function startFaqEditing() {
  if (faqCustomized()) return;
  const db = getDb();
  const insert = db.prepare(
    `INSERT INTO faq (position, published, q_uz, a_uz, q_ru, a_ru, q_en, a_en, updated_at) VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const now = Date.now();
  db.exec("BEGIN");
  try {
    defaultFaq().forEach((item, i) =>
      insert.run(i + 1, item.question.uz, item.answer.uz, item.question.ru, item.answer.ru, item.question.en, item.answer.en, now),
    );
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  markCustomized(FLAG);
}

export function saveFaq(id: number | null, input: FaqInput) {
  const db = getDb();
  const now = Date.now();
  const q = input.question;
  const a = input.answer;
  if (id === null) {
    const position = Number(db.prepare("SELECT COALESCE(MAX(position), 0) + 1 AS p FROM faq").get()?.p ?? 1);
    db.prepare(
      `INSERT INTO faq (position, published, q_uz, a_uz, q_ru, a_ru, q_en, a_en, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(position, input.published ? 1 : 0, q.uz, a.uz, q.ru, a.ru, q.en, a.en, now);
    return;
  }
  db.prepare(
    `UPDATE faq SET published = ?, q_uz = ?, a_uz = ?, q_ru = ?, a_ru = ?, q_en = ?, a_en = ?, updated_at = ? WHERE id = ?`,
  ).run(input.published ? 1 : 0, q.uz, a.uz, q.ru, a.ru, q.en, a.en, now, id);
}

export const moveFaq = (id: number, direction: "up" | "down") => moveRow("faq", id, direction);

export function setFaqPublished(id: number, published: boolean) {
  getDb().prepare("UPDATE faq SET published = ?, updated_at = ? WHERE id = ?").run(published ? 1 : 0, Date.now(), id);
}

export function deleteFaq(id: number) {
  getDb().prepare("DELETE FROM faq WHERE id = ?").run(id);
}
