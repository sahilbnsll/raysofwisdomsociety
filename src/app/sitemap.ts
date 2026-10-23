import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Just the festival page: the pass and gate pages are private and the rest of the site is one page.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl, changeFrequency: "weekly", priority: 1 }];
}
