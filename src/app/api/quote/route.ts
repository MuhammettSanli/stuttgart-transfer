import { NextResponse } from 'next/server';
import { quoteSchema } from '@/lib/validation';
import { computeQuote } from '@/lib/quote-service';
import { checkRateLimit, getClientIp, LIMITS } from '@/lib/rate-limit';

// POST /api/quote — authoritative price calculation. The client PriceCalculator
// calls this (debounced) for the live preview; the booking flow re-quotes here
// server-side so the stored price can never be tampered with client-side.
export async function POST(request: Request) {
  // Per-IP rate limit: each quote hits the paid Google Distance Matrix API, so
  // cap how fast a single client can trigger it.
  const ip = getClientIp(request.headers);
  const rl = await checkRateLimit(`quote:${ip}`, LIMITS.quote.limit, LIMITS.quote.windowMs);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'RATE_LIMIT' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'VALIDATION', issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const result = await computeQuote(parsed.data);
    return NextResponse.json({
      totalCents: result.totalCents,
      currency: result.currency,
      breakdown: result.breakdown,
      distanceMeters: result.distanceMeters,
      durationSeconds: result.durationSeconds,
      vehicle: result.vehicle,
    });
  } catch (err) {
    const code = (err as { code?: string }).code ?? 'UNKNOWN';
    const status = code === 'NO_ROUTE' ? 422 : 500;
    return NextResponse.json({ error: code }, { status });
  }
}
