import { event } from "@/content/event";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";

// A small, fixed lean per print, like photographs laid on a table (see .print in globals.css).
const lean = ["-1.5deg", "1deg", "-0.75deg", "1.25deg", "-1deg", "0.75deg"];

export function Award() {
  const a = event.award;
  return (
    <section id="award" aria-labelledby="award-title" className="section">
      <div className="wrap">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <Reveal>
            <p className="serif text-lg italic text-ink-muted">A special highlight of the festival</p>
            <h2 id="award-title" className="section-title mt-3">
              {a.title}
            </h2>
            <p className="display mt-4 text-[2rem] leading-tight text-maroon">{a.recipient}</p>
            <div className="reading mt-6 max-w-xl space-y-4">
              {a.bio.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <p className="serif mt-7 max-w-xl border-l-2 border-gold pl-5 text-[clamp(1.25rem,1.1rem+0.6vw,1.55rem)] italic leading-snug text-maroon">{a.legacy}</p>
          </Reveal>
          <Reveal develop delay={100} className="mx-auto w-full max-w-[22rem]">
            <div className="arch-frame">
              <Frame photo={a.portrait} ratio="4 / 5" arch sizes="(min-width:1024px) 22rem, 80vw" />
            </div>
          </Reveal>
        </div>

        <div className="mt-24">
          <Reveal>
            <h3 className="display text-3xl">From the archive</h3>
            <p className="reading mt-2">{a.archiveIntro}</p>
          </Reveal>
          <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:gap-x-8 lg:gap-y-10">
            {a.archive.map((p, i) => (
              <Reveal as="li" key={p.photo.src} delay={(i % 6) * 60}>
                <figure className="card print h-full p-2.5 pb-4" style={{ "--lean": lean[i % lean.length] } as React.CSSProperties}>
                  <Frame photo={p.photo} ratio="4 / 5" sizes="(min-width:768px) 30vw, 46vw" className="!rounded-[0.6rem]" />
                  <figcaption className="px-2 pt-4">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="display block text-2xl leading-tight">{p.title}</span>
                      {p.year && <span className="shrink-0 text-sm tabular-nums text-ink-muted">{p.year}</span>}
                    </span>
                    <span className="serif mt-1.5 block text-[0.98rem] leading-relaxed text-ink-muted">{p.caption}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
