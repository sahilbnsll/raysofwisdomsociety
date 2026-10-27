import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Just the festival page: the pass and gate pages are private and the rest of the site is one page.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(), // the deploy date: the programme and photographs change with each one
      changeFrequency: "weekly",
      priority: 1,
      // The share picture and poster, so image search can find the festival too
      images: [`${siteUrl}/opengraph-image`, `${siteUrl}/images/poster-v2.jpg`],
    },
  ];
}
