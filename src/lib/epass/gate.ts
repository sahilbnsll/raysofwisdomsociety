import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Gate staff sign in once on /gate with a PIN (env GATE_PIN). After that, the same phone that scans
 * a pass's QR code sees the check-in controls; everyone else sees only the visitor view.
 * The session is a signed cookie, so nothing about staff is stored in the database.
 */

export const GATE_COOKIE = "iaaf_gate";
const SESSION_HOURS = 14;

const dev = process.env.NODE_ENV !== "production";

/** The PIN staff type at the gate. In development it falls back to 2026 so the draft can be tried. */
export function gatePin(): string | null {
  return process.env.GATE_PIN || (dev ? "2026" : null);
}

function secret(): string | null {
  return process.env.GATE_SECRET || (gatePin() ? `iaaf-gate:${gatePin()}` : null);
}

function sign(payload: string): string {
  return createHmac("sha256", secret() ?? "").update(payload).digest("base64url");
}

export function sessionValue(): string {
  const exp = Date.now() + SESSION_HOURS * 3_600_000;
  return `${exp}.${sign(String(exp))}`;
}

export const sessionCookie = (value: string) => ({
  name: GATE_COOKIE,
  value,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: !dev,
  path: "/",
  maxAge: SESSION_HOURS * 3600,
});

export function checkPin(input: string): boolean {
  const pin = gatePin();
  if (!pin) return false;
  const a = Buffer.from(input.trim());
  const b = Buffer.from(pin);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isStaff(): Promise<boolean> {
  if (!secret()) return false;
  const raw = (await cookies()).get(GATE_COOKIE)?.value;
  if (!raw) return false;
  const [exp, sig] = raw.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const expected = sign(exp);
  return sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export const gateConfigured = () => !!gatePin();
