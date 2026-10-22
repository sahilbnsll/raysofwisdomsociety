import { curator, event } from "@/content/event";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  const [lead, ...rest] = event.about;
  return (
    <section id="about" className="section">
      <div className="wrap grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <h2 className="section-title">{event.intro}</h2>
          </Reveal>

          <Reveal develop delay={120} className="card mt-10 flex items-center gap-5 p-4 pr-6">
            <div className="w-28 shrink-0">
              <Frame photo={curator.photo} ratio="3 / 4" arch sizes="7rem" />
            </div>
            <div>
              <p className="text-sm text-ink-muted">Curated and directed by</p>
              <p className="display mt-1 text-[1.75rem] leading-tight">{curator.name}</p>
              <p className="mt-1.5 text-sm leading-snug text-ink-muted">{curator.roles.replaceAll(" | ", ", ")}</p>
              <p className="mt-1 text-sm leading-snug text-ink-muted">{curator.affiliations.join(". ")}.</p>
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <p className="display text-[clamp(1.6rem,1.3rem+1vw,2.1rem)] leading-[1.3]">{lead}</p>
          </Reveal>
          <div className="mt-8 space-y-6 text-[1.0625rem] leading-[1.8] text-ink-muted">
            {rest.map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
