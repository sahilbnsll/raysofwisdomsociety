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
  style: "normal",
  display: "swap",
});

// Reading and UI: the Portfolio pairing.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: "normal",
  display: "swap",
});

// The italic is a large file and only dresses small phrases, so it is not preloaded: it loads right
// after the page's first paint instead of competing with the text for the first bytes.
const newsreaderItalic = Newsreader({
  variable: "--font-newsreader-italic",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: "italic",
  display: "swap",
  preload: false,
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
    "classical music festival Delhi",
    "Ancient Arts Award 2026",
    "Madhavi Mudgal",
    "Reela Hota",
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
  // Added to the iPhone home screen it opens like an app, titled with the short name
  appleWebApp: { capable: true, title: event.shortTitle, statusBarStyle: "default" },
  // The page has proper tap-to-call links; stop phones restyling plain numbers and addresses on their own
  formatDetection: { telephone: false, email: false, address: false },
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
    <html lang="en-IN" className={`${dmSerif.variable} ${newsreader.variable} ${newsreaderItalic.variable} ${hanken.variable}`}>
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
