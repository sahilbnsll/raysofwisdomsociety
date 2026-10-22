import { event } from "@/content/event";
import { dateRange } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CalendarButton } from "./CalendarButton";

const icon = {
  when: <path d="M4.5 6.5h15v13h-15zM4.5 10.5h15M8.5 4v4M15.5 4v4" />,
  where: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  metro: (
    <>
      <rect x="6" y="3.5" width="12" height="13" rx="3" />
      <path d="M6 11h12M9 20l1.5-3.5M15 20l-1.5-3.5M9.5 14h.01M14.5 14h.01" />
    </>
  ),
  entry: <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8ZM14 6v12" />,
};

/** Everything a visitor needs on the day, in one card beside the map, then the questions people ask. */
export function Visit() {
  const v = event.venue;
  const query = encodeURIComponent(`${v.name}, ${v.area}`);
  const facts: { key: keyof typeof icon; title: string; text: string }[] = [
    { key: "when", title: dateRange(), text: `${event.timeLabel}, both evenings` },
    { key: "where", title: v.name, text: v.address },
    { key: "metro", title: "Mandi House metro", text: "Blue and Violet lines, a 5 to 10 minute walk" },
    { key: "entry", title: "Your e-pass", text: "On your phone or printed. The gate team scans it." },
  ];

  return (
    <section id="visit" className="section border-t border-line">
      <div className="wrap">
        <SectionHeader title="Plan your visit" intro={`${v.name} is one of Delhi's best-loved stages for classical music and dance, in the arts district around Mandi House.`} />

        <Reveal className="card mt-12 grid overflow-hidden lg:grid-cols-[minmax(0,26rem)_1fr]">
          <div className="flex flex-col p-6 sm:p-8">
            <ul className="space-y-5">
              {facts.map((f) => (
                <li key={f.key} className="flex gap-4">
                  <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-sage text-olive">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      {icon[f.key]}
                    </svg>
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="font-semibold leading-snug">{f.title}</p>
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
          <div className="relative min-h-[18rem] border-t border-line bg-sage lg:min-h-[26rem] lg:border-l lg:border-t-0">
            <iframe
              title={`Map showing ${v.name}, ${v.area}`}
              src={`https://maps.google.com/maps?q=${query}&z=15&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 grayscale-[0.3] sepia-[0.12]"
            />
          </div>
        </Reveal>

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
