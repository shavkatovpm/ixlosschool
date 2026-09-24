import type { Metadata } from "next";
import { Geist, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { adminEnabled } from "@/lib/admin/config";
import "../globals.css";
import "./admin.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin", "cyrillic"], weight: ["600", "700", "800"] });

// Always rendered per request: the switch (ADMIN_ENABLED) and the session are runtime facts.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Ixlos School",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  if (!adminEnabled()) notFound();
  return (
    <html lang="uz" className={`${geistSans.variable} ${manrope.variable} antialiased`}>
      <body className="admin-app min-h-screen bg-paper font-sans text-ink">{children}</body>
    </html>
  );
}
