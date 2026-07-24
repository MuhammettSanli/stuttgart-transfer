import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validation';
import { sendContactEmail } from '@/lib/email';

// POST /api/contact — validates a contact-form submission and emails the operator.
export async function POST(request: Request) {
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
