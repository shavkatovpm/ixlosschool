"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePanel } from "@/lib/admin/panel";
import { errorState, formValues, okState, type FormState } from "@/lib/admin/form-state";
import { UploadError, deleteUpload, saveImageFile } from "@/lib/admin/uploads";
import { parseTeacherForm } from "@/lib/admin/validate-teacher";
import { deleteTeacher, getTeacherRow, moveTeacher, saveTeacher, setTeacherPublished, startTeachersEditing } from "@/lib/content/teachers";

const id = (formData: FormData) => {
  const value = Number(formData.get("id"));
  return Number.isInteger(value) && value > 0 ? value : null;
};

// Portrait 4:5, the proportions of the cards on the site.
const PHOTO = { width: 800, height: 1000, quality: 82 } as const;

export async function startTeachersEditingAction() {
  await requirePanel();
  startTeachersEditing();
  redirect("/admin/teachers");
}

export async function saveTeacherAction(previous: FormState, formData: FormData): Promise<FormState> {
  await requirePanel();
  const rowId = id(formData);
  const existing = rowId !== null ? getTeacherRow(rowId) : null;
  if (rowId !== null && !existing) redirect("/admin/teachers");

  const values = formValues(formData, 400);
  const { value, errors } = parseTeacherForm(values);
  const failures: Record<string, string> = { ...(errors ?? {}) };

  let photo = existing?.photo ?? "";
  let uploaded: string | null = null;
  if (!errors) {
    try {
      uploaded = await saveImageFile(formData.get("photo"), "teachers", PHOTO);
    } catch (error) {
      if (!(error instanceof UploadError)) throw error;
      failures.photo = error.message;
    }
    if (!uploaded && !photo) failures.photo = "Ustoz rasmini yuklang.";
  } else if (!photo) {
    failures.photo = "Ustoz rasmini yuklang (xatolarni tuzatgach yana tanlang).";
  }
  if (!value || Object.keys(failures).length) {
    if (uploaded) deleteUpload(uploaded);
    const picked = formData.get("photo");
    const lostPhoto = picked instanceof File && picked.size > 0;
    return errorState(
      previous,
      failures,
      values,
      lostPhoto ? "Ma'lumotlarni tekshiring: ba'zi maydonlar to'g'ri emas. Xatolarni tuzatgach rasmni qayta tanlang." : undefined,
    );
  }

  if (uploaded) {
    if (existing) deleteUpload(existing.photo);
    photo = uploaded;
  }
  startTeachersEditing();
  saveTeacher(rowId, { ...value, photo }, values.published === "on");
  revalidatePath("/admin/teachers");
  if (rowId === null) redirect("/admin/teachers?saved=new");
  return okState(previous, "Saqlandi. O'zgarish saytda darhol ko'rinadi.", values);
}

export async function moveTeacherAction(formData: FormData) {
  await requirePanel();
  const rowId = id(formData);
  if (rowId !== null) moveTeacher(rowId, formData.get("dir") === "up" ? "up" : "down");
  revalidatePath("/admin/teachers");
}

export async function toggleTeacherAction(formData: FormData) {
  await requirePanel();
  const rowId = id(formData);
  if (rowId !== null) setTeacherPublished(rowId, formData.get("published") === "1");
  revalidatePath("/admin/teachers");
}

export async function deleteTeacherAction(formData: FormData) {
  await requirePanel();
  const rowId = id(formData);
  const row = rowId !== null ? getTeacherRow(rowId) : null;
  if (row) {
    deleteTeacher(row.id);
    deleteUpload(row.photo);
  }
  revalidatePath("/admin/teachers");
}
