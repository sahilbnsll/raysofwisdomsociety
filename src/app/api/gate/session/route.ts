import type { NextRequest } from "next/server";
import { checkPin, gateConfigured, GATE_COOKIE, sessionCookie, sessionValue } from "@/lib/epass/gate";
import { clientKey, createLimiter, json, sameOrigin } from "@/lib/http";

// Slow down PIN guessing: only WRONG pins count (10 per 10 minutes per client, 100 in total, per server
// instance). A correct PIN never uses the allowance up, so a gate team signing in on one shared Wi-Fi
// (which looks like a single client) is never locked out by its own sign-ins.
const perClient = createLimiter(10, 600_000);
const everyone = createLimiter(100, 600_000);

/** Staff sign-in: POST { pin } sets a 14-hour signed cookie. */
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  if (!gateConfigured()) {
    return json({ error: "Gate check-in is not set up yet. Add GATE_PIN and GATE_SECRET to the site's settings." }, 503);
  }
  const client = clientKey(request);
  if (perClient.blocked(client) || everyone.blocked("all")) {
    return json({ error: "Too many wrong PINs. Wait a few minutes and try again." }, 429, { "Retry-After": String(perClient.retryAfter) });
  }
  let pin = "";
  try {
    pin = String(((await request.json()) as { pin?: unknown }).pin ?? "");
  } catch {
    /* fall through to the error below */
  }
  if (!checkPin(pin)) {
    perClient.hit(client);
    everyone.hit("all");
    return json({ error: "That PIN is not right." }, 401);
  }

  const res = json({ ok: true });
  const c = sessionCookie(sessionValue());
  res.headers.append("Set-Cookie", `${c.name}=${c.value}; Path=${c.path}; Max-Age=${c.maxAge}; HttpOnly; SameSite=Lax${c.secure ? "; Secure" : ""}`);
  return res;
}

/** Sign out. */
export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  const res = json({ ok: true });
  res.headers.append("Set-Cookie", `${GATE_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  return res;
}
