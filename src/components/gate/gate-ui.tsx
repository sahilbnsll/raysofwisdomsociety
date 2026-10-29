import Image from "next/image";
import { brand, event } from "@/content/event";
import { Hills, Sprig } from "@/components/ui/Ornaments";
import type { Evening } from "@/lib/epass/evening";

/**
 * The few pieces every gate screen shares, so the sign-in, the scanner console and the staff view of a
 * pass look like one tool: the festival's paper, sage and olive, gold hairlines and the serif display face.
 */

/** The emblem in a small paper medallion. */
export function Medallion({ size = "md" }: { size?: "md" | "lg" }) {
  const box = size === "lg" ? "size-20" : "size-11";
  const img = size === "lg" ? 56 : 30;
  return (
    <span className={`grid ${box} shrink-0 place-items-center rounded-full bg-paper shadow-e1 ring-1 ring-line`}>
      <Image src={brand.logo.src} alt="" width={img} height={img} style={{ width: img, height: img }} />
    </span>
  );
}

/**
 * The main page's atmosphere behind every gate screen: its sage glow, gold leaf sprigs in the corners and
 * the hills along the foot. Sits behind everything (-z-10), so the parent needs `relative isolate`.
 */
export function GateBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(46rem_22rem_at_0%_0%,rgba(176,194,140,0.34),transparent_72%),radial-gradient(40rem_24rem_at_100%_100%,rgba(176,194,140,0.2),transparent_72%),radial-gradient(34rem_20rem_at_60%_30%,rgba(222,196,128,0.14),transparent_72%)]" />
      <Sprig className="absolute left-0 top-16 hidden w-44 lg:block xl:w-56" />
      <Sprig className="absolute right-0 top-16 hidden w-44 lg:block xl:w-56" flip />
      <Hills className="absolute inset-x-0 bottom-0 h-24 sm:h-36" />
    </div>
  );
}

/** Title bar of the console and the staff pass view. `children` sits on the right (sign out, a link). */
export function GateHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <Medallion />
        <div className="min-w-0 leading-tight">
          <p className="display whitespace-nowrap text-[1.4rem] lg:text-[1.75rem]">Gate check-in</p>
          <p className="truncate text-xs text-ink-muted lg:text-sm">
            {event.searchName} · {event.venue.name}
          </p>
        </div>
      </div>
      {children}
    </header>
  );
}

/** The two evenings as a switch: the date, and what is on that night. */
export const eveningTabs: { value: Evening; date: string; theme: string; aria: string }[] = [
  { value: "day1", date: "25 Nov", theme: event.days[0].short, aria: `Evening of 25 November, ${event.days[0].short.toLowerCase()}` },
  { value: "day2", date: "26 Nov", theme: event.days[1].short, aria: `Evening of 26 November, ${event.days[1].short.toLowerCase()}` },
];

export const segmented = "grid grid-cols-2 gap-1 rounded-full bg-paper p-1 shadow-e1 ring-1 ring-line";
export const segmentItem = (active: boolean) =>
  `rounded-full px-3 py-2.5 text-center text-sm leading-tight transition-colors duration-[var(--d2)] ${
    active ? "bg-ink text-paper shadow-e1" : "text-ink-muted hover:text-ink"
  }`;

/** "25 Nov · Dance" for the switch. */
export function TabLabel({ date, theme }: { date: string; theme: string }) {
  return (
    <>
      <span className="font-semibold">{date}</span>
      <span className="font-normal opacity-75"> · {theme}</span>
    </>
  );
}

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const IconScan = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16" />
  </svg>
);
export const IconCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const IconAlert = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <path d="M12 4.5 21 19.5H3L12 4.5ZM12 10v4.2M12 16.8v.1" />
  </svg>
);
export const IconCross = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
  </svg>
);
