"use client";

import { useRef, useState } from "react";
import { event, type Artist, type Session } from "@/content/event";
import { fmtDate } from "@/lib/format";
import { downloadCalendar } from "@/lib/ics";
import { EPassLink } from "@/components/epass/EPassLink";
import { Avatar } from "@/components/ui/Avatar";
import { Frame } from "@/components/ui/Frame";
import { GalleryViewer } from "@/components/ui/GalleryViewer";
import { sessionPhotos } from "@/lib/gallery";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArtistSheet } from "./ArtistSheet";

/** The bigger the name, the more of the page it takes: long names step down so they stay on two lines. */
const nameSize = (name: string) =>
  name.length > 32
    ? "text-[clamp(1.7rem,1.3rem+1.6vw,2.5rem)]"
    : name.length > 20
      ? "text-[clamp(2.1rem,1.5rem+2.4vw,3.25rem)]"
      : "text-[clamp(2.5rem,1.7rem+3.2vw,4.25rem)]";

function Leads({ s, flip, extras, onOpen }: { s: Session; flip: boolean; extras: number; onOpen: (src: string, from: Element) => void }) {
  const [first, second] = s.leadPhotos;
  return (
    <Reveal develop className={`md:col-span-5 ${flip ? "md:order-2" : ""}`}>
      {second ? (
        // Two lead artists (a collaboration): two arches, the second set lower
        <div className="grid grid-cols-2 items-start gap-3 sm:gap-4">
          {[first, second].map((photo, i) => (
            <figure key={photo.src} className={`relative ${i === 1 ? "mt-10" : ""}`}>
              <button type="button" onClick={(e) => onOpen(photo.src, e.currentTarget)} aria-label={`Enlarge photograph: ${photo.alt}`} className="arch-frame block w-full cursor-zoom-in">
                <Frame photo={photo} ratio="3 / 4.2" arch sizes="(min-width:768px) 20vw, 44vw" />
              </button>
            </figure>
          ))}
        </div>
      ) : (
        // One lead artist: a tall arch, with a smaller picture of the performance resting on its corner
        <div className="relative mx-auto w-[min(100%,24rem)] pb-8">
          <button type="button" onClick={(e) => onOpen(first.src, e.currentTarget)} aria-label={`Enlarge photograph: ${first.alt}`} className="arch-frame block w-full cursor-zoom-in">
            <Frame photo={first} ratio="4 / 5" arch sizes="(min-width:768px) 26vw, 80vw" />
          </button>
          {s.stage && (
            <button
              type="button"
              onClick={(e) => onOpen(s.stage!.src, e.currentTarget)}
              aria-label={extras > 0 ? `Open ${extras + 1} more photographs` : `Enlarge photograph: ${s.stage.alt}`}
              className="absolute -bottom-0 -right-2 block w-[44%] rotate-[2deg] cursor-zoom-in rounded-2xl bg-paper p-1.5 text-left shadow-e2 ring-1 ring-line transition-transform duration-[var(--d2)] hover:rotate-0 sm:-right-6"
            >
              <Frame photo={s.stage} ratio="4 / 3" sizes="12rem" className="!rounded-xl" />
              {extras > 0 && <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2 py-0.5 text-[0.72rem] font-semibold text-paper">+{extras}</span>}
            </button>
          )}
        </div>
      )}
    </Reveal>
  );
}

function Chip({ a }: { a: Artist }) {
  return (
    <li className="flex items-center gap-3">
      {a.thumb ?? a.photo ? <Avatar artist={a} /> : <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-gold" />}
      <span className="min-w-0 leading-tight">
        <span className="block font-semibold">{a.name}</span>
        <span className="serif text-[0.95rem] italic text-ink-muted">{a.role}</span>
      </span>
    </li>
  );
}

function SessionRow({ s, flip }: { s: Session; flip: boolean }) {
  const sheet = useRef<HTMLDialogElement>(null);
  // The sheet's contents (portraits, bios) are built the first time it is opened
  const [sheetBuilt, setSheetBuilt] = useState(false);
  const { all, extras } = sessionPhotos(s);
  const [view, setView] = useState<{ i: number; origin: DOMRect | null } | null>(null);
  const openAt = (src: string, from: Element) => setView({ i: Math.max(0, all.findIndex((p) => p.src === src)), origin: from.getBoundingClientRect() });
  const leads = s.artists.filter((a) => a.billing === "lead");
  const guests = s.artists.filter((a) => a.billing === "guest");
  const others = s.artists.filter((a) => !a.billing);
  // "Bharatanatyam" as both label and title would read twice: show it once.
  const sameName = s.title.trim().toLowerCase() === s.artForm.trim().toLowerCase();
  // Everything already said above the names (label, title, art form). A role is only shown for what it
  // adds: "Bharatanatyam" under Arupa Lahiri is left out, "Odissi, festival director" keeps "festival director".
  // When the title is only the dance ("Kuchipudi"), the dance goes under the artist's name, like Gauri Diwakar's, and the label above is dropped.
  const label = sameName && s.artists.filter((a) => a.billing === "lead").length === 1 ? null : (s.tagline ?? s.artForm);
  const said = [label ?? "", sameName ? "" : s.title, s.tagline ? s.artForm : ""].join(" ").toLowerCase();
  const newInRole = (role: string) =>
    role
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p && !said.includes(p.toLowerCase()))
      .join(", ");

  return (
    <li className="grid items-center gap-10 border-t border-line py-14 md:grid-cols-12 md:gap-12 lg:gap-16">
      <Leads s={s} flip={flip} extras={extras} onOpen={openAt} />

      <Reveal delay={100} className="md:col-span-7">
        {label && <p className="serif italic text-olive">{label}</p>}
        {!sameName && (
          <h4 className="serif mt-1.5 text-[clamp(1.15rem,1.05rem+0.5vw,1.45rem)] font-medium leading-snug text-ink-muted">
            {s.title}
            {s.tagline && !s.hideArtForm && <span className="font-normal"> · {s.artForm}</span>}
          </h4>
        )}

        {/* The artists are the headline of every performance */}
        <div className="mt-4 space-y-3">
          {leads.map((a) => (
            <div key={a.name}>
              <p className={`display ${nameSize(a.name)} leading-[1.02]`}>{a.name}</p>
              {/* With two lead artists each name keeps its own dance underneath; with one, only what is new */}
              {(leads.length > 1 ? a.role : newInRole(a.role)) && (
                <p className="serif mt-1 text-lg italic text-maroon first-letter:uppercase">{leads.length > 1 ? a.role : newInRole(a.role)}</p>
              )}
            </div>
          ))}
        </div>

        <p className="reading mt-5 max-w-xl">{s.note}</p>

        {(others.length > 0 || guests.length > 0) && (
          <div className="mt-6 border-t border-line pt-5">
            {others.length > 0 && (
              <>
                <p className="serif text-sm italic text-ink-muted">{leads.length ? "With" : "Performing"}</p>
                <ul className="mt-3 flex flex-wrap gap-x-7 gap-y-3.5">
                  {others.map((a) => (
                    <Chip key={a.name} a={a} />
                  ))}
                </ul>
              </>
            )}
            {guests.length > 0 && (
              <div className={others.length > 0 ? "mt-5" : ""}>
                <p className="serif text-sm italic text-ink-muted">Guest appearance</p>
                <ul className="mt-3 flex flex-wrap gap-x-7 gap-y-3.5">
                  {guests.map((a) => (
                    <Chip key={a.name} a={a} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-x-7">
          <button
            type="button"
            onClick={() => {
              setSheetBuilt(true);
              sheet.current?.showModal();
            }}
            className="link-arrow"
          >
            {s.artists.length === 1 ? "Meet the artist" : `Meet the ${s.artists.length} artists`}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {extras > 0 && (
            <button type="button" onClick={(e) => setView({ i: 0, origin: e.currentTarget.getBoundingClientRect() })} className="link-arrow">
              Photographs · {all.length}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </Reveal>
      <ArtistSheet ref={sheet} session={s} built={sheetBuilt} />
      <GalleryViewer
        photos={view ? all : null}
        index={view?.i ?? 0}
        origin={view?.origin ?? null}
        title={leads.length === 1 && sameName ? `${leads[0].name} · ${s.title}` : s.title}
        onIndexChange={(i) => setView((v) => (v ? { ...v, i } : v))}
        onClose={() => setView(null)}
      />
    </li>
  );
}

export function Programme() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panel = useRef<HTMLDivElement>(null);
  const day = event.days[active];

  function choose(i: number) {
    setActive(i);
    // The switch stays on screen as you scroll, so after changing evening bring the new list to the top.
    requestAnimationFrame(() => {
      const top = panel.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) panel.current?.scrollIntoView({ block: "start" });
    });
  }

  // Arrow keys move between day tabs, per the WAI-ARIA tabs pattern.
  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const last = event.days.length - 1;
    const next = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : null;
    if (next === null) return;
    e.preventDefault();
    choose(next);
    tabs.current[next]?.focus();
  }

  const dateLong = fmtDate(day.date, { weekday: "long", day: "numeric", month: "long" });

  return (
    <section id="programme" className="section border-t border-line">
      <div className="wrap">
        <SectionHeader title="Two evenings of dance and music" intro={event.programmeIntro} />

        {/* The evening switch follows you down the page, so you never scroll back up to change day */}
        <div className="sticky top-[calc(var(--header-h)+0.375rem)] z-30 mt-8 flex justify-center">
          <div role="tablist" aria-label="Festival evenings" className="relative grid w-[min(100%,25rem)] grid-cols-2 rounded-full bg-paper/90 p-1 shadow-e1 ring-1 ring-line backdrop-blur-md">
            <span
              aria-hidden="true"
              className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-ink transition-transform duration-[var(--d3)] ease-[var(--ease-move)]"
              style={{ transform: `translateX(${active * 100}%)` }}
            />
            {event.days.map((d, i) => (
              <button
                key={d.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`tab-${d.id}`}
                aria-selected={i === active}
                aria-controls={`panel-${d.id}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => choose(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`relative z-10 rounded-full px-3 py-1.5 text-center transition-colors duration-[var(--d2)] ${i === active ? "text-paper" : "text-ink hover:text-maroon"}`}
              >
                <span className="block text-[0.95rem] font-semibold leading-tight">
                  Day {i + 1}
                  <span className="font-normal opacity-75"> · {fmtDate(d.date, { day: "numeric", month: "short" })}</span>
                </span>
                <span className={`serif block text-[0.74rem] italic leading-tight ${i === active ? "opacity-70" : "text-ink-muted"}`}>{d.theme}</span>
              </button>
            ))}
          </div>
        </div>

        <div ref={panel} role="tabpanel" id={`panel-${day.id}`} aria-labelledby={`tab-${day.id}`} tabIndex={0} className="mt-10 outline-none">
          <div className="flex flex-wrap items-end justify-between gap-6 pb-6">
            <div className="max-w-2xl">
              <h3 className="display text-4xl">
                {day.label}: {day.theme}
              </h3>
              <p className="reading mt-2">
                {dateLong}, {event.timeLabel}. {day.blurb}
              </p>
            </div>
            <button type="button" onClick={() => downloadCalendar(day.evening)} className="btn btn-secondary">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
                <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              Add to calendar
            </button>
          </div>

          <ol>
            {day.sessions.map((s, i) => (
              <SessionRow key={s.id} s={s} flip={i % 2 === 1} />
            ))}
          </ol>

          {/* The natural next step after reading an evening's programme */}
          <Reveal className="card mt-4 flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="display text-3xl">Coming on {fmtDate(day.date, { day: "numeric", month: "long" })}?</p>
              <p className="reading mt-1">Make your e-pass for the {day.theme.toLowerCase()} evening. It takes a minute.</p>
            </div>
            <EPassLink evening={day.evening} className="btn btn-primary shrink-0">
              E-pass for {fmtDate(day.date, { day: "numeric", month: "short" })}
            </EPassLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
