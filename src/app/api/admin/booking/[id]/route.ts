import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminAuthed } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const patchSchema = z.object({
  status: z.enum(['NEW', 'CONFIRMED', 'DONE', 'CANCELLED']),
});

// PATCH /api/admin/booking/:id — update a booking's status. Admin-only.
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'VALIDATION' }, { status: 422 });
  }

  try {
    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
      select: { id: true, status: true },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  }
}
