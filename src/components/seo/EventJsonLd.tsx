import { eventStartsAt, event, org, sponsors } from "@/content/event";
import { siteUrl } from "@/lib/site";

/** "A and B", "A, B and C" names become separate people; "Pandit" and friends stay with the name. */
const personNames = (name: string) => name.split(/, | and /).map((n) => n.trim()).filter(Boolean);

/**
 * schema.org Event data, so search engines can show the festival as an event (dates, venue, organiser)
 * and understand its two evenings. Nothing here is invented: no prices or ticket links are claimed
 * until the client confirms an entry policy.
 */
export function EventJsonLd() {
  const performers = [...new Set(event.days.flatMap((d) => d.sessions.flatMap((s) => s.artists.flatMap((a) => personNames(a.name)))))];
  const place = {
    "@type": "Place",
    name: event.venue.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: "1, Copernicus Marg, Mandi House",
      addressLocality: "New Delhi",
      postalCode: "110001",
      addressCountry: "IN",
    },
  };
  const organizer = { "@type": "Organization", name: org.name, url: org.site, email: org.email, telephone: org.mobile };

  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${event.edition} ${event.title} 2026`,
    alternateName: [event.searchName, "IAAF 26", event.shortTitle, `${event.title} 2026`],
    description: `${event.seoDescription} The Ancient Arts Award 2026 is presented to ${event.award.recipient}.`,
    keywords: "IAAF26, IAAF 2026, Indian classical dance, Odissi, Bharatanatyam, Kuchipudi, Kathak, santoor, rabab, Banaras Gharana, ancient arts",
    url: siteUrl,
    image: [`${siteUrl}/opengraph-image`, `${siteUrl}${event.poster.src}`],
    startDate: eventStartsAt,
    endDate: event.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: "en",
    location: place,
    organizer,
    performer: performers.map((name) => ({ "@type": "Person", name })),
    sponsor: sponsors.map((s) => ({ "@type": "Organization", name: s.name })),
    subEvent: event.days.map((d) => ({
      "@type": "Event",
      name: `${event.shortTitle}: ${d.theme} evening`,
      description: d.blurb,
      startDate: `${d.date}T18:30:00+05:30`,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: place,
      organizer,
    })),
  };

  // The site itself, so a search for the short name can show the festival's own name and address
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: event.searchName,
    alternateName: ["IAAF 26", event.shortTitle, `${event.edition} ${event.title} 2026`],
    url: siteUrl,
    inLanguage: "en-IN",
    publisher: { "@type": "Organization", name: org.name, url: org.site },
  };

  // "<" is escaped so no text in the data can close the script tag early.
  const json = (d: object) => JSON.stringify(d).replace(/</g, "\\u003c");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(data) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(website) }} />
    </>
  );
}
