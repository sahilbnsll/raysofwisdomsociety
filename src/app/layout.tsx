import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";
import { brand, event, org } from "@/content/event";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Geist for UI and reading text (as in LumaCV); Cormorant only for display sizes.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

// Absolute base for share-image URLs: set NEXT_PUBLIC_SITE_URL on the live site; Vercel supplies a fallback.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3100");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${event.title} 2026 | ${org.name}`,
  description: `${event.edition} ${event.title}, 25 and 26 November 2026 at Kamani Auditorium, New Delhi. ${event.motto.join(". ")}.`,
  icons: { icon: brand.logo.src },
  openGraph: {
    title: `${event.edition} ${event.title} 2026`,
    description: event.motto.join(". ") + ".",
    images: [{ url: event.poster.src, width: event.poster.width, height: event.poster.height, alt: event.poster.alt }],
  },
  robots: event.isDraft ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f1e5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${geist.variable}`}>
      <body>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.develop img{filter:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
