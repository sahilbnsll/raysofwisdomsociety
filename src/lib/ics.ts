import { event, org } from "@/content/event";

/** UTC form of an India-time start, as calendar files require. */
function utc(isoWithOffset: string): string {
  return new Date(isoWithOffset).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * A calendar file for one or both evenings. The client has not given an end time, so events carry a
 * start only (calendar apps show them as a point in time).
 */
export function calendarFile(which: "both" | "day1" | "day2"): string {
  const picks = which === "both" ? event.days : event.days.filter((d) => d.id === (which === "day1" ? "day-1" : "day-2"));
  const stamp = utc(new Date().toISOString());
  const where = `${event.venue.name}, ${event.venue.area}`;
  const body = picks.map((d) =>
    [
      "BEGIN:VEVENT",
      `UID:${event.slug}-${d.id}@raysofwisdomsociety.net`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${utc(`${d.date}T18:30:00+05:30`)}`,
      `SUMMARY:${event.edition} ${event.title} 2026: ${d.theme} evening`,
      `LOCATION:${where}`,
      `DESCRIPTION:${d.blurb} Organised by ${org.name}.`,
      "END:VEVENT",
    ].join("\r\n"),
  );
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Rays of Wisdom Society//IAAF 2026//EN", ...body, "END:VCALENDAR"].join("\r\n");
}

export function downloadCalendar(which: "both" | "day1" | "day2") {
  const blob = new Blob([calendarFile(which)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = which === "both" ? "iaaf-2026.ics" : `iaaf-2026-${which}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
