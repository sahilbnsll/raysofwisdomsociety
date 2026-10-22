"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades content up once it scrolls into view. With `develop`, photographs inside also go from
 * black and white to colour (see .develop in globals.css). Content is never hidden for people who
 * prefer reduced motion or have JavaScript off.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  develop = false,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  develop?: boolean;
  as?: "div" | "li" | "section" | "figure";
}) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${develop ? "develop" : ""} ${className}`}
      data-in={seen}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
