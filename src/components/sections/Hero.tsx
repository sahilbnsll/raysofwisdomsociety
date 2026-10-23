import Image from "next/image";
import { brand, event, org } from "@/content/event";
import { EPassLink } from "@/components/epass/EPassLink";
import { Hills, LotusRule, Sprig } from "@/components/ui/Ornaments";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Opens like the printed pass, on a quiet field: the organiser's mark, who presents it, the title with
 * its big "9th", the lotus rule, the festival's own words, date and venue in maroon, the director and
 * the four words, with the festival emblem turning slowly and faintly behind them, on the poster's hills.
 */
export function Hero() {
  return (
    <section id="top" className="relative isolate -mt-[var(--header-h)] flex min-h-[min(100svh,58rem)] flex-col overflow-hidden pt-[var(--header-h)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(46rem_26rem_at_100%_0%,rgba(214,150,150,0.2),transparent_70%),radial-gradient(40rem_24rem_at_0%_10%,rgba(176,194,140,0.22),transparent_70%)]"
      />

      <Sprig className="absolute left-0 top-16 -z-10 hidden w-44 md:block lg:w-56" />
      <Sprig className="absolute right-0 top-16 -z-10 hidden w-44 md:block lg:w-56" flip />

      <div className="wrap relative flex flex-1 flex-col items-center justify-center pb-28 pt-8 text-center sm:pb-36 sm:pt-12">
        {/* The festival emblem, faded and slowly turning behind the title */}
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[44%] -z-10 w-[min(118vw,48rem)] -translate-x-1/2 -translate-y-1/2">
          <div className="emblem-breathe">
            <div className="emblem-turn">
              <Image src={brand.logo.src} alt="" width={brand.logo.w} height={brand.logo.h} sizes="(min-width:768px) 48rem, 118vw" quality={90} className="h-auto w-full select-none" priority />
            </div>
          </div>
        </div>

        <Reveal className="flex flex-col items-center">
          <a href={org.site} aria-label={`${org.name}, website`} className="transition-opacity hover:opacity-80">
            <Image src={brand.rays.src} alt={brand.rays.alt} width={brand.rays.w} height={brand.rays.h} className="h-16 w-auto sm:h-20" priority />
          </a>
          <p className="serif mt-2 text-[1.1rem] italic text-ink-muted">{org.name} presents</p>

          <h1 className="display mt-5 text-balance text-[clamp(2.8rem,1.1rem+6.6vw,6.5rem)] leading-[0.96] tracking-[-0.01em]">
            <span className="whitespace-nowrap">
              <span className="text-[1.5em] leading-none">9</span>
              <sup className="mr-[0.15em] align-[0.95em] text-[0.4em] italic">th</sup>
              International
            </span>
            <br />
            Ancient Arts Festival <span className="whitespace-nowrap text-maroon">2026</span>
          </h1>
          <LotusRule className="mx-auto mt-6 w-[min(80%,22rem)]" />
          <p className="serif mt-5 max-w-2xl text-balance text-[clamp(1.2rem,1.05rem+0.7vw,1.6rem)] italic leading-snug text-olive">{event.subtitle}</p>
        </Reveal>

        <Reveal delay={100} className="mt-7 flex flex-col items-center">
          <p className="serif flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[clamp(1.15rem,1rem+0.6vw,1.5rem)] font-medium text-maroon">
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
          <p className="serif mt-2 text-lg text-ink-muted">
            Curated and directed by <span className="font-medium text-ink">Dr. {event.director}</span> <span className="whitespace-nowrap">· {event.timeLabel}</span>
          </p>
          <p className="motto mt-4 justify-center" aria-label={event.motto.join(", ")}>
            {event.motto.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </p>
        </Reveal>

        <Reveal delay={180} className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <EPassLink className="btn btn-primary !min-h-[3.25rem] !px-7 text-base" />
          <a href="#programme" className="link-arrow">
            See the programme
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>
      </div>

      {/* The poster's hills close the opening */}
      <Hills className="absolute inset-x-0 bottom-0 -z-10 h-28 sm:h-40" />
    </section>
  );
}
