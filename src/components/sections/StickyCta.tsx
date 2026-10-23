"use client";

import { useEffect, useState } from "react";
import { EPassCounter } from "@/components/epass/EPassCounter";
import { EPassLink } from "@/components/epass/EPassLink";

/** Phone-only bar that keeps the main action in reach once the hero has scrolled away. */
export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const pass = document.getElementById("e-pass")?.getBoundingClientRect();
      const overPass = !!pass && pass.top < window.innerHeight && pass.bottom > 0;
      setShow(window.scrollY > window.innerHeight * 0.9 && !overPass);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`no-print fixed inset-x-3 bottom-3 z-30 flex items-center justify-between gap-3 rounded-full bg-paper/95 py-2 pl-5 pr-2 shadow-e3 backdrop-blur transition-[transform,opacity] duration-[var(--d3)] ease-[var(--ease-out)] md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[130%] opacity-0"
      }`}
      inert={!show}
    >
      <EPassCounter short />
      <EPassLink className="btn btn-primary !min-h-11 !px-5 text-sm whitespace-nowrap" />
    </div>
  );
}
