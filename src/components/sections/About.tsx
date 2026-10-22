import { curator, event } from "@/content/event";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { Seal } from "@/components/ui/Seal";

/** Why the festival exists, and the person who shapes it. */
export function About() {
  const [lead, ...rest] = event.about;
  return (
    <section id="about" className="section">
      <div className="wrap grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <Reveal>
            <h2 className="section-title max-w-[16ch]">{event.intro}</h2>
            <p className="serif mt-8 text-[clamp(1.35rem,1.15rem+0.8vw,1.75rem)] leading-[1.45] text-ink">{lead}</p>
          </Reveal>
          <div className="reading mt-6 max-w-[38rem] space-y-5">
            {rest.map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* The director, as the person who vouches for the festival: her portrait and the seal */}
        <Reveal develop delay={120} className="lg:pt-4">
          <figure className="card relative p-5 sm:p-6">
            <Seal className="absolute -right-4 -top-6 w-24 rotate-[8deg] text-olive sm:w-28" label="Festival seal" />
            <div className="arch-frame mx-auto w-[min(100%,17rem)]">
              <Frame photo={curator.photo} ratio="3 / 4" arch sizes="17rem" />
            </div>
            <figcaption className="mt-6">
              <p className="text-sm text-ink-muted">Curated and directed by</p>
              <p className="display mt-1 text-[2rem] leading-tight">{curator.name}</p>
              <p className="serif mt-1 italic text-ink-muted">{curator.roles}</p>
              <div className="reading mt-4 space-y-3 !text-[1.02rem]">
                {curator.bio.map((p) => (
                  <p key={p.slice(0, 20)}>{p}</p>
                ))}
              </div>
              <p className="mt-4 text-sm text-ink-muted">{curator.affiliations.join(" · ")}</p>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
