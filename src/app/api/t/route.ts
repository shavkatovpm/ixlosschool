import { adminEnabled } from "@/lib/admin/config";
import { recordPageview } from "@/lib/admin/analytics";
import { hostOf, isInternalHost } from "@/lib/analytics-shared";

// Page-view beacon (see components/site/tracker.tsx). Always answers 204: statistics must never be able to
// affect the site, and a failed write is not something the browser should retry or show.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 60;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const text = (value: unknown, max: number) => (typeof value === "string" ? value.slice(0, max) : "");
const done = () => new Response(null, { status: 204 });

export async function POST(request: Request) {
  if (!adminEnabled()) return done();

  // The beacon only comes from the site's own pages; anything else is somebody poking the endpoint.
  const origin = request.headers.get("origin");
  if (origin) {
    const host = hostOf(origin);
    if (!isInternalHost(host) && host !== "localhost" && host !== "127.0.0.1") return done();
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return done();

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return done();
  const b = body as Record<string, unknown>;

  try {
    recordPageview({
      path: text(b.p, 200),
      ip,
      userAgent: request.headers.get("user-agent") ?? "",
      referrer: text(b.r, 300),
      utmSource: text(b.us, 60),
      utmMedium: text(b.um, 60),
      utmCampaign: text(b.uc, 80),
    });
  } catch (error) {
    console.error("[t] could not record the page view:", error);
  }
  return done();
}
