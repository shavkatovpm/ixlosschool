// Student result images as provided by the school (source: 23.09/natijalar). Every fact shown here —
// name, score — is baked into the image itself (the school's own certificate/story graphics); this
// file only orders them and groups them for the gallery. Nothing here is invented.

export type ResultCategory = "featured" | "ielts" | "olympiad" | "sat" | "cefr";

export type Result = {
  slug: string;
  file: string;
  category: ResultCategory;
  /** Portrait ratio close to the source photo (used for the homepage/large tiles only). */
  ratio?: "portrait" | "square";
};

const photo = (slug: string) => `/results/${slug}.jpg`;

// The 4 photos that show the student together with their certificate — these are the ones featured
// on the homepage. Every other image is a certificate/screenshot on its own.
export const featuredResults: Result[] = [
  { slug: "featured-1-kenjayev-abdulaziz", file: photo("featured-1-kenjayev-abdulaziz"), category: "featured", ratio: "portrait" },
  { slug: "featured-2-tolipov-otabek", file: photo("featured-2-tolipov-otabek"), category: "featured", ratio: "portrait" },
  { slug: "featured-3-ashirmetova-nilufar", file: photo("featured-3-ashirmetova-nilufar"), category: "featured", ratio: "portrait" },
  { slug: "featured-4-avazov-muhammadiyor", file: photo("featured-4-avazov-muhammadiyor"), category: "featured", ratio: "portrait" },
];

export const ieltsResults: Result[] = [
  "ielts-1-kenjayev-abdulaziz",
  "ielts-2-shakirova-mubina",
  "ielts-3-akbaraliyeva-moxinur",
  "ielts-4-vosiqxonova-ominaxon",
  "ielts-5-abdugofurov-muhammad",
  "ielts-6-ashirmetova-nilufar",
].map((slug) => ({ slug, file: photo(slug), category: "ielts" as const }));

export const olympiadResults: Result[] = [
  "olympiad-1-akbaraliyev-sardor",
  "olympiad-2-tolqinova-dilnuraxon",
  "olympiad-3-nasirova-moxlaroyim",
  "olympiad-4-hamidov-ahmadxon",
  "olympiad-5-avazov-muhammadyusuf",
  "olympiad-6-abdulazizova-ezozaxon",
  "olympiad-7-rizayev-xadulla",
  "olympiad-8-jorayev-islomjon",
].map((slug) => ({ slug, file: photo(slug), category: "olympiad" as const }));

export const satResults: Result[] = ["sat-1", "sat-2-mirsobitov-kozimjon", "sat-3-tuxtayeva-farzona"].map((slug) => ({
  slug,
  file: photo(slug),
  category: "sat" as const,
}));

export const cefrResults: Result[] = [{ slug: "cefr-1-sheraliyev-sardor", file: photo("cefr-1-sheraliyev-sardor"), category: "cefr" }];

export const resultGroups: { category: ResultCategory; items: Result[] }[] = [
  { category: "featured", items: featuredResults },
  { category: "ielts", items: ieltsResults },
  { category: "olympiad", items: olympiadResults },
  { category: "sat", items: satResults },
  { category: "cefr", items: cefrResults },
];

export const allResults: Result[] = resultGroups.flatMap((g) => g.items);
