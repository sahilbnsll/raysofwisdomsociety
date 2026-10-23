import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { brand, event, eveningLabels, org } from "@/content/event";
import { dateRange } from "@/lib/format";
import { isStaff } from "@/lib/epass/gate";
import { getPassStore, normalisePassId, PASS_ID, usingSharedStore } from "@/lib/epass/store";
import { defaultEvening, eveningName, type Evening } from "@/lib/epass/evening";
import { toGatePass, verdictFor } from "@/lib/epass/verdict";
import { VerdictCard } from "@/components/gate/VerdictCard";
import { Seal } from "@/components/ui/Seal";

export const metadata: Metadata = {
  title: "E-pass",
  description: `Show this e-pass at the gate: ${event.edition} ${event.title} 2026, Kamani Auditorium, New Delhi.`,
  robots: { index: false, follow: false },
  openGraph: { type: "website", title: `E-pass for the ${event.edition} ${event.title} 2026`, description: "Show this e-pass at the gate. The festival team scans its QR code and checks you in." },
};

/** "Sahil Bansal" becomes "Sahil B.": enough for a guest to recognise, not a list of attendees. */
const mask = (name: string) => {
  const [first, ...rest] = name.split(" ");
  return rest.length ? `${first} ${rest[rest.length - 1][0]}.` : first;
};

/**
 * What a pass's QR code opens. Gate staff (signed in at /gate) get the verdict and the check-in
 * button; anyone else sees a calm confirmation that the pass is real and what to do with it.
 */
export default async function PassPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ evening?: string }> }) {
  await connection();
  const { id: raw } = await params;
  const { evening: asked } = await searchParams;
  // Staff check against tonight by default, or the evening they pick with the switch below.
  const evening: Evening = asked === "day1" || asked === "day2" ? asked : defaultEvening();
  const id = normalisePassId(decodeURIComponent(raw));

  let pass = null;
  let failed = false;
  if (PASS_ID.test(id)) {
    try {
      pass = await getPassStore().get(id);
    } catch {
      failed = true;
    }
  }

  if (await isStaff()) {
    const verdict = { ...verdictFor(pass && toGatePass(pass), evening), shared: usingSharedStore(), ...(PASS_ID.test(id) ? {} : { invalid: true }) };
    return (
      <main className="mx-auto min-h-svh w-full max-w-xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-ink-muted">
            <Image src={brand.logo.src} alt="" width={28} height={28} className="size-7" /> Gate check-in
          </span>
          <Link href="/gate" className="text-sm font-semibold underline underline-offset-4">
            Open the scanner
          </Link>
        </div>
        <nav aria-label="Evening being checked" className="mb-4 grid grid-cols-2 rounded-full bg-paper p-1 shadow-e1 ring-1 ring-line">
          {(["day1", "day2"] as const).map((e) => (
            <Link
              key={e}
              href={`?evening=${e}`}
              replace
              aria-current={evening === e ? "true" : undefined}
              className={`rounded-full py-2.5 text-center text-sm font-semibold transition-colors ${evening === e ? "bg-ink text-paper" : "text-ink-muted"}`}
            >
              Evening of {eveningName[e]}
            </Link>
          ))}
        </nav>
        {failed ? <p className="card p-6">Could not reach the pass list. Try again in a moment.</p> : <VerdictCard key={evening} initial={verdict} />}
      </main>
    );
  }

  const state = failed ? "error" : pass ? "valid" : "unknown";

  return (
    <main className="grid min-h-svh place-items-center px-5 py-10">
      <article className="card w-full max-w-md overflow-hidden text-center shadow-e3">
        <div className="relative bg-sage px-6 pb-8 pt-8">
          <Seal className="mx-auto w-28 text-olive" />
          <p className="mt-4 text-sm text-ink-muted">
            {event.edition} {event.title}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {dateRange()} · {event.venue.name}, {event.venue.area}
          </p>
        </div>
        <div className="perforation" />
        <div className="px-6 pb-8 pt-7">
          {state === "valid" && pass && (
            <>
              <p className="inline-flex items-center gap-2 rounded-full bg-sage px-3.5 py-1 text-sm font-semibold">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="m3 8.5 3.2 3L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                This is a genuine e-pass
              </p>
              <p className="display mt-5 text-5xl">{mask(pass.name)}</p>
              <p className="mt-2 text-ink-muted">
                Admits {pass.guests} {pass.guests === 1 ? "person" : "people"} · {eveningLabels[pass.days].long}
              </p>
              <p className="mt-1 text-sm tracking-[0.1em] text-ink-muted">{pass.id}</p>
              <p className="reading mt-6">Show this pass at the gate from {event.start}. The festival team will scan it and check you in.</p>
            </>
          )}
          {state === "unknown" && (
            <>
              <p className="display text-4xl">We could not find this pass</p>
              <p className="reading mt-3">Check the pass number, or make a new e-pass on the festival page. It takes a minute.</p>
            </>
          )}
          {state === "error" && (
            <>
              <p className="display text-4xl">Please try again</p>
              <p className="reading mt-3">We could not check the pass just now. Reload this page in a moment.</p>
            </>
          )}
          <Link href="/#e-pass" className="btn btn-secondary mt-7">
            Festival page
          </Link>
          <p className="mt-6 text-xs text-ink-muted">
            {org.name} · {org.mobile} ·{" "}
            <Link href={`/gate?next=/p/${encodeURIComponent(id)}`} className="underline underline-offset-2">
              Staff sign-in
            </Link>
          </p>
        </div>
      </article>
    </main>
  );
}
