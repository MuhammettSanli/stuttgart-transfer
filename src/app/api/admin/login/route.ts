import { NextResponse } from 'next/server';
import { checkCredentials, createSessionToken, sessionCookie } from '@/lib/auth';

// POST /api/admin/login — validates credentials and sets the session cookie.
export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 });
  }

  if (!body.username || !body.password || !checkCredentials(body.username, body.password)) {
    return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie.name, createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: sessionCookie.maxAge,
  });
  return res;
}
