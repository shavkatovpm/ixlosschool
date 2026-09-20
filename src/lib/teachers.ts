// Teacher data as provided by the school.
// Only facts the school gave us are stored here; nothing is inferred.
// Text that differs per language (institution names, labels) lives in messages/*.json.

export type InstitutionKey =
  | "umft"
  | "jahonTillari"
  | "nizomiyTdpu"
  | "oriental"
  | "urdu"
  | "aifu"
  | "profi"
  | "tdpu"
  | "buxdpi"
  | "ozmu"
  | "isft";

export type Degree = "bachelor" | "master" | "bachelorMaster";
export type CredentialKey = "roboUz" | "c1" | "nationalHistory" | "accaPapers";

export type Teacher = {
  slug: string;
  /** Cropped portrait in /public (4:5, face-aligned). */
  photo: string;
  /** Latin spelling (Uzbek and English pages), "First Last". */
  name: string;
  /** Cyrillic spelling for the Russian pages. */
  nameRu: string;
  focus?: "robotics" | "acca";
  experienceYears?: number;
  category?: "first" | "highest";
  education?: { degree?: Degree; institution: InstitutionKey }[];
  credentials?: CredentialKey[];
};

const photo = (slug: string) => `/teachers/site/${slug}.jpg`;

// Ordered by years of experience (most first); teachers without details come last.
export const teachers: Teacher[] = [
  {
    slug: "dildora-baxtiyarovna",
    photo: photo("dildora-baxtiyarovna"),
    name: "Dildora Baxtiyarovna",
    nameRu: "Дилдора Бахтияровна",
    experienceYears: 30,
    education: [{ degree: "bachelor", institution: "profi" }],
  },
  {
    slug: "yulduz-shamsiyeva",
    photo: photo("yulduz-shamsiyeva"),
    name: "Yulduz Shamsiyeva",
    nameRu: "Юлдуз Шамсиева",
    experienceYears: 28,
    category: "first",
    education: [{ degree: "bachelor", institution: "tdpu" }],
  },
  {
    slug: "dilmurod-taylakov",
    photo: photo("dilmurod-taylakov"),
    name: "Dilmurod Taylakov",
    nameRu: "Дилмурод Тайлаков",
    experienceYears: 25,
    category: "highest",
    education: [{ degree: "bachelorMaster", institution: "ozmu" }],
  },
  {
    slug: "manzura-urazaliyeva",
    photo: photo("manzura-urazaliyeva"),
    name: "Manzura Urazaliyeva",
    nameRu: "Манзура Уразалиева",
    experienceYears: 20,
    category: "first",
    education: [
      { degree: "bachelor", institution: "urdu" },
      { degree: "master", institution: "aifu" },
    ],
    credentials: ["nationalHistory"],
  },
  {
    slug: "nigora-kamilova",
    photo: photo("nigora-kamilova"),
    name: "Nigora Kamilova",
    nameRu: "Нигора Камилова",
    experienceYears: 15,
    education: [{ degree: "bachelor", institution: "jahonTillari" }],
    credentials: ["c1"],
  },
  {
    slug: "zulfiya-hakimova",
    photo: photo("zulfiya-hakimova"),
    name: "Zulfiya Hakimova",
    nameRu: "Зульфия Хакимова",
    experienceYears: 12,
    education: [{ degree: "bachelor", institution: "buxdpi" }],
  },
  {
    slug: "shahobiddin-xusniddinov",
    photo: photo("shahobiddin-xusniddinov"),
    name: "Shahobiddin Xusniddinov",
    nameRu: "Шахобиддин Хусниддинов",
    focus: "robotics",
    experienceYears: 8,
    education: [{ degree: "bachelor", institution: "umft" }],
    credentials: ["roboUz"],
  },
  {
    slug: "mukarram-rahmatillayeva",
    photo: photo("mukarram-rahmatillayeva"),
    name: "Mukarram Rahmatillayeva",
    nameRu: "Мукаррам Рахматиллаева",
    experienceYears: 5,
    education: [
      { degree: "bachelor", institution: "nizomiyTdpu" },
      { degree: "master", institution: "oriental" },
    ],
  },
  {
    slug: "islom-abdunosirov",
    photo: photo("islom-abdunosirov"),
    name: "Islom Abdunosirov",
    nameRu: "Ислом Абдуносиров",
    focus: "acca",
    experienceYears: 5,
    education: [{ institution: "isft" }],
    credentials: ["accaPapers"],
  },
  {
    slug: "feruza-babayeva",
    photo: photo("feruza-babayeva"),
    name: "Feruza Babayeva",
    nameRu: "Феруза Бабаева",
    education: [{ institution: "tdpu" }],
  },
  {
    slug: "dilshoda-butayeva",
    photo: photo("dilshoda-butayeva"),
    name: "Dilshoda Butayeva",
    nameRu: "Дилшода Бутаева",
  },
];

export function teacherName(teacher: Teacher, locale: string) {
  return locale === "ru" ? teacher.nameRu : teacher.name;
}
