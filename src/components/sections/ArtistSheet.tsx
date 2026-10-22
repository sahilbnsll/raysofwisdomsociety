"use client";

import Image from "next/image";
import { forwardRef } from "react";
import type { Session } from "@/content/event";

const initials = (name: string) =>
  name
    .replace(/^(Pandit|Dr\.)\s+/i, "")
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

/**
 * "Meet the artists": the people behind one performance, each with a portrait (or a monogram where
 * no photograph was supplied) and a short bio. Opens over the programme so the list itself stays
 * short enough to scan (Portfolio's skill-dialog pattern).
 */
export const ArtistSheet = forwardRef<HTMLDialogElement, { session: Session }>(function ArtistSheet({ session }, ref) {
  const close = () => (typeof ref === "object" ? ref?.current?.close() : undefined);
  return (
    <dialog
      ref={ref}
      aria-labelledby={`sheet-${session.id}`}
      onClick={(e) => e.target === e.currentTarget && close()}
      className="sheet m-0 mt-auto max-h-[88svh] w-full max-w-none overflow-y-auto rounded-t-3xl bg-paper p-0 text-ink shadow-e3 sm:m-auto sm:max-h-[90svh] sm:w-[min(42rem,94vw)] sm:rounded-3xl"
    >
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-paper/95 px-6 py-5 backdrop-blur sm:px-8">
        <div>
          <p className="serif italic text-ink-muted">{session.artForm}</p>
          <h3 id={`sheet-${session.id}`} className="display mt-1 text-3xl leading-tight">
            {session.title}
          </h3>
        </div>
        <button type="button" onClick={close} aria-label="Close" className="grid size-10 shrink-0 place-items-center rounded-full bg-cream transition-colors hover:bg-sage">
          <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M3 3l12 12M15 3 3 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <ul className="divide-y divide-line px-6 sm:px-8">
        {session.artists.map((a) => (
          <li key={a.name} className="grid grid-cols-[5.5rem_1fr] gap-5 py-6 sm:grid-cols-[7rem_1fr]">
            {a.photo ? (
              <span className="relative block aspect-[4/5] w-full overflow-hidden rounded-[50%_50%_0.75rem_0.75rem/32%_32%_0.75rem_0.75rem] bg-sage-deep ring-1 ring-line">
                <Image src={a.photo.src} alt={a.photo.alt} fill sizes="112px" className="object-cover" style={{ objectPosition: a.photo.position ?? "50% 25%" }} />
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="display grid aspect-[4/5] w-full place-items-center rounded-[50%_50%_0.75rem_0.75rem/32%_32%_0.75rem_0.75rem] bg-sage text-2xl text-olive ring-1 ring-line"
              >
                {initials(a.name)}
              </span>
            )}
            <div className="min-w-0 self-center">
              <p className="text-lg font-semibold leading-snug">{a.name}</p>
              <p className="serif italic text-ink-muted">{a.role}</p>
              {a.bio && <p className="reading mt-2 !text-base">{a.bio}</p>}
            </div>
          </li>
        ))}
      </ul>
    </dialog>
  );
});
