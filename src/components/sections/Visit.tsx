import { event } from "@/content/event";
import { dateRange } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CalendarButton } from "./CalendarButton";

const icon = {
  when: <path d="M4.5 6.5h15v13h-15zM4.5 10.5h15M8.5 4v4M15.5 4v4" />,
  metro: (
    <>
      <rect x="6" y="3.5" width="12" height="13" rx="3" />
      <path d="M6 11h12M9 20l1.5-3.5M15 20l-1.5-3.5M9.5 14h.01M14.5 14h.01" />
    </>
  ),
  entry: <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8ZM14 6v12" />,
};

/**
 * Everything a visitor needs on the day: a ticket-style card (venue on a sage header, a tear line, then the
 * practical details) beside the map in a print frame, then the questions people ask.
 */
export function Visit() {
  const v = event.venue;
  const query = encodeURIComponent(`${v.name}, ${v.area}`);
  const facts: { key: keyof typeof icon; title: string; text: string }[] = [
    { key: "when", title: dateRange(), text: `${event.timeLabel}, both evenings` },
    { key: "metro", title: "Mandi House metro", text: "Blue and Violet lines, a 5 to 10 minute walk" },
    { key: "entry", title: "Your e-pass", text: "On your phone or printed. The gate team scans it." },
  ];

  return (
    <section id="visit" className="section border-t border-line">
      <div className="wrap">
        <SectionHeader title="Plan your visit" intro={`${v.name} is one of Delhi's best-loved stages for classical music and dance, in the arts district around Mandi House.`} />

        <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,27rem)_1fr] lg:gap-6">
          {/* A ticket, like the e-pass: the venue on a sage header, a tear line, then what to know */}
          <Reveal className="card flex flex-col overflow-hidden">
            <div className="bg-sage px-6 pb-6 pt-7 sm:px-8">
              <p className="serif italic text-olive">The venue</p>
              <h3 className="display mt-1 text-[clamp(1.9rem,1.6rem+1vw,2.4rem)] leading-tight">{v.name}</h3>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-muted">{v.address}</p>
            </div>
            <div className="perforation" />
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <ul className="space-y-5">
                {facts.map((f) => (
                  <li key={f.key} className="flex gap-4">
                    <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-paper text-maroon ring-1 ring-[color-mix(in_srgb,var(--gold)_50%,transparent)]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        {icon[f.key]}
                      </svg>
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="display text-[1.2rem] leading-snug">{f.title}</p>
                      <p className="text-sm leading-relaxed text-ink-muted">{f.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-8">
                <a href={v.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m4 11 16-7-7 16-2-7-7-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  </svg>
                  Get directions
                  <span className="sr-only"> (opens Google Maps in a new tab)</span>
                </a>
                <CalendarButton />
              </div>
            </div>
          </Reveal>

          {/* The map in a cream print frame with a gold hairline, warmed to the page's colours so the bright
              default greens, blues and pinks do not fight the cream and sage. The iframe is 15rem taller than its
              frame and shifted up, which crops off Google's place pop-up (our "Get directions" does the same job);
              the attribution along the bottom stays visible. ll= centres the map about 1 km north of the venue
              so the pin lands mid-frame after the crop. */}
          <Reveal delay={100} className="card flex min-h-[23rem] p-2 lg:min-h-[31rem]">
            <div className="relative min-h-[21rem] flex-1 overflow-hidden rounded-[0.9rem] ring-1 ring-[color-mix(in_srgb,var(--gold)_55%,transparent)] lg:min-h-[29rem]">
              <iframe
                title={`Map showing ${v.name}, ${v.area}`}
                src={`https://maps.google.com/maps?q=${query}&ll=28.6338,77.2336&t=&z=14&ie=UTF8&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-x-0 bottom-0 h-[calc(100%+15rem)] w-full border-0 [filter:sepia(0.4)_saturate(0.72)_hue-rotate(-10deg)_contrast(0.96)_brightness(1.03)]"
              />
              {/* a wash of the page's sage over the map, so it sits in the same light as everything else */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#d8dfc2]/40 mix-blend-multiply" />
              <a
                href={v.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-full bg-paper/95 px-3.5 py-2 text-sm font-semibold shadow-e1 ring-1 ring-line backdrop-blur transition-colors hover:bg-paper"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                Open in Maps
                <span className="sr-only"> (opens Google Maps in a new tab)</span>
              </a>
            </div>
          </Reveal>
        </div>

        <div id="faq" className="mt-20 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <h3 className="display text-4xl">Questions, answered</h3>
            <p className="reading mt-3">Anything else, call or write to the festival team. Their details are at the foot of the page.</p>
          </Reveal>
          <Reveal delay={100} className="card divide-y divide-line px-6 sm:px-8">
            {event.faqs.map((f) => (
              <details key={f.q} className="group py-2">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 text-left text-[1.0625rem] font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0 text-ink-muted transition-transform duration-[var(--d3)] ease-[var(--ease-out)] group-open:rotate-180">
                    <path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <p className="reading pb-5 pr-8 !text-base">{f.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
