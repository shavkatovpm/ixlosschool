"use server";

import { redirect } from "next/navigation";
import { requirePanel } from "@/lib/admin/panel";
import { createBackup } from "@/lib/admin/backup";
import { errorState, formValues, okState, type FormState } from "@/lib/admin/form-state";
import { GA_ID_RE, INTEGRATIONS_KEY, VERIFICATION_RE, YM_ID_RE, type Integrations } from "@/lib/integrations";
import { sendToTelegram, telegramConfigured } from "@/lib/telegram";
import { writeSetting } from "@/lib/settings";

/** Accepts the bare code or the whole <meta name="…" content="CODE"> tag that Google/Yandex show. */
function verificationCode(raw: string) {
  const value = raw.trim();
  return /content\s*=\s*["']([^"']+)["']/i.exec(value)?.[1] ?? value;
}

export async function saveIntegrationsAction(previous: FormState, formData: FormData): Promise<FormState> {
  await requirePanel();
  const values = formValues(formData, 400);
  const errors: Record<string, string> = {};

  const gaId = (values.gaId ?? "").trim().toUpperCase();
  if (gaId && !GA_ID_RE.test(gaId)) errors.gaId = "Google Analytics ID «G-» bilan boshlanadi (masalan G-ABC123XYZ4).";
  const ymId = (values.ymId ?? "").trim();
  if (ymId && !YM_ID_RE.test(ymId)) errors.ymId = "Yandex Metrica hisoblagichi 5–12 ta raqamdan iborat.";
  const googleVerification = verificationCode(values.googleVerification ?? "");
  if (googleVerification && !VERIFICATION_RE.test(googleVerification)) errors.googleVerification = "Kod noto'g'ri ko'rinadi. Faqat kodning o'zini (yoki meta tegni) kiriting.";
  const yandexVerification = verificationCode(values.yandexVerification ?? "");
  if (yandexVerification && !VERIFICATION_RE.test(yandexVerification)) errors.yandexVerification = "Kod noto'g'ri ko'rinadi. Faqat kodning o'zini (yoki meta tegni) kiriting.";

  const next: Integrations = { gaId, ymId, googleVerification, yandexVerification };
  if (Object.keys(errors).length) return errorState(previous, errors, values);
  writeSetting(INTEGRATIONS_KEY, next);
  return okState(previous, "Saqlandi. Kodlar saytga darhol qo'shildi.", { ...next });
}

export async function createBackupAction() {
  await requirePanel();
  try {
    createBackup();
  } catch (error) {
    console.error("[backup] manual backup failed:", error);
    redirect("/admin/settings?done=backup-failed");
  }
  redirect("/admin/settings?done=backup");
}

export async function testTelegramAction() {
  await requirePanel();
  if (!telegramConfigured()) redirect("/admin/settings?done=telegram-missing");
  const result = await sendToTelegram("Test");
  redirect(`/admin/settings?done=${result === "sent" ? "telegram-sent" : "telegram-failed"}`);
}
