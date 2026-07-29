import { NextResponse } from 'next/server';
import { bookingSchema } from '@/lib/validation';
import { computeQuote } from '@/lib/quote-service';
import { prisma } from '@/lib/prisma';
import { sendBookingEmails } from '@/lib/email';
import { checkRateLimit, getClientIp, LIMITS } from '@/lib/rate-limit';
import { minibarTotalCents } from '@/lib/extras';

// POST /api/booking — re-quotes server-side (authoritative price), persists the
// booking, then sends notification + confirmation emails.
export async function POST(request: Request) {
  // Per-IP rate limit: block a single client from spamming bookings.
  const ip = getClientIp(request.headers);
  const rl = await checkRateLimit(`booking:${ip}`, LIMITS.booking.limit, LIMITS.booking.windowMs);
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

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'VALIDATION', issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const data = parsed.data;

  // Never trust a client-sent price: recompute here.
  let quote;
  try {
    quote = await computeQuote({
      pickup: data.pickup,
      dropoff: data.dropoff,
      vehicleSlug: data.vehicleSlug,
      pickupAt: data.pickupAt,
    });
  } catch (err) {
    const code = (err as { code?: string }).code ?? 'UNKNOWN';
    const status = code === 'NO_ROUTE' ? 422 : 500;
    return NextResponse.json({ error: code }, { status });
  }

  const pickupAt = new Date(data.pickupAt);

  // Add paid extras (minibar) — priced server-side from the shared catalog so
  // the stored total always matches what the customer was shown.
  const extrasCents = minibarTotalCents(data.extras?.minibar);
  const totalCents = quote.totalCents + extrasCents;

  const booking = await prisma.booking.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      pickupAddress: data.pickup,
      dropoffAddress: data.dropoff,
      pickupAt,
      passengers: data.passengers,
      luggage: data.luggage,
      notes: data.notes || null,
      vehicleId: quote.vehicle.id,
      distanceMeters: quote.distanceMeters,
      durationSeconds: quote.durationSeconds,
      priceCents: totalCents,
      currency: quote.currency,
      locale: data.locale,
    },
  });

  // Fire emails but don't fail the booking if delivery has an issue.
  await sendBookingEmails({
    id: booking.id,
    firstName: booking.firstName,
    lastName: booking.lastName,
    email: booking.email,
    phone: booking.phone,
    pickupAddress: booking.pickupAddress,
    dropoffAddress: booking.dropoffAddress,
    pickupAt: booking.pickupAt,
    passengers: booking.passengers,
    luggage: booking.luggage,
    vehicleName: quote.vehicle.name,
    priceCents: booking.priceCents,
    notes: booking.notes,
  });

  return NextResponse.json({
    id: booking.id,
    priceCents: booking.priceCents,
    currency: booking.currency,
  });
}
