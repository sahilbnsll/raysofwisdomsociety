import type { MetadataRoute } from "next";
import { event } from "@/content/event";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // While the page is a draft, ask crawlers to stay away entirely.
  if (event.isDraft) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/gate", "/pass/", "/p/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
