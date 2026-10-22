"use client";

import type { Evenings } from "@/content/event";
import { useEPass } from "./EPassProvider";

/**
 * A link to the e-pass section that also drops the cursor into the form, optionally with an evening
 * already chosen. Works as a plain #e-pass link without JavaScript.
 */
export function EPassLink({
  className = "btn btn-primary",
  children,
  evening,
  icon = true,
}: {
  className?: string;
  children?: React.ReactNode;
  evening?: Evenings;
  icon?: boolean;
}) {
  const { goToPass, passes } = useEPass();
  return (
    <a
      href="#e-pass"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        goToPass(evening);
      }}
    >
      {icon && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M14 6v12" stroke="currentColor" strokeWidth="1.7" strokeDasharray="2 2.4" />
        </svg>
      )}
      {children ?? (passes.length ? "Your e-pass" : "Get your e-pass")}
    </a>
  );
}
