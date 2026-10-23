"use client";

import { useEffect, useRef, useState } from "react";
import { useEPass } from "./EPassProvider";

/** Counts up to the live number once, then follows later changes directly (with a small bump). */
function useCountUp(target: number | null): { shown: number | null; bump: number } {
  const [shown, setShown] = useState<number | null>(null);
  const [bump, setBump] = useState(0);
  const first = useRef(true);
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (target === null) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wasFirst = first.current;
    first.current = false;
    const previous = last.current;
    last.current = target;

    if (!wasFirst || reduce || target < 2) {
      setShown(target);
      if (!wasFirst && previous !== null && target > previous) setBump((b) => b + 1);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setShown(Math.round(target * (1 - Math.pow(1 - t, 4))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return { shown, bump };
}

const nf = new Intl.NumberFormat("en-IN");

/** Round numbers worth cheering for. The bar fills toward the next one, so there is always a goal in sight. */
const MILESTONES = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];

function milestone(count: number) {
  const next = MILESTONES.find((m) => m > count) ?? null;
  const prev = [...MILESTONES].reverse().find((m) => m <= count) ?? 0;
  return { next, pct: next ? Math.max(4, Math.round(((count - prev) / (next - prev)) * 100)) : 100 };
}

/**
 * The live "e-passes downloaded" figure, in three sizes:
 * - `banner`: the centrepiece in the e-pass section, a card with the big number and a milestone bar;
 * - `pill`: a highlighted chip under the hero buttons;
 * - `inline`: a quiet line for the phone bar.
 * The dot is the only live-status motion on the page.
 */
export function EPassCounter({ variant = "inline", className = "" }: { variant?: "inline" | "pill" | "banner"; className?: string }) {
  const { count } = useEPass();
  const { shown, bump } = useCountUp(count);
  const noun = count === 1 ? "e-pass" : "e-passes";
  const bumpStyle = bump ? { animation: "count-bump 520ms var(--ease-out)" } : undefined;
  const value =
    shown === null ? (
      <span className="inline-block h-[0.8em] w-[1.6ch] animate-pulse rounded bg-ink/10 align-[-0.05em]" />
    ) : (
      nf.format(shown)
    );

  const dot = (
    <span className="relative flex size-2.5 shrink-0" aria-hidden="true">
      <span className="absolute inset-0 rounded-full bg-maroon" style={{ animation: "pulse-ring 2.4s ease-out infinite" }} />
      <span className="relative size-2.5 rounded-full bg-maroon" />
    </span>
  );
  const label = count === null ? "E-pass count loading" : `${count} ${noun} downloaded so far`;

  if (variant === "banner") {
    const m = count === null ? null : milestone(count);
    return (
      <span
        className={`card relative block w-full max-w-md overflow-hidden px-6 py-5 text-left ring-1 ring-[color-mix(in_srgb,var(--gold)_55%,transparent)] ${className}`}
        role="status"
        aria-live="polite"
        aria-label={label}
      >
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-maroon via-gold to-maroon" />
        <span className="flex items-center gap-5">
          <span key={bump} className="display inline-block text-[clamp(3.5rem,3rem+3vw,5rem)] leading-none tabular-nums text-maroon" style={bumpStyle}>
            {value}
          </span>
          <span className="flex min-w-0 flex-col gap-1">
            <span className="flex items-center gap-2 text-[0.95rem] font-semibold text-ink">
              {dot}
              {noun} downloaded
            </span>
            <span className="serif text-[1.05rem] italic leading-snug text-ink-muted">
              {count === 0 ? "Be the first. Your pass starts the count." : "and counting. Add yours to the number."}
            </span>
          </span>
        </span>
        {m && count !== null && (
          <span className="mt-4 block" aria-hidden="true">
            <span className="block h-2 overflow-hidden rounded-full bg-ink/10">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-maroon to-gold transition-[width] duration-1000 ease-[var(--ease-out)]"
                style={{ width: `${m.pct}%` }}
              />
            </span>
            <span className="mt-2 block text-xs text-ink-muted">
              {!m.next
                ? "Thank you, every seat has a story"
                : count === 0
                  ? `First milestone: ${nf.format(m.next)} passes`
                  : `${nf.format(m.next - count)} more to reach ${nf.format(m.next)}`}
            </span>
          </span>
        )}
      </span>
    );
  }

  if (variant === "pill") {
    return (
      <span
        className={`inline-flex items-center gap-3.5 rounded-full bg-paper py-2.5 pl-5 pr-6 shadow-e2 ring-2 ring-[color-mix(in_srgb,var(--gold)_60%,transparent)] ${className}`}
        role="status"
        aria-live="polite"
        aria-label={label}
      >
        {dot}
        <span key={bump} className="display inline-block text-[2.1rem] leading-none tabular-nums text-maroon" style={bumpStyle}>
          {value}
        </span>
        <span className="text-left text-[0.95rem] font-semibold leading-tight text-ink">
          {noun} downloaded
          <span className="serif block text-[0.95rem] font-normal italic text-ink-muted">{count === 0 ? "Be the first to join" : "Join them, get yours"}</span>
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} role="status" aria-live="polite" aria-label={label}>
      {dot}
      <span className="text-sm text-ink-muted">
        <span key={bump} className="inline-block font-semibold tabular-nums text-ink" style={bumpStyle}>
          {value}
        </span>{" "}
        {noun} downloaded
      </span>
    </span>
  );
}
