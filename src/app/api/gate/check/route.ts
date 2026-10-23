import type { NextRequest } from "next/server";
import { isStaff } from "@/lib/epass/gate";
import { getPassStore, normalisePassId, PASS_ID, usingSharedStore } from "@/lib/epass/store";
import { defaultEvening, type Evening } from "@/lib/epass/evening";
import { toGatePass, verdictFor } from "@/lib/epass/verdict";
import { json, sameOrigin } from "@/lib/http";

const EVENINGS: Evening[] = ["day1", "day2"];

const answer = (v: object) => json({ ...v, shared: usingSharedStore() });

const eveningFrom = (v: unknown): Evening => (EVENINGS.includes(v as Evening) ? (v as Evening) : defaultEvening());

/** Looks a pass up for gate staff: GET ?id=RWS26-XXXXXX&evening=day1 */
export async function GET(request: NextRequest) {
  if (!(await isStaff())) return json({ error: "Sign in at /gate first." }, 401);
  const id = normalisePassId(request.nextUrl.searchParams.get("id") ?? "");
  const evening = eveningFrom(request.nextUrl.searchParams.get("evening"));
  if (!PASS_ID.test(id)) return answer({ ...verdictFor(null, evening), invalid: true });
  try {
    const pass = await getPassStore().get(id);
    return answer(verdictFor(pass && toGatePass(pass), evening));
  } catch (error) {
    console.error("[gate] lookup failed:", error);
    return json({ error: "Could not check the pass. Try again." }, 503);
  }
}

/** Admits (or with undo: true, un-admits) a pass for an evening: POST { id, evening, undo? } */
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  if (!(await isStaff())) return json({ error: "Sign in at /gate first." }, 401);
  let body: { id?: unknown; evening?: unknown; undo?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (!body || typeof body !== "object") return json({ error: "Invalid request." }, 400);
  const id = normalisePassId(String(body.id ?? ""));
  const evening = eveningFrom(body.evening);
  if (!PASS_ID.test(id)) return answer({ ...verdictFor(null, evening), invalid: true });
  try {
    const store = getPassStore();
    if (body.undo === true) {
      const pass = await store.undoAdmit(id, evening);
      return answer({ ...verdictFor(pass && toGatePass(pass), evening), undone: true });
    }
    const result = await store.admit(id, evening);
    if (result.status === "not-found") return answer(verdictFor(null, evening));
    const pass = toGatePass(result.pass);
    // "admitted" is a fresh check-in; "already" keeps the earlier time.
    return answer({ state: result.status, evening, pass, admittedAt: pass.admitted[evening] });
  } catch (error) {
    console.error("[gate] admit failed:", error);
    return json({ error: "Could not record the check-in. Try again." }, 503);
  }
}
