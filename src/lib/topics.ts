// Landing pages for the school's tracks (grades 10–11) and free clubs. Texts: messages/*.json -> pages.topics.<key>.
// Only facts the school itself has given are written there; a page is not the place for invented timetables or coaches.

export const topics = {
  it: { path: "/programs/it", kind: "program", art: "/illustrations/club-coding-warm.webp", teacher: "shahobiddin-xusniddinov" },
  finance: { path: "/programs/finance", kind: "program", art: "/illustrations/why-certificates.webp", teacher: "islom-abdunosirov" },
  mentalArithmetic: { path: "/clubs/mental-arithmetic", kind: "club", art: "/illustrations/club-abacus-warm.webp" },
  chess: { path: "/clubs/chess", kind: "club", art: "/illustrations/club-chess-warm.webp" },
  arabic: { path: "/clubs/arabic", kind: "club", art: "/illustrations/club-arabic-warm.webp" },
  robotics: { path: "/clubs/robotics", kind: "club", art: "/illustrations/club-robotics-warm.webp", teacher: "shahobiddin-xusniddinov" },
  speechTherapy: { path: "/clubs/speech-therapy", kind: "club", art: "/illustrations/club-speech-warm.webp" },
  football: { path: "/clubs/football", kind: "club", art: "/illustrations/club-football-warm.webp" },
  judo: { path: "/clubs/judo", kind: "club", art: "/illustrations/club-judo-warm.webp" },
} as const satisfies Record<string, { path: string; kind: "program" | "club"; art: string; teacher?: string }>;

export type TopicKey = keyof typeof topics;

export const topicKeys = Object.keys(topics) as TopicKey[];
export const programKeys = topicKeys.filter((key) => topics[key].kind === "program");
export const clubKeys = topicKeys.filter((key) => topics[key].kind === "club");

export const CLUBS_PATH = "/clubs";

// The eight clubs in the order the school lists them (home page and /clubs); the IT club is covered by the IT track page.
export const clubOrder: TopicKey[] = ["mentalArithmetic", "chess", "arabic", "robotics", "it", "speechTherapy", "football", "judo"];
