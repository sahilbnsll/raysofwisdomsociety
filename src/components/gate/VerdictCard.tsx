"use client";

import { useState } from "react";
import { eveningLabels } from "@/content/event";
import { eveningName, type Evening } from "@/lib/epass/evening";
import type { Verdict } from "@/lib/epass/verdict";
import { IconAlert, IconCheck, IconClock, IconCross } from "./gate-ui";

const time = (iso?: string) =>
  iso ? new Date(iso).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" }) : "";

/** Colour and a shape for every answer, so it reads at a glance and without relying on colour alone. */
const tone = {
  admit: { bar: "bg-olive text-paper", disc: "bg-paper/20", label: "Valid pass", Icon: IconCheck },
  admitted: { bar: "bg-olive text-paper", disc: "bg-paper/20", label: "Admitted", Icon: IconCheck },
  already: { bar: "bg-gold text-ink", disc: "bg-ink/10", label: "Already admitted", Icon: IconClock },
  "wrong-evening": { bar: "bg-maroon text-paper", disc: "bg-paper/20", label: "Not for tonight", Icon: IconAlert },
  "not-found": { bar: "bg-maroon text-paper", disc: "bg-paper/20", label: "Pass not found", Icon: IconCross },
} as const;

/**
 * One scan, one unmistakable answer, readable at arm's length in a dim foyer: a coloured band with
 * the verdict, a tear line like the e-pass, the guest's name and party size, and the one action that fits.
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
  const t = v.state === "not-found" && v.invalid ? { ...tone["not-found"], label: "Not a festival pass" } : tone[v.state];
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
      <div className={`flex items-center justify-between gap-4 px-5 py-4 sm:px-6 ${t.bar}`}>
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden="true" className={`grid size-11 shrink-0 place-items-center rounded-full ${t.disc}`}>
            <t.Icon />
          </span>
          <p className="display text-[1.55rem] leading-tight sm:text-[2rem]">{t.label}</p>
        </div>
        {v.state === "already" && v.admittedAt && (
          <p className="shrink-0 text-right leading-tight">
            <span className="block text-xs font-semibold uppercase tracking-wide opacity-70">Admitted at</span>
            <span className="display whitespace-nowrap text-3xl tabular-nums sm:text-4xl">{time(v.admittedAt)}</span>
          </p>
        )}
        {(v.state === "admit" || v.state === "admitted") && p && (
          <p className="display shrink-0 text-5xl tabular-nums" aria-label={`${p.guests} ${p.guests === 1 ? "person" : "people"}`}>
            {p.guests}
            <span className="ml-1 font-sans text-base font-semibold">{p.guests === 1 ? "person" : "people"}</span>
          </p>
        )}
      </div>
      <div className="perforation" />

      <div className={compact ? "p-5" : "p-6 sm:p-8"}>
        {p ? (
          <>
            <p className="display text-4xl leading-tight">{p.name}</p>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-sage px-3 py-1 font-semibold">
                {p.guests} {p.guests === 1 ? "person" : "people"}
              </span>
              <span className="rounded-full bg-sage px-3 py-1">{eveningLabels[p.days].long}</span>
              <span className="rounded-full bg-cream px-3 py-1 font-semibold tracking-wider ring-1 ring-line-strong">{p.id}</span>
            </p>

            <p className="mt-5 border-l-2 border-gold pl-4 text-[1.0625rem] leading-relaxed">
              {v.state === "admit" && <>Valid for the evening of {eveningName[v.evening]}. Check them in to let the party through.</>}
              {v.state === "admitted" && <>Checked in at {time(v.admittedAt)} for {eveningName[v.evening]}. If it is scanned again, it will show as already admitted.</>}
              {v.state === "already" && (
                <>
                  This pass was admitted at <strong>{time(v.admittedAt)}</strong> on {eveningName[v.evening]}, for {p.guests} {p.guests === 1 ? "person" : "people"}. If more of the party
                  have arrived, check with the guest before letting them through.
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
                <button type="button" disabled={busy} onClick={() => send({})} className="btn w-full bg-olive !min-h-16 text-lg text-paper shadow-e2 hover:bg-ink sm:w-auto sm:!px-10">
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
            <p className="display text-3xl leading-tight">{v.invalid ? "That is not a pass number" : "We could not find this pass"}</p>
            {v.invalid ? (
              <p className="mt-3 text-ink-muted">
                Pass numbers look like <strong>RWS26-ABC234</strong>. Scan the QR code on the guest&apos;s e-pass, or type the number printed under it.
              </p>
            ) : v.shared === false ? (
              <p className="mt-3 rounded-xl bg-maroon/10 p-4 text-maroon">
                The pass list is not saved in the shared database yet, so a pass made on another server cannot be found here. This is a set-up problem, not a bad pass.
                Ask the site owner to connect the database before admitting anyone.
              </p>
            ) : (
              <p className="mt-3 text-ink-muted">Check the pass number on the guest&apos;s screen, or ask for their name. Passes start with RWS26.</p>
            )}
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
