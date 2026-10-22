import type { NextRequest } from "next/server";
import { isStaff } from "@/lib/epass/gate";
import { getPassStore, normalisePassId, PASS_ID } from "@/lib/epass/store";
import { defaultEvening, type Evening } from "@/lib/epass/evening";
import { toGatePass, verdictFor } from "@/lib/epass/verdict";

const NO_STORE = { "Cache-Control": "no-store" };
const EVENINGS: Evening[] = ["day1", "day2"];

const eveningFrom = (v: unknown): Evening => (EVENINGS.includes(v as Evening) ? (v as Evening) : defaultEvening());

/** Looks a pass up for gate staff: GET ?id=RWS26-XXXXXX&evening=day1 */
export async function GET(request: NextRequest) {
  if (!(await isStaff())) return Response.json({ error: "Sign in at /gate first." }, { status: 401, headers: NO_STORE });
  const id = normalisePassId(request.nextUrl.searchParams.get("id") ?? "");
  const evening = eveningFrom(request.nextUrl.searchParams.get("evening"));
  if (!PASS_ID.test(id)) return Response.json(verdictFor(null, evening), { headers: NO_STORE });
  try {
    const pass = await getPassStore().get(id);
    return Response.json(verdictFor(pass && toGatePass(pass), evening), { headers: NO_STORE });
  } catch (error) {
    console.error("[gate] lookup failed:", error);
    return Response.json({ error: "Could not check the pass. Try again." }, { status: 503, headers: NO_STORE });
  }
}

/** Admits (or with undo: true, un-admits) a pass for an evening: POST { id, evening, undo? } */
export async function POST(request: NextRequest) {
  if (!(await isStaff())) return Response.json({ error: "Sign in at /gate first." }, { status: 401, headers: NO_STORE });
  let body: { id?: unknown; evening?: unknown; undo?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400, headers: NO_STORE });
  }
  const id = normalisePassId(String(body.id ?? ""));
  const evening = eveningFrom(body.evening);
  if (!PASS_ID.test(id)) return Response.json(verdictFor(null, evening), { headers: NO_STORE });
  try {
    const store = getPassStore();
    if (body.undo === true) {
      const pass = await store.undoAdmit(id, evening);
      return Response.json({ ...verdictFor(pass && toGatePass(pass), evening), undone: true }, { headers: NO_STORE });
    }
    const result = await store.admit(id, evening);
    if (result.status === "not-found") return Response.json(verdictFor(null, evening), { headers: NO_STORE });
    const pass = toGatePass(result.pass);
    // "admitted" is reported as a fresh check-in; "already" keeps the earlier time.
    return Response.json(
      result.status === "admitted"
        ? { state: "admitted", evening, pass, admittedAt: pass.admitted[evening] }
        : { state: "already", evening, pass, admittedAt: pass.admitted[evening] },
      { headers: NO_STORE },
    );
  } catch (error) {
    console.error("[gate] admit failed:", error);
    return Response.json({ error: "Could not record the check-in. Try again." }, { status: 503, headers: NO_STORE });
  }
}
