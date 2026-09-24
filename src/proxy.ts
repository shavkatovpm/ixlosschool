import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { adminEnabled } from "./lib/admin/config";
import { recordBotHit } from "./lib/admin/analytics";
import { detectBot } from "./lib/analytics-shared";

const intl = createMiddleware(routing);

// Crawlers do not run the site's page-view beacon, so their visits (Googlebot, ChatGPT, Yandex, link previews…)
// are noted here. Capped per minute so a scanner cannot flood the database.
let windowStart = 0;
let inWindow = 0;

function noteCrawler(request: NextRequest) {
  if (!adminEnabled() || request.method !== "GET") return;
  const bot = detectBot(request.headers.get("user-agent") ?? "");
  if (!bot) return;
  const now = Date.now();
  if (now - windowStart > 60_000) {
    windowStart = now;
    inWindow = 0;
  }
  if (++inWindow > 120) return;
  try {
    recordBotHit(request.nextUrl.pathname, bot);
  } catch (error) {
    console.error("[proxy] could not log the crawler visit:", error);
  }
}

export default function proxy(request: NextRequest) {
  noteCrawler(request);
  return intl(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|logo|admin|.*\\..*).*)"],
};
