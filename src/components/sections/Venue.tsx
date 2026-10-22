import { event } from "@/content/event";
import { dateRange } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";
import { CalendarButton } from "./CalendarButton";

export function Venue() {
  const v = event.venue;
  const query = encodeURIComponent(`${v.name}, ${v.area}`);
  const facts: [string, string][] = [
    ["Dates", dateRange()],
    ["Time", `${event.timeLabel}, both evenings`],
    ["Entry", "Show your e-pass at the gate"],
  ];
  return (
    <section id="venue" className="section rule-top">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <h2 className="section-title">{v.name}</h2>
          <p className="mt-2 text-lg text-ink-muted">{[v.address, v.area].filter(Boolean).join(", ")}</p>

          <dl className="mt-8 divide-y divide-line border-y border-line">
            {facts.map(([k, val]) => (
              <div key={k} className="grid grid-cols-[6rem_1fr] gap-4 py-4">
                <dt className="text-ink-muted">{k}</dt>
                <dd className="font-medium">{val}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={v.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Get directions
              <span className="sr-only"> (opens Google Maps in a new tab)</span>
            </a>
            <CalendarButton className="btn btn-secondary" />
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
    </section>
  );
}
