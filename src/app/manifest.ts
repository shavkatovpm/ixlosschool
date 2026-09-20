import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: "Ixlos School — 1–11-sinf uchun aniq fanlarga ixtisoslashgan xususiy maktab.",
    lang: routing.defaultLocale,
    start_url: `/${routing.defaultLocale}`,
    scope: "/",
    display: "standalone",
    background_color: "#f4f3e9",
    theme_color: "#175c2b",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
