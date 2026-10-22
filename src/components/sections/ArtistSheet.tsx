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
 * "Meet the artists": the people behind one performance, with a short bio for each. Opens over the
 * programme so the list itself stays short enough to scan (Portfolio's skill-dialog pattern).
 */
export const ArtistSheet = forwardRef<HTMLDialogElement, { session: Session }>(function ArtistSheet({ session }, ref) {
  const close = () => (typeof ref === "object" ? ref?.current?.close() : undefined);
  return (
    <dialog
      ref={ref}
      aria-labelledby={`sheet-${session.id}`}
      onClick={(e) => e.target === e.currentTarget && close()}
      className="sheet m-0 mt-auto max-h-[88svh] w-full max-w-none overflow-y-auto rounded-t-3xl bg-paper p-0 text-ink shadow-e3 sm:m-auto sm:max-h-[90svh] sm:w-[min(40rem,94vw)] sm:rounded-3xl"
    >
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-paper/95 px-6 py-5 backdrop-blur">
        <div>
          <p className="text-sm text-ink-muted">{session.artForm}</p>
          <h3 id={`sheet-${session.id}`} className="display mt-1 text-3xl leading-tight">
            {session.title}
          </h3>
        </div>
        <button type="button" onClick={close} aria-label="Close" className="grid size-10 shrink-0 place-items-center rounded-full bg-cream">
          <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M3 3l12 12M15 3 3 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <ul className="divide-y divide-line px-6">
        {session.artists.map((a) => (
          <li key={a.name} className="flex gap-4 py-5">
            {a.photo ? (
              <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-sage-deep ring-1 ring-line">
                <Image src={a.photo.src} alt="" fill sizes="64px" className="object-cover" style={{ objectPosition: a.photo.position ?? "50% 25%" }} />
              </span>
            ) : (
              <span aria-hidden="true" className="display grid size-16 shrink-0 place-items-center rounded-full bg-sage text-xl text-olive ring-1 ring-line">
                {initials(a.name)}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-lg font-semibold leading-snug">{a.name}</p>
              <p className="serif italic text-ink-muted">{a.role}</p>
              {a.bio && <p className="reading mt-2 !text-base">{a.bio}</p>}
            </div>
          </li>
        ))}
      </ul>

      {session.formNote && (
        <div className="mx-6 mb-6 mt-1 flex gap-4 rounded-2xl bg-cream p-4">
          {session.formPhoto && (
            <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl">
              <Image src={session.formPhoto.src} alt={session.formPhoto.alt} fill sizes="80px" className="object-cover" style={{ objectPosition: session.formPhoto.position }} />
            </span>
          )}
          <p className="reading !text-base">{session.formNote}</p>
        </div>
      )}
    </dialog>
  );
});
