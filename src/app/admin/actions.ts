"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { changeAccount, getSession, login, logout, requireAdmin } from "@/lib/admin/auth";
import { isLeadStatus, updateLead } from "@/lib/admin/leads";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  const password = String(formData.get("password") ?? "").slice(0, 200);
  const result = await login(email, password);
  if (!result.ok) redirect(`/admin/login?e=${result.error}`);
  redirect("/admin");
}

export async function logoutAction() {
  if (await getSession()) await logout();
  redirect("/admin/login");
}

export async function updateLeadAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = formData.get("status");
  const note = String(formData.get("note") ?? "").trim().slice(0, 1000);
  if (!Number.isInteger(id) || id < 1 || !isLeadStatus(status)) return;
  updateLead(id, status, note);
  revalidatePath("/admin", "layout");
}

export async function changeAccountAction(formData: FormData) {
  const session = await requireAdmin();
  const text = (name: string) => String(formData.get(name) ?? "").slice(0, 200);
  const result = await changeAccount(session, {
    currentPassword: text("currentPassword"),
    newPassword: text("newPassword"),
    confirmPassword: text("confirmPassword"),
    email: text("email"),
  });
  if (!result.ok) redirect(`/admin/account?e=${result.error}`);
  redirect("/admin?updated=1");
}
