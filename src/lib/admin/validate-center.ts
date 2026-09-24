import type { CenterInput } from "../center";

const HOSTS = {
  telegramUrl: ["t.me", "telegram.me"],
  instagramUrl: ["instagram.com", "www.instagram.com"],
  youtubeUrl: ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"],
} as const;

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 9) return `+998${digits}`;
  if (digits.length === 12 && digits.startsWith("998")) return `+${digits}`;
  return null;
}

function socialUrl(raw: string, hosts: readonly string[]): string | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:" || !hosts.includes(url.hostname.toLowerCase())) return null;
    if (url.pathname.split("/").filter(Boolean).length === 0) return null;
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

/** Validates the "Markaz ma'lumotlari" form. Returns the cleaned value or a message per field. */
export function parseCenterForm(values: Record<string, string>): { value?: CenterInput; errors?: Record<string, string> } {
  const errors: Record<string, string> = {};
  const text = (key: string, label: string, max: number) => {
    const value = (values[key] ?? "").trim().replace(/\s+/g, " ");
    if (!value) errors[key] = `${label} kiritilishi shart.`;
    else if (value.length > max) errors[key] = `${label} ${max} belgidan oshmasin.`;
    return value;
  };

  const phones: string[] = [];
  for (const key of ["phone1", "phone2", "phone3"]) {
    const raw = (values[key] ?? "").trim();
    if (!raw) continue;
    const phone = normalizePhone(raw);
    if (!phone) errors[key] = "Raqam +998 bilan boshlanib, jami 12 ta raqamdan iborat bo'lsin (masalan +998 78 113 36 00).";
    else if (!phones.includes(phone)) phones.push(phone);
  }
  if (phones.length === 0 && !errors.phone1) errors.phone1 = "Kamida bitta telefon raqam kerak.";

  const city = text("city", "Shahar", 60);
  const district = text("district", "Tuman", 60);
  const street = text("street", "Ko'cha va uy", 120);

  const opens = (values.opens ?? "").trim();
  const closes = (values.closes ?? "").trim();
  if (!TIME.test(opens)) errors.opens = "Vaqt SS:DD ko'rinishida bo'lsin (masalan 08:00).";
  if (!TIME.test(closes)) errors.closes = "Vaqt SS:DD ko'rinishida bo'lsin (masalan 18:00).";
  if (!errors.opens && !errors.closes && opens >= closes) errors.closes = "Yopilish vaqti ochilish vaqtidan keyin bo'lishi kerak.";

  const links: Partial<Record<keyof typeof HOSTS, string>> = {};
  const labels = { telegramUrl: "Telegram", instagramUrl: "Instagram", youtubeUrl: "YouTube" } as const;
  for (const key of Object.keys(HOSTS) as (keyof typeof HOSTS)[]) {
    const url = socialUrl(values[key] ?? "", HOSTS[key]);
    if (!url) errors[key] = `${labels[key]} havolasi https:// bilan boshlanib, ${HOSTS[key][0]} manziliga ishora qilsin (kanal/akkaunt nomi bilan).`;
    else links[key] = url;
  }

  const orgName = text("orgName", "Tashkilot nomi", 120);
  const taxId = (values.taxId ?? "").replace(/\s+/g, "");
  if (!/^\d{9}$/.test(taxId)) errors.taxId = "STIR 9 ta raqamdan iborat bo'lsin.";
  const licenseNumber = (values.licenseNumber ?? "").trim();
  if (!/^[\w\-/ ]{3,30}$/u.test(licenseNumber)) errors.licenseNumber = "Litsenziya raqami 3–30 belgi bo'lsin.";
  const licenseDate = (values.licenseDate ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(licenseDate) || Number.isNaN(Date.parse(licenseDate))) errors.licenseDate = "Sanani tanlang.";

  if (Object.keys(errors).length) return { errors };
  return {
    value: {
      phones,
      city,
      district,
      street,
      opens,
      closes,
      telegramUrl: links.telegramUrl!,
      instagramUrl: links.instagramUrl!,
      youtubeUrl: links.youtubeUrl!,
      orgName,
      taxId,
      licenseNumber,
      licenseDate,
    },
  };
}
