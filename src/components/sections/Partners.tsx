import Image from "next/image";
import { sponsors } from "@/content/event";

/**
 * The organiser's mark is already at the top of the page, so this band only thanks the supporters,
 * as the printed pass does: "In association with" and their logos.
 */
export function Partners() {
  return (
    <section aria-label="In association with" className="border-y border-line bg-paper/60">
      <div className="wrap flex flex-col items-center justify-center gap-4 py-7 sm:flex-row sm:gap-6">
        <span className="serif text-base italic text-ink-muted">In association with</span>
        <ul className="flex items-center gap-10">
          {sponsors.map((s) => (
            <li key={s.name}>
              <Image src={s.src} alt={s.name} width={s.w} height={s.h} className="h-12 w-auto" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
