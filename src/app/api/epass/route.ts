import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { getPassStore, usingSharedStore } from "@/lib/epass/store";
import type { Evenings } from "@/content/event";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const people = await getPassStore().people();
    // `shared` says whether the number comes from the database (true) or a local file / server memory (false).
    return Response.json({ people, shared: usingSharedStore() }, { headers: NO_STORE });
  } catch (error) {
    console.error("[epass] guest count failed:", error);
    return Response.json({ error: "unavailable" }, { status: 503, headers: NO_STORE });
  }
}

/* Small per-instance rate limit: 5 passes per client per 10 minutes. It only stops a script from
   inflating the guest count; a person getting passes for a family never gets near it. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function limited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  hits.set(key, [...recent, now]);
  if (hits.size > 5000) hits.clear();
  return false;
}

const clean = (value: unknown) =>
  typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f<>]/g, "").replace(/\s+/g, " ").trim() : "";

const EVENINGS: Evenings[] = ["both", "day1", "day2"];

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400, headers: NO_STORE });
  }

  // Hidden field only a script fills in: pretend it worked, store nothing.
  if (clean(body.website)) {
    return Response.json({ id: "RWS26-222222", name: "", guests: 1, days: "both", people: 0 }, { headers: NO_STORE });
  }

  const name = clean(body.name);
  const guests = Number(body.guests ?? 1);
  const days = (typeof body.days === "string" ? body.days : "both") as Evenings;
  if (name.length < 2 || name.length > 60) {
    return Response.json({ error: "Please enter your name (2 to 60 characters).", field: "name" }, { status: 400, headers: NO_STORE });
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 4) {
    return Response.json({ error: "A pass admits 1 to 4 people.", field: "guests" }, { status: 400, headers: NO_STORE });
  }
  if (!EVENINGS.includes(days)) {
    return Response.json({ error: "Please choose which evening you plan to attend.", field: "days" }, { status: 400, headers: NO_STORE });
  }

  const ip = (request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local").trim();
  if (limited(createHash("sha256").update(ip).digest("hex"))) {
    return Response.json({ error: "That is a lot of passes at once. Please try again in a few minutes." }, { status: 429, headers: NO_STORE });
  }

  try {
    const store = getPassStore();
    const pass = await store.issue({ name, guests, days });
    const people = await store.people();
    return Response.json({ id: pass.id, name: pass.name, guests: pass.guests, days: pass.days, people }, { headers: NO_STORE });
  } catch (error) {
    console.error("[epass] issue failed:", error);
    return Response.json({ error: "We could not create your pass. Please try again." }, { status: 503, headers: NO_STORE });
  }
}
