"use client";

import { useState } from "react";
import { event } from "@/content/event";
import { GateBackdrop, Medallion } from "./gate-ui";

/** Only our own pass and gate pages are valid places to return to ("//evil.com" and the like are not). */
const safeNext = (next?: string) => (next && /^\/(?:gate|p\/[A-Za-z0-9-]{1,24}|pass\/[A-Za-z0-9-]{1,24})$/.test(next) ? next : "/gate");

/** Staff sign-in: a sage ticket header like the e-pass and the venue card, then the PIN. */
export function GateLogin({ configured, next }: { configured: boolean; next?: string }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/gate/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }) });
      const data = (await r.json()) as { error?: string };
      if (!r.ok) throw new Error(data.error ?? "Could not sign in.");
      // Back to the pass that was scanned, if that is how staff got here.
      location.href = safeNext(next);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <main className="relative isolate grid min-h-svh place-items-center overflow-hidden px-5 py-10">
      <GateBackdrop />
      <form onSubmit={submit} className="card w-full max-w-sm overflow-hidden text-center shadow-e3">
        <div className="bg-sage px-6 pb-7 pt-8">
          <div className="flex justify-center">
            <Medallion size="lg" />
          </div>
          <p className="serif mt-4 italic text-olive">For festival staff</p>
          <h1 className="display mt-1 text-4xl leading-tight">Gate check-in</h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            {event.searchName} · {event.venue.name}
          </p>
        </div>
        <div className="perforation" />

        <div className="px-6 pb-7 pt-6">
          {configured ? (
            <>
              <label htmlFor="pin" className="block text-left text-sm font-semibold">
                Gate PIN
              </label>
              <input
                id="pin"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                type="password"
                autoComplete="current-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="• • • • • •"
                aria-describedby={error ? "pin-error" : "pin-help"}
                className="bare-focus mt-2 w-full rounded-xl border border-line-strong bg-cream/60 px-4 py-3.5 text-center text-2xl tracking-[0.4em] outline-none transition-shadow placeholder:tracking-[0.3em] focus:border-ink-muted focus:shadow-[0_0_0_3px_rgb(180_141_60/0.28)]"
              />
              {error ? (
                <p id="pin-error" role="alert" className="mt-3 rounded-lg bg-maroon/10 px-3 py-2 text-sm font-semibold text-maroon">
                  {error}
                </p>
              ) : (
                <p id="pin-help" className="mt-3 text-sm text-ink-muted">
                  Enter the PIN to scan and check in passes on this phone.
                </p>
              )}
              <button type="submit" disabled={busy || !pin} className="btn btn-primary mt-5 w-full !min-h-[3.25rem] text-base">
                {busy ? "Signing in…" : "Sign in"}
              </button>
            </>
          ) : (
            <p className="rounded-xl bg-cream p-4 text-sm text-ink-muted ring-1 ring-line">
              Check-in is not set up yet. Add GATE_PIN and GATE_SECRET in the site&apos;s settings.
            </p>
          )}
        </div>
      </form>
    </main>
  );
}
