// Contact facts as provided by the school. Kept in one place so the address/phone stay identical
// everywhere they appear (site, JSON-LD, Google Business, 2GIS, …) — see docs/sayt-arxitekturasi.md.

export const CONTACT = {
  phones: ["+998781133600", "+998771133600"],
  phonesDisplay: ["+998 78 113 36 00", "+998 77 113 36 00"],
  // Kept in Latin Uzbek across every locale so it matches maps and delivery services exactly.
  address: "Toshkent, Yunusobod tumani, Bog'ishamol ko'chasi, 219-uy",
  addressParts: {
    streetAddress: "Bog'ishamol ko'chasi, 219-uy",
    addressLocality: "Toshkent",
    addressRegion: "Yunusobod tumani",
    addressCountry: "UZ",
  },
  hours: "08:00–18:00",
  telegramUrl: "https://t.me/ixlos_maktabi",
  telegramHandle: "@ixlos_maktabi",
  instagramUrl: "https://www.instagram.com/ixlos_school",
  instagramHandle: "@ixlos_school",
  youtubeUrl: "https://www.youtube.com/@IXLOSMAKTAB",
} as const;
