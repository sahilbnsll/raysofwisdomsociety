"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { event } from "@/content/event";
import { Reveal } from "@/components/ui/Reveal";

const items = event.gallery;

export function Gallery() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const item = items[index];

  const step = (dir: 1 | -1) => setIndex((i) => (i + dir + items.length) % items.length);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
  }

  return (
    <section id="gallery" className="section rule-top">
      <div className="wrap">
        <Reveal>
          <h2 className="section-title">Moments from the stage</h2>
          <p className="section-intro">A few glimpses of the artists you will see. Select any photograph to see it larger.</p>
        </Reveal>

        <ul className="mt-12 columns-2 gap-4 md:columns-3 lg:columns-4 [&>li]:mb-4">
          {items.map((g, i) => (
            <Reveal as="li" develop key={g.photo.src} delay={(i % 4) * 60} className="break-inside-avoid">
              <button
                type="button"
                onClick={() => {
                  setIndex(i);
                  dialog.current?.showModal();
                }}
                aria-label={`Open photograph: ${g.caption}`}
                className="group relative block w-full overflow-hidden rounded-2xl bg-sage-deep shadow-e1"
              >
                <Image
                  src={g.photo.src}
                  alt={g.photo.alt}
                  width={g.photo.w}
                  height={g.photo.h}
                  sizes="(min-width:1024px) 24vw, (min-width:768px) 32vw, 48vw"
                  className="h-auto w-full transition-transform duration-[600ms] ease-[var(--ease-out)] group-hover:scale-[1.03]"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-paper/90 px-3 py-1 text-xs font-medium text-ink opacity-0 shadow-e1 backdrop-blur transition-opacity duration-[var(--d2)] group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
                  {g.caption}
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialog}
        aria-label="Photograph viewer"
        onKeyDown={onKeyDown}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-auto max-h-[94svh] w-[min(72rem,96vw)] max-w-none overflow-hidden rounded-3xl bg-ink p-0 text-paper"
      >
        <div className="relative grid max-h-[94svh] place-items-center p-3 pb-20 sm:p-6 sm:pb-20">
          <Image
            key={item.photo.src}
            src={item.photo.src}
            alt={item.photo.alt}
            width={item.photo.w}
            height={item.photo.h}
            sizes="96vw"
            className="max-h-[76svh] w-auto max-w-full rounded-xl object-contain"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <button type="button" onClick={() => step(-1)} aria-label="Previous photograph" className="grid size-11 place-items-center rounded-full bg-paper/10 hover:bg-paper/20">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M13 8H3M7 4 3 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <p className="min-w-0 text-center text-sm" aria-live="polite">
              <span className="block truncate font-semibold">{item.caption}</span>
              <span className="text-paper/60">
                {index + 1} of {items.length}
              </span>
            </p>
            <button type="button" onClick={() => step(1)} aria-label="Next photograph" className="grid size-11 place-items-center rounded-full bg-paper/10 hover:bg-paper/20">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-ink/70 sm:right-5 sm:top-5">
            <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M3 3l12 12M15 3 3 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </dialog>
    </section>
  );
}
