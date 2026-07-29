import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validation';
import { sendContactEmail } from '@/lib/email';
import { checkRateLimit, getClientIp, LIMITS } from '@/lib/rate-limit';

// POST /api/contact — validates a contact-form submission and emails the operator.
export async function POST(request: Request) {
  // Per-IP rate limit: block contact-form spam.
  const ip = getClientIp(request.headers);
  const rl = await checkRateLimit(`contact:${ip}`, LIMITS.contact.limit, LIMITS.contact.windowMs);
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

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'VALIDATION', issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  await sendContactEmail({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || undefined,
    message: parsed.data.message,
  });

  return NextResponse.json({ ok: true });
}
