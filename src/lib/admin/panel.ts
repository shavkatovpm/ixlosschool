import { redirect } from "next/navigation";
import { requireAdmin } from "./auth";

/**
 * The check every panel page, action and download starts with. The layout also checks, but Next.js can render a page
 * without re-running its layout (client navigation, partial RSC requests), so the page must not rely on it.
 */
export async function requirePanel() {
  const session = await requireAdmin();
  if (session.mustChangePassword) redirect("/admin/account");
  return session;
}
