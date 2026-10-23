import type { NextRequest } from "next/server";
import { isStaff } from "@/lib/epass/gate";
import { getPassStore, usingSharedStore } from "@/lib/epass/store";
import { defaultEvening, type Evening } from "@/lib/epass/evening";
import { json } from "@/lib/http";

/** Live numbers for the gate console: GET ?evening=day1 */
export async function GET(request: NextRequest) {
  if (!(await isStaff())) return json({ error: "Sign in at /gate first." }, 401);
  const raw = request.nextUrl.searchParams.get("evening");
  const evening: Evening = raw === "day1" || raw === "day2" ? raw : defaultEvening();
  try {
    const stats = await getPassStore().stats(evening);
    return json({ evening, ...stats, shared: usingSharedStore() });
  } catch (error) {
    console.error("[gate] stats failed:", error);
    return json({ error: "Could not load the numbers." }, 503);
  }
}
