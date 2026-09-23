// The five Shorts on the school's official YouTube channel. Upload dates come from the channel feed,
// so VideoObject markup never carries invented values. Copy lives in messages/*.json (testimonials.items.<key>).

export const testimonialVideos = [
  { key: "parent", id: "E8blVgcjxBY", thumb: "/testimonials/testimonial-1-parent.jpg", uploadDate: "2026-09-22T14:20:19+00:00" },
  { key: "english", id: "G5IKQRc6CWc", thumb: "/testimonials/testimonial-2-english-results.jpg", uploadDate: "2026-09-22T15:30:28+00:00" },
  { key: "america", id: "-3utIFjs5cY", thumb: "/testimonials/testimonial-3-america-winner.jpg", uploadDate: "2026-09-22T15:26:22+00:00" },
  { key: "ielts", id: "i-N4LjJ31tQ", thumb: "/testimonials/testimonial-4-ielts-8.jpg", uploadDate: "2026-09-22T15:23:39+00:00" },
  { key: "grant", id: "NJJy5QrlaaM", thumb: "/testimonials/testimonial-5-university-grant.jpg", uploadDate: "2026-09-22T15:23:27+00:00" },
] as const;

export type TestimonialKey = (typeof testimonialVideos)[number]["key"];

export const youtubeShortUrl = (id: string) => `https://www.youtube.com/shorts/${id}`;
