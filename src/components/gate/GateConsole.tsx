"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { defaultEvening, eveningName, type Evening } from "@/lib/epass/evening";
import type { Verdict } from "@/lib/epass/verdict";
import { GateBackdrop, GateHeader, IconAlert, IconScan, TabLabel, eveningTabs, segmented, segmentItem } from "./gate-ui";
import { passIdFrom, Scanner } from "./Scanner";
import { VerdictCard } from "./VerdictCard";

interface Stats {
  passes: number;
  people: number;
  expectedPasses: number;
  expectedPeople: number;
  admittedPasses: number;
  admittedPeople: number;
  shared: boolean;
}

interface Check {
  key: string;
  verdict: Verdict;
}

/**
 * The scanner console. On a phone it is one column in the order a guest meets it: the evening, the
 * numbers, the camera, the answer. On a laptop or tablet it splits in two so nothing is wasted: scanning and
 * the answer on the left, tonight's numbers on the right. To re-check a pass, scan it again.
 */
export function GateConsole() {
  const [evening, setEvening] = useState<Evening>(() => defaultEvening());
  const [stats, setStats] = useState<Stats | null>(null);
  const [scanning, setScanning] = useState(false);
  const [checking, setChecking] = useState(false);
  const [manual, setManual] = useState("");
  const [current, setCurrent] = useState<Check | null>(null);
  const [error, setError] = useState("");
  const manualRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const loadStats = useCallback(async () => {
    if (document.visibilityState === "hidden") return;
    try {
      const r = await fetch(`/api/gate/stats?evening=${evening}`, { cache: "no-store" });
      if (r.status === 401) return location.reload();
      if (r.ok) setStats(await r.json());
    } catch {
      /* keep the last numbers */
    }
  }, [evening]);

  // The numbers refresh every 15 seconds, and straight away when the phone is picked up again.
  useEffect(() => {
    const first = setTimeout(loadStats, 0);
    const t = setInterval(loadStats, 15_000);
    document.addEventListener("visibilitychange", loadStats);
    return () => {
      clearTimeout(first);
      clearInterval(t);
      document.removeEventListener("visibilitychange", loadStats);
    };
  }, [loadStats]);

  const check = useCallback(
    async (id: string) => {
      setError("");
      setScanning(false);
      setChecking(true);
      try {
        const r = await fetch(`/api/gate/check?id=${encodeURIComponent(id)}&evening=${evening}`, { cache: "no-store" });
        if (r.status === 401) return location.reload(); // the 14-hour sign-in ran out: back to the PIN
        const v = (await r.json()) as Verdict & { error?: string };
        if (!r.ok) throw new Error(v.error ?? "Could not check that pass.");
        setCurrent({ key: `${id}-${Date.now()}`, verdict: v });
      } catch (e) {
        setError(e instanceof TypeError ? "No connection. Check the phone's signal, then scan the pass again." : (e as Error).message);
      } finally {
        setChecking(false);
        // On a laptop, keep the cursor in the box so the next number can be typed straight away.
        if (window.matchMedia("(pointer: fine)").matches) manualRef.current?.focus({ preventScroll: true });
      }
    },
    [evening],
  );

  // Bring a fresh answer into view: on a phone it can sit below the fold.
  useEffect(() => {
    if (current) resultRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [current]);

  const onChange = useCallback(() => {
    loadStats();
  }, [loadStats]);

  /** Starts the camera for the next pass and clears the last answer, so it never sits there stale. */
  function scanNext() {
    setCurrent(null);
    setError("");
    setScanning(true);
  }

  async function signOut() {
    await fetch("/api/gate/session", { method: "DELETE" });
    location.reload();
  }

  const pct = stats && stats.expectedPeople ? Math.round((stats.admittedPeople / stats.expectedPeople) * 100) : 0;
  const dash = "–";

  return (
    <div className="relative isolate min-h-svh overflow-hidden">
      <GateBackdrop />
      <div className="mx-auto w-full max-w-5xl px-4 pb-40 pt-5 sm:px-6 lg:pt-8">
        <GateHeader>
          <button type="button" onClick={signOut} className="btn btn-secondary !min-h-9 !px-4 !py-1.5 text-[0.8125rem]">
            Sign out
          </button>
        </GateHeader>

        {/* One column on a phone (the order below is the `order-` numbers); two columns from a tablet up. */}
        <div className="mt-5 flex flex-col gap-4 lg:mt-7 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-6">
          {/* Left: choose the evening, scan or type, and the answer */}
          <div className="contents lg:flex lg:flex-col lg:gap-4">
            <div role="radiogroup" aria-label="Evening being checked" className={`${segmented} order-1`}>
              {eveningTabs.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={evening === o.value}
                  aria-label={o.aria}
                  onClick={() => {
                    setEvening(o.value);
                    setStats(null);
                    setCurrent(null);
                  }}
                  className={segmentItem(evening === o.value)}
                >
                  <TabLabel date={o.date} theme={o.theme} />
                </button>
              ))}
            </div>

            {stats && !stats.shared && (
              <p role="alert" className="order-2 flex gap-3 rounded-2xl border border-maroon/30 bg-maroon/10 p-4 text-sm font-semibold leading-relaxed text-maroon-deep">
                <span className="mt-0.5 shrink-0 text-maroon">
                  <IconAlert />
                </span>
                <span>
                  Database not connected. Passes and check-ins live in one server&apos;s memory, so a pass can show as &quot;not found&quot; or be admitted twice. Connect the
                  database before the festival.
                </span>
              </p>
            )}

            <div className="order-4">
              {scanning ? (
                <Scanner onPass={check} onClose={() => setScanning(false)} />
              ) : (
                <button type="button" onClick={scanNext} className="btn btn-primary w-full !min-h-[4.5rem] !justify-start !gap-4 !px-5 text-left lg:!min-h-24">
                  <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-paper/15 lg:size-14">
                    <IconScan />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-lg lg:text-2xl">Scan a pass</span>
                    <span className="block text-sm font-normal opacity-80">Point the camera at the QR code</span>
                  </span>
                </button>
              )}
            </div>

            <form
              className="order-5 flex items-center gap-1.5 rounded-full bg-paper p-1.5 pl-5 shadow-e1 ring-1 ring-line-strong focus-within:ring-ink-muted"
              onSubmit={(e) => {
                e.preventDefault();
                const text = manual.trim();
                if (!text || checking) return;
                // Accept a pasted pass link too; anything else goes to the server, which says "not a pass number".
                check(passIdFrom(text) ?? text);
                setManual("");
              }}
            >
              <label htmlFor="manual-id" className="sr-only">
                Pass number
              </label>
              <input
                ref={manualRef}
                id="manual-id"
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder="Or type a pass number"
                autoCapitalize="characters"
                autoComplete="off"
                className="bare-focus min-w-0 grow bg-transparent py-2 text-base uppercase tracking-wide outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-muted/80"
              />
              <button type="submit" disabled={checking} className="btn !min-h-11 bg-ink !px-6 text-paper hover:bg-olive">
                {checking ? "Checking…" : "Check"}
              </button>
            </form>

            {error && (
              <p role="alert" className="order-5 rounded-lg bg-maroon/10 px-3 py-2 text-sm font-semibold text-maroon">
                {error}
              </p>
            )}

            {current && (
              <div ref={resultRef} className="order-6 scroll-mt-4">
                <VerdictCard key={current.key} initial={current.verdict} onChange={onChange} compact />
                <button type="button" onClick={scanNext} className="btn btn-primary mt-4 w-full !min-h-14 text-base">
                  <IconScan />
                  Scan the next pass
                </button>
              </div>
            )}
          </div>

          {/* Right: tonight's numbers */}
          <div className="contents lg:block">
            {/* A ticket: tonight's numbers on top, a tear line, then the totals of every pass made */}
            <section aria-label="Check-in so far" className="card order-3 overflow-hidden">
              <div className="p-5 lg:p-7">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="serif text-lg italic text-ink-muted lg:text-xl">Inside for {eveningName[evening]}</p>
                  <p className="text-sm tabular-nums text-ink-muted">{stats ? `${stats.admittedPasses} of ${stats.expectedPasses} passes` : "…"}</p>
                </div>
                <p className="display mt-1 flex flex-wrap items-baseline gap-x-3 text-[3.5rem] leading-none tabular-nums lg:mt-2 lg:text-[5rem]">
                  {stats ? stats.admittedPeople : dash}
                  <span className="font-sans text-base font-normal leading-snug text-ink-muted">
                    checked in, of {stats ? stats.expectedPeople : dash} guests
                    <br />
                    with an e-pass for this evening
                  </span>
                </p>
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-sage lg:mt-5 lg:h-3" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Share of expected guests inside">
                  <div className="h-full rounded-full bg-olive transition-[width] duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="perforation" />
              <dl className="grid grid-cols-2 bg-sage/50 text-center">
                <div className="px-4 py-3.5 lg:py-5">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">E-passes downloaded</dt>
                  <dd className="display mt-0.5 text-3xl tabular-nums text-maroon lg:text-4xl">{stats ? stats.passes : dash}</dd>
                </div>
                <div className="border-l border-line px-4 py-3.5 lg:py-5">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Guests in all passes</dt>
                  <dd className="display mt-0.5 text-3xl tabular-nums text-maroon lg:text-4xl">{stats ? stats.people : dash}</dd>
                </div>
              </dl>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
