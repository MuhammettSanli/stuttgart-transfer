import { NextResponse } from 'next/server';
import { sessionCookie } from '@/lib/auth';

// POST /api/admin/logout — clears the session cookie.
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie.name, '', { path: '/', maxAge: 0 });
  return res;
}
