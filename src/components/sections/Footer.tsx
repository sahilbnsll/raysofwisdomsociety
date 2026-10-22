import Image from "next/image";
import { brand, event, org, photoCredits } from "@/content/event";
import { dateRange } from "@/lib/format";

export function Footer() {
  return (
    <footer className="on-dark bg-ink pb-28 pt-20 text-paper md:pb-12">
      <div className="wrap grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-4">
            <Image src={brand.logo.src} alt="" width={64} height={64} className="size-14 object-contain" />
            <div>
              <p className="display text-2xl leading-tight">
                {event.edition} {event.title}
              </p>
              <p className="mt-1 text-sm text-paper/60">
                {dateRange()} · {event.venue.name}, {event.venue.area}
              </p>
            </div>
          </div>
          <p className="display mt-8 text-2xl italic text-paper/85">Art heals. Connects. Awakens.</p>
        </div>

        <div>
          <p className="text-sm font-semibold">Contact the festival team</p>
          <address className="mt-4 space-y-2 text-sm not-italic leading-relaxed text-paper/70">
            <p>
              <a className="hover:text-paper" href={`tel:${org.landline.replace(/\s/g, "")}`}>
                {org.landline}
              </a>{" "}
              (landline)
            </p>
            <p>
              <a className="hover:text-paper" href={`tel:${org.mobile.replace(/\s/g, "")}`}>
                {org.mobile}
              </a>{" "}
              (mobile)
            </p>
            <p>
              <a className="hover:text-paper" href={`mailto:${org.email}`}>
                {org.email}
              </a>
            </p>
            <p className="pt-2">{org.address}</p>
          </address>
        </div>

        <div>
          <p className="text-sm font-semibold">Organised by</p>
          <a href={org.site} className="mt-4 inline-block rounded-2xl bg-paper p-3 transition-transform duration-[var(--d2)] hover:-translate-y-0.5" aria-label={`${org.name} website`}>
            <Image src={brand.rays.src} alt={brand.rays.alt} width={brand.rays.w} height={brand.rays.h} className="h-14 w-auto" />
          </a>
          <p className="mt-4 text-sm leading-relaxed text-paper/70">{org.tagline}.</p>
          <a href={org.site} className="mt-2 inline-flex min-h-8 items-center text-sm text-paper/70 underline decoration-paper/30 underline-offset-4 hover:text-paper">
            raysofwisdomsociety.net
          </a>
        </div>
      </div>

      <div className="wrap mt-16 flex flex-col gap-2 border-t border-paper/12 pt-6 text-xs leading-relaxed text-paper/50 sm:flex-row sm:justify-between sm:gap-8">
        <p>
          © {new Date().getFullYear()} {org.name}. {org.registration}.
        </p>
        <p className="max-w-xl sm:text-right">{photoCredits}</p>
      </div>
    </footer>
  );
}
