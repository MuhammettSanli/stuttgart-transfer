// Lightweight in-memory rate limiter (fixed window per key).
//
// NOTE: On serverless (Vercel) memory is per-instance and resets on cold start,
// so this is a best-effort guard against casual/scripted abuse from a single
// IP — not a hard distributed limit. Combined with the Google Cloud daily quota
// cap it keeps cost bounded. For strict cross-instance limits, back this with a
// shared store (e.g. Upstash Redis).

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

export interface RateResult {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
}

/**
 * Allow up to `limit` hits per `windowMs` for a given `key`. Returns whether the
 * current hit is allowed plus how long to wait if not.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    // Opportunistic cleanup of expired keys to avoid unbounded growth.
    if (store.size > 5000) {
      for (const [k, v] of store) if (v.resetAt <= now) store.delete(k);
    }
    return { ok: true, remaining: limit - 1, retryAfterSec: 0 };
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { ok: true, remaining: limit - entry.count, retryAfterSec: 0 };
}

/** Best-effort client IP from the proxy headers Vercel sets. */
export function getClientIp(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return headers.get('x-real-ip') ?? 'unknown';
}

const HOUR = 60 * 60 * 1000;

// Per-IP limits, tuned so real customers never hit them but abuse is capped.
export const LIMITS = {
  booking: { limit: 5, windowMs: HOUR },
  contact: { limit: 5, windowMs: HOUR },
  quote: { limit: 100, windowMs: HOUR },
} as const;
