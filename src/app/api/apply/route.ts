import { NextResponse } from "next/server";
import { applicationSchema } from "@/lib/application";
import { adminEnabled } from "@/lib/admin/config";
import { insertLead } from "@/lib/admin/leads";

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

async function sendToTelegram(text: string): Promise<"sent" | "failed" | "not_configured"> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return "not_configured";

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

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
      insertLead({ name, phone, grade, locale });
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
