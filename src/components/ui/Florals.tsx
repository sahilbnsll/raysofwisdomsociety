"use client";

import { useEffect, useRef } from "react";

/**
 * The page's living wallpaper, in three quiet layers behind the content:
 *  1. soft washes of sage and rose that drift as you read, so no two screens look the same;
 *  2. faded flowers (lotus, marigold, jasmine, vine) that float up with the scroll, turn, and lean
 *     a little when you scroll fast, near ones larger and brighter than far ones;
 *  3. a few petals that fall slowly of their own accord.
 * Everything keeps to the edges so it never sits under reading text, and with reduced motion it
 * holds still (petals are hidden).
 */

type Kind = "lotus" | "marigold" | "jasmine" | "vine";

interface Bloom {
  kind: Kind;
  /** Horizontal position, as a share of the width. */
  x: number;
  /** Where it starts vertically, as a share of the height. */
  y: number;
  /** Width in rem on a wide screen (it shrinks on phones). */
  size: number;
  /** How fast scrolling carries it up (1 = as fast as the page). Far blooms move slower. */
  speed: number;
  /** Degrees turned per 100px scrolled. */
  spin: number;
  colour: string;
  opacity: number;
}

const BLOOMS: Bloom[] = [
  // near: larger and brighter, move faster
  { kind: "lotus", x: 0.04, y: 0.12, size: 14, speed: 0.34, spin: 3.2, colour: "var(--maroon)", opacity: 0.15 },
  { kind: "jasmine", x: 0.94, y: 0.32, size: 13, speed: 0.4, spin: -2.4, colour: "var(--olive)", opacity: 0.18 },
  { kind: "marigold", x: 0.91, y: 0.8, size: 10, speed: 0.3, spin: 4.2, colour: "var(--gold)", opacity: 0.22 },
  { kind: "vine", x: 0.02, y: 0.64, size: 15, speed: 0.36, spin: -1.6, colour: "var(--olive)", opacity: 0.17 },
  { kind: "lotus", x: 0.87, y: 0.05, size: 9, speed: 0.5, spin: 2.6, colour: "var(--gold)", opacity: 0.18 },
  // far: smaller and fainter, move slower, so the page has depth
  { kind: "marigold", x: 0.14, y: 0.92, size: 6.5, speed: 0.14, spin: -5, colour: "var(--maroon)", opacity: 0.1 },
  { kind: "jasmine", x: 0.07, y: 0.4, size: 7.5, speed: 0.17, spin: 2, colour: "var(--maroon)", opacity: 0.09 },
  { kind: "vine", x: 0.96, y: 0.56, size: 9, speed: 0.12, spin: 1.4, colour: "var(--maroon)", opacity: 0.09 },
  { kind: "lotus", x: 0.2, y: 0.02, size: 5.5, speed: 0.1, spin: -3, colour: "var(--olive)", opacity: 0.08 },
  { kind: "marigold", x: 0.8, y: 0.45, size: 5, speed: 0.11, spin: 3.4, colour: "var(--gold)", opacity: 0.12 },
];

/** Petals that fall by themselves: left position (%), size (px), seconds to fall, and a head start. */
const PETALS = [
  { x: 6, s: 14, d: 26, o: 0.1, c: "var(--maroon)" },
  { x: 15, s: 10, d: 34, o: 0.4, c: "var(--gold)" },
  { x: 24, s: 12, d: 30, o: 0.7, c: "var(--rose)" },
  { x: 74, s: 11, d: 29, o: 0.25, c: "var(--rose)" },
  { x: 83, s: 15, d: 36, o: 0.55, c: "var(--gold)" },
  { x: 92, s: 12, d: 27, o: 0.85, c: "var(--maroon)" },
  { x: 97, s: 9, d: 32, o: 0.05, c: "var(--olive)" },
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

/**
 * `overlay` is for sections that paint their own solid background (the green e-pass band): the same
 * flowers are drawn on top of that background, clipped to the section, so they carry on across it.
 */
export function Florals({ overlay = false }: { overlay?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let lastY = window.scrollY;
    let lean = 0; // how far the flowers are leaning with the scroll speed, in degrees

    const place = () => {
      raf = 0;
      const sy = still ? 0 : window.scrollY;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const scale = vw < 640 ? 0.55 : vw < 1024 ? 0.8 : 1;

      // Scrolling fast tips the flowers a little in the direction of travel, then they settle back.
      const velocity = still ? 0 : sy - lastY;
      lastY = sy;
      lean += (Math.max(-14, Math.min(14, velocity * 0.45)) - lean) * 0.18;

      const doc = Math.max(1, document.documentElement.scrollHeight - vh);
      root.current?.style.setProperty("--sp", String(Math.min(1, sy / doc)));

      BLOOMS.forEach((b, i) => {
        const el = refs.current[i];
        if (!el) return;
        const w = b.size * 16 * scale;
        // Carry upward with the scroll, then wrap round so a bloom re-enters from below.
        const span = vh + w * 2;
        const raw = b.y * vh - sy * b.speed;
        const y = ((((raw + w) % span) + span) % span) - w;
        const lift = b.speed > 0.25 ? 1 : 0.5; // near blooms lean more than far ones
        el.style.width = `${w}px`;
        el.style.transform = `translate3d(${b.x * vw - w / 2}px, ${y}px, 0) rotate(${(sy / 100) * b.spin + lean * lift}deg)`;
      });

      // Keep easing back to upright after scrolling stops
      if (!still && Math.abs(lean) > 0.08) raf = requestAnimationFrame(place);
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
    <div
      ref={root}
      aria-hidden="true"
      className={`no-print pointer-events-none fixed inset-0 overflow-hidden ${overlay ? "" : "-z-10"}`}
      style={
        {
          "--sp": 0,
          // Two soft washes that slide across the screen as you read (the page itself only, not the overlay copy)
          background: overlay
            ? undefined
            : "radial-gradient(60rem 42rem at calc(8% + var(--sp) * 22%) calc(18% + var(--sp) * 46%), rgba(176,194,140,0.2), transparent 70%), radial-gradient(52rem 38rem at calc(94% - var(--sp) * 20%) calc(88% - var(--sp) * 52%), rgba(214,150,150,0.15), transparent 70%)",
        } as React.CSSProperties
      }
    >
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

      {PETALS.map((p, i) => (
        <span key={i} className="petal" style={{ left: `${p.x}%`, width: p.s, height: p.s * 1.5, color: p.c, animationDuration: `${p.d}s`, animationDelay: `${-p.d * p.o}s` }}>
          <svg viewBox="0 0 20 30" className="petal-spin block h-full w-full" style={{ animationDuration: `${6 + (i % 3) * 2}s` }}>
            <path d="M10 0 C 20 8 20 22 10 30 C 0 22 0 8 10 0 Z" fill="currentColor" fillOpacity="0.55" />
            <path d="M10 4 L 10 26" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
          </svg>
        </span>
      ))}
    </div>
  );
}
