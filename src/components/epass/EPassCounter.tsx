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
 * The live "e-passes downloaded" figure. `inline` reads as part of a sentence (hero, phone bar);
 * `feature` gives the number room (e-pass section). The dot is the only live-status motion on the page.
 */
export function EPassCounter({ variant = "inline", className = "" }: { variant?: "inline" | "feature"; className?: string }) {
  const { count } = useEPass();
  const { shown, bump } = useCountUp(count);
  const noun = count === 1 ? "e-pass" : "e-passes";
  const value =
    shown === null ? (
      <span className="inline-block h-[0.8em] w-10 animate-pulse rounded bg-ink/10 align-[-0.05em]" />
    ) : (
      nf.format(shown)
    );

  const dot = (
    <span className="relative flex size-2 shrink-0" aria-hidden="true">
      <span className="absolute inset-0 rounded-full bg-olive" style={{ animation: "pulse-ring 2.4s ease-out infinite" }} />
      <span className="relative size-2 rounded-full bg-olive" />
    </span>
  );

  // Before the first pass, a big "0" reads as "nobody is coming"; invite instead.
  if (count === 0) {
    return (
      <span className={`inline-flex items-center gap-2.5 text-sm text-ink-muted ${className}`} role="status">
        {dot}
        {variant === "feature" ? "E-passes are open. Be among the first to get yours." : "E-passes are open"}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={count === null ? "E-pass count loading" : `${count} ${noun} downloaded so far`}
    >
      {variant === "feature" ? (
        <span className="flex flex-col">
          <span
            key={bump}
            className="display inline-block text-6xl tabular-nums"
            style={bump ? { animation: "count-bump 520ms var(--ease-out)" } : undefined}
          >
            {value}
          </span>
          <span className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
            {dot}
            {noun} downloaded so far
          </span>
        </span>
      ) : (
        <>
          {dot}
          <span className="text-sm text-ink-muted">
            <span key={bump} className="inline-block font-semibold tabular-nums text-ink" style={bump ? { animation: "count-bump 520ms var(--ease-out)" } : undefined}>
              {value}
            </span>{" "}
            {noun} downloaded
          </span>
        </>
      )}
    </span>
  );
}
