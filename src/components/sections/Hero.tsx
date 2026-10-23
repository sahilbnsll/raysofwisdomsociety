import Image from "next/image";
import { brand, event, org } from "@/content/event";
import { EPassLink } from "@/components/epass/EPassLink";
import { Hills, LotusRule, Sprig } from "@/components/ui/Ornaments";

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
        className="absolute inset-0 -z-20 bg-[radial-gradient(50rem_30rem_at_0%_0%,rgba(176,194,140,0.3),transparent_72%),radial-gradient(44rem_30rem_at_50%_42%,rgba(222,196,128,0.16),transparent_72%),radial-gradient(44rem_26rem_at_100%_100%,rgba(176,194,140,0.16),transparent_72%)]"
      />

      <Sprig className="absolute left-0 top-16 -z-10 hidden w-44 md:block lg:w-56" />
      <Sprig className="absolute right-0 top-16 -z-10 hidden w-44 md:block lg:w-56" flip />

      <div className="wrap relative flex flex-1 flex-col items-center justify-center pb-16 pt-8 text-center sm:pt-12 lg:grid lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-x-2 lg:pb-[clamp(2.5rem,8svh,5.5rem)] lg:pt-4 lg:text-left">
        {/* The festival emblem, faded and slowly turning. On a phone it sits behind the title (the artists need the
            width there); from tablet up it sits centred behind the artists instead, in the collage's own box below. */}
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[30%] -z-10 w-[min(118vw,48rem)] -translate-x-1/2 -translate-y-1/2 md:hidden">
          <div className="emblem-breathe">
            <div className="emblem-turn">
              <Image src={brand.emblem.src} alt="" width={brand.emblem.w} height={brand.emblem.h} sizes="118vw" quality={85} className="h-auto w-full select-none" />
            </div>
          </div>
        </div>

        {/* On a phone the three blocks and the artists are separate steps, so the artists can come right after the title; on a wide screen the blocks sit together in the left column. */}
        <div className="contents lg:flex lg:flex-col lg:items-start">
        <div className="hero-rise order-1 flex flex-col items-center lg:items-start">
          {/* beside each other on a wide screen, to save height */}
          <div className="flex flex-col items-center lg:flex-row lg:gap-3">
          <a href={org.site} aria-label={`${org.name}, website`} className="transition-opacity hover:opacity-80">
            <Image src={brand.rays.src} alt={brand.rays.alt} width={brand.rays.w} height={brand.rays.h} className="h-16 w-auto sm:h-20 lg:h-[clamp(2.5rem,6svh,4.5rem)]" priority />
          </a>
          <p className="serif mt-2 text-[1.1rem] italic text-ink-muted lg:mt-0">{org.name} presents</p>
          </div>

          <h1 className="display mt-5 text-balance text-[clamp(2.8rem,1.1rem+6.6vw,6.5rem)] leading-[0.95] lg:mt-[2svh] lg:text-[clamp(2.4rem,min(4.2vw,6.6svh),4.6rem)] tracking-[-0.015em] text-[#1d2714] [text-shadow:0_1px_0_rgb(255_255_255/0.6),0_0_28px_rgb(246_239_224/0.9)]">
            <span className="whitespace-nowrap">
              <span className="text-[1.5em] leading-none">9</span>
              <sup className="mr-[0.15em] align-[0.95em] text-[0.4em]">th</sup>
              International
            </span>
            <br />
            Ancient Arts Festival <span className="whitespace-nowrap text-maroon [text-shadow:0_1px_0_rgb(255_255_255/0.5),0_0_24px_rgb(246_239_224/0.9)]">2026</span>
          </h1>
          <LotusRule className="mx-auto mt-6 w-[min(80%,22rem)] lg:mx-0 lg:mt-[2.2svh]" />
          <p className="serif mt-5 max-w-2xl text-balance text-[clamp(1.2rem,1.05rem+0.7vw,1.6rem)] lg:mt-[2svh] lg:text-[clamp(1rem,2.9svh,1.5rem)] font-medium italic leading-snug text-[#44562a]">{event.subtitle}</p>
        </div>

        <div className="hero-rise order-3 mt-7 lg:mt-[2.6svh] flex flex-col items-center lg:items-start" style={{ animationDelay: "100ms" }}>
          <p className="serif flex flex-wrap items-center justify-center gap-x-3 lg:justify-start gap-y-1 text-[clamp(1.15rem,1rem+0.6vw,1.5rem)] lg:text-[clamp(0.95rem,2.7svh,1.4rem)] font-medium text-maroon-deep">
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
          <p className="serif mt-2.5 text-[1.05rem] text-[#5b6250]">
            Curated and directed by <span className="font-medium text-ink">Dr. {event.director}</span> <span className="whitespace-nowrap">· {event.timeLabel}</span>
          </p>
          <p className="motto mt-4 justify-center lg:justify-start" aria-label={event.motto.join(", ")}>
            {event.motto.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </p>
        </div>

        <div className="hero-rise order-4 mt-9 lg:mt-[3.4svh] flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start" style={{ animationDelay: "180ms" }}>
          <EPassLink className="btn btn-primary !min-h-[3.25rem] !px-7 text-base" />
          <a href="#programme" className="link-arrow">
            See the programme
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
        </div>

        {/* The artists, cut out and grouped: the first thing that shows who is performing. They stand on the hills. */}
        <div className="hero-rise relative order-2 mt-7 w-full max-w-[38rem] lg:order-none lg:-mb-12 lg:-ml-[8%] lg:mt-0 lg:w-[122%] lg:max-w-none xl:-ml-[14%] xl:w-[134%] lg:self-end" style={{ animationDelay: "250ms" }}>
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[44%] -z-10 hidden w-[130%] -translate-x-1/2 -translate-y-1/2 md:block">
            <div className="emblem-breathe">
              <div className="emblem-turn">
                <Image src={brand.emblem.src} alt="" width={brand.emblem.w} height={brand.emblem.h} sizes="(min-width:1024px) 54rem, 50rem" quality={85} className="h-auto w-full select-none" />
              </div>
            </div>
          </div>
          <Image
            src={brand.collage.src}
            alt={brand.collage.alt}
            width={brand.collage.w}
            height={brand.collage.h}
            sizes="(min-width:1024px) 50rem, (min-width:640px) 38rem, 92vw"
            quality={85}
            priority
            className="h-auto w-full select-none [mask-image:linear-gradient(to_bottom,#000_92%,transparent)] lg:[mask-image:linear-gradient(to_bottom,#000_84%,transparent)]"
          />
        </div>
      </div>

      {/* The poster's hills close the opening, lying in front of the artists' feet */}
      <Hills className="absolute inset-x-0 bottom-0 z-10 h-28 sm:h-40" />
    </section>
  );
}
