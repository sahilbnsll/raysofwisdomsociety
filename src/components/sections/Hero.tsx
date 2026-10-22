import { event, org, photos } from "@/content/event";
import { dateRange } from "@/lib/format";
import { EPassLink } from "@/components/epass/EPassLink";
import { EPassCounter } from "@/components/epass/EPassCounter";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { Countdown } from "./Countdown";

const Icon = {
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  pin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  clock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

export function Hero() {
  return (
    <section id="top" className="relative isolate -mt-[var(--header-h)] overflow-hidden pt-[var(--header-h)]">
      {/* The poster's watercolour, kept faint: rose at the top corner, green low on the left */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(52rem_30rem_at_100%_0%,rgba(205,140,140,0.2),transparent_72%),radial-gradient(46rem_28rem_at_0%_88%,rgba(160,182,118,0.24),transparent_72%)] [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
      />

      <div className="wrap grid items-center gap-14 pb-20 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-28 lg:pt-16">
        <div>
          <Reveal>
            <p className="text-[0.95rem] text-ink-muted">
              {org.name} presents the {event.edition} edition
            </p>
            <h1 className="display mt-4 text-[clamp(3rem,1.4rem+6vw,6.5rem)] leading-[0.95] [@media(max-height:520px)_and_(orientation:landscape)]:text-[clamp(2.5rem,7vw,3.5rem)]">
              International Ancient Arts Festival
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">{event.subtitle}</p>
          </Reveal>

          <Reveal delay={100}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[0.95rem]">
              <li className="flex items-center gap-2">
                <span className="text-olive">{Icon.calendar}</span>
                {dateRange()}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-olive">{Icon.pin}</span>
                {event.venue.name}, {event.venue.area}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-olive">{Icon.clock}</span>
                {event.timeLabel}
              </li>
            </ul>
          </Reveal>

          <Reveal delay={180} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <EPassLink className="btn btn-primary !min-h-[3.25rem] !px-7 text-base" />
            <a href="#programme" className="link-arrow">
              See the programme
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Reveal>

          <Reveal delay={240} className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
            <EPassCounter />
            <span aria-hidden="true" className="hidden h-4 w-px bg-line-strong sm:block" />
            <Countdown />
          </Reveal>
        </div>

        {/* Three temple arches: dance and music, as on the poster */}
        <div className="relative mx-auto w-full max-w-[32rem] lg:max-w-none">
          <div className="relative aspect-[1/1.02]">
            <Reveal develop delay={60} className="absolute bottom-0 left-0 w-[37%]">
              <div className="arch-frame">
                <Frame photo={photos.gauriTwirl} ratio="3 / 4.3" arch sizes="(min-width:1024px) 17vw, 38vw" />
              </div>
            </Reveal>
            <Reveal develop className="absolute left-1/2 top-0 w-[44%] -translate-x-1/2">
              <div className="arch-frame">
                <Frame photo={photos.amritaRed} ratio="3 / 4.5" arch priority sizes="(min-width:1024px) 20vw, 46vw" />
              </div>
            </Reveal>
            <Reveal develop delay={120} className="absolute bottom-8 right-0 w-[37%]">
              <div className="arch-frame">
                <Frame photo={photos.mishraDuo} ratio="3 / 4.3" arch sizes="(min-width:1024px) 17vw, 38vw" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
