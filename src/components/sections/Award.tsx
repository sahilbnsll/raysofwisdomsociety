"use client";

import { useMemo, useState } from "react";
import { event, type Photo } from "@/content/event";
import { awardGallery } from "@/lib/gallery";
import { Frame } from "@/components/ui/Frame";
import { GalleryViewer } from "@/components/ui/GalleryViewer";
import { Reveal } from "@/components/ui/Reveal";

// A small, fixed lean per print, like photographs laid on a table (see .print in globals.css).
const lean = ["-1.5deg", "1deg", "-0.75deg", "1.25deg", "-1deg", "0.75deg"];

export function Award() {
  const a = event.award;
  const [view, setView] = useState<{ i: number; origin: DOMRect | null } | null>(null);

  // Everything a visitor can open: the portrait, the six prints on the page, then the rest of the collection
  const photos = useMemo<Photo[]>(() => {
    const seen = new Set<string>();
    return [
      a.portrait,
      ...a.archive.map((p) => ({
        ...p.photo,
        // the title is only added when the caption does not already say it
        caption: `${p.year ? `${p.year} · ` : ""}${p.caption.toLowerCase().includes(p.title.toLowerCase()) ? p.caption : `${p.title}. ${p.caption}`}`,
      })),
      ...awardGallery(),
    ].filter((p) => !seen.has(p.src) && !!seen.add(p.src));
  }, [a]);
  const at = (src: string) => Math.max(0, photos.findIndex((p) => p.src === src));
  const openAt = (src: string, from: Element) => setView({ i: at(src), origin: from.getBoundingClientRect() });

  return (
    <section id="award" aria-labelledby="award-title" className="section">
      <div className="wrap">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <Reveal>
            <p className="serif text-lg italic text-ink-muted">A special highlight of the festival</p>
            <h2 id="award-title" className="section-title mt-3">
              {a.title}
            </h2>
            <p className="display mt-4 text-[2rem] leading-tight text-maroon">{a.recipient}</p>
            <div className="reading mt-6 max-w-xl space-y-4">
              {a.bio.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <p className="serif mt-7 max-w-xl border-l-2 border-gold pl-5 text-[clamp(1.25rem,1.1rem+0.6vw,1.55rem)] italic leading-snug text-maroon">{a.legacy}</p>
          </Reveal>
          <Reveal develop delay={100} className="mx-auto w-full max-w-[22rem]">
            <button type="button" onClick={(e) => openAt(a.portrait.src, e.currentTarget)} aria-label={`Enlarge photograph: ${a.portrait.alt}`} className="arch-frame block w-full cursor-zoom-in">
              <Frame photo={a.portrait} ratio="4 / 5" arch sizes="(min-width:1024px) 22rem, 80vw" />
            </button>
          </Reveal>
        </div>

        <div className="mt-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div>
              <h3 className="display text-3xl">From the archive</h3>
              <p className="reading mt-2">{a.archiveIntro}</p>
            </div>
            {photos.length > a.archive.length + 1 && (
              <button type="button" onClick={(e) => setView({ i: 0, origin: e.currentTarget.getBoundingClientRect() })} className="link-arrow">
                All photographs · {photos.length}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </Reveal>
          <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:gap-x-8 lg:gap-y-10">
            {a.archive.map((p, i) => (
              <Reveal as="li" key={p.photo.src} delay={(i % 6) * 60}>
                <figure className="card print h-full p-2.5" style={{ "--lean": lean[i % lean.length] } as React.CSSProperties}>
                  <button type="button" onClick={(e) => openAt(p.photo.src, e.currentTarget)} aria-label={`Enlarge photograph: ${p.title}${p.year ? `, ${p.year}` : ""}`} className="block w-full cursor-zoom-in">
                    <Frame photo={p.photo} ratio="4 / 5" sizes="(min-width:768px) 30vw, 46vw" className="!rounded-[0.6rem]" />
                  </button>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      <GalleryViewer
        photos={view ? photos : null}
        index={view?.i ?? 0}
        origin={view?.origin ?? null}
        title={`${a.recipient}, ${a.title}`}
        onIndexChange={(i) => setView((v) => (v ? { ...v, i } : v))}
        onClose={() => setView(null)}
      />
    </section>
  );
}
