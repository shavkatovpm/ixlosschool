"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { errorState, formValues, okState, type FormState } from "@/lib/admin/form-state";
import { parseCenterForm } from "@/lib/admin/validate-center";
import { CENTER_KEY, formatPhone } from "@/lib/center";
import { writeSetting } from "@/lib/settings";

export async function saveCenterAction(previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formValues(formData, 300);
  const { value, errors } = parseCenterForm(values);
  if (!value) return errorState(previous, errors ?? {}, values);
  writeSetting(CENTER_KEY, value);
  revalidatePath("/admin/center");
  return okState(previous, "Saqlandi. O'zgarishlar saytda darhol ko'rinadi.", {
    phone1: formatPhone(value.phones[0] ?? ""),
    phone2: formatPhone(value.phones[1] ?? ""),
    phone3: formatPhone(value.phones[2] ?? ""),
    city: value.city,
    district: value.district,
    street: value.street,
    opens: value.opens,
    closes: value.closes,
    telegramUrl: value.telegramUrl,
    instagramUrl: value.instagramUrl,
    youtubeUrl: value.youtubeUrl,
    legalName: value.legalName,
    taxId: value.taxId,
    licenseNumber: value.licenseNumber,
    licenseDate: value.licenseDate,
  });
}
