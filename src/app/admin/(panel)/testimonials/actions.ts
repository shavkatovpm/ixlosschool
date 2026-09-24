"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { errorState, formValues, okState, type FormState } from "@/lib/admin/form-state";
import { readLocalized } from "@/lib/admin/localized";
import { UploadError, deleteUpload, saveImageBuffer, saveImageFile } from "@/lib/admin/uploads";
import { checkYoutube, fetchYoutubeThumbnail, parseYoutubeId } from "@/lib/admin/youtube";
import {
  deleteTestimonial,
  getTestimonialRow,
  moveTestimonial,
  saveTestimonial,
  setTestimonialPublished,
  startTestimonialsEditing,
  youtubeIdTaken,
} from "@/lib/content/testimonials";

const id = (formData: FormData) => {
  const value = Number(formData.get("id"));
  return Number.isInteger(value) && value > 0 ? value : null;
};

const THUMB = { width: 540, height: 960, quality: 80 } as const;

export async function startTestimonialsEditingAction() {
  await requireAdmin();
  startTestimonialsEditing();
  redirect("/admin/testimonials");
}

export async function saveTestimonialAction(previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const rowId = id(formData);
  const existing = rowId !== null ? getTestimonialRow(rowId) : null;
  if (rowId !== null && !existing) redirect("/admin/testimonials");

  const values = formValues(formData, 1000);
  const errors: Record<string, string> = {};

  const youtubeId = parseYoutubeId(values.youtube ?? "");
  if (!youtubeId) errors.youtube = "YouTube havolasini kiriting (masalan https://www.youtube.com/shorts/…).";
  else if (youtubeIdTaken(youtubeId, rowId)) errors.youtube = "Bu video ro'yxatda allaqachon bor.";

  const uploadDate = (values.uploadDate ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(uploadDate) || Number.isNaN(Date.parse(uploadDate)) || uploadDate > new Date().toISOString().slice(0, 10)) {
    errors.uploadDate = "YouTube'ga yuklangan sanani tanlang (YouTube Studio'da ko'rinadi). Kelajak sanasi bo'lmaydi.";
  }

  const chip = readLocalized(values, "chip", "Qisqa belgi", { min: 2, max: 40 }, errors);
  const title = readLocalized(values, "title", "Sarlavha", { min: 5, max: 140 }, errors);
  const description = readLocalized(values, "description", "Tavsif", { min: 10, max: 320 }, errors);
  if (Object.keys(errors).length) return errorState(previous, errors, values);

  // Thumbnail: the uploaded picture, else the existing one, else the video's own thumbnail from YouTube.
  let thumb = existing?.thumb ?? "";
  let uploaded: string | null = null;
  try {
    uploaded = await saveImageFile(formData.get("thumb"), "testimonials", THUMB);
    if (!uploaded && (!thumb || (existing && existing.youtubeId !== youtubeId && thumb.startsWith("/media/")))) {
      if ((await checkYoutube(youtubeId!)) === "missing") {
        return errorState(previous, { youtube: "YouTube bu videoni topmadi yoki u yopiq. Havolani tekshiring." }, values);
      }
      const picture = await fetchYoutubeThumbnail(youtubeId!);
      if (picture) uploaded = await saveImageBuffer(picture, "testimonials", { ...THUMB, position: "centre" });
    }
  } catch (error) {
    if (error instanceof UploadError) return errorState(previous, { thumb: error.message }, values);
    throw error;
  }
  if (uploaded) {
    if (existing && existing.thumb !== uploaded) deleteUpload(existing.thumb);
    thumb = uploaded;
  }
  if (!thumb) {
    return errorState(previous, { thumb: "Miniatyura avtomatik olinmadi. Video rasmini o'zingiz yuklang." }, values);
  }

  startTestimonialsEditing();
  saveTestimonial(rowId, { published: values.published === "on", youtubeId: youtubeId!, thumb, uploadDate, chip, title, description });
  revalidatePath("/admin/testimonials");
  if (rowId === null) redirect("/admin/testimonials?saved=new");
  return okState(previous, "Saqlandi. O'zgarish saytda darhol ko'rinadi.", { ...values, youtube: values.youtube });
}

export async function moveTestimonialAction(formData: FormData) {
  await requireAdmin();
  const rowId = id(formData);
  if (rowId !== null) moveTestimonial(rowId, formData.get("dir") === "up" ? "up" : "down");
  revalidatePath("/admin/testimonials");
}

export async function toggleTestimonialAction(formData: FormData) {
  await requireAdmin();
  const rowId = id(formData);
  if (rowId !== null) setTestimonialPublished(rowId, formData.get("published") === "1");
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdmin();
  const rowId = id(formData);
  const row = rowId !== null ? getTestimonialRow(rowId) : null;
  if (row) {
    deleteTestimonial(row.id);
    deleteUpload(row.thumb);
  }
  revalidatePath("/admin/testimonials");
}
