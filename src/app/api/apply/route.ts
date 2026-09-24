import { NextResponse } from "next/server";
import { applicationSchema } from "@/lib/application";
import { adminEnabled } from "@/lib/admin/config";
import { insertLead } from "@/lib/admin/leads";
import { classifySource, parseDevice } from "@/lib/analytics-shared";
import { sendToTelegram } from "@/lib/telegram";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const escapeHtml = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field; pretend success to bots.
  if (typeof (raw as { company?: unknown }).company === "string" && (raw as { company: string }).company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { name, phone, grade, locale } = parsed.data;
  const referer = request.headers.get("referer") ?? "-";
  const text = [
    "<b>Yangi ariza — Ixlos School</b>",
    `Ism: ${escapeHtml(name)}`,
    `Telefon: ${escapeHtml(phone)}`,
    `Sinf: ${grade}`,
    `Til: ${locale}`,
    `Sahifa: ${escapeHtml(referer)}`,
    `Vaqt: ${new Date().toISOString()}`,
  ].join("\n");

  // Where the admin panel exists the application is stored first, so it survives a Telegram outage.
  let saved = false;
  if (adminEnabled()) {
    try {
      const attr = ((raw as { attr?: unknown }).attr ?? {}) as Record<string, unknown>;
      const str = (value: unknown, max: number) => (typeof value === "string" ? value.slice(0, max) : "");
      const origin = classifySource({
        referrer: str(attr.ref, 300),
        utmSource: str(attr.us, 60),
        utmMedium: str(attr.um, 60),
        utmCampaign: str(attr.uc, 80),
      });
      const hasAttr = Object.keys(attr).length > 0;
      insertLead({
        name,
        phone,
        grade,
        locale,
        source: hasAttr ? origin.source : "",
        medium: hasAttr ? origin.medium : "",
        campaign: origin.campaign,
        landing: str(attr.lp, 160),
        device: parseDevice(request.headers.get("user-agent") ?? ""),
      });
      saved = true;
    } catch (error) {
      console.error("[apply] could not store the lead:", error);
    }
  }

  const result = await sendToTelegram(text);

  if (result === "sent" || saved) {
    if (result !== "sent") console.error(`[apply] telegram ${result}, lead is stored:`, { name, phone });
    return NextResponse.json({ ok: true });
  }

  console.error(`[apply] delivery ${result}:`, { name, phone, grade, locale });

  if (result === "not_configured" && process.env.NODE_ENV !== "production") {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: result === "not_configured" ? 503 : 502 });
}
