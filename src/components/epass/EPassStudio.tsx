"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { event, eveningLabels, type Evenings } from "@/content/event";
import { canvasToBlob, downloadBlob, drawPass, PASS_H, PASS_W, PREVIEW_ID, type PassData } from "@/lib/epass/render-pass";
import { downloadCalendar } from "@/lib/ics";
import { Hills } from "@/components/ui/Ornaments";
import { Reveal } from "@/components/ui/Reveal";
import { Swap } from "@/components/ui/Swap";
import { EPassCounter } from "./EPassCounter";
import { useEPass } from "./EPassProvider";
import { GateView } from "./GateView";

const FIELD =
  "mt-2 w-full rounded-xl border border-line-strong bg-paper px-4 py-3.5 text-base text-ink outline-none transition-[border-color,box-shadow] duration-[var(--d2)] placeholder:text-ink-muted/70 focus:border-ink-muted focus:ring-4 focus:ring-ink/[0.08]";

const evenings: { value: Evenings; title: string; note: string }[] = [
  { value: "both", title: "Both evenings", note: "25 and 26 Nov" },
  { value: "day1", title: "25 Nov", note: event.days[0].theme },
  { value: "day2", title: "26 Nov", note: event.days[1].theme },
];

const steps = [
  { title: "Make your pass", detail: "Your name, how many of you, which evening." },
  { title: "Keep it on your phone", detail: "It downloads as an image; you can also share it to your photos." },
  { title: "Show it at the gate", detail: `From ${event.start} at ${event.venue.name}. One scan checks your party in.` },
];

interface FormError {
  field?: string;
  message: string;
}

const noop = () => () => {};

export function EPassStudio() {
  const { passes, preferred, recordIssued, registerFocus } = useEPass();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const readyRef = useRef<HTMLHeadingElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const gateRef = useRef<HTMLDialogElement>(null);
  const drawVersion = useRef(0);

  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [choice, setChoice] = useState<{ value: Evenings; at: number } | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<FormError | null>(null);
  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [justIssued, setJustIssued] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");

  // A choice made in the form wins unless the visitor later picked an evening elsewhere on the page.
  const days: Evenings = choice && (!preferred || choice.at > preferred.at) ? choice.value : (preferred?.value ?? "both");
  const setDays = useCallback((value: Evenings) => setChoice({ value, at: Date.now() }), []);

  const canShare = useSyncExternalStore(noop, () => typeof navigator !== "undefined" && typeof navigator.canShare === "function", () => false);

  const current: PassData | null = creating ? null : (passes.find((p) => p.id === selectedId) ?? passes[0] ?? null);
  const view = useMemo<PassData>(() => current ?? { id: PREVIEW_ID, name: name.trim() || "Your name", guests, days }, [current, name, guests, days]);
  const step = current ? 2 : 0;

  // The picture on screen is the same one that gets downloaded.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const version = ++drawVersion.current;
    const raf = requestAnimationFrame(() => {
      drawPass(canvas, view, window.location.origin, () => version !== drawVersion.current).catch(() => {});
    });
    return () => cancelAnimationFrame(raf);
  }, [view]);

  useEffect(() => {
    registerFocus(() => (current ? readyRef.current?.focus({ preventScroll: true }) : nameRef.current?.focus({ preventScroll: true })));
    return () => registerFocus(null);
  }, [current, registerFocus]);

  async function pngFor(p: PassData): Promise<Blob> {
    const c = document.createElement("canvas");
    await drawPass(c, p, window.location.origin);
    return canvasToBlob(c);
  }

  async function save(p: PassData) {
    downloadBlob(await pngFor(p), `IAAF-2026-e-pass-${p.id}.png`);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setError(null);
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError({ field: "name", message: "Please enter your name as you would like it on the pass." });
      nameRef.current?.focus();
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/epass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, guests, days, website: honeypot.current?.value ?? "" }),
      });
      const data = (await res.json()) as { error?: string; field?: string; id: string; name: string; guests: number; days: Evenings; count: number };
      if (!res.ok) {
        setError({ field: data.field, message: data.error ?? "Something went wrong. Please try again." });
        return;
      }
      const issued: PassData = { id: data.id, name: data.name, guests: data.guests, days: data.days };
      recordIssued(issued, data.count);
      setCreating(false);
      setSelectedId(issued.id);
      setJustIssued(issued.id);
      setName("");
      setNotice("Your e-pass is ready and has been saved to your device.");
      window.setTimeout(() => readyRef.current?.focus({ preventScroll: true }), 50);
      await save(issued);
    } catch {
      setError({ message: "We could not reach the server. Check your connection and try again." });
    } finally {
      setSending(false);
    }
  }

  async function share(p: PassData) {
    try {
      const file = new File([await pngFor(p)], `IAAF-2026-e-pass-${p.id}.png`, { type: "image/png" });
      if (!navigator.canShare?.({ files: [file] })) {
        await save(p);
        return;
      }
      await navigator.share({ files: [file], title: `${event.title} 2026 e-pass`, text: `My e-pass for the ${event.edition} ${event.title}, ${event.venue.name}, ${event.venue.area}.` });
    } catch (err) {
      if ((err as DOMException)?.name !== "AbortError") setNotice("Sharing is not available here. Use Download instead.");
    }
  }

  async function copyId(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setNotice("Could not copy. The pass number is shown above the button.");
    }
  }

  function another() {
    setCreating(true);
    setJustIssued(null);
    setError(null);
    window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 60);
  }

  const nameErr = error?.field === "name" ? error.message : "";
  const generalErr = error && error.field !== "name" ? error.message : "";

  return (
    <section id="e-pass" className="relative overflow-hidden bg-sage" aria-labelledby="epass-title">
      {/* The cream page meets the green section along the poster's hills */}
      <div className="bg-cream">
        <Hills className="h-16 sm:h-24" fade="var(--sage)" />
      </div>
      <div className="wrap pb-[clamp(4.5rem,3rem+5vw,8rem)] pt-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 id="epass-title" className="section-title">
            {current ? "Your e‑pass is ready" : "Get your e‑pass"}
          </h2>
          <p className="reading mx-auto mt-4 max-w-xl">
            {event.closing} Make your pass here, keep it on your phone and show it at the gate.
          </p>
          <div className="mt-6 flex justify-center">
            <EPassCounter variant="feature" />
          </div>
        </Reveal>

        {/* Where you are in three steps; it follows what the visitor has actually done */}
        <ol className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3" aria-label="How the e-pass works">
          {steps.map((s, i) => {
            const done = i < step || (i === 1 && !!current);
            const active = i === step;
            return (
              <li
                key={s.title}
                aria-current={active ? "step" : undefined}
                className={`flex gap-3 rounded-2xl px-4 py-3.5 transition-colors duration-[var(--d3)] ${active ? "bg-paper shadow-e1 ring-1 ring-line" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                    done ? "bg-olive text-paper" : active ? "bg-maroon text-paper" : "bg-paper text-ink-muted ring-1 ring-line-strong"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span>
                  <span className="block font-semibold leading-snug">{s.title}</span>
                  <span className="mt-0.5 block text-sm leading-snug text-ink-muted">{s.detail}</span>
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_minmax(0,24rem)] lg:gap-16">
          {/* Ticket: first on phones so people see what they are making */}
          <div className="order-1 mx-auto w-full max-w-[19rem] lg:order-2 lg:sticky lg:top-24 lg:max-w-none">
            <div
              key={justIssued ?? "draft"}
              style={justIssued && current?.id === justIssued ? { animation: "ticket-issue 760ms var(--ease-out)" } : undefined}
            >
              <canvas
                ref={canvasRef}
                width={PASS_W}
                height={PASS_H}
                role="img"
                aria-label={`E-pass for ${view.name}, ${view.guests} ${view.guests === 1 ? "person" : "people"}, ${eveningLabels[view.days].long}, pass number ${view.id}`}
                className="block h-auto w-full rotate-[-1deg] drop-shadow-[0_26px_26px_rgba(38,48,26,0.25)]"
                style={{ aspectRatio: `${PASS_W} / ${PASS_H}` }}
              />
            </div>
            {!current && <p className="mt-4 text-center text-sm text-ink-muted">Live preview. It updates as you type.</p>}
          </div>

          <div className="order-2 lg:order-1">
            {!current ? (
              <form onSubmit={onSubmit} noValidate className="card p-6 shadow-e2 sm:p-8">
                <h3 className="display text-3xl">Make your pass</h3>
                <div className="mt-6">
                  <label htmlFor="epass-name" className="text-sm font-semibold">
                    Full name
                  </label>
                  <input
                    ref={nameRef}
                    id="epass-name"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameErr) setError(null);
                    }}
                    maxLength={60}
                    autoComplete="name"
                    placeholder="As it should appear on the pass"
                    disabled={sending}
                    aria-invalid={!!nameErr}
                    aria-describedby={nameErr ? "epass-name-error" : undefined}
                    className={`${FIELD} ${nameErr ? "!border-maroon" : ""}`}
                  />
                  <p id="epass-name-error" role="alert" className="mt-1.5 min-h-5 text-sm text-maroon">
                    {nameErr}
                  </p>
                </div>

                <fieldset className="mt-2" disabled={sending}>
                  <legend className="text-sm font-semibold">Which evening are you coming?</legend>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {evenings.map((o) => (
                      <label key={o.value} className="cursor-pointer">
                        <input type="radio" name="days" value={o.value} checked={days === o.value} onChange={() => setDays(o.value)} className="peer sr-only" />
                        <span className="flex h-full flex-col rounded-xl bg-paper px-3 py-3 shadow-[inset_0_0_0_1px_var(--line-strong)] transition-[background-color,color,box-shadow] duration-[var(--d2)] peer-checked:bg-maroon peer-checked:text-paper peer-checked:shadow-none peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-maroon">
                          <span className="text-sm font-semibold leading-tight">{o.title}</span>
                          <span className="mt-0.5 text-xs opacity-75">{o.note}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p id="guests-label" className="text-sm font-semibold">
                      How many of you?
                    </p>
                    <p className="text-sm text-ink-muted" aria-live="polite">
                      Admits {guests} {guests === 1 ? "person" : "people"}, including you
                    </p>
                  </div>
                  <div role="group" aria-labelledby="guests-label" className="inline-flex items-center rounded-full bg-paper shadow-[inset_0_0_0_1px_var(--line-strong)]">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      disabled={guests <= 1 || sending}
                      aria-label="One fewer person"
                      className="grid size-12 place-items-center rounded-full text-xl transition-colors hover:bg-sage disabled:opacity-35"
                    >
                      <span aria-hidden="true">−</span>
                    </button>
                    <output className="display w-8 text-center text-2xl tabular-nums" aria-live="polite">
                      {guests}
                    </output>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(4, g + 1))}
                      disabled={guests >= 4 || sending}
                      aria-label="One more person"
                      className="grid size-12 place-items-center rounded-full text-xl transition-colors hover:bg-sage disabled:opacity-35"
                    >
                      <span aria-hidden="true">+</span>
                    </button>
                  </div>
                </div>

                {/* Honeypot: hidden from people, tempting to bots. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Website
                    <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <p role="alert" className="mt-4 min-h-5 text-sm text-maroon">
                  {generalErr}
                </p>

                <button type="submit" disabled={sending} aria-busy={sending} className="btn btn-primary mt-1 w-full !min-h-14 text-base">
                  <Swap
                    active={sending ? "sending" : "idle"}
                    states={{
                      idle: (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M4 20h16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Make and download my e-pass
                        </>
                      ),
                      sending: <>Making your pass…</>,
                    }}
                  />
                </button>
                <p className="mt-3 text-center text-xs text-ink-muted">We keep only the name, number of people and evening you enter here.</p>
              </form>
            ) : (
              <div className="card p-6 shadow-e2 sm:p-8">
                {passes.length > 1 && (
                  <div role="tablist" aria-label="Your passes" className="-mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1">
                    {passes.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        role="tab"
                        aria-selected={p.id === current.id}
                        onClick={() => setSelectedId(p.id)}
                        className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors ${p.id === current.id ? "bg-ink text-paper" : "bg-cream text-ink-muted hover:text-ink"}`}
                      >
                        {p.name.split(" ")[0]} · {p.guests}
                      </button>
                    ))}
                  </div>
                )}
                <p className="inline-flex items-center gap-2 rounded-full bg-sage px-3 py-1 text-sm font-medium">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="m3 8.5 3.2 3L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {justIssued === current.id ? "Saved to your device" : "Saved on this device"}
                </p>
                <h3 ref={readyRef} tabIndex={-1} className="display mt-4 text-4xl outline-none sm:text-5xl">
                  {current.name}
                </h3>
                <p className="mt-1 text-ink-muted">
                  {current.guests} {current.guests === 1 ? "person" : "people"} · {eveningLabels[current.days].long} · {event.timeLabel}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-cream px-4 py-3">
                  <div className="min-w-0 grow">
                    <p className="text-xs text-ink-muted">Pass number</p>
                    <p className="font-semibold tracking-[0.08em]">{current.id}</p>
                  </div>
                  <button type="button" onClick={() => copyId(current.id)} className="btn btn-secondary !min-h-10 !px-4 text-xs">
                    <Swap active={copied ? "copied" : "copy"} states={{ copy: <>Copy</>, copied: <>Copied</> }} />
                  </button>
                </div>

                <button type="button" onClick={() => gateRef.current?.showModal()} className="btn btn-primary mt-6 w-full !min-h-14 text-base">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  </svg>
                  Show at the gate
                </button>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={() => save(current)} className="btn btn-secondary">
                    <Swap active={saved ? "saved" : "save"} states={{ save: <>Download again</>, saved: <>Saved ✓</> }} />
                  </button>
                  {canShare ? (
                    <button type="button" onClick={() => share(current)} className="btn btn-secondary">
                      Save to photos or share
                    </button>
                  ) : (
                    <button type="button" onClick={() => downloadCalendar(current.days)} className="btn btn-secondary">
                      Add to calendar
                    </button>
                  )}
                </div>
                {canShare && (
                  <button type="button" onClick={() => downloadCalendar(current.days)} className="link-arrow mt-2">
                    Add {current.days === "both" ? "both evenings" : eveningLabels[current.days].short} to your calendar
                  </button>
                )}

                <div className="perforation my-6" />
                <p className="text-sm leading-relaxed text-ink-muted">
                  Your pass stays on this phone: open this page again any time to show it. At the gate the team scans the code and checks your party in{" "}
                  {current.days === "both" ? "once each evening" : "for the evening"}.
                </p>
                <button type="button" onClick={another} className="link-arrow mt-2">
                  Get a pass for someone else
                </button>
              </div>
            )}

            <p className="sr-only" role="status">
              {notice}
            </p>
          </div>
        </div>
      </div>
      {current && <GateView ref={gateRef} pass={current} />}
    </section>
  );
}
