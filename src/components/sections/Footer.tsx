import Image from "next/image";
import Link from "next/link";
import { brand, event, org, sponsors } from "@/content/event";
import { dateRange } from "@/lib/format";
import { EPassLink } from "@/components/epass/EPassLink";
import { Seal } from "@/components/ui/Seal";

/**
 * The foot of the page answers the last questions in one place: the festival at a glance with the
 * one action, then four tidy columns (when, where, who to call, who makes it possible).
 */
export function Footer() {
  const columns = [
    {
      title: "The festival",
      body: (
        <>
          <p>{dateRange()}</p>
          <p>{event.timeLabel}</p>
          <p className="serif mt-3 italic text-paper/85">{event.motto.join(" · ")}</p>
        </>
      ),
    },
    {
      title: "The venue",
      body: (
        <>
          <p>{event.venue.address}</p>
          <p className="mt-2">Nearest metro: Mandi House</p>
          <a href={event.venue.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-paper underline decoration-paper/35 underline-offset-4 hover:decoration-paper">
            Get directions<span className="sr-only"> (opens Google Maps in a new tab)</span>
          </a>
        </>
      ),
    },
    {
      title: "Contact",
      body: (
        <>
          <p>
            <span className="font-semibold text-paper">{org.coordinator.name}</span>
            <span className="block text-paper/55">{org.coordinator.role}</span>
            <a className="hover:text-paper" href={`tel:${org.coordinator.phone.replace(/\s/g, "")}`}>
              {org.coordinator.phone}
            </a>
          </p>
          <p className="!mt-3 text-paper/55">Festival office</p>
          <p>
            <a className="hover:text-paper" href={`tel:${org.mobile.replace(/\s/g, "")}`}>
              {org.mobile}
            </a>
          </p>
          <p>
            <a className="hover:text-paper" href={`tel:${org.landline.replace(/\s/g, "")}`}>
              {org.landline}
            </a>
          </p>
          <p>
            <a className="break-all hover:text-paper" href={`mailto:${org.email}`}>
              {org.email}
            </a>
          </p>
        </>
      ),
    },
  ];

  return (
    <footer className="on-dark bg-ink text-paper">
      <div className="wrap">
        {/* The festival at a glance, with the one thing to do */}
        <div className="flex flex-col items-start justify-between gap-8 border-b border-paper/12 py-14 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <Seal className="w-20 shrink-0 text-paper/80 sm:w-24" />
            <div>
              <p className="display text-[clamp(1.6rem,1.3rem+1vw,2.2rem)] leading-tight">
                {event.edition} {event.title}
              </p>
              <p className="mt-1 text-paper/65">
                #{event.searchName} · {dateRange()} · {event.venue.name}, {event.venue.area}
              </p>
            </div>
          </div>
          <EPassLink className="btn btn-primary shrink-0 !min-h-12 !px-6" />
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.3fr]">
          {columns.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-semibold text-paper">{c.title}</p>
              <div className="mt-3 space-y-1 text-sm leading-relaxed text-paper/65">{c.body}</div>
            </div>
          ))}

          <div>
            <p className="text-sm font-semibold text-paper">Presented by</p>
            <a href={org.site} aria-label={`${org.name} website`} className="mt-3 flex h-20 w-44 items-center justify-center rounded-2xl bg-paper p-2.5 transition-transform duration-[var(--d2)] hover:-translate-y-0.5">
              <Image src={brand.rays.src} alt={brand.rays.alt} width={brand.rays.w} height={brand.rays.h} className="h-full w-auto object-contain" />
            </a>
            <p className="mt-5 text-sm font-semibold text-paper">In association with</p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {sponsors.map((s) => (
                <li key={s.name} className="flex h-16 w-[8.5rem] items-center justify-center rounded-2xl bg-paper p-3">
                  <Image src={s.src} alt={s.name} width={s.w} height={s.h} className="max-h-full w-auto object-contain" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-paper/12 py-6 pb-28 text-xs text-paper/70 sm:flex-row sm:items-center sm:justify-between md:pb-6">
          <p>
            © {new Date().getFullYear()} {org.name} · {org.registration} · {org.address}
          </p>
          <div className="flex gap-5">
            <a href={org.site} className="hover:text-paper">
              raysofwisdomsociety.net
            </a>
            <Link href="/gate" className="hover:text-paper">
              Gate staff
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
