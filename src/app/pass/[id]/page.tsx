import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { brand, event, eveningLabels, org } from "@/content/event";
import { dateRange } from "@/lib/format";
import { getPassStore, PASS_ID } from "@/lib/epass/store";

export const metadata: Metadata = {
  title: `E-pass check | ${event.title} 2026`,
  robots: { index: false, follow: false },
};

/** "Sahil Bansal" becomes "Sahil B.": enough for a gate check, not a list of attendees. */
const mask = (name: string) => {
  const [first, ...rest] = name.split(" ");
  return rest.length ? `${first} ${rest[rest.length - 1][0]}.` : first;
};

export default async function PassCheck({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id: raw } = await params;
  const id = decodeURIComponent(raw).toUpperCase();

  let pass = null;
  let failed = false;
  if (PASS_ID.test(id)) {
    try {
      pass = await getPassStore().get(id);
    } catch {
      failed = true;
    }
  }

  const state = failed ? "error" : pass ? "valid" : "unknown";

  return (
    <main className="grid min-h-svh place-items-center bg-sage px-5 py-12">
      <article className="w-full max-w-md overflow-hidden card rounded-3xl text-center shadow-e3">
        <div className="bg-maroon px-6 pb-12 pt-8 text-paper">
          <Image src={brand.logo.src} alt={brand.logo.alt} width={72} height={72} className="mx-auto h-[4.5rem] w-auto" />
          <p className="mt-4 text-sm text-paper/75">
            {event.edition} {event.shortTitle}
          </p>
          <p className="display mt-1 text-2xl">{event.title}</p>
        </div>
        <div className="-mt-6 rounded-t-3xl bg-paper px-6 pb-8 pt-8">
          {state === "valid" && pass && (
            <>
              <p className="inline-flex items-center gap-2 rounded-full bg-sage px-4 py-1.5 text-sm font-semibold text-ink">
                <span aria-hidden="true" className="size-2 rounded-full bg-olive" />
                Valid e-pass
              </p>
              <p className="display mt-5 text-5xl">{mask(pass.name)}</p>
              <p className="mt-2 text-ink-muted">
                Admits {pass.guests} {pass.guests === 1 ? "person" : "people"} · {eveningLabels[pass.days].short}
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line text-left text-sm">
                <div className="bg-paper p-3">
                  <dt className="text-xs text-ink-muted">Pass number</dt>
                  <dd className="mt-0.5 font-semibold tracking-wider">{pass.id}</dd>
                </div>
                <div className="bg-paper p-3">
                  <dt className="text-xs text-ink-muted">When</dt>
                  <dd className="mt-0.5 font-semibold">{dateRange()}</dd>
                </div>
                <div className="col-span-2 bg-paper p-3">
                  <dt className="text-xs text-ink-muted">Where</dt>
                  <dd className="mt-0.5 font-semibold">
                    {event.venue.name}, {event.venue.area} · {event.timeLabel}
                  </dd>
                </div>
              </dl>
            </>
          )}
          {state === "unknown" && (
            <>
              <p className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-1.5 text-sm font-semibold text-maroon">
                <span aria-hidden="true" className="size-2 rounded-full bg-maroon" />
                Pass not found
              </p>
              <p className="display mt-5 text-4xl">We could not find that pass</p>
              <p className="mt-3 text-ink-muted">
                Check the pass number ({id.slice(0, 20)}) or ask the help desk. You can get a new e-pass on the festival page.
              </p>
            </>
          )}
          {state === "error" && (
            <>
              <p className="display text-4xl">Please try again</p>
              <p className="mt-3 text-ink-muted">We could not check the pass just now. Reload this page in a moment.</p>
            </>
          )}
          <Link href="/" className="btn btn-secondary mt-8">
            Festival page
          </Link>
          <p className="mt-6 text-xs text-ink-muted">
            {org.name} · {org.mobile}
          </p>
        </div>
      </article>
    </main>
  );
}
