import generated from "@/content/gallery.generated.json";
import type { Photo, Session } from "@/content/event";

/** What scripts/prepare-gallery.mjs writes: one list per performance, from the gallery folder. */
type Generated = Record<string, { src: string; w: number; h: number; caption?: string; alt?: string }[]>;

/**
 * Every photograph a visitor can open for a performance: the big ones already on the page first, then
 * the extras (listed in the content file, then those dropped into the gallery folder). Each picture
 * appears once, whichever way it was added.
 */
export function sessionPhotos(s: Session): { all: Photo[]; extras: number } {
  const dropped: Photo[] = ((generated as Generated)[s.id] ?? []).map((g, i) => ({
    src: g.src,
    w: g.w,
    h: g.h,
    alt: g.alt ?? g.caption ?? `${s.title}, photograph ${i + 1}`,
    caption: g.caption,
  }));
  const onPage = [...s.leadPhotos, ...(s.stage ? [s.stage] : [])];
  const seen = new Set<string>();
  const all = [...onPage, ...(s.gallery ?? []), ...dropped].filter((p) => !seen.has(p.src) && !!seen.add(p.src));
  return { all, extras: all.length - onPage.length };
}

/** The photographs of the award laureate dropped into gallery-inbox/award, as gallery photos. */
export function awardGallery(): Photo[] {
  return ((generated as Generated)["award"] ?? []).map((g, i) => ({
    src: g.src,
    w: g.w,
    h: g.h,
    alt: g.alt ?? g.caption ?? `Madhavi Mudgal, photograph ${i + 1}`,
    caption: g.caption,
  }));
}
