import type { Metadata, Viewport } from "next";
import { Geist, Manrope, Bodoni_Moda } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL, schoolNode, websiteNode } from "@/lib/seo";
import { Analytics } from "@/components/site/analytics";
import { ApplyModalProvider } from "@/components/site/apply-modal";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { JsonLd } from "@/components/site/json-ld";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#163e32",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = hasLocale(routing.locales, locale) ? await getTranslations({ locale, namespace: "seo" }) : null;

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "education",
    keywords: seo ? (seo.raw("keywords") as string[]) : undefined,
    referrer: "strict-origin-when-cross-origin",
    formatDetection: { telephone: false },
    // Allow full-size previews and long snippets: what search and AI answer engines quote.
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    other: { "geo.region": "UZ-TK", "geo.placename": "Tashkent" },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const meta = await getTranslations({ locale, namespace: "meta" });
  const footer = await getTranslations({ locale, namespace: "footer" });
  const seo = await getTranslations({ locale, namespace: "seo" });

  return (
    <html lang={locale} className={`${geistSans.variable} ${manrope.variable} ${bodoni.variable} antialiased`}>
      <body className="min-h-screen bg-paper font-sans text-ink">
        <JsonLd
          graph={[
            schoolNode(locale, meta("description"), footer("tagline"), {
              founderTitle: seo("founderTitle"),
              knowsAbout: seo.raw("knowsAbout") as string[],
              amenities: seo.raw("amenities") as string[],
            }),
            websiteNode(),
          ]}
        />
        <NextIntlClientProvider>
          <ApplyModalProvider>
            <Header />
            {children}
            <Footer />
          </ApplyModalProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
