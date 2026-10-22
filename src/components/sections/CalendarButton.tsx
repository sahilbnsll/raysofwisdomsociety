"use client";

import { downloadCalendar } from "@/lib/ics";

export function CalendarButton({ which = "both", className = "btn btn-secondary" }: { which?: "both" | "day1" | "day2"; className?: string }) {
  return (
    <button type="button" onClick={() => downloadCalendar(which)} className={className}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
      Add to calendar
    </button>
  );
}
