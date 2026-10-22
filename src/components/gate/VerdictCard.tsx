"use client";

import { useState } from "react";
import { eveningLabels } from "@/content/event";
import { eveningName, type Evening } from "@/lib/epass/evening";
import type { Verdict } from "@/lib/epass/verdict";

const time = (iso?: string) =>
  iso ? new Date(iso).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" }) : "";

const tone = {
  admit: { bar: "bg-olive text-paper", label: "Valid pass" },
  admitted: { bar: "bg-olive text-paper", label: "Admitted" },
  already: { bar: "bg-gold text-ink", label: "Already checked in" },
  "wrong-evening": { bar: "bg-maroon text-paper", label: "Not for tonight" },
  "not-found": { bar: "bg-maroon text-paper", label: "Pass not found" },
} as const;

/**
 * One scan, one unmistakable answer, readable at arm's length in a dim foyer: a coloured band with
 * the verdict, the guest's name and party size, and the one action that fits.
 */
export function VerdictCard({
  initial,
  onChange,
  compact = false,
}: {
  initial: Verdict;
  onChange?: (v: Verdict) => void;
  compact?: boolean;
}) {
  const [v, setV] = useState<Verdict>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const t = tone[v.state];
  const p = v.pass;

  async function send(body: { undo?: boolean }) {
    if (!p) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/gate/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, evening: v.evening, ...body }),
      });
      const data = (await res.json()) as Verdict & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not save. Try again.");
      setV(data);
      onChange?.(data);
      if (navigator.vibrate) navigator.vibrate(data.state === "admitted" ? 60 : [40, 60, 40]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-3xl bg-paper shadow-e3 ring-1 ring-line" aria-live="assertive">
      <div className={`flex items-center justify-between gap-4 px-6 py-5 ${t.bar}`}>
        <p className="display text-3xl sm:text-4xl">{t.label}</p>
        {(v.state === "admit" || v.state === "admitted") && p && (
          <p className="display text-5xl tabular-nums" aria-label={`${p.guests} ${p.guests === 1 ? "person" : "people"}`}>
            {p.guests}
            <span className="ml-1 font-sans text-base font-semibold">{p.guests === 1 ? "person" : "people"}</span>
          </p>
        )}
      </div>

      <div className={compact ? "p-5" : "p-6 sm:p-8"}>
        {p ? (
          <>
            <p className="display text-4xl leading-tight">{p.name}</p>
            <p className="mt-1 text-ink-muted">
              {p.guests} {p.guests === 1 ? "person" : "people"} · {eveningLabels[p.days].long} · <span className="font-semibold tracking-wider text-ink">{p.id}</span>
            </p>

            <p className="mt-5 text-[1.0625rem]">
              {v.state === "admit" && <>Valid for the evening of {eveningName[v.evening]}. Check them in to let the party through.</>}
              {v.state === "admitted" && <>Checked in at {time(v.admittedAt)} for {eveningName[v.evening]}. Scanning it again will show this time.</>}
              {v.state === "already" && (
                <>
                  This pass was already used at <strong>{time(v.admittedAt)}</strong> on {eveningName[v.evening]}. Ask the guest if part of the party went in
                  earlier.
                </>
              )}
              {v.state === "wrong-evening" && (
                <>
                  This pass is for <strong>{eveningLabels[p.days].long}</strong>, not tonight ({eveningName[v.evening]}). Admit only if seating allows.
                </>
              )}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {v.state === "admit" && (
                <button type="button" disabled={busy} onClick={() => send({})} className="btn w-full bg-olive !min-h-16 text-lg text-paper hover:bg-ink sm:w-auto sm:!px-10">
                  {busy ? "Checking in…" : `Check in ${p.guests} ${p.guests === 1 ? "person" : "people"}`}
                </button>
              )}
              {v.state === "wrong-evening" && (
                <button type="button" disabled={busy} onClick={() => send({})} className="btn btn-secondary">
                  Admit anyway
                </button>
              )}
              {(v.state === "admitted" || v.state === "already") && (
                <button type="button" disabled={busy} onClick={() => send({ undo: true })} className="link-arrow text-ink-muted">
                  {busy ? "Undoing…" : "Undo this check-in"}
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="display text-3xl leading-tight">We could not find this pass</p>
            <p className="mt-3 text-ink-muted">Check the pass number on the guest&apos;s screen, or ask for their name. Passes start with RWS26.</p>
          </>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm font-semibold text-maroon">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}

export const eveningOptions: { value: Evening; label: string }[] = [
  { value: "day1", label: "25 Nov" },
  { value: "day2", label: "26 Nov" },
];
