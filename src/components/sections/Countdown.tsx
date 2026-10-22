"use client";

import { useEffect, useState } from "react";
import { event, eventStartsAt } from "@/content/event";

const DAY = 86_400_000;

/** A sentence, not a ticking clock: "33 days to go", "Tomorrow evening", "Tonight at 6:30 pm". */
function phrase(now: number): string {
  const start = new Date(eventStartsAt).getTime();
  const end = new Date(`${event.endDate}T23:59:59+05:30`).getTime();
  if (now > end) return "Thank you for joining us";
  if (now >= start) return "Under way now";
  // Compare calendar days in India time.
  const ist = (t: number) => Math.floor((t + 5.5 * 3_600_000) / DAY);
  const days = ist(start) - ist(now);
  if (days <= 0) return `Tonight at ${event.start}`;
  if (days === 1) return "Tomorrow evening";
  return `${days} days to go`;
}

export function Countdown({ className = "" }: { className?: string }) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setText(phrase(Date.now()));
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {text ?? " "}
    </span>
  );
}
