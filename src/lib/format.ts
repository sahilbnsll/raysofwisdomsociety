import { event } from "@/content/event";

/** Event dates are Indian local dates; pin the zone so the server and browser always agree. */
export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(`${iso}T12:00:00+05:30`).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", ...opts });

/** "25 to 26 November 2026" (or "30 November to 2 December 2026" across months). */
export function dateRange(): string {
  const sameMonth = event.startDate.slice(0, 7) === event.endDate.slice(0, 7);
  const a = fmtDate(event.startDate, sameMonth ? { day: "numeric" } : { day: "numeric", month: "long" });
  const b = fmtDate(event.endDate, { day: "numeric", month: "long", year: "numeric" });
  return `${a} to ${b}`;
}
