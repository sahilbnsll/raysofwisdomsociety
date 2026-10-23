"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { Evenings } from "@/content/event";
import type { PassData } from "@/lib/epass/render-pass";

interface EPassContextValue {
  /** Passes this browser has made, newest first. */
  passes: PassData[];
  /** The evening a visitor picked elsewhere on the page (e.g. under a day of the programme). */
  preferred: { value: Evenings; at: number } | null;
  recordIssued: (pass: PassData) => void;
  /** Scrolls to the e-pass section and puts the cursor in the name field, optionally choosing an evening. */
  goToPass: (evening?: Evenings) => void;
  /** The studio registers how to focus its first field. */
  registerFocus: (fn: (() => void) | null) => void;
}

const EPassContext = createContext<EPassContextValue | null>(null);

/* The passes this browser holds live in localStorage. Read through useSyncExternalStore so server and
   first client render agree (no passes) and the real list arrives without an effect-driven setState. */
const STORAGE_KEY = "rws-epass-iaaf-2026-v2";
const CHANGE_EVENT = "rws-epass-change";
let memoryRaw: string | null = null; // used when localStorage is blocked

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function getSnapshot(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? memoryRaw;
  } catch {
    return memoryRaw;
  }
}

function parsePasses(raw: string | null): PassData[] {
  if (!raw) return [];
  try {
    const list = JSON.parse(raw) as PassData[];
    return Array.isArray(list)
      ? list.filter((p) => p && typeof p.id === "string" && typeof p.name === "string").map((p) => ({ ...p, days: p.days ?? "both" }))
      : [];
  } catch {
    return [];
  }
}

const NO_PASSES: PassData[] = [];

export function EPassProvider({ children }: { children: React.ReactNode }) {
  const [preferred, setPreferred] = useState<{ value: Evenings; at: number } | null>(null);
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const parsed = useMemo(() => parsePasses(raw), [raw]);
  const passes = parsed.length ? parsed : NO_PASSES;
  const focusRef = useRef<(() => void) | null>(null);

  const recordIssued = useCallback((p: PassData) => {
    const next = JSON.stringify([p, ...parsePasses(getSnapshot()).filter((x) => x.id !== p.id)].slice(0, 12));
    memoryRaw = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode: the pass still downloaded, we just can't remember it across visits */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const registerFocus = useCallback((fn: (() => void) | null) => {
    focusRef.current = fn;
  }, []);

  const goToPass = useCallback((evening?: Evenings) => {
    if (evening) setPreferred({ value: evening, at: Date.now() });
    const el = document.getElementById("e-pass");
    el?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    // Wait for the scroll to settle so the on-screen keyboard doesn't fight it.
    window.setTimeout(() => focusRef.current?.(), 650);
  }, []);

  const value = useMemo(
    () => ({ passes, preferred, recordIssued, goToPass, registerFocus }),
    [passes, preferred, recordIssued, goToPass, registerFocus],
  );

  return <EPassContext.Provider value={value}>{children}</EPassContext.Provider>;
}

export function useEPass(): EPassContextValue {
  const ctx = useContext(EPassContext);
  if (!ctx) throw new Error("useEPass must be used inside <EPassProvider>");
  return ctx;
}
