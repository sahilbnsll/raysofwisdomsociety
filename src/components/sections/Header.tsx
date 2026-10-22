"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { brand, event } from "@/content/event";
import { EPassLink } from "@/components/epass/EPassLink";
import { useActiveSection } from "@/components/ui/useActiveSection";

const links = [
  { id: "about", label: "About" },
  { id: "programme", label: "Programme" },
  { id: "artists", label: "Artists" },
  { id: "gallery", label: "Gallery" },
  { id: "venue", label: "Venue" },
];

export function Header() {
  const active = useActiveSection(links.map((l) => l.id));
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-[var(--d3)] ${
        scrolled ? "bg-cream/88 shadow-[0_1px_0_var(--line)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-3" aria-label={`${event.title} 2026, back to top`}>
          <Image src={brand.logo.src} alt="" width={44} height={44} className="size-10 object-contain" priority />
          <span className="leading-tight">
            <span className="display block text-[1.35rem]">{event.shortTitle}</span>
            <span className="hidden text-xs text-ink-muted sm:block">25 to 26 Nov · New Delhi</span>
          </span>
        </a>

        <nav aria-label="Festival sections" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              aria-current={active === l.id ? "location" : undefined}
              className={`rounded-full px-3.5 py-2 text-[0.9375rem] transition-colors duration-[var(--d2)] ${
                active === l.id ? "bg-ink/[0.06] text-ink" : "text-ink-muted hover:text-ink"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Short label on the narrowest phones so the bar never overflows */}
          <EPassLink className="btn btn-primary !min-h-10 !px-4 text-sm whitespace-nowrap">
            <span className="max-[379px]:hidden">Get your&nbsp;</span>e-pass
          </EPassLink>
          <button
            type="button"
            onClick={() => menu.current?.showModal()}
            className="grid size-10 place-items-center rounded-full bg-paper shadow-e1 lg:hidden"
            aria-label="Open menu"
            aria-haspopup="dialog"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 7h14M3 13h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <dialog
        ref={menu}
        aria-label="Menu"
        onClick={(e) => e.target === e.currentTarget && menu.current?.close()}
        className="m-0 ml-auto h-svh max-h-none w-[min(22rem,88vw)] max-w-none bg-cream p-0 text-ink shadow-e3"
      >
        <div className="flex items-center justify-between px-6 py-5">
          <span className="flex items-center gap-3">
            <Image src={brand.logo.src} alt="" width={36} height={36} className="size-9 object-contain" />
            <span className="display text-xl">{event.shortTitle}</span>
          </span>
          <button type="button" onClick={() => menu.current?.close()} aria-label="Close menu" className="grid size-10 place-items-center rounded-full bg-paper shadow-e1">
            <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M3 3l12 12M15 3 3 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav aria-label="Festival sections" className="px-3">
          <ul>
            {links.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={() => menu.current?.close()} className="display flex min-h-14 items-center rounded-xl px-3 text-[1.75rem] hover:bg-ink/[0.05]">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="px-6 pt-6">
          <EPassLink className="btn btn-primary w-full" />
        </div>
      </dialog>
    </header>
  );
}
