"use client";

import { useRef, useState } from "react";
import { event } from "@/content/event";
import { fmtDate } from "@/lib/format";
import { downloadCalendar } from "@/lib/ics";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";

export function Programme() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const day = event.days[active];

  // Arrow keys move between day tabs, per the WAI-ARIA tabs pattern.
  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const last = event.days.length - 1;
    const next = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <section id="programme" className="section rule-top">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <h2 className="section-title">Two evenings of dance and music</h2>
            <p className="section-intro">{event.programmeIntro}</p>
          </Reveal>

          {/* Segmented day switch; the sliding fill is the current selection, so it takes the accent */}
          <div role="tablist" aria-label="Festival days" className="relative grid w-full grid-cols-2 rounded-full bg-paper p-1 shadow-e1 ring-1 ring-line lg:w-[22rem]">
            <span
              aria-hidden="true"
              className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-maroon shadow-e1 transition-transform duration-[var(--d3)] ease-[var(--ease-move)]"
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
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`relative z-10 rounded-full px-4 py-2.5 text-center transition-colors duration-[var(--d2)] ${i === active ? "text-paper" : "text-ink-muted hover:text-ink"}`}
              >
                <span className="block text-[0.95rem] font-semibold">{d.theme}</span>
                <span className="block text-xs opacity-80">{fmtDate(d.date, { weekday: "short", day: "numeric", month: "short" })}</span>
              </button>
            ))}
          </div>
        </div>

        <div role="tabpanel" id={`panel-${day.id}`} aria-labelledby={`tab-${day.id}`} tabIndex={0} className="mt-14 outline-none">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="display text-4xl">
                {day.label}: {day.theme}
              </h3>
              <p className="mt-2 text-ink-muted">
                {fmtDate(day.date, { weekday: "long", day: "numeric", month: "long" })}, {event.timeLabel}. {day.blurb}
              </p>
            </div>
            <button type="button" onClick={() => downloadCalendar(day.id === "day-1" ? "day1" : "day2")} className="btn btn-secondary">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
                <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              Add to calendar
            </button>
          </div>

          <ol className="mt-6">
            {day.sessions.map((s, i) => {
              const flip = i % 2 === 1;
              const [first, second] = s.images;
              const tall = first.h > first.w;
              return (
                <li key={`${day.id}-${s.title}`} className="grid items-center gap-8 border-t border-line py-12 md:grid-cols-12 md:gap-14">
                  <Reveal develop className={`md:col-span-6 ${flip ? "md:order-2" : ""}`}>
                    {second ? (
                      <div className="grid grid-cols-[1.35fr_1fr] gap-3">
                        <Frame photo={first} ratio="4 / 5" sizes="(min-width:768px) 30vw, 55vw" className="self-start shadow-e2" />
                        <Frame photo={second} ratio="4 / 5" sizes="(min-width:768px) 22vw, 40vw" className="mt-12 shadow-e2" />
                      </div>
                    ) : tall ? (
                      <div className="arch-frame mx-auto w-[min(100%,24rem)]">
                        <Frame photo={first} ratio="4 / 5" arch sizes="(min-width:768px) 26vw, 80vw" />
                      </div>
                    ) : (
                      <Frame photo={first} ratio="3 / 2" sizes="(min-width:768px) 48vw, 100vw" className="shadow-e2" />
                    )}
                  </Reveal>

                  <Reveal delay={100} className="md:col-span-6">
                    <p className="text-sm font-medium text-olive">{s.time ? `${s.time} · ${s.artForm}` : s.artForm}</p>
                    <h4 className="display mt-3 text-[clamp(2.1rem,1.7rem+1.4vw,2.9rem)] leading-[1.05]">{s.title}</h4>
                    <p className="mt-4 text-lg font-medium leading-snug">{s.performers}</p>
                    <p className="mt-3 max-w-lg leading-relaxed text-ink-muted">{s.note}</p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
