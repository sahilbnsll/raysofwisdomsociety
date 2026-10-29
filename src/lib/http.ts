import { createHash } from "node:crypto";

/** Headers for every API answer: results are per-request, never worth caching. */
export const NO_STORE = { "Cache-Control": "no-store" } as const;

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return Response.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

/**
 * Browsers always send an Origin header on cross-site POSTs. If it names another site, the request
 * is not from our pages, so refuse it. (A missing Origin means a non-browser client, which is fine:
 * the cookie that matters is SameSite=Lax and the pass maker has its own rate limit.)
 */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** An anonymous key for a client (a hash of its address), so limits never store raw IPs. */
export function clientKey(request: Request): string {
  const ip = (request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local").trim();
  return createHash("sha256").update(ip).digest("hex");
}

/**
 * A small sliding-window limiter, per server instance. It stops scripts, not determined attackers:
 * on serverless hosting each instance counts separately, so keep the limits themselves strict.
 */
export function createLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return {
    /** Records a hit and says whether the client is now over the limit. */
    over(key: string): boolean {
      const now = Date.now();
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      const over = recent.length >= max;
      hits.set(key, over ? recent : [...recent, now]);
      if (hits.size > 5000) hits.clear();
      return over;
    },
    /** Whether the client is already over the limit, without counting this visit. */
    blocked(key: string): boolean {
      const now = Date.now();
      return (hits.get(key) ?? []).filter((t) => now - t < windowMs).length >= max;
    },
    /** Counts one hit against the client: for failures only, so honest use never uses the allowance up. */
    hit(key: string): void {
      const now = Date.now();
      hits.set(key, [...(hits.get(key) ?? []).filter((t) => now - t < windowMs), now]);
      if (hits.size > 5000) hits.clear();
    },
    retryAfter: Math.ceil(windowMs / 1000),
  };
}
