import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { brand, event, eveningLabels, org } from "@/content/event";
import { dateRange } from "@/lib/format";
import { isStaff } from "@/lib/epass/gate";
import { getPassStore, normalisePassId, PASS_ID } from "@/lib/epass/store";
import { defaultEvening } from "@/lib/epass/evening";
import { toGatePass, verdictFor } from "@/lib/epass/verdict";
import { VerdictCard } from "@/components/gate/VerdictCard";
import { Seal } from "@/components/ui/Seal";

export const metadata: Metadata = {
  title: "E-pass",
  robots: { index: false, follow: false },
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
export default async function PassPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id: raw } = await params;
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
    const verdict = verdictFor(pass && toGatePass(pass), defaultEvening());
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
        {failed ? <p className="card p-6">Could not reach the pass list. Try again in a moment.</p> : <VerdictCard initial={verdict} />}
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
