import { event } from "@/content/event";
import { Reveal } from "@/components/ui/Reveal";

export function Faq() {
  return (
    <section id="faq" className="section rule-top">
      <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <Reveal>
          <h2 className="section-title">Questions, answered</h2>
          <p className="section-intro">Anything else, call or write to the festival team. Details are at the foot of the page.</p>
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
              <p className="pb-5 pr-8 leading-relaxed text-ink-muted">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
