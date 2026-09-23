import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL, languageAlternates } from "@/lib/seo";

const pages = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/admissions", changeFrequency: "monthly", priority: 0.9 },
  { path: "/teachers", changeFrequency: "monthly", priority: 0.8 },
  { path: "/results", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return pages.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${page.path}`,
      lastModified,
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
