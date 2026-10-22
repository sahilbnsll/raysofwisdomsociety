import { event } from "@/content/event";
import { fmtDate } from "@/lib/format";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";

export function Performers() {
  return (
    <section id="artists" className="section rule-top">
      <div className="wrap">
        <Reveal>
          <h2 className="section-title">The artists</h2>
          <p className="section-intro">Classical traditions from India in dialogue with artists from across the world.</p>
        </Reveal>

        {event.days.map((d, di) => {
          const acts = event.acts.filter((a) => a.day === di + 1);
          return (
            <div key={d.id} className="mt-14">
              <Reveal>
                <h3 className="flex flex-wrap items-baseline gap-x-3">
                  <span className="display text-3xl">
                    {d.label}: {d.theme}
                  </span>
                  <span className="text-ink-muted">{fmtDate(d.date, { weekday: "long", day: "numeric", month: "long" })}</span>
                </h3>
              </Reveal>
              <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                {acts.map((a, i) => (
                  <Reveal as="li" develop key={a.name} delay={(i % 4) * 70}>
                    <div className="arch-frame">
                      <Frame photo={a.photo} ratio="4 / 5" arch sizes="(min-width:1024px) 20vw, (min-width:768px) 30vw, 46vw" />
                    </div>
                    <h4 className="mt-5 text-lg font-semibold leading-snug">{a.name}</h4>
                    <p className="mt-0.5 text-sm leading-snug text-ink-muted">{a.detail}</p>
                  </Reveal>
                ))}
              </ul>
            </div>
          );
        })}

        <Reveal className="mt-14 border-t border-line pt-6">
          <p className="max-w-3xl leading-relaxed text-ink-muted">
            <span className="font-semibold text-ink">Also on stage: </span>
            {event.alsoOnStage.join(", ")}.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
