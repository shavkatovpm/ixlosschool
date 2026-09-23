import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { CONTACT } from "@/lib/contact";

export const SITE_URL = "https://www.ixlosschool.uz";
export const SITE_NAME = "Ixlos School";
const FOUNDER_NAME = "Maxsuma Axrarovna Ashirmetova";

const OG_LOCALE: Record<string, string> = { uz: "uz_UZ", ru: "ru_RU", en: "en_US" };

export function languageAlternates(path = "") {
  return {
    ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`])),
    "x-default": `/${routing.defaultLocale}${path}`,
  };
}

export function absoluteUrl(locale: string, path = "") {
  return `${SITE_URL}/${locale}${path}`;
}

export function buildMetadata({
  locale,
  path = "",
  title,
  description,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
}): Metadata {
  const image = `/og/og-${locale}.png`;
  return {
    title,
    description,
    alternates: { canonical: `/${locale}${path}`, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: `/${locale}${path}`,
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export type SchoolExtras = { founderTitle: string; knowsAbout: string[]; amenities: string[] };

export function schoolNode(locale: string, description: string, slogan: string, extras: SchoolExtras) {
  return {
    "@type": "School",
    "@id": `${SITE_URL}/#school`,
    name: SITE_NAME,
    url: absoluteUrl(locale),
    logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/ixlos-school-original.png`, width: 3601, height: 3601 },
    image: `${SITE_URL}/og/og-${locale}.png`,
    description,
    slogan,
    telephone: CONTACT.phones[0],
    address: { "@type": "PostalAddress", ...CONTACT.addressParts },
    contactPoint: CONTACT.phones.map((telephone) => ({ "@type": "ContactPoint", telephone, contactType: "admissions" })),
    founder: { "@type": "Person", name: FOUNDER_NAME, jobTitle: extras.founderTitle },
    knowsAbout: extras.knowsAbout,
    amenityFeature: extras.amenities.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    sameAs: [CONTACT.telegramUrl, CONTACT.instagramUrl, CONTACT.youtubeUrl],
  };
}

// Programme facts only (no prices or offers): each Course restates what the school itself publishes.
export function courseNodes(locale: string, courses: { name: string; description: string }[]) {
  return courses.map((course, i) => ({
    "@type": "Course",
    "@id": `${absoluteUrl(locale)}#course-${i + 1}`,
    name: course.name,
    description: course.description,
    provider: { "@id": `${SITE_URL}/#school` },
  }));
}

export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: routing.locales,
    publisher: { "@id": `${SITE_URL}/#school` },
  };
}

export function webPageNode({
  locale,
  path = "",
  type = "WebPage",
  name,
  description,
  breadcrumb,
}: {
  locale: string;
  path?: string;
  type?: "WebPage" | "ContactPage" | "AboutPage";
  name: string;
  description: string;
  breadcrumb?: { name: string; path: string }[];
}) {
  const url = absoluteUrl(locale, path);
  return [
    {
      "@type": type,
      "@id": `${url}#webpage`,
      url,
      name,
      description,
      inLanguage: locale,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#school` },
      ...(breadcrumb ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
    },
    ...(breadcrumb
      ? [
          {
            "@type": "BreadcrumbList",
            "@id": `${url}#breadcrumb`,
            itemListElement: breadcrumb.map((b, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: b.name,
              item: absoluteUrl(locale, b.path),
            })),
          },
        ]
      : []),
  ];
}
