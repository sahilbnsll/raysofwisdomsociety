import type { NextConfig } from "next";

const security = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The gate scanner needs the camera; nothing else on the site needs any device feature.
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Narrow on purpose (no script rules): stops other sites framing ours and injected forms or base tags.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The default quality (75) visibly softens the festival photographs, so they use 85 and the hero 90.
  // Optimised copies are kept for 30 days: the photographs rarely change, and a new name or a redeploy refreshes them.
  images: { formats: ["image/avif", "image/webp"], qualities: [75, 85, 90], minimumCacheTTL: 60 * 60 * 24 * 30 },
  async headers() {
    return [
      { source: "/:path*", headers: security },
      // Private pages and the API must never show up in search results, even if linked from somewhere.
      { source: "/gate", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/pass/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/p/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      // Photographs and icons change rarely; let browsers and the CDN reuse them for a day.
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=604800" }] },
      { source: "/icons/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=604800" }] },
    ];
  },
};

export default nextConfig;
