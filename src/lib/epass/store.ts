import "server-only";
import { randomInt } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Evenings } from "@/content/event";
import type { Evening } from "./evening";

export interface IssuedPass {
  id: string;
  name: string;
  guests: number;
  days: Evenings;
  createdAt: string;
  /** When the pass was checked in at the gate, per evening. */
  admitted: Partial<Record<Evening, string>>;
}

export interface GateStats {
  passes: number;
  people: number;
  /** For the chosen evening: passes and people expected, and how many are in. */
  expectedPasses: number;
  expectedPeople: number;
  admittedPasses: number;
  admittedPeople: number;
}

export type AdmitResult = { status: "admitted"; pass: IssuedPass } | { status: "already"; pass: IssuedPass } | { status: "not-found" };

interface PassStore {
  count(): Promise<number>;
  issue(input: { name: string; guests: number; days: Evenings }): Promise<IssuedPass>;
  get(id: string): Promise<IssuedPass | null>;
  /** Marks the pass as in for this evening. Never overwrites an earlier check-in. */
  admit(id: string, evening: Evening): Promise<AdmitResult>;
  /** Clears a check-in made by mistake. */
  undoAdmit(id: string, evening: Evening): Promise<IssuedPass | null>;
  stats(evening: Evening): Promise<GateStats>;
}

// No 0/O/1/I so a pass number read aloud at the gate is unambiguous.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const PREFIX = "RWS26";

export const PASS_ID = new RegExp(`^${PREFIX}-[${ALPHABET}]{6}$`);

export function newPassId(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += ALPHABET[randomInt(ALPHABET.length)];
  return `${PREFIX}-${suffix}`;
}

/** Accepts what a person might type at the gate: "rws26 abc234", "ABC234", with or without the dash. */
export function normalisePassId(input: string): string {
  const s = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const tail = s.startsWith(PREFIX) ? s.slice(PREFIX.length) : s;
  return `${PREFIX}-${tail}`;
}

function summarise(rows: IssuedPass[], evening: Evening): GateStats {
  const expected = rows.filter((r) => r.days === "both" || r.days === evening);
  const admitted = expected.filter((r) => r.admitted[evening]);
  const people = (list: IssuedPass[]) => list.reduce((n, r) => n + r.guests, 0);
  return {
    passes: rows.length,
    people: people(rows),
    expectedPasses: expected.length,
    expectedPeople: people(expected),
    admittedPasses: admitted.length,
    admittedPeople: people(admitted),
  };
}

/* ---------------------------------------------------------------- */
/* Supabase: used when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY set  */
/* ---------------------------------------------------------------- */

interface Row {
  id: string;
  name: string;
  guests: number;
  days: Evenings;
  created_at: string;
  admitted_day1: string | null;
  admitted_day2: string | null;
}

const COLS = "id, name, guests, days, created_at, admitted_day1, admitted_day2";

const fromRow = (r: Row): IssuedPass => ({
  id: r.id,
  name: r.name,
  guests: r.guests,
  days: r.days,
  createdAt: r.created_at,
  admitted: {
    ...(r.admitted_day1 ? { day1: r.admitted_day1 } : {}),
    ...(r.admitted_day2 ? { day2: r.admitted_day2 } : {}),
  },
});

function supabaseStore(): PassStore | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const db = createClient(url, key, { auth: { persistSession: false } });
  const table = () => db.from("epass_issues");

  return {
    async count() {
      const { count, error } = await table().select("id", { count: "exact", head: true });
      if (error) throw new Error(error.message);
      return count ?? 0;
    },
    async issue({ name, guests, days }) {
      // Retry on the (very unlikely) id collision.
      for (let attempt = 0; attempt < 4; attempt++) {
        const { data, error } = await table().insert({ id: newPassId(), name, guests, days }).select(COLS).single();
        if (!error && data) return fromRow(data as Row);
        if (error && error.code !== "23505") throw new Error(error.message);
      }
      throw new Error("Could not allocate a pass number");
    },
    async get(id) {
      const { data, error } = await table().select(COLS).eq("id", id).maybeSingle();
      if (error) throw new Error(error.message);
      return data ? fromRow(data as Row) : null;
    },
    async admit(id, evening) {
      const col = evening === "day1" ? "admitted_day1" : "admitted_day2";
      // Only fills an empty slot, so two phones scanning the same pass can't both admit it.
      const { data, error } = await table().update({ [col]: new Date().toISOString() }).eq("id", id).is(col, null).select(COLS).maybeSingle();
      if (error) throw new Error(error.message);
      if (data) return { status: "admitted", pass: fromRow(data as Row) };
      const existing = await this.get(id);
      return existing ? { status: "already", pass: existing } : { status: "not-found" };
    },
    async undoAdmit(id, evening) {
      const col = evening === "day1" ? "admitted_day1" : "admitted_day2";
      const { data, error } = await table().update({ [col]: null }).eq("id", id).select(COLS).maybeSingle();
      if (error) throw new Error(error.message);
      return data ? fromRow(data as Row) : null;
    },
    async stats(evening) {
      const { data, error } = await table().select("guests, days, admitted_day1, admitted_day2");
      if (error) throw new Error(error.message);
      const rows = (data ?? []).map((r) => fromRow({ id: "", name: "", created_at: "", ...(r as Omit<Row, "id" | "name" | "created_at">) }));
      return summarise(rows, evening);
    },
  };
}

/* ---------------------------------------------------------------- */
/* Local fallback: .data/epass.json in dev, memory where the disk is */
/* read-only (e.g. a serverless preview). Fine for a draft demo only.*/
/* ---------------------------------------------------------------- */

const FILE = path.join(process.cwd(), ".data", "epass.json");
const memory: IssuedPass[] = [];
let diskWritable = true;

async function readAll(): Promise<IssuedPass[]> {
  if (!diskWritable) return memory;
  try {
    const rows = JSON.parse(await fs.readFile(FILE, "utf8")) as IssuedPass[];
    return rows.map((r) => ({ ...r, days: r.days ?? "both", admitted: r.admitted ?? {} }));
  } catch {
    return memory;
  }
}

async function writeAll(rows: IssuedPass[]) {
  memory.splice(0, memory.length, ...rows);
  if (!diskWritable) return;
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(rows, null, 2));
  } catch {
    diskWritable = false;
  }
}

const localStore: PassStore = {
  async count() {
    return (await readAll()).length;
  },
  async issue({ name, guests, days }) {
    const rows = await readAll();
    const taken = new Set(rows.map((r) => r.id));
    let id = newPassId();
    while (taken.has(id)) id = newPassId();
    const pass: IssuedPass = { id, name, guests, days, createdAt: new Date().toISOString(), admitted: {} };
    await writeAll([...rows, pass]);
    return pass;
  },
  async get(id) {
    return (await readAll()).find((r) => r.id === id) ?? null;
  },
  async admit(id, evening) {
    const rows = await readAll();
    const pass = rows.find((r) => r.id === id);
    if (!pass) return { status: "not-found" };
    if (pass.admitted[evening]) return { status: "already", pass };
    pass.admitted = { ...pass.admitted, [evening]: new Date().toISOString() };
    await writeAll(rows);
    return { status: "admitted", pass };
  },
  async undoAdmit(id, evening) {
    const rows = await readAll();
    const pass = rows.find((r) => r.id === id);
    if (!pass) return null;
    const next = { ...pass.admitted };
    delete next[evening];
    pass.admitted = next;
    await writeAll(rows);
    return pass;
  },
  async stats(evening) {
    return summarise(await readAll(), evening);
  },
};

export function getPassStore(): PassStore {
  return supabaseStore() ?? localStore;
}

export const usingSharedStore = () => !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
