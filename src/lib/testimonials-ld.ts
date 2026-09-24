import { SITE_URL, absoluteUrl } from "@/lib/seo";
import { publicTestimonials } from "@/lib/content/testimonials";
import type { ContentLocale } from "@/lib/content/shared";

// The videos are spoken in Uzbek whatever the page language, so inLanguage stays "uz".
export async function testimonialVideoNodes(locale: string, path = "") {
  const page = absoluteUrl(locale, path);

  return publicTestimonials(locale as ContentLocale).map((video) => ({
    "@type": "VideoObject",
    "@id": `${page}#video-${video.id}`,
    name: video.title,
    description: video.description,
    thumbnailUrl: `${SITE_URL}${video.thumb}`,
    uploadDate: video.uploadDate,
    embedUrl: `https://www.youtube.com/embed/${video.id}`,
    inLanguage: "uz",
    isPartOf: { "@id": `${page}#webpage` },
    publisher: { "@id": `${SITE_URL}/#school` },
  }));
}
