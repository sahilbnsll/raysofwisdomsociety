import "server-only";
import { randomInt } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Evenings } from "@/content/event";

export interface IssuedPass {
  id: string;
  name: string;
  guests: number;
  days: Evenings;
  createdAt: string;
}

interface PassStore {
  count(): Promise<number>;
  issue(input: { name: string; guests: number; days: Evenings }): Promise<IssuedPass>;
  get(id: string): Promise<IssuedPass | null>;
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

/* ---------------------------------------------------------------- */
/* Supabase: used when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY set  */
/* ---------------------------------------------------------------- */

function supabaseStore(): PassStore | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const db = createClient(url, key, { auth: { persistSession: false } });
  const cols = "id, name, guests, days, created_at";
  const toPass = (r: { id: string; name: string; guests: number; days: Evenings; created_at: string }): IssuedPass => ({
    id: r.id,
    name: r.name,
    guests: r.guests,
    days: r.days,
    createdAt: r.created_at,
  });

  return {
    async count() {
      const { count, error } = await db.from("epass_issues").select("id", { count: "exact", head: true });
      if (error) throw new Error(error.message);
      return count ?? 0;
    },
    async issue({ name, guests, days }) {
      // Retry on the (very unlikely) id collision.
      for (let attempt = 0; attempt < 4; attempt++) {
        const id = newPassId();
        const { data, error } = await db.from("epass_issues").insert({ id, name, guests, days }).select(cols).single();
        if (!error && data) return toPass(data);
        if (error && error.code !== "23505") throw new Error(error.message);
      }
      throw new Error("Could not allocate a pass number");
    },
    async get(id) {
      const { data, error } = await db.from("epass_issues").select(cols).eq("id", id).maybeSingle();
      if (error) throw new Error(error.message);
      return data ? toPass(data) : null;
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
    return rows.map((r) => ({ ...r, days: r.days ?? "both" }));
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
    const pass: IssuedPass = { id, name, guests, days, createdAt: new Date().toISOString() };
    await writeAll([...rows, pass]);
    return pass;
  },
  async get(id) {
    return (await readAll()).find((r) => r.id === id) ?? null;
  },
};

export function getPassStore(): PassStore {
  return supabaseStore() ?? localStore;
}
