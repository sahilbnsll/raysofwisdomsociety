"use client";

import Image from "next/image";
import { useState } from "react";
import { brand } from "@/content/event";

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
      location.href = next && next.startsWith("/") ? next : "/gate";
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-svh place-items-center px-5">
      <form onSubmit={submit} className="card w-full max-w-sm p-7 text-center">
        <Image src={brand.logo.src} alt="" width={64} height={64} className="mx-auto size-16" />
        <h1 className="display mt-4 text-3xl">Gate check-in</h1>
        <p className="mt-2 text-sm text-ink-muted">For festival staff. Enter the gate PIN to scan and check in passes on this phone.</p>
        {configured ? (
          <>
            <label htmlFor="pin" className="sr-only">
              Gate PIN
            </label>
            <input
              id="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="PIN"
              className="mt-6 w-full rounded-xl border border-line-strong bg-paper px-4 py-3.5 text-center text-2xl tracking-[0.4em] outline-none focus:border-ink-muted"
            />
            {error && (
              <p role="alert" className="mt-3 text-sm font-semibold text-maroon">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy || !pin} className="btn btn-primary mt-5 w-full">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </>
        ) : (
          <p className="mt-6 rounded-xl bg-cream p-4 text-sm text-ink-muted">Check-in is not set up yet. Add a GATE_PIN in the site&apos;s settings.</p>
        )}
      </form>
    </main>
  );
}
