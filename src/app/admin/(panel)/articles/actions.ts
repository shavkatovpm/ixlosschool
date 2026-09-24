"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePanel } from "@/lib/admin/panel";
import { errorState, formValues, okState, type FormState } from "@/lib/admin/form-state";
import { UploadError, deleteUpload, saveImageFile } from "@/lib/admin/uploads";
import { parseArticleForm, publishErrors } from "@/lib/admin/validate-article";
import { deleteArticle, getArticleRow, saveArticle, setArticleStatus, slugTaken, type ArticleStatus } from "@/lib/content/articles";

const id = (formData: FormData) => {
  const value = Number(formData.get("id"));
  return Number.isInteger(value) && value > 0 ? value : null;
};

const COVER = { width: 1200, height: 630, quality: 82 } as const;

export async function saveArticleAction(previous: FormState, formData: FormData): Promise<FormState> {
  await requirePanel();
  const rowId = id(formData);
  const existing = rowId !== null ? getArticleRow(rowId) : null;
  if (rowId !== null && !existing) redirect("/admin/articles");

  const values = formValues(formData, 50000);
  const intent = values.intent; // "save" keeps the current status; "publish" / "unpublish" change it
  const { value, errors } = parseArticleForm(values);
  const failures: Record<string, string> = { ...(errors ?? {}) };
  if (value && slugTaken(value.slug, rowId)) failures.slug = "Bu havola nomi boshqa maqolada ishlatilgan.";
  // A published article's address must not change: links, search results and the sitemap already point to it.
  if (value && existing?.status === "published" && value.slug !== existing.slug) {
    failures.slug = "Chop etilgan maqolaning havola nomini o'zgartirib bo'lmaydi (avval qoralamaga qaytaring).";
  }

  const status: ArticleStatus = intent === "publish" ? "published" : intent === "unpublish" ? "draft" : (existing?.status ?? "draft");
  if (value && status === "published") Object.assign(failures, publishErrors(value));

  let cover = existing?.cover ?? "";
  let uploaded: string | null = null;
  try {
    uploaded = await saveImageFile(formData.get("cover"), "articles", COVER);
  } catch (error) {
    if (!(error instanceof UploadError)) throw error;
    failures.cover = error.message;
  }

  if (!value || Object.keys(failures).length) {
    if (uploaded) deleteUpload(uploaded);
    const picked = formData.get("cover");
    const lost = picked instanceof File && picked.size > 0;
    return errorState(
      previous,
      failures,
      values,
      status === "published" && !errors
        ? "Maqolani chop etib bo'lmadi: uch tildagi sarlavha, tavsif va matn to'liq bo'lishi kerak."
        : lost
          ? "Ma'lumotlarni tekshiring. Xatolarni tuzatgach muqova rasmini qayta tanlang."
          : undefined,
    );
  }

  if (uploaded) {
    if (existing) deleteUpload(existing.cover);
    cover = uploaded;
  } else if (values.removeCover === "on" && cover) {
    deleteUpload(cover);
    cover = "";
  }

  const savedId = saveArticle(rowId, { ...value, cover, status });
  revalidatePath("/admin/articles");
  if (rowId === null) redirect(`/admin/articles/${savedId}?created=1`);
  return okState(
    previous,
    status === "published" ? "Saqlandi. Maqola saytda chop etilgan." : "Saqlandi (qoralama: saytda ko'rinmaydi).",
    { ...values, intent: "" },
  );
}

export async function toggleArticleAction(formData: FormData) {
  await requirePanel();
  const rowId = id(formData);
  const row = rowId !== null ? getArticleRow(rowId) : null;
  if (!row) redirect("/admin/articles");
  if (formData.get("status") === "published") {
    if (Object.keys(publishErrors(row)).length) redirect(`/admin/articles?e=incomplete&id=${row.id}`);
    setArticleStatus(row.id, "published");
  } else {
    setArticleStatus(row.id, "draft");
  }
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function deleteArticleAction(formData: FormData) {
  await requirePanel();
  const rowId = id(formData);
  const row = rowId !== null ? getArticleRow(rowId) : null;
  if (row) {
    deleteArticle(row.id);
    deleteUpload(row.cover);
  }
  revalidatePath("/admin/articles");
}
