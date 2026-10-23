import type { MetadataRoute } from "next";
import { event } from "@/content/event";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${event.edition} ${event.title} 2026`,
    short_name: event.shortTitle,
    description: event.seoDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f6efe0",
    theme_color: "#f6efe0",
    lang: "en-IN",
    categories: ["events", "entertainment"],
    // Long-press the installed icon for a shortcut straight to the pass
    shortcuts: [{ name: "Get your e-pass", short_name: "E-pass", url: "/#e-pass", icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }] }],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
