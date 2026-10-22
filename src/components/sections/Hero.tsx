import { event, org, totals } from "@/content/event";
import { EPassLink } from "@/components/epass/EPassLink";
import { EPassCounter } from "@/components/epass/EPassCounter";
import { Frame } from "@/components/ui/Frame";
import { Hills, LotusRule, Sprig } from "@/components/ui/Ornaments";
import { Reveal } from "@/components/ui/Reveal";
import { Countdown } from "./Countdown";

// The colonnade: the middle arch stands tallest, the outer ones step down, like the poster's group.
const lift = ["lg:translate-y-10", "lg:translate-y-4", "", "lg:translate-y-4", "lg:translate-y-10"];

/**
 * Opens like the printed pass: who presents it, the title with its big "9th", the lotus rule, the
 * date and venue in maroon, the director and the four words. Then five arches, one tradition each,
 * standing on the poster's hills, and a guide line of numbers that are also links.
 */
export function Hero() {
  return (
    <section id="top" className="relative isolate -mt-[var(--header-h)] overflow-hidden pt-[var(--header-h)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(46rem_26rem_at_100%_0%,rgba(214,150,150,0.2),transparent_70%),radial-gradient(40rem_24rem_at_0%_10%,rgba(176,194,140,0.22),transparent_70%)]"
      />
      <Sprig className="absolute left-0 top-16 -z-10 hidden w-44 md:block lg:w-56" />
      <Sprig className="absolute right-0 top-16 -z-10 hidden w-44 md:block lg:w-56" flip />

      <div className="wrap flex flex-col items-center pt-8 text-center sm:pt-12">
        <Reveal>
          <p className="serif text-[1.05rem] italic text-ink-muted">{org.name} presents</p>
          <h1 className="display mt-4 text-[clamp(2.7rem,1.2rem+6vw,6rem)] leading-[0.98]">
            <span className="whitespace-nowrap">
              <span className="text-[1.45em] leading-none">9</span>
              <sup className="mr-[0.15em] align-[0.95em] text-[0.42em]">th</sup>
              International
            </span>
            <br />
            Ancient Arts Festival <span className="whitespace-nowrap">2026</span>
          </h1>
          <LotusRule className="mx-auto mt-5 w-[min(80%,20rem)]" />
        </Reveal>

        <Reveal delay={100} className="mt-5 flex flex-col items-center">
          <p className="serif flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[clamp(1.1rem,1rem+0.5vw,1.4rem)] font-medium text-maroon">
            <span className="inline-flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              November 25 to 26, 2026
            </span>
            <span aria-hidden="true" className="hidden h-5 w-px bg-maroon/40 sm:block" />
            <span className="inline-flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              {event.venue.name}, {event.venue.area}
            </span>
          </p>
          <p className="serif mt-2 text-lg">
            Festival Director: <span className="font-medium">{event.director}</span> · {event.timeLabel}
          </p>
          <p className="motto mt-3 justify-center" aria-label={event.motto.join(", ")}>
            {event.motto.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </p>
        </Reveal>

        <Reveal delay={180} className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <EPassLink className="btn btn-primary !min-h-[3.25rem] !px-7 text-base" />
          <a href="#programme" className="link-arrow">
            See the programme
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>
      </div>

      {/* Five traditions, one stage: the arches stand on the poster's hills, each with its nameplate */}
      <div className="relative mt-12 lg:mt-14">
        <Hills className="absolute inset-x-0 bottom-0 h-28 sm:h-40" />
        <div className="wrap relative pb-10 sm:pb-14 lg:pb-20">
          <ul className="mx-auto grid max-w-5xl grid-cols-3 items-end gap-3 sm:gap-5 lg:grid-cols-5">
            {event.arcade.map((a, i) => (
              <li
                key={a.label}
                className={`${lift[i]} ${i === 0 || i === 4 ? "hidden lg:block" : ""}`}
                style={{ animation: `rise 900ms var(--ease-out) ${200 + Math.abs(2 - i) * 110}ms both` }}
              >
                <figure className="relative">
                  <div className="arch-frame">
                    <Frame photo={a.photo} ratio="3 / 4.2" arch priority={i === 2} sizes="(min-width:1024px) 18vw, 31vw" />
                  </div>
                  <figcaption className="absolute inset-x-0 -bottom-3.5 flex justify-center">
                    <span className="serif rounded-full bg-paper px-3 py-1 text-[0.8rem] italic leading-none text-ink shadow-e1 ring-1 ring-[color-mix(in_srgb,var(--gold)_45%,transparent)] sm:px-4 sm:py-1.5 sm:text-[0.95rem]">
                      {a.label}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Guide line: what's here, and where to go next (My Postcards' StatsBar) */}
      <nav aria-label="At a glance" className="relative pb-6 pt-2">
        <ul className="wrap flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm text-ink-muted">
          {[
            { href: "#programme", n: totals.evenings, label: "evenings" },
            { href: "#programme", n: totals.performances, label: "performances" },
            { href: "#programme", n: totals.artists, label: "artists" },
          ].map((s, i) => (
            <li key={s.label} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden="true" className="text-line-strong">·</span>}
              <a href={s.href} className="rounded-full px-2.5 py-1.5 transition-colors hover:bg-ink/[0.05] hover:text-ink">
                <span className="font-semibold text-ink tabular-nums">{s.n}</span> {s.label}
              </a>
            </li>
          ))}
          <li className="flex items-center gap-1">
            <span aria-hidden="true" className="text-line-strong">·</span>
            <a href="#e-pass" className="rounded-full px-2.5 py-1.5 transition-colors hover:bg-ink/[0.05] hover:text-ink">
              <EPassCounter />
            </a>
          </li>
          <li className="flex items-center gap-1">
            <span aria-hidden="true" className="text-line-strong">·</span>
            <span className="px-2.5 py-1.5">
              <Countdown />
            </span>
          </li>
        </ul>
      </nav>
    </section>
  );
}
