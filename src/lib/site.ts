/**
 * The public address of the site, used for canonical links, share images, the sitemap and structured data.
 * The festival has one address, iaaf26.raysofwisdomsociety.net, and every canonical link, share card, sitemap
 * entry and structured-data URL uses it, so search engines see a single site. NEXT_PUBLIC_SITE_URL overrides it
 * (with or without https://); preview deployments use their own address, and development uses localhost.
 */
export const FESTIVAL_ADDRESS = "https://iaaf26.raysofwisdomsociety.net";

function resolve(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return /^https?:\/\//.test(configured) ? configured : `https://${configured}`;
  if (process.env.VERCEL_ENV === "production") return FESTIVAL_ADDRESS;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3100";
}

export const siteUrl = resolve().replace(/\/+$/, "");
