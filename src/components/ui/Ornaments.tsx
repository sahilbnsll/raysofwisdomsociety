/**
 * The poster's own ornaments, redrawn as light SVG: watercolour hills in sage and rose, gold leaf
 * sprigs, and the lotus divider under the title. Decorative only (aria-hidden).
 */

/** Layered hills that close a section the way the poster's landscape closes its artwork. */
export function Hills({ className = "", fade = "var(--cream)" }: { className?: string; fade?: string }) {
  return (
    <svg className={`pointer-events-none block w-full ${className}`} viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id="hills-soft" x="-5%" y="-30%" width="110%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <path
        d="M0 118 C 180 70 360 150 600 112 C 840 74 1020 150 1240 104 C 1330 86 1390 92 1440 98 L1440 220 L0 220 Z"
        fill="var(--rose)"
        opacity="0.55"
        filter="url(#hills-soft)"
      />
      <path d="M0 158 C 260 112 520 196 860 150 C 1120 116 1300 176 1440 146 L1440 220 L0 220 Z" fill="var(--sage-deep)" opacity="0.62" />
      <path
        d="M0 158 C 260 112 520 196 860 150 C 1120 116 1300 176 1440 146"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="1.2"
        opacity="0.55"
        vectorEffect="non-scaling-stroke"
      />
      <path d="M0 192 C 280 168 620 214 920 186 C 1180 162 1330 198 1440 186 L1440 220 L0 220 Z" fill={fade} />
    </svg>
  );
}

/** A gold leaf sprig, as in the poster's corners. Mirror it with `flip`. */
export function Sprig({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  const leaves = [
    { x: 40, y: 150, r: -50 },
    { x: 70, y: 118, r: -20 },
    { x: 92, y: 92, r: -62 },
    { x: 122, y: 70, r: -28 },
    { x: 146, y: 46, r: -70 },
    { x: 176, y: 30, r: -36 },
  ];
  return (
    <svg className={`pointer-events-none ${className}`} viewBox="0 0 220 200" aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M8 196 C 60 150 120 90 210 14" fill="none" stroke="var(--gold)" strokeWidth="1.4" opacity="0.7" />
      {leaves.map((l, i) => (
        <path
          key={i}
          d="M0 0 C 10 -14 30 -16 44 -6 C 30 4 10 6 0 0 Z"
          transform={`translate(${l.x} ${l.y}) rotate(${l.r})`}
          fill={i % 2 ? "var(--sage-deep)" : "none"}
          stroke="var(--gold)"
          strokeWidth="1.1"
          opacity={i % 2 ? 0.55 : 0.75}
        />
      ))}
    </svg>
  );
}

/** The poster's title rule: line, diamond, lotus, diamond, line. */
export function LotusRule({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 28" aria-hidden="true" fill="none" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round">
      <path d="M10 16 H122 M198 16 H310" />
      <path d="M128 16 l5 -5 5 5 -5 5 Z M182 16 l5 -5 5 5 -5 5 Z" fill="var(--gold)" stroke="none" />
      <path d="M160 4 c5 5 7 10 0 18 c-7 -8 -5 -13 0 -18 Z" />
      <path d="M160 22 c-6 -1 -12 -6 -13 -12 c6 0 10 4 13 12 Z M160 22 c6 -1 12 -6 13 -12 c-6 0 -10 4 -13 12 Z" />
      <path d="M144 22 H176" />
    </svg>
  );
}
