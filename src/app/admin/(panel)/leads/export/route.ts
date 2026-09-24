import { getSession } from "@/lib/admin/auth";
import { adminEnabled } from "@/lib/admin/config";
import { allLeads, formatDateTime } from "@/lib/admin/leads";
import { filterFrom } from "@/lib/admin/lead-filter";
import { sourceWithMedium } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

const quote = (text: string) => `"${text.replace(/"/g, '""')}"`;
const cell = (value: string | number) => quote(String(value));
// Free text typed by visitors (the name): a leading = + - @ would be read as a spreadsheet formula.
const freeText = (value: string) => quote(/^[=+\-@\t\r]/.test(value) ? `'${value}` : value);

export async function GET(request: Request) {
  const session = adminEnabled() ? await getSession() : null;
  if (!session || session.mustChangePassword) return new Response("Unauthorized", { status: 401 });
  const filter = filterFrom(Object.fromEntries(new URL(request.url).searchParams));
  const header = ["ID", "Sana", "Ism", "Telefon", "Sinf", "Til", "Manba", "Kampaniya", "Qurilma", "Kirish sahifasi"];
  const lines = allLeads(filter).map((lead) =>
    [
      cell(lead.id),
      cell(formatDateTime(lead.createdAt)),
      freeText(lead.name),
      cell(lead.phone),
      cell(lead.grade),
      cell(lead.locale),
      cell(lead.source ? sourceWithMedium(lead.source, lead.medium) : ""),
      freeText(lead.campaign),
      cell(lead.device),
      freeText(lead.landing),
    ].join(","),
  );
  const csv = `﻿${[header.map(cell).join(","), ...lines].join("\r\n")}\r\n`;
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="arizalar-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
