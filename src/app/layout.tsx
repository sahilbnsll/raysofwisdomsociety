import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Hanken_Grotesk, Newsreader } from "next/font/google";
import { event, org } from "@/content/event";
import { siteUrl } from "@/lib/site";
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

const fullTitle = `${event.edition} ${event.title} 2026`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${fullTitle} | ${org.name}`, template: `%s | ${event.shortTitle}` },
  description: event.seoDescription,
  applicationName: event.shortTitle,
  keywords: [
    "International Ancient Arts Festival",
    "IAAF 2026",
    "Indian classical dance festival",
    "Odissi",
    "Bharatanatyam",
    "Kuchipudi",
    "Kathak",
    "santoor",
    "Kamani Auditorium",
    "New Delhi events",
    org.name,
  ],
  authors: [{ name: org.name, url: org.site }],
  creator: org.name,
  publisher: org.name,
  category: "events",
  alternates: { canonical: "/" },
  // The share image comes from opengraph-image.tsx; these fill in the rest of the card.
  openGraph: {
    type: "website",
    siteName: org.name,
    locale: "en_IN",
    url: "/",
    title: fullTitle,
    description: event.seoDescription,
  },
  twitter: { card: "summary_large_image", title: fullTitle, description: event.seoDescription },
  robots: event.isDraft
    ? { index: false, follow: false }
    : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6efe0",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${dmSerif.variable} ${newsreader.variable} ${hanken.variable}`}>
      <body>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.develop img{filter:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-maroon focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-paper"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
