import type { NextRequest } from "next/server";
import { isStaff } from "@/lib/epass/gate";
import { getPassStore, usingSharedStore } from "@/lib/epass/store";
import { defaultEvening, type Evening } from "@/lib/epass/evening";

const NO_STORE = { "Cache-Control": "no-store" };

/** Live numbers for the gate console: GET ?evening=day1 */
export async function GET(request: NextRequest) {
  if (!(await isStaff())) return Response.json({ error: "Sign in at /gate first." }, { status: 401, headers: NO_STORE });
  const raw = request.nextUrl.searchParams.get("evening");
  const evening: Evening = raw === "day1" || raw === "day2" ? raw : defaultEvening();
  try {
    const stats = await getPassStore().stats(evening);
    return Response.json({ evening, ...stats, shared: usingSharedStore() }, { headers: NO_STORE });
  } catch (error) {
    console.error("[gate] stats failed:", error);
    return Response.json({ error: "Could not load the numbers." }, { status: 503, headers: NO_STORE });
  }
}
