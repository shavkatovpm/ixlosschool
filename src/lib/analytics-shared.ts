// Pure helpers (no I/O) shared by the tracking endpoint, the proxy and the lead form endpoint.

export type Attribution = { source: string; medium: string; campaign: string };

const SITE_HOSTS = ["ixlosschool.uz"];

type Rule = { test: RegExp; source: string; medium: string };
const REFERRERS: Rule[] = [
  { test: /(^|\.)google\.[a-z.]+$/, source: "google", medium: "organic" },
  { test: /(^|\.)yandex\.[a-z.]+$|(^|\.)ya\.ru$/, source: "yandex", medium: "organic" },
  { test: /(^|\.)bing\.com$/, source: "bing", medium: "organic" },
  { test: /(^|\.)duckduckgo\.com$/, source: "duckduckgo", medium: "organic" },
  { test: /(^|\.)t\.me$|(^|\.)telegram\.(org|me)$/, source: "telegram", medium: "social" },
  { test: /(^|\.)instagram\.com$/, source: "instagram", medium: "social" },
  { test: /(^|\.)facebook\.com$|(^|\.)fb\.me$|(^|\.)fb\.com$/, source: "facebook", medium: "social" },
  { test: /(^|\.)youtube\.com$|(^|\.)youtu\.be$/, source: "youtube", medium: "social" },
  { test: /(^|\.)tiktok\.com$/, source: "tiktok", medium: "social" },
  { test: /(^|\.)vk\.com$/, source: "vk", medium: "social" },
  { test: /(^|\.)ok\.ru$/, source: "ok", medium: "social" },
  { test: /(^|\.)twitter\.com$|(^|\.)x\.com$|(^|\.)t\.co$/, source: "x", medium: "social" },
  { test: /(^|\.)chatgpt\.com$|(^|\.)chat\.openai\.com$/, source: "chatgpt", medium: "ai" },
  { test: /(^|\.)perplexity\.ai$/, source: "perplexity", medium: "ai" },
  { test: /(^|\.)gemini\.google\.com$/, source: "gemini", medium: "ai" },
  { test: /(^|\.)claude\.ai$/, source: "claude", medium: "ai" },
  { test: /(^|\.)copilot\.microsoft\.com$/, source: "copilot", medium: "ai" },
];

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().toLowerCase().replace(/[^\p{L}\p{N}._\-+ ]/gu, "").slice(0, max) : "";

export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

export const isInternalHost = (host: string) => SITE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));

/** Turns the raw referrer / UTM values into a source, medium and campaign. */
export function classifySource(input: { referrer?: string; utmSource?: string; utmMedium?: string; utmCampaign?: string }): Attribution {
  const utmSource = clean(input.utmSource, 40);
  if (utmSource) {
    const known = REFERRERS.find((r) => r.source === utmSource);
    return {
      source: utmSource,
      medium: clean(input.utmMedium, 30) || known?.medium || "campaign",
      campaign: clean(input.utmCampaign, 60),
    };
  }
  const host = input.referrer ? hostOf(input.referrer) : "";
  if (!host || isInternalHost(host)) return { source: "direct", medium: "direct", campaign: clean(input.utmCampaign, 60) };
  const rule = REFERRERS.find((r) => r.test.test(host));
  const campaign = clean(input.utmCampaign, 60);
  return rule ? { source: rule.source, medium: rule.medium, campaign } : { source: host.slice(0, 60), medium: "referral", campaign };
}

export function parseDevice(ua: string): "mobile" | "tablet" | "desktop" {
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return "tablet";
  if (/Mobi|iPhone|iPod|Android|Windows Phone/i.test(ua)) return "mobile";
  return "desktop";
}

export function parseBrowser(ua: string): string {
  if (/Instagram/i.test(ua)) return "Instagram (ilova ichida)";
  if (/FBAN|FBAV/i.test(ua)) return "Facebook (ilova ichida)";
  if (/Telegram/i.test(ua)) return "Telegram (ilova ichida)";
  if (/YaBrowser|YaSearchBrowser/i.test(ua)) return "Yandex Browser";
  if (/SamsungBrowser/i.test(ua)) return "Samsung Internet";
  if (/OPR\/|Opera/i.test(ua)) return "Opera";
  if (/Edg\//i.test(ua)) return "Edge";
  if (/Firefox|FxiOS/i.test(ua)) return "Firefox";
  if (/Chrome|CriOS/i.test(ua)) return "Chrome";
  if (/Safari/i.test(ua)) return "Safari";
  return "Boshqa";
}

export type BotInfo = { name: string; kind: "search" | "ai" | "social" | "seo" | "other" };

const BOTS: { test: RegExp; name: string; kind: BotInfo["kind"] }[] = [
  { test: /Googlebot|Google-InspectionTool|GoogleOther|AdsBot-Google/i, name: "Googlebot", kind: "search" },
  { test: /bingbot|BingPreview/i, name: "Bingbot", kind: "search" },
  { test: /YandexBot|YandexImages|YandexMobileBot|YandexWebmaster/i, name: "YandexBot", kind: "search" },
  { test: /Baiduspider/i, name: "Baiduspider", kind: "search" },
  { test: /DuckDuckBot/i, name: "DuckDuckBot", kind: "search" },
  { test: /Applebot/i, name: "Applebot", kind: "search" },
  { test: /OAI-SearchBot/i, name: "OAI-SearchBot (ChatGPT qidiruvi)", kind: "ai" },
  { test: /ChatGPT-User/i, name: "ChatGPT-User", kind: "ai" },
  { test: /GPTBot/i, name: "GPTBot (OpenAI)", kind: "ai" },
  { test: /Claude-SearchBot/i, name: "Claude-SearchBot", kind: "ai" },
  { test: /Claude-User/i, name: "Claude-User", kind: "ai" },
  { test: /ClaudeBot|anthropic-ai/i, name: "ClaudeBot (Anthropic)", kind: "ai" },
  { test: /Perplexity-User/i, name: "Perplexity-User", kind: "ai" },
  { test: /PerplexityBot/i, name: "PerplexityBot", kind: "ai" },
  { test: /Google-Extended|Google-CloudVertexBot/i, name: "Google-Extended (Gemini)", kind: "ai" },
  { test: /meta-externalagent|meta-externalfetcher/i, name: "Meta AI", kind: "ai" },
  { test: /Amazonbot/i, name: "Amazonbot", kind: "ai" },
  { test: /Bytespider/i, name: "Bytespider (TikTok)", kind: "ai" },
  { test: /CCBot/i, name: "CCBot (Common Crawl)", kind: "ai" },
  { test: /facebookexternalhit|facebot/i, name: "Facebook ko'rinishi", kind: "social" },
  { test: /TelegramBot/i, name: "Telegram ko'rinishi", kind: "social" },
  { test: /Twitterbot/i, name: "X (Twitter) ko'rinishi", kind: "social" },
  { test: /LinkedInBot/i, name: "LinkedIn ko'rinishi", kind: "social" },
  { test: /WhatsApp/i, name: "WhatsApp ko'rinishi", kind: "social" },
  { test: /Slackbot/i, name: "Slack ko'rinishi", kind: "social" },
  { test: /SemrushBot/i, name: "SemrushBot", kind: "seo" },
  { test: /AhrefsBot/i, name: "AhrefsBot", kind: "seo" },
  { test: /MJ12bot/i, name: "MJ12bot", kind: "seo" },
  { test: /DotBot|PetalBot|DataForSeoBot|BLEXBot/i, name: "SEO/qidiruv boti", kind: "seo" },
  { test: /bot|crawler|spider|crawl|scraper|headless|python-requests|curl\//i, name: "Boshqa bot", kind: "other" },
];

export function detectBot(ua: string): BotInfo | null {
  if (!ua) return null;
  const hit = BOTS.find((b) => b.test.test(ua));
  return hit ? { name: hit.name, kind: hit.kind } : null;
}

export const BOT_KIND_LABEL: Record<BotInfo["kind"], string> = {
  search: "Qidiruv tizimlari",
  ai: "AI dasturlar",
  social: "Ijtimoiy tarmoq ko'rinishlari",
  seo: "SEO vositalari",
  other: "Boshqa",
};

export const SOURCE_LABEL: Record<string, string> = {
  direct: "To'g'ridan-to'g'ri",
  google: "Google",
  yandex: "Yandex",
  bing: "Bing",
  duckduckgo: "DuckDuckGo",
  telegram: "Telegram",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  vk: "VK",
  ok: "Odnoklassniki",
  x: "X (Twitter)",
  chatgpt: "ChatGPT",
  perplexity: "Perplexity",
  gemini: "Gemini",
  claude: "Claude",
  copilot: "Copilot",
};

export const MEDIUM_LABEL: Record<string, string> = {
  direct: "To'g'ridan-to'g'ri",
  organic: "Qidiruv",
  social: "Ijtimoiy tarmoq",
  ai: "AI yordamchi",
  referral: "Boshqa sayt",
  campaign: "Reklama/kampaniya",
};

export const sourceLabel = (source: string) => SOURCE_LABEL[source] ?? source;
