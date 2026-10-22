import { event, type Evenings } from "@/content/event";

export type Evening = "day1" | "day2";

/** Calendar date in India, whatever the device's time zone. */
export function istDate(now = new Date()): string {
  return new Date(now.getTime() + 5.5 * 3_600_000).toISOString().slice(0, 10);
}

/** The festival evening that is "tonight" in India, or null outside the festival dates. */
export function eveningOn(now = new Date()): Evening | null {
  const d = istDate(now);
  if (d === event.startDate) return "day1";
  if (d === event.endDate) return "day2";
  return null;
}

/** What the gate should check against when staff haven't picked: tonight, else the nearest evening. */
export function defaultEvening(now = new Date()): Evening {
  return eveningOn(now) ?? (istDate(now) < event.startDate ? "day1" : "day2");
}

export function validFor(days: Evenings, evening: Evening): boolean {
  return days === "both" || days === evening;
}

export const eveningName: Record<Evening, string> = {
  day1: "25 November",
  day2: "26 November",
};
