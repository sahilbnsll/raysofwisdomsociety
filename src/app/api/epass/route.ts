import type { NextRequest } from "next/server";
import { getPassStore, usingSharedStore } from "@/lib/epass/store";
import type { Evenings } from "@/content/event";
import { clientKey, createLimiter, json, sameOrigin } from "@/lib/http";

/** How many guests already hold an e-pass: GET /api/epass -> { people, shared } */
export async function GET() {
  try {
    const people = await getPassStore().people();
    // `shared` says whether the number comes from the database (true) or a local file / server memory (false).
    return json({ people, shared: usingSharedStore() });
  } catch (error) {
    console.error("[epass] guest count failed:", error);
    return json({ error: "unavailable" }, 503);
  }
}

/* Small per-instance rate limit: 5 passes per client per 10 minutes. It only stops a script from
   inflating the guest count; a person getting passes for a family never gets near it. */
const limiter = createLimiter(5, 10 * 60 * 1000);

const clean = (value: unknown) =>
  typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f<>]/g, "").replace(/\s+/g, " ").trim() : "";

const EVENINGS: Evenings[] = ["both", "day1", "day2"];

/** Makes a pass: POST { name, guests, days } -> { id, name, guests, days, people } */
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "Invalid request." }, 400);

  // Hidden field only a script fills in: pretend it worked, store nothing.
  if (clean(body.website)) {
    return json({ id: "RWS26-222222", name: "", guests: 1, days: "both", people: 0 });
  }

  const name = clean(body.name);
  const guests = Number(body.guests ?? 1);
  const days = (typeof body.days === "string" ? body.days : "both") as Evenings;
  if (name.length < 2 || name.length > 60) {
    return json({ error: "Please enter your name (2 to 60 characters).", field: "name" }, 400);
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 4) {
    return json({ error: "A pass admits 1 to 4 people.", field: "guests" }, 400);
  }
  if (!EVENINGS.includes(days)) {
    return json({ error: "Please choose which evening you plan to attend.", field: "days" }, 400);
  }

  if (limiter.over(clientKey(request))) {
    return json({ error: "That is a lot of passes at once. Please try again in a few minutes." }, 429, {
      "Retry-After": String(limiter.retryAfter),
    });
  }

  try {
    const store = getPassStore();
    const pass = await store.issue({ name, guests, days });
    const people = await store.people();
    return json({ id: pass.id, name: pass.name, guests: pass.guests, days: pass.days, people });
  } catch (error) {
    console.error("[epass] issue failed:", error);
    return json({ error: "We could not create your pass. Please try again." }, 503);
  }
}
