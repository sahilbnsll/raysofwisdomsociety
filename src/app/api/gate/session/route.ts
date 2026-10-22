import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { checkPin, gateConfigured, GATE_COOKIE, sessionCookie, sessionValue } from "@/lib/epass/gate";

const NO_STORE = { "Cache-Control": "no-store" };

// Slow down PIN guessing: 6 tries per 10 minutes per client (per server instance).
const tries = new Map<string, number[]>();
function tooMany(key: string): boolean {
  const now = Date.now();
  const recent = (tries.get(key) ?? []).filter((t) => now - t < 600_000);
  tries.set(key, [...recent, now]);
  if (tries.size > 2000) tries.clear();
  return recent.length >= 6;
}

export async function POST(request: NextRequest) {
  if (!gateConfigured()) {
    return Response.json({ error: "Gate check-in is not set up yet. Add GATE_PIN to the site's settings." }, { status: 503, headers: NO_STORE });
  }
  const ip = (request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local").trim();
  if (tooMany(createHash("sha256").update(ip).digest("hex"))) {
    return Response.json({ error: "Too many attempts. Wait a few minutes and try again." }, { status: 429, headers: NO_STORE });
  }
  let pin = "";
  try {
    pin = String(((await request.json()) as { pin?: unknown }).pin ?? "");
  } catch {
    /* fall through to the error below */
  }
  if (!checkPin(pin)) {
    return Response.json({ error: "That PIN is not right." }, { status: 401, headers: NO_STORE });
  }
  const res = Response.json({ ok: true }, { headers: NO_STORE });
  const c = sessionCookie(sessionValue());
  res.headers.append(
    "Set-Cookie",
    `${c.name}=${c.value}; Path=${c.path}; Max-Age=${c.maxAge}; HttpOnly; SameSite=Lax${c.secure ? "; Secure" : ""}`,
  );
  return res;
}

export async function DELETE() {
  const res = Response.json({ ok: true }, { headers: NO_STORE });
  res.headers.append("Set-Cookie", `${GATE_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  return res;
}
