"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { Photo } from "@/content/event";

/**
 * A quiet way to see more photographs without crowding the page: one photograph at a time, laid in a
 * cream "print" over a dark veil. Step with the arrows, the keyboard (left and
 * right), a swipe, or the thumbnails along the bottom. The neighbours load in the background, so
 * stepping is instant. Modelled on the lightbox in My Postcards, in this festival's colours.
 */

interface GalleryViewerProps {
  /** The photographs, or null when closed. */
  photos: Photo[] | null;
  index: number;
  /** Where the photograph was clicked, so the print can grow out of it. */
  origin: DOMRect | null;
  title: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const CLOSE_MS = 220;
const SWIPE_PX = 56;
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function GalleryViewer({ photos, index, origin, title, onIndexChange, onClose }: GalleryViewerProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const print = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const closing = useRef(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const open = photos !== null;
  const count = photos?.length ?? 0;
  const photo = photos?.[index];

  const finish = useCallback(() => {
    const d = dialog.current;
    if (d?.open) d.close();
    closing.current = false;
    onClose();
  }, [onClose]);

  const requestClose = useCallback(() => {
    const d = dialog.current;
    if (!d || closing.current) return;
    closing.current = true;
    if (reduced()) return finish();
    d.dataset.closing = "true";
    window.setTimeout(finish, CLOSE_MS);
  }, [finish]);

  // The native dialog gives the focus trap, Escape and focus return for free.
  useLayoutEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      closing.current = false;
      delete d.dataset.closing;
      d.showModal();
      closeButton.current?.focus({ preventScroll: true });
      // Grow the print out of the photograph that was clicked.
      const el = print.current;
      if (origin && el && !reduced()) {
        const to = el.getBoundingClientRect();
        const scale = Math.min(origin.width / to.width, 1);
        const dx = origin.left + origin.width / 2 - (to.left + to.width / 2);
        const dy = origin.top + origin.height / 2 - (to.top + to.height / 2);
        el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0.4 }, { transform: "none", opacity: 1 }], {
          duration: 480,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        });
      }
    } else if (!open && d.open) {
      d.close();
    }
  }, [open, origin]);

  const go = useCallback(
    (step: 1 | -1) => {
      if (count < 2) return;
      setDirection(step);
      onIndexChange((index + step + count) % count);
    },
    [count, index, onIndexChange],
  );

  // Keep the current thumbnail in view along the bottom strip
  useEffect(() => {
    if (open) thumbs.current[index]?.scrollIntoView({ inline: "center", block: "nearest", behavior: reduced() ? "auto" : "smooth" });
  }, [open, index]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };
  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  };

  const prev = photos && count > 1 ? photos[(index - 1 + count) % count] : undefined;
  const next = photos && count > 1 ? photos[(index + 1) % count] : undefined;
  const ratio = photo ? photo.w / photo.h : 1;

  return (
    <dialog
      ref={dialog}
      className="viewer on-dark"
      aria-label={photo ? `${title}, photograph ${index + 1} of ${count}` : "Photographs"}
      onClose={finish}
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      onKeyDown={onKeyDown}
    >
      {photo && (
        <div className="grid h-svh grid-rows-[auto_minmax(0,1fr)_auto]">
          <header className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="serif min-w-0 truncate text-[1.05rem] italic text-paper/85">
              {title}
              <span className="ml-3 font-sans text-sm not-italic tabular-nums text-paper/55">
                {index + 1} / {count}
              </span>
            </p>
            <button ref={closeButton} type="button" onClick={requestClose} aria-label="Close photographs" className="grid size-11 shrink-0 place-items-center rounded-full bg-paper/12 text-paper transition-colors hover:bg-paper/25">
              <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M3 3l12 12M15 3 3 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div className="relative grid min-h-0 place-items-center overflow-hidden px-3 sm:px-16" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onClick={(e) => e.target === e.currentTarget && requestClose()}>
            <figure key={photo.src} className="viewer-slide flex max-w-full flex-col items-center" style={{ "--dir": direction } as CSSProperties}>
              <div ref={print} className="viewer-print rounded-[0.35rem] bg-paper p-2 pb-2.5 shadow-e3 sm:p-3 sm:pb-3.5">
                <div
                  className="relative"
                  style={{
                    aspectRatio: `${photo.w} / ${photo.h}`,
                    // as large as fits: the screen width, or the height left under the header and strip
                    width: `min(calc(100vw - 2.5rem), 72rem, calc((100svh - 13.5rem) * ${ratio}))`,
                  }}
                >
                  <Image src={photo.src} alt={photo.alt} fill sizes="(min-width:1024px) 72rem, 100vw" quality={90} priority className="object-contain" />
                </div>
              </div>
            </figure>

            {count > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label="Previous photograph" className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-paper/14 text-paper backdrop-blur transition-colors hover:bg-paper/28 sm:left-4">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next photograph" className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-paper/14 text-paper backdrop-blur transition-colors hover:bg-paper/28 sm:right-4">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Neighbours load now, so the next step is instant */}
          <div className="sr-only" aria-hidden="true">
            {prev && <Image src={prev.src} alt="" width={prev.w} height={prev.h} sizes="(min-width:1024px) 72rem, 100vw" quality={90} priority />}
            {next && next !== prev && <Image src={next.src} alt="" width={next.w} height={next.h} sizes="(min-width:1024px) 72rem, 100vw" quality={90} priority />}
          </div>

          {count > 1 && (
            <ul className="flex snap-x gap-2 overflow-x-auto px-4 py-3 sm:justify-center sm:px-6" aria-label="All photographs">
              {photos!.map((p, i) => (
                <li key={p.src} className="shrink-0 snap-center">
                  <button
                    ref={(el) => {
                      thumbs.current[i] = el;
                    }}
                    type="button"
                    onClick={() => {
                      setDirection(i > index ? 1 : -1);
                      onIndexChange(i);
                    }}
                    aria-label={`Show photograph ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    className={`relative block h-14 w-11 overflow-hidden rounded-md ring-2 transition-[opacity,box-shadow] sm:h-16 sm:w-12 ${i === index ? "opacity-100 ring-gold" : "opacity-55 ring-transparent hover:opacity-90"}`}
                  >
                    <Image src={p.src} alt="" fill sizes="64px" quality={75} className="object-cover" style={{ objectPosition: p.position ?? "50% 25%" }} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </dialog>
  );
}
