import { event } from "@/content/event";
import { dateRange } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CalendarButton } from "./CalendarButton";

/** Everything a visitor needs on the day: where, when, how to get there, what to bring, and answers. */
export function Visit() {
  const v = event.venue;
  const query = encodeURIComponent(`${v.name}, ${v.area}`);
  const facts: [string, React.ReactNode][] = [
    ["When", `${dateRange()}, ${event.timeLabel}`],
    ["Where", v.address],
    ["Getting there", v.metro],
    ["Entry", "Your e-pass, on your phone or printed. The gate team scans it and checks your party in."],
  ];

  return (
    <section id="visit" className="section border-t border-line">
      <div className="wrap">
        <SectionHeader title={`Plan your visit to ${v.name}`} intro="One of Delhi's best-loved stages for classical music and dance, in the arts district around Mandi House." />

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <dl className="divide-y divide-line border-y border-line">
              {facts.map(([k, val]) => (
                <div key={k} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
                  <dt className="serif italic text-ink-muted">{k}</dt>
                  <dd className="font-medium leading-relaxed">{val}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={v.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Get directions
                <span className="sr-only"> (opens Google Maps in a new tab)</span>
              </a>
              <CalendarButton />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="card overflow-hidden p-1.5">
              <iframe
                title={`Map showing ${v.name}, ${v.area}`}
                src={`https://maps.google.com/maps?q=${query}&z=15&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block aspect-[4/3] w-full rounded-[1rem] border-0 bg-sage grayscale-[0.35] sepia-[0.15]"
              />
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
