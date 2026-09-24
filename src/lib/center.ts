import { CONTACT, LEGAL } from "./contact";
import { readSetting } from "./settings";

// The school's contact and legal details. The values in contact.ts are the defaults; whatever the owner saves in
// the admin panel ("Markaz ma'lumotlari") replaces them everywhere on the site (pages, footer, JSON-LD, llms.txt).

export type CenterInput = {
  phones: string[];
  city: string;
  district: string;
  street: string;
  opens: string;
  closes: string;
  telegramUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  orgName: string;
  taxId: string;
  licenseNumber: string;
  licenseDate: string;
};

export type Contact = {
  phones: string[];
  phonesDisplay: string[];
  address: string;
  addressParts: { streetAddress: string; addressLocality: string; addressRegion: string; addressCountry: string };
  hours: string;
  telegramUrl: string;
  telegramHandle: string;
  instagramUrl: string;
  instagramHandle: string;
  youtubeUrl: string;
};

export type Legal = {
  orgName: string;
  legalName: string;
  taxId: string;
  taxIdDisplay: string;
  licenseNumber: string;
  licenseDate: string;
  licenseDateDisplay: string;
};

const [DEFAULT_OPENS, DEFAULT_CLOSES] = CONTACT.hours.split("–");

export const DEFAULT_CENTER: CenterInput = {
  phones: [...CONTACT.phones],
  city: CONTACT.addressParts.addressLocality,
  district: CONTACT.addressParts.addressRegion,
  street: CONTACT.addressParts.streetAddress,
  opens: DEFAULT_OPENS,
  closes: DEFAULT_CLOSES,
  telegramUrl: CONTACT.telegramUrl,
  instagramUrl: CONTACT.instagramUrl,
  youtubeUrl: CONTACT.youtubeUrl,
  orgName: LEGAL.orgName,
  taxId: LEGAL.taxId,
  licenseNumber: LEGAL.licenseNumber,
  licenseDate: LEGAL.licenseDate,
};

/** "+998781133600" -> "+998 78 113 36 00" */
export const formatPhone = (phone: string) => phone.replace(/^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/, "+998 $1 $2 $3 $4");

/** "310060070" -> "310 060 070" */
export const formatTaxId = (taxId: string) => taxId.replace(/^(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3");

/** "2026-07-08" -> "08.07.2026" */
export const formatLicenseDate = (day: string) => day.split("-").reverse().join(".");

/** "https://t.me/ixlos_maktabi" -> "@ixlos_maktabi" */
export function handleFromUrl(url: string) {
  try {
    const segment = new URL(url).pathname.split("/").filter(Boolean)[0] ?? "";
    return segment ? `@${segment.replace(/^@/, "")}` : "";
  } catch {
    return "";
  }
}

export function resolveContact(input: CenterInput): Contact {
  return {
    phones: input.phones,
    phonesDisplay: input.phones.map(formatPhone),
    address: [input.city, input.district, input.street].filter(Boolean).join(", "),
    addressParts: {
      streetAddress: input.street,
      addressLocality: input.city,
      addressRegion: input.district,
      addressCountry: "UZ",
    },
    hours: `${input.opens}–${input.closes}`,
    telegramUrl: input.telegramUrl,
    telegramHandle: handleFromUrl(input.telegramUrl),
    instagramUrl: input.instagramUrl,
    instagramHandle: handleFromUrl(input.instagramUrl),
    youtubeUrl: input.youtubeUrl,
  };
}

export function resolveLegal(input: CenterInput): Legal {
  return {
    orgName: input.orgName,
    legalName: `"${input.orgName}" nodavlat ta'lim muassasasi`,
    taxId: input.taxId,
    taxIdDisplay: formatTaxId(input.taxId),
    licenseNumber: input.licenseNumber,
    licenseDate: input.licenseDate,
    licenseDateDisplay: formatLicenseDate(input.licenseDate),
  };
}

export const CENTER_KEY = "center";

/** The saved details, with any missing field filled from the defaults. */
export function getCenterInput(): CenterInput {
  const saved = readSetting<Partial<CenterInput>>(CENTER_KEY);
  return saved ? { ...DEFAULT_CENTER, ...saved } : DEFAULT_CENTER;
}

export const getContact = () => resolveContact(getCenterInput());
export const getLegal = () => resolveLegal(getCenterInput());
