import { useId } from "react";
import { brand } from "@/content/event";

/**
 * The festival seal: the lotus emblem inside a ring of lettering, drawn as live SVG so the text
 * follows the ring and stays sharp (the pattern of My Postcards' Seal). Used where something is
 * being vouched for: the director's card, the e-pass and the gate.
 */
export function Seal({
  className = "",
  top = "International Ancient Arts Festival",
  bottom = "Kamani Auditorium · New Delhi · 2026",
  label = "Seal of the 9th International Ancient Arts Festival 2026",
}: {
  className?: string;
  top?: string;
  bottom?: string;
  label?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={`block h-auto ${className}`} viewBox="0 0 200 200" role="img" aria-label={label}>
      <defs>
        <path id={`${id}-top`} d="M 30 100 A 70 70 0 0 1 170 100" />
        <path id={`${id}-bottom`} d="M 17 100 A 83 83 0 0 0 183 100" />
      </defs>
      <g fill="none" stroke="currentColor">
        <circle cx="100" cy="100" r="95" strokeWidth="2.2" />
        <circle cx="100" cy="100" r="90" strokeWidth="0.8" opacity="0.6" />
        <circle cx="100" cy="100" r="58" strokeWidth="1.4" />
      </g>
      <g fill="currentColor" style={{ fontFamily: "var(--font-sans)", fontWeight: 700 }}>
        <text fontSize="12" letterSpacing="2.2">
          <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
            {top.toUpperCase()}
          </textPath>
        </text>
        <text fontSize="10.5" letterSpacing="2">
          <textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle">
            {bottom.toUpperCase()}
          </textPath>
        </text>
        <circle cx="20" cy="100" r="2.6" />
        <circle cx="180" cy="100" r="2.6" />
      </g>
      <image href={brand.logo.src} x="50" y="50" width="100" height="100" />
    </svg>
  );
}
