import { getTranslations } from "next-intl/server";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import { testimonialVideos } from "@/lib/testimonials";

// The videos are spoken in Uzbek whatever the page language, so inLanguage stays "uz".
export async function testimonialVideoNodes(locale: string, path = "") {
  const t = await getTranslations({ locale, namespace: "testimonials" });
  const page = absoluteUrl(locale, path);

  return testimonialVideos.map((video) => ({
    "@type": "VideoObject",
    "@id": `${page}#video-${video.id}`,
    name: t(`items.${video.key}.title`),
    description: t(`items.${video.key}.description`),
    thumbnailUrl: `${SITE_URL}${video.thumb}`,
    uploadDate: video.uploadDate,
    embedUrl: `https://www.youtube.com/embed/${video.id}`,
    inLanguage: "uz",
    isPartOf: { "@id": `${page}#webpage` },
    publisher: { "@id": `${SITE_URL}/#school` },
  }));
}
