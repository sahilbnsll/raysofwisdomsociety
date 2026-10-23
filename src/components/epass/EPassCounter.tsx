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

/**
 * The live "e-passes downloaded" figure, kept small like a stat:
 * - `chip`: sits in the header, so it is in view wherever you are on the page;
 * - `inline`: a plain line for the phone bar, the hero on phones and the e-pass section.
 * The dot is the only live-status motion on the page.
 */
export function EPassCounter({ variant = "inline", className = "" }: { variant?: "inline" | "chip"; className?: string }) {
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
    <span className="relative flex size-2 shrink-0" aria-hidden="true">
      <span className="absolute inset-0 rounded-full bg-maroon" style={{ animation: "pulse-ring 2.4s ease-out infinite" }} />
      <span className="relative size-2 rounded-full bg-maroon" />
    </span>
  );
  const label = count === null ? "E-pass count loading" : `${count} ${noun} downloaded so far`;
  const shell = variant === "chip" ? "gap-2 rounded-full bg-paper/80 py-1.5 pl-3 pr-3.5 text-sm ring-1 ring-line" : "gap-2.5 text-sm";

  // Before the first pass, "0 e-passes" reads as "nobody is coming"; invite instead.
  if (count === 0) {
    return (
      <span className={`inline-flex items-center whitespace-nowrap text-ink-muted ${shell} ${className}`} role="status" aria-label="E-passes are open">
        {dot}
        E-passes open · be the first
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center whitespace-nowrap text-ink-muted ${shell} ${className}`} role="status" aria-live="polite" aria-label={label}>
      {dot}
      <span>
        <span key={bump} className="inline-block font-semibold tabular-nums text-maroon" style={bumpStyle}>
          {value}
        </span>{" "}
        {noun} downloaded
      </span>
    </span>
  );
}
