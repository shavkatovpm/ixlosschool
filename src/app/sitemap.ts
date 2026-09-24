import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { publishedSlugs } from "@/lib/content/articles";
import { SITE_URL, languageAlternates } from "@/lib/seo";

// Articles come from the admin panel, so the sitemap is built per request.
export const dynamic = "force-dynamic";

const pages = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/admissions", changeFrequency: "monthly", priority: 0.9 },
  { path: "/teachers", changeFrequency: "monthly", priority: 0.8 },
  { path: "/results", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
] as const;

type Entry = { path: string; changeFrequency: "weekly" | "monthly"; priority: number; lastModified: Date };

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const articles = publishedSlugs();
  const entries: Entry[] = [
    ...pages.map((page) => ({ ...page, lastModified: now })),
    ...(articles.length
      ? [
          { path: "/blog", changeFrequency: "weekly" as const, priority: 0.7, lastModified: new Date(Math.max(...articles.map((a) => a.updatedAt))) },
          ...articles.map((a) => ({ path: `/blog/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.6, lastModified: new Date(a.updatedAt) })),
        ]
      : []),
  ];

  return entries.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${page.path}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: locale === routing.defaultLocale ? page.priority : Math.max(page.priority - 0.1, 0.1),
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(page.path)).map(([lang, href]) => [lang, `${SITE_URL}${href}`]),
        ),
      },
    })),
  );
}
