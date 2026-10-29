import { brand, eventStartsAt, event, org, sponsors } from "@/content/event";
import { siteUrl } from "@/lib/site";

/** "A and B", "A, B and C" names become separate people; "Pandit" and friends stay with the name. */
const personNames = (name: string) => name.split(/, | and /).map((n) => n.trim()).filter(Boolean);

/** "<" is escaped so no text in the data can close the script tag early. */
const json = (d: object) => JSON.stringify(d).replace(/</g, "\\u003c");

/**
 * Structured data (schema.org) in four linked parts, so search engines understand what this page is:
 * the Event (dates, venue, organiser, the two evenings), the WebSite (its name is IAAF26), the
 * Organization behind it, and the FAQ shown on the page. Nothing here is invented: no prices or ticket
 * links are claimed until the client confirms an entry policy, and every question and answer is the
 * one visitors can read in the page.
 */
export function EventJsonLd() {
  const ids = { site: `${siteUrl}/#website`, event: `${siteUrl}/#event`, org: `${siteUrl}/#organization` };
  const performers = [...new Set(event.days.flatMap((d) => d.sessions.flatMap((s) => s.artists.flatMap((a) => personNames(a.name)))))];

  const place = {
    "@type": "Place",
    name: event.venue.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: "1, Copernicus Marg, Mandi House",
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      postalCode: "110001",
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: 28.625, longitude: 77.2336 },
    hasMap: event.venue.mapUrl,
  };

  const organization = {
    "@type": "Organization",
    "@id": ids.org,
    name: org.name,
    url: org.site,
    logo: { "@type": "ImageObject", url: `${siteUrl}${brand.rays.src}`, width: brand.rays.w, height: brand.rays.h },
    email: org.email,
    telephone: org.mobile,
    address: {
      "@type": "PostalAddress",
      streetAddress: "5th Floor, 86, Padma Palace, Nehru Place",
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      postalCode: "110019",
      addressCountry: "IN",
    },
    contactPoint: [
      { "@type": "ContactPoint", contactType: "customer support", name: org.coordinator.name, telephone: org.coordinator.phone, areaServed: "IN" },
      { "@type": "ContactPoint", contactType: "customer support", telephone: org.mobile, email: org.email, areaServed: "IN" },
    ],
  };

  const eventData = {
    "@context": "https://schema.org",
    // A festival of dance and of music: all three are kinds of Event, so it stays eligible for event results
    "@type": ["Festival", "DanceEvent", "MusicEvent"],
    "@id": ids.event,
    name: `${event.edition} ${event.title} 2026`,
    alternateName: [event.searchName, "IAAF 26", event.shortTitle, `${event.title} 2026`],
    description: `${event.seoDescription} The first evening, 25 November, brings Odissi, classical ballet, Bharatanatyam, Kuchipudi and Kathak with the Russian folk dance Sudarushka; the second, 26 November, is classical music: santoor, rabab and a Hindustani classical vocal recital in the Banaras Gharana tradition. The Ancient Arts Award 2026 is presented to ${event.award.recipient}.`,
    keywords:
      "IAAF26, IAAF 2026, art event in Delhi, classical dance festival Delhi, Indian classical dance, Kathak performance Delhi, Odissi, Bharatanatyam, Kuchipudi, Kathak, classical music concert Delhi, santoor, rabab, Hindustani classical vocal, Banaras Gharana, cultural event New Delhi November 2026, ancient arts",
    about: [
      "Indian classical dance",
      "Odissi",
      "Bharatanatyam",
      "Kuchipudi",
      "Kathak",
      "Classical ballet",
      "Russian folk dance",
      "Hindustani classical music",
      "Santoor",
      "Rabab",
      "Indian arts and culture",
    ].map((name) => ({ "@type": "Thing", name })),
    url: siteUrl,
    mainEntityOfPage: siteUrl,
    image: [`${siteUrl}/opengraph-image`, `${siteUrl}${event.poster.src}`],
    startDate: eventStartsAt,
    endDate: event.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: "en",
    location: place,
    organizer: organization,
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
      organizer: { "@id": ids.org },
    })),
  };

  // The site itself, so a search for the short name can show the festival's own name and address
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": ids.site,
    name: event.searchName,
    alternateName: ["IAAF 26", event.shortTitle, `${event.edition} ${event.title} 2026`],
    url: siteUrl,
    inLanguage: "en-IN",
    publisher: { "@id": ids.org },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: event.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(eventData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(faq) }} />
    </>
  );
}
