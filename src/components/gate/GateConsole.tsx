"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { brand } from "@/content/event";
import { defaultEvening, eveningName, type Evening } from "@/lib/epass/evening";
import type { Verdict } from "@/lib/epass/verdict";
import { passIdFrom, Scanner } from "./Scanner";
import { VerdictCard, eveningOptions } from "./VerdictCard";

interface Stats {
  passes: number;
  people: number;
  expectedPasses: number;
  expectedPeople: number;
  admittedPasses: number;
  admittedPeople: number;
  shared: boolean;
}

interface Check {
  key: string;
  verdict: Verdict;
}

export function GateConsole() {
  const [evening, setEvening] = useState<Evening>(() => defaultEvening());
  const [stats, setStats] = useState<Stats | null>(null);
  const [scanning, setScanning] = useState(false);
  const [manual, setManual] = useState("");
  const [current, setCurrent] = useState<Check | null>(null);
  const [recent, setRecent] = useState<Check[]>([]);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    try {
      const r = await fetch(`/api/gate/stats?evening=${evening}`, { cache: "no-store" });
      if (r.status === 401) return location.reload();
      if (r.ok) setStats(await r.json());
    } catch {
      /* keep the last numbers */
    }
  }, [evening]);

  useEffect(() => {
    const first = setTimeout(loadStats, 0);
    const t = setInterval(loadStats, 15_000);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, [loadStats]);

  const check = useCallback(
    async (id: string) => {
      setError("");
      setScanning(false);
      try {
        const r = await fetch(`/api/gate/check?id=${encodeURIComponent(id)}&evening=${evening}`, { cache: "no-store" });
        const v = (await r.json()) as Verdict & { error?: string };
        if (!r.ok) throw new Error(v.error ?? "Could not check that pass.");
        const entry = { key: `${id}-${Date.now()}`, verdict: v };
        setCurrent(entry);
        setRecent((list) => [entry, ...list].slice(0, 8));
      } catch (e) {
        setError((e as Error).message);
      }
    },
    [evening],
  );

  const onChange = useCallback(
    (v: Verdict) => {
      setRecent((list) => list.map((c, i) => (i === 0 ? { ...c, verdict: v } : c)));
      loadStats();
    },
    [loadStats],
  );

  async function signOut() {
    await fetch("/api/gate/session", { method: "DELETE" });
    location.reload();
  }

  const pct = stats && stats.expectedPeople ? Math.round((stats.admittedPeople / stats.expectedPeople) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-xl px-4 pb-16 pt-5">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image src={brand.logo.src} alt="" width={40} height={40} className="size-10" />
          <div className="leading-tight">
            <p className="display text-xl">Gate check-in</p>
            <p className="text-xs text-ink-muted">IAAF 2026 · Kamani Auditorium</p>
          </div>
        </div>
        <button type="button" onClick={signOut} className="text-sm text-ink-muted underline underline-offset-4">
          Sign out
        </button>
      </header>

      <div role="radiogroup" aria-label="Evening being checked" className="mt-5 grid grid-cols-2 rounded-full bg-paper p-1 shadow-e1 ring-1 ring-line">
        {eveningOptions.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={evening === o.value}
            onClick={() => {
              setEvening(o.value);
              setCurrent(null);
            }}
            className={`rounded-full py-2.5 text-sm font-semibold transition-colors ${evening === o.value ? "bg-ink text-paper" : "text-ink-muted"}`}
          >
            Evening of {o.label}
          </button>
        ))}
      </div>

      <section aria-label="All e-passes" className="card mt-4 flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm text-ink-muted">E-passes downloaded so far</p>
          <p className="display mt-1 text-5xl tabular-nums text-maroon">
            {stats ? stats.people : "–"}
            <span className="ml-2 font-sans text-base text-ink-muted">guests</span>
          </p>
        </div>
        <p className="text-right text-sm text-ink-muted">
          <span className="display block text-3xl tabular-nums text-ink">{stats ? stats.passes : "–"}</span>
          {stats?.passes === 1 ? "pass" : "passes"}
        </p>
      </section>

      <section aria-label="Tonight so far" className="card mt-4 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm text-ink-muted">Inside for {eveningName[evening]}</p>
          <p className="text-sm text-ink-muted">{stats ? `${stats.admittedPasses} of ${stats.expectedPasses} passes` : "…"}</p>
        </div>
        <p className="display mt-1 text-5xl tabular-nums">
          {stats ? stats.admittedPeople : "–"}
          <span className="ml-2 font-sans text-base text-ink-muted">of {stats ? stats.expectedPeople : "–"} people expected</span>
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-sage" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Share of expected guests inside">
          <div className="h-full rounded-full bg-olive transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
        {stats && !stats.shared && (
          <p role="alert" className="mt-3 rounded-lg bg-maroon px-3 py-2.5 text-sm font-semibold text-paper">
            Database not connected. Passes and check-ins live in one server&apos;s memory, so a pass can show as &quot;not found&quot; or be admitted twice. Connect the database before the festival.
          </p>
        )}
      </section>

      <div className="mt-4">
        {scanning ? (
          <Scanner onPass={check} onClose={() => setScanning(false)} />
        ) : (
          <button type="button" onClick={() => setScanning(true)} className="btn btn-primary w-full !min-h-16 text-lg">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Scan a pass
          </button>
        )}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const text = manual.trim();
          if (!text) return;
          // Accept a pasted pass link too; anything else goes to the server, which says "not a pass number".
          check(passIdFrom(text) ?? text);
          setManual("");
        }}
      >
        <label htmlFor="manual-id" className="sr-only">
          Pass number
        </label>
        <input
          id="manual-id"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="Or type a pass number"
          autoCapitalize="characters"
          autoComplete="off"
          className="min-w-0 grow rounded-full border border-line-strong bg-paper px-5 py-3 text-base uppercase tracking-wide outline-none placeholder:normal-case placeholder:tracking-normal focus:border-ink-muted"
        />
        <button type="submit" className="btn btn-secondary">
          Check
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-maroon">
          {error}
        </p>
      )}

      {current && (
        <div className="mt-5">
          <VerdictCard key={current.key} initial={current.verdict} onChange={onChange} compact />
          <button type="button" onClick={() => setScanning(true)} className="btn btn-primary mt-4 w-full">
            Scan the next pass
          </button>
        </div>
      )}

      {recent.length > 1 && (
        <section aria-label="Recent checks" className="mt-8">
          <p className="text-sm font-semibold">Recent checks</p>
          <ul className="mt-2 divide-y divide-line rounded-2xl bg-paper ring-1 ring-line">
            {recent.slice(1).map((c) => (
              <li key={c.key} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <span className="truncate">{c.verdict.pass?.name ?? "Unknown pass"}</span>
                <span className="shrink-0 text-ink-muted">{c.verdict.state.replace("-", " ")}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
