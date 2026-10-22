import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Hanken_Grotesk, Newsreader } from "next/font/google";
import { brand, event, org } from "@/content/event";
import "./globals.css";

// Display: a bold, high-contrast serif close to the poster's title lettering.
const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

// Reading and UI: the Portfolio pairing.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
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
  description: `${event.edition} ${event.title}, 25 and 26 November 2026 at Kamani Auditorium, New Delhi. Get your e-pass. ${event.motto.join(". ")}.`,
  icons: { icon: brand.logo.src },
  openGraph: {
    title: `${event.edition} ${event.title} 2026`,
    description: `25 and 26 November 2026, Kamani Auditorium, New Delhi. ${event.motto.join(". ")}.`,
    images: [{ url: event.poster.src, width: event.poster.width, height: event.poster.height, alt: event.poster.alt }],
  },
  robots: event.isDraft ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6efe0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${newsreader.variable} ${hanken.variable}`}>
      <body>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.develop img{filter:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
