import { curator, event } from "@/content/event";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { Seal } from "@/components/ui/Seal";

/** Why the festival exists, and the person who shapes it. */
export function About() {
  const [lead, ...rest] = event.about;
  return (
    <section id="about" className="section">
      <div className="wrap grid items-start gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        {/* One column, one measure: heading, lead and body share the same left edge and width */}
        <div className="max-w-[36rem]">
          <Reveal>
            <h2 className="section-title">{event.intro}</h2>
            <p className="serif mt-8 text-[clamp(1.3rem,1.15rem+0.6vw,1.6rem)] leading-[1.45] text-ink">{lead}</p>
          </Reveal>
          <div className="reading mt-6 space-y-5">
            {rest.map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* The director: portrait, name with the festival seal beside it, then her story */}
        <Reveal develop delay={120}>
          <figure className="card overflow-hidden">
            <Frame photo={curator.photo} ratio="4 / 3.4" sizes="(min-width:1024px) 30rem, 92vw" className="!rounded-none" />
            <figcaption className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="serif italic text-ink-muted">Curated and directed by</p>
                  <p className="display mt-1 text-[2rem] leading-tight">{curator.name}</p>
                  <p className="mt-1 text-sm text-ink-muted">{curator.roles}</p>
                </div>
                <Seal className="w-20 shrink-0 text-olive sm:w-24" label="Festival seal" />
              </div>
              <div className="reading mt-5 space-y-3 !text-[1.02rem]">
                {curator.bio.map((p) => (
                  <p key={p.slice(0, 20)}>{p}</p>
                ))}
              </div>
              <ul className="mt-5 space-y-1 border-t border-line pt-4 text-sm text-ink-muted">
                {curator.affiliations.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
