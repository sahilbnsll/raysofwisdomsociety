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
 * How many guests already hold an e-pass (people, not passes: one pass can cover up to four).
 * Kept small, like a stat:
 * - `chip`: in the header, so it is in view wherever you are on the page;
 * - `inline`: a plain line (hero on phones, e-pass section, phone bar).
 * `short` trims the sentence for tight spots; the full one ends with the invitation.
 * The dot is the only live-status motion on the page.
 */
export function EPassCounter({
  variant = "inline",
  short = false,
  className = "",
}: {
  variant?: "inline" | "chip";
  short?: boolean;
  className?: string;
}) {
  const { people, countFailed } = useEPass();
  const { shown, bump } = useCountUp(people);
  const bumpStyle = bump ? { animation: "count-bump 520ms var(--ease-out)" } : undefined;
  const value =
    shown === null ? (
      <span className="inline-block h-[0.8em] w-[1.6ch] animate-pulse rounded bg-ink/10 align-[-0.05em]" />
    ) : (
      nf.format(shown)
    );

  // The count could not be loaded: show nothing rather than a placeholder that never fills in.
  const hidden = people === null && countFailed;

  const dot = (
    <span className="relative flex size-2 shrink-0" aria-hidden="true">
      <span className="absolute inset-0 rounded-full bg-maroon" style={{ animation: "pulse-ring 2.4s ease-out infinite" }} />
      <span className="relative size-2 rounded-full bg-maroon" />
    </span>
  );
  const shell = variant === "chip" ? "gap-2 rounded-full bg-paper/80 py-1.5 pl-3 pr-3.5 text-sm ring-1 ring-line" : "gap-2.5 text-sm";
  const base = `inline-flex items-center text-ink-muted ${shell} ${className}`;

  if (hidden) return null;

  // Before the first pass, "0 guests" reads as "nobody is coming"; invite instead.
  if (people === 0) {
    return (
      <span className={`${base} whitespace-nowrap`} role="status" aria-label="E-passes are open">
        {dot}
        {short ? "E-passes open · be the first" : "E-passes are open. Be the first to get yours."}
      </span>
    );
  }

  const one = people === 1;
  const label =
    people === null ? "Guest count loading" : `${people} ${one ? "guest has" : "guests have"} already got their ${one ? "e-pass" : "e-passes"}`;

  return (
    <span className={`${base} ${short ? "whitespace-nowrap" : "text-left"}`} role="status" aria-live="polite" aria-label={label}>
      {dot}
      <span>
        <span key={bump} className="inline-block font-semibold tabular-nums text-maroon" style={bumpStyle}>
          {value}
        </span>{" "}
        {short ? (
          <>guest{one ? "" : "s"} {one ? "has" : "have"} their e-pass</>
        ) : (
          <>
            guest{one ? "" : "s"} {one ? "has" : "have"} already got {one ? "their e-pass" : "their e-passes"}.{" "}
            <span className="serif italic text-ink">Get yours too.</span>
          </>
        )}
      </span>
    </span>
  );
}
