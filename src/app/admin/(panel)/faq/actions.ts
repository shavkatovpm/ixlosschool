"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePanel } from "@/lib/admin/panel";
import { errorState, formValues, okState, type FormState } from "@/lib/admin/form-state";
import { readLocalized } from "@/lib/admin/localized";
import { deleteFaq, getFaqRow, moveFaq, saveFaq, setFaqPublished, startFaqEditing } from "@/lib/content/faq";

const id = (formData: FormData) => {
  const value = Number(formData.get("id"));
  return Number.isInteger(value) && value > 0 ? value : null;
};

export async function startFaqEditingAction() {
  await requirePanel();
  startFaqEditing();
  redirect("/admin/faq");
}

export async function saveFaqAction(previous: FormState, formData: FormData): Promise<FormState> {
  await requirePanel();
  const rowId = id(formData);
  if (rowId !== null && !getFaqRow(rowId)) redirect("/admin/faq");
  const values = formValues(formData, 3000);
  const errors: Record<string, string> = {};
  const question = readLocalized(values, "question", "Savol", { min: 5, max: 200 }, errors);
  const answer = readLocalized(values, "answer", "Javob", { min: 10, max: 1500 }, errors);
  if (Object.keys(errors).length) return errorState(previous, errors, values);

  startFaqEditing(); // the first save also moves the built-in entries into the database
  saveFaq(rowId, { question, answer, published: values.published === "on" });
  revalidatePath("/admin/faq");
  if (rowId === null) redirect("/admin/faq?saved=new");
  return okState(previous, "Saqlandi. O'zgarish saytda darhol ko'rinadi.", values);
}

export async function moveFaqAction(formData: FormData) {
  await requirePanel();
  const rowId = id(formData);
  if (rowId !== null) moveFaq(rowId, formData.get("dir") === "up" ? "up" : "down");
  revalidatePath("/admin/faq");
}

export async function toggleFaqAction(formData: FormData) {
  await requirePanel();
  const rowId = id(formData);
  if (rowId !== null) setFaqPublished(rowId, formData.get("published") === "1");
  revalidatePath("/admin/faq");
}

export async function deleteFaqAction(formData: FormData) {
  await requirePanel();
  const rowId = id(formData);
  if (rowId !== null) deleteFaq(rowId);
  revalidatePath("/admin/faq");
}
