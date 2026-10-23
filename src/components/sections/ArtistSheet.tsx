"use client";

import Image from "next/image";
import { forwardRef } from "react";
import type { Session } from "@/content/event";

/**
 * "Meet the artists": the people behind one performance, each with a portrait where a photograph
 * was supplied (and no stand-in where it was not) and a short bio. Opens over the programme so the list itself stays
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
          {session.artForm.trim().toLowerCase() !== session.title.trim().toLowerCase() && <p className="serif italic text-ink-muted">{session.artForm}</p>}
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
          <li key={a.name} className={`grid gap-5 py-6 ${a.photo ? "grid-cols-[6.5rem_1fr] sm:grid-cols-[9rem_1fr]" : ""}`}>
            {a.photo && (
              <span className="relative block aspect-[4/5] w-full overflow-hidden rounded-[50%_50%_0.75rem_0.75rem/32%_32%_0.75rem_0.75rem] bg-sage-deep ring-1 ring-line">
                <Image src={a.photo.src} alt={a.photo.alt} fill sizes="(min-width:640px) 144px, 104px" quality={90} className="object-cover" style={{ objectPosition: a.photo.position ?? "50% 25%" }} />
              </span>
            )}
            <div className="min-w-0 self-center">
              <p className="text-lg font-semibold leading-snug">{a.name}</p>
              {/* A role that only repeats the performance's name (the sheet header) is left out */}
              {(() => {
                const role = [session.title, session.artForm].some((x) => x.trim().toLowerCase() === a.role.trim().toLowerCase()) ? "" : a.role;
                const guest = a.billing === "guest" ? "guest appearance" : "";
                const line = [role, guest].filter(Boolean).join(" · ");
                return line ? <p className="serif italic text-ink-muted">{line}</p> : null;
              })()}
              {a.bio && <p className="reading mt-2 !text-base">{a.bio}</p>}
            </div>
          </li>
        ))}
      </ul>
    </dialog>
  );
});
