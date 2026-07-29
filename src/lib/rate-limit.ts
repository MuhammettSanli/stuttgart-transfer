// Two-layer fixed-window rate limiter.
//
// Layer 1 (memory) is a per-instance cache. It answers instantly and, once a key
// is known to be over its limit, absorbs the rest of a flood without touching the
// database at all.
//
// Layer 2 (Postgres `rate_limits`) is the shared source of truth. On Vercel every
// serverless instance has its own memory, so a memory-only limiter multiplies the
// real limit by the number of live instances — an attacker just keeps opening new
// connections. The DB counter is atomic and shared, so `limit` means `limit`
// regardless of how many instances are running.
//
// If the database is unreachable we fall back to the memory layer rather than
// locking everyone out: degraded protection beats an offline site.

import { prisma } from './prisma';

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

function secondsUntil(ts: number): number {
  return Math.max(1, Math.ceil((ts - Date.now()) / 1000));
}

/** Bump the per-instance counter and report the local view of the limit. */
function bumpMemory(key: string, limit: number, windowMs: number): RateResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    if (store.size > 5000) {
      for (const [k, v] of store) if (v.resetAt <= now) store.delete(k);
    }
    return { ok: true, remaining: limit - 1, retryAfterSec: 0 };
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0, retryAfterSec: secondsUntil(entry.resetAt) };
  }

  entry.count += 1;
  return { ok: true, remaining: limit - entry.count, retryAfterSec: 0 };
}

// Expired rows are harmless but accumulate. Sweep at most once every 10 minutes
// per instance, in the background — never block a request on cleanup.
const SWEEP_INTERVAL_MS = 10 * 60 * 1000;
let lastSweepAt = 0;

function maybeSweep(): void {
  const now = Date.now();
  if (now - lastSweepAt < SWEEP_INTERVAL_MS) return;
  lastSweepAt = now;
  prisma.rateLimit
    .deleteMany({ where: { resetAt: { lt: new Date(now - 60 * 60 * 1000) } } })
    .catch(() => {
      /* cleanup is best-effort */
    });
}

/**
 * Allow up to `limit` hits per `windowMs` for `key`, counted across all server
 * instances. Returns whether this hit is allowed and how long to wait if not.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateResult> {
  // Already known to be over the limit on this instance — reject without a query.
  const local = bumpMemory(key, limit, windowMs);
  if (!local.ok) return local;

  const resetAt = new Date(Date.now() + windowMs);

  try {
    // Single atomic statement: insert the row, or increment it — resetting the
    // counter first if its window has already elapsed.
    const rows = await prisma.$queryRaw<Array<{ count: number; resetAt: Date }>>`
      INSERT INTO "rate_limits" ("key", "count", "resetAt")
      VALUES (${key}, 1, ${resetAt})
      ON CONFLICT ("key") DO UPDATE SET
        "count"   = CASE WHEN "rate_limits"."resetAt" <= now() THEN 1 ELSE "rate_limits"."count" + 1 END,
        "resetAt" = CASE WHEN "rate_limits"."resetAt" <= now() THEN ${resetAt} ELSE "rate_limits"."resetAt" END
      RETURNING "count", "resetAt"
    `;

    maybeSweep();

    const row = rows[0];
    if (!row) return local;

    const sharedResetAt = row.resetAt.getTime();
    // Mirror the shared view locally so the next flood is stopped in memory.
    store.set(key, { count: row.count, resetAt: sharedResetAt });

    if (row.count > limit) {
      return { ok: false, remaining: 0, retryAfterSec: secondsUntil(sharedResetAt) };
    }
    return { ok: true, remaining: limit - row.count, retryAfterSec: 0 };
  } catch {
    // DB down / not configured — the memory layer still applies.
    return local;
  }
}

/** Clear a key's counter (e.g. after a successful admin login). */
export async function resetRateLimit(key: string): Promise<void> {
  store.delete(key);
  try {
    await prisma.rateLimit.deleteMany({ where: { key } });
  } catch {
    /* best-effort */
  }
}

/**
 * Best-effort client IP.
 *
 * `x-vercel-forwarded-for` is written by Vercel's edge and cannot be forged by
 * the client, so it is preferred. `x-forwarded-for` is only consulted as a
 * fallback and only its FIRST entry is used — a client can append to that header,
 * so trusting a later entry would let an attacker mint a fresh identity (and a
 * fresh quota) on every request.
 */
export function getClientIp(headers: Headers): string {
  const vercel = headers.get('x-vercel-forwarded-for');
  if (vercel) return vercel.split(',')[0].trim();

  const real = headers.get('x-real-ip');
  if (real) return real.trim();

  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();

  return 'unknown';
}

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

// Per-IP limits, tuned so real customers never hit them but abuse is capped.
export const LIMITS = {
  booking: { limit: 5, windowMs: HOUR },
  contact: { limit: 5, windowMs: HOUR },
  quote: { limit: 100, windowMs: HOUR },
  // Brute-force protection for the admin panel. One operator needs a handful of
  // attempts; a password-guessing bot needs thousands.
  adminLogin: { limit: 8, windowMs: 15 * MINUTE },
  // Site-wide ceiling, so the per-IP limit can't be sidestepped with a botnet.
  adminLoginGlobal: { limit: 40, windowMs: 15 * MINUTE },
} as const;
