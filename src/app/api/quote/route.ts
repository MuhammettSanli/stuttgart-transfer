import { NextResponse } from 'next/server';
import { quoteSchema } from '@/lib/validation';
import { computeQuote } from '@/lib/quote-service';

// POST /api/quote — authoritative price calculation. The client PriceCalculator
// calls this (debounced) for the live preview; the booking flow re-quotes here
// server-side so the stored price can never be tampered with client-side.
export async function POST(request: Request) {
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
