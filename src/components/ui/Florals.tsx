"use client";

import { useEffect, useRef } from "react";

/**
 * Faded flowers that drift through the page as you scroll, like petals on a temple floor.
 * Four hand-drawn shapes (lotus, marigold, jasmine sprig, leaf vine) in the page's own olive, maroon
 * and gold, kept to the edges so they never sit under reading text. Scrolling moves and turns them;
 * each one wraps round when it leaves the screen, so there is always some blossom in view. With
 * reduced motion they stay still.
 */

type Kind = "lotus" | "marigold" | "jasmine" | "vine";

interface Bloom {
  kind: Kind;
  /** Horizontal position, as a share of the width. */
  x: number;
  /** Where it starts vertically, as a share of the height. */
  y: number;
  /** Width in rem on a wide screen (it shrinks a little on phones). */
  size: number;
  /** How fast scrolling carries it up (1 = as fast as the page). */
  speed: number;
  /** Degrees turned per 100px scrolled. */
  spin: number;
  colour: string;
  opacity: number;
}

const BLOOMS: Bloom[] = [
  { kind: "lotus", x: 0.04, y: 0.12, size: 13, speed: 0.22, spin: 3.2, colour: "var(--maroon)", opacity: 0.13 },
  { kind: "jasmine", x: 0.93, y: 0.3, size: 12, speed: 0.34, spin: -2.4, colour: "var(--olive)", opacity: 0.16 },
  { kind: "marigold", x: 0.9, y: 0.78, size: 9, speed: 0.18, spin: 4.2, colour: "var(--gold)", opacity: 0.2 },
  { kind: "vine", x: 0.02, y: 0.62, size: 14, speed: 0.28, spin: -1.6, colour: "var(--olive)", opacity: 0.15 },
  { kind: "marigold", x: 0.14, y: 0.92, size: 7, speed: 0.4, spin: -5, colour: "var(--maroon)", opacity: 0.12 },
  { kind: "lotus", x: 0.86, y: 0.05, size: 8, speed: 0.46, spin: 2.6, colour: "var(--gold)", opacity: 0.17 },
  { kind: "jasmine", x: 0.07, y: 0.4, size: 8, speed: 0.52, spin: 2, colour: "var(--maroon)", opacity: 0.1 },
  { kind: "vine", x: 0.95, y: 0.55, size: 10, speed: 0.15, spin: 1.4, colour: "var(--maroon)", opacity: 0.1 },
];

/** Each shape is drawn in a 200 x 200 box, in a single colour taken from the surrounding text colour. */
function Shape({ kind }: { kind: Kind }) {
  switch (kind) {
    case "lotus":
      // Two rings of pointed petals around a seed pod
      return (
        <g fill="currentColor" fillOpacity="0.35" stroke="currentColor" strokeWidth="1.6">
          {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a) => (
            <path key={`o${a}`} d="M100 100 C 82 70 84 30 100 8 C 116 30 118 70 100 100 Z" transform={`rotate(${a} 100 100)`} />
          ))}
          {[20, 60, 100, 140, 180, 220, 260, 300, 340].map((a) => (
            <path key={`i${a}`} d="M100 100 C 88 80 90 52 100 36 C 110 52 112 80 100 100 Z" transform={`rotate(${a} 100 100)`} fillOpacity="0.55" />
          ))}
          <circle cx="100" cy="100" r="9" fillOpacity="0.9" />
        </g>
      );
    case "marigold":
      // Rings of small round petals, packed like a garland flower
      return (
        <g fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2">
          {Array.from({ length: 16 }, (_, i) => (
            <ellipse key={`a${i}`} cx="100" cy="42" rx="12" ry="20" transform={`rotate(${i * 22.5} 100 100)`} />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <ellipse key={`b${i}`} cx="100" cy="64" rx="10" ry="16" transform={`rotate(${i * 30 + 15} 100 100)`} fillOpacity="0.6" />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse key={`c${i}`} cx="100" cy="82" rx="7" ry="11" transform={`rotate(${i * 45} 100 100)`} fillOpacity="0.8" />
          ))}
        </g>
      );
    case "jasmine":
      // A curving stem with leaves and small five-petal blossoms
      return (
        <g fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M30 190 C 60 150 40 110 90 80 C 130 56 150 40 170 10" fill="none" />
          {[
            [48, 160, -40],
            [62, 128, 30],
            [92, 100, -50],
            [118, 74, 24],
            [150, 50, -36],
          ].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx="13" ry="6" fillOpacity="0.4" transform={`rotate(${r} ${x} ${y})`} />
          ))}
          {[
            [70, 140],
            [104, 88],
            [138, 60],
            [166, 18],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`} fillOpacity="0.5">
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx="0" cy="-8" rx="4.5" ry="8" transform={`rotate(${a})`} />
              ))}
              <circle r="2.6" fillOpacity="1" />
            </g>
          ))}
        </g>
      );
    case "vine":
      // A flowing vine with paired leaves
      return (
        <g fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M20 180 C 70 170 60 120 100 110 C 140 100 130 50 180 20" fill="none" />
          {[
            [44, 174, -20, 1],
            [62, 150, 60, -1],
            [88, 120, -10, 1],
            [112, 106, 70, -1],
            [140, 80, 0, 1],
            [158, 54, 55, -1],
          ].map(([x, y, r, side], i) => (
            <path
              key={i}
              d="M0 0 C 8 -10 22 -12 30 -4 C 22 6 8 8 0 0 Z"
              fillOpacity="0.4"
              transform={`translate(${x} ${y}) rotate(${(r as number) + ((side as number) > 0 ? -35 : 150)})`}
            />
          ))}
        </g>
      );
  }
}

export function Florals() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const place = () => {
      raf = 0;
      const sy = still ? 0 : window.scrollY;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const scale = vw < 640 ? 0.55 : vw < 1024 ? 0.8 : 1;
      BLOOMS.forEach((b, i) => {
        const el = refs.current[i];
        if (!el) return;
        const w = b.size * 16 * scale;
        // Carry upward with the scroll, then wrap round so a bloom re-enters from below.
        const span = vh + w * 2;
        const raw = b.y * vh - sy * b.speed;
        const y = ((((raw + w) % span) + span) % span) - w;
        el.style.width = `${w}px`;
        el.style.transform = `translate3d(${b.x * vw - w / 2}px, ${y}px, 0) rotate(${(sy / 100) * b.spin}deg)`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(place);
    };

    place();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="no-print pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {BLOOMS.map((b, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="absolute left-0 top-0 will-change-transform"
          style={{ color: b.colour, opacity: b.opacity }}
        >
          <svg viewBox="0 0 200 200" className="floral-sway block h-auto w-full" style={{ animationDelay: `${-i * 1.7}s`, animationDuration: `${9 + (i % 4) * 2}s` }}>
            <Shape kind={b.kind} />
          </svg>
        </div>
      ))}
    </div>
  );
}
