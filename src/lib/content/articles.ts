import { adminEnabled } from "../admin/config";
import { getDb, type Row } from "../admin/db";
import type { ContentLocale, Localized } from "./shared";

export type ArticleStatus = "draft" | "published";

export type ArticleRow = {
  id: number;
  slug: string;
  status: ArticleStatus;
  cover: string;
  title: Localized;
  description: Localized;
  body: Localized;
  createdAt: number;
  updatedAt: number;
  publishedAt: number | null;
};

/** An article as the public pages use it, texts already in the page language. */
export type PublicArticle = {
  slug: string;
  title: string;
  description: string;
  body: string;
  cover: string;
  publishedAt: number;
  updatedAt: number;
  readMinutes: number;
};

const toRow = (r: Row): ArticleRow => ({
  id: Number(r.id),
  slug: String(r.slug),
  status: r.status === "published" ? "published" : "draft",
  cover: String(r.cover),
  title: { uz: String(r.title_uz), ru: String(r.title_ru), en: String(r.title_en) },
  description: { uz: String(r.desc_uz), ru: String(r.desc_ru), en: String(r.desc_en) },
  body: { uz: String(r.body_uz), ru: String(r.body_ru), en: String(r.body_en) },
  createdAt: Number(r.created_at),
  updatedAt: Number(r.updated_at),
  publishedAt: r.published_at == null ? null : Number(r.published_at),
});

export const readMinutes = (text: string) => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));

const toPublic = (row: ArticleRow, locale: ContentLocale): PublicArticle => ({
  slug: row.slug,
  title: row.title[locale],
  description: row.description[locale],
  body: row.body[locale],
  cover: row.cover,
  publishedAt: row.publishedAt ?? row.createdAt,
  updatedAt: row.updatedAt,
  readMinutes: readMinutes(row.body[locale]),
});

export function listArticles(): ArticleRow[] {
  return getDb().prepare("SELECT * FROM articles ORDER BY COALESCE(published_at, created_at) DESC, id DESC").all().map(toRow);
}

export function getArticleRow(id: number): ArticleRow | null {
  const row = getDb().prepare("SELECT * FROM articles WHERE id = ?").get(id);
  return row ? toRow(row) : null;
}

export function slugTaken(slug: string, exceptId: number | null) {
  const row = getDb().prepare("SELECT id FROM articles WHERE slug = ?").get(slug);
  return row !== undefined && Number(row.id) !== exceptId;
}

// ---- public reads: never throw, the site must not depend on the blog ----------------------------

export function publishedArticles(locale: ContentLocale): PublicArticle[] {
  if (!adminEnabled()) return [];
  try {
    return getDb()
      .prepare("SELECT * FROM articles WHERE status = 'published' ORDER BY published_at DESC, id DESC")
      .all()
      .map((r) => toPublic(toRow(r), locale));
  } catch (error) {
    console.error("[articles] could not read the list:", error);
    return [];
  }
}

export function publishedArticle(slug: string, locale: ContentLocale): PublicArticle | null {
  if (!adminEnabled()) return null;
  try {
    const row = getDb().prepare("SELECT * FROM articles WHERE slug = ? AND status = 'published'").get(slug);
    return row ? toPublic(toRow(row), locale) : null;
  } catch (error) {
    console.error("[articles] could not read the article:", error);
    return null;
  }
}

/** For the sitemap: every published article with its last change. */
export function publishedSlugs(): { slug: string; updatedAt: number }[] {
  if (!adminEnabled()) return [];
  try {
    return getDb()
      .prepare("SELECT slug, updated_at FROM articles WHERE status = 'published' ORDER BY published_at DESC")
      .all()
      .map((r) => ({ slug: String(r.slug), updatedAt: Number(r.updated_at) }));
  } catch {
    return [];
  }
}

export const hasPublishedArticles = () => publishedSlugs().length > 0;

// ---- writes ---------------------------------------------------------------------------------------

export type ArticleInput = {
  slug: string;
  cover: string;
  title: Localized;
  description: Localized;
  body: Localized;
  status: ArticleStatus;
};

export function saveArticle(id: number | null, input: ArticleInput): number {
  const db = getDb();
  const now = Date.now();
  const { title: t, description: d, body: b } = input;
  if (id === null) {
    const result = db
      .prepare(
        `INSERT INTO articles (slug, status, cover, title_uz, desc_uz, body_uz, title_ru, desc_ru, body_ru, title_en, desc_en, body_en, created_at, updated_at, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(input.slug, input.status, input.cover, t.uz, d.uz, b.uz, t.ru, d.ru, b.ru, t.en, d.en, b.en, now, now, input.status === "published" ? now : null);
    return Number(result.lastInsertRowid);
  }
  // published_at is set the first time an article goes live and kept afterwards, so the date shown does not jump.
  db.prepare(
    `UPDATE articles SET slug = ?, status = ?, cover = ?, title_uz = ?, desc_uz = ?, body_uz = ?, title_ru = ?, desc_ru = ?, body_ru = ?,
       title_en = ?, desc_en = ?, body_en = ?, updated_at = ?,
       published_at = CASE WHEN ? = 'published' AND published_at IS NULL THEN ? ELSE published_at END
     WHERE id = ?`,
  ).run(input.slug, input.status, input.cover, t.uz, d.uz, b.uz, t.ru, d.ru, b.ru, t.en, d.en, b.en, now, input.status, now, id);
  return id;
}

export function setArticleStatus(id: number, status: ArticleStatus) {
  const now = Date.now();
  getDb()
    .prepare(
      `UPDATE articles SET status = ?, updated_at = ?,
         published_at = CASE WHEN ? = 'published' AND published_at IS NULL THEN ? ELSE published_at END WHERE id = ?`,
    )
    .run(status, now, status, now, id);
}

export function deleteArticle(id: number) {
  getDb().prepare("DELETE FROM articles WHERE id = ?").run(id);
}
