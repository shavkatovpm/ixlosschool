import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// STANDALONE=1 is set only by the Docker build (droplet). Vercel builds ignore it and keep AVIF.
const standalone = process.env.STANDALONE === "1";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Photos uploaded in the admin panel arrive through server actions (the default limit is 1 MB).
  experimental: { serverActions: { bodySizeLimit: "12mb" } },
  ...(standalone ? { output: "standalone" as const } : {}),
  images: standalone
    ? // The droplet has a single small CPU: skip slow AVIF encoding and keep optimized images for a month.
      { formats: ["image/webp"], minimumCacheTTL: 60 * 60 * 24 * 30 }
    : { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // YouTube embeds need a referrer, so this stays at the browser default rather than "no-referrer".
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
