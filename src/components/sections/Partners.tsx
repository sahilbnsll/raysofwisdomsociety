import Image from "next/image";
import { brand, org, sponsors } from "@/content/event";

/** The poster's logo row, in words a visitor can read: who presents the festival and who supports it. */
export function Partners() {
  return (
    <section aria-label="Presented by and supported by" className="border-y border-line bg-paper/60">
      <div className="wrap flex flex-col items-center justify-center gap-6 py-7 sm:flex-row sm:gap-12">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <span className="serif text-sm italic text-ink-muted">Presented by</span>
          <a href={org.site} aria-label={org.name} className="transition-opacity hover:opacity-80">
            <Image src={brand.rays.src} alt={org.name} width={brand.rays.w} height={brand.rays.h} className="h-20 w-auto" />
          </a>
        </div>
        <span aria-hidden="true" className="hidden h-10 w-px bg-line-strong sm:block" />
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <span className="serif text-sm italic text-ink-muted">In association with</span>
          <ul className="flex items-center gap-8">
            {sponsors.map((s) => (
              <li key={s.name}>
                <Image src={s.src} alt={s.name} width={s.w} height={s.h} className="h-11 w-auto" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
