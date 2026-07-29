import { NextResponse } from 'next/server';
import {
  checkCredentials,
  createSessionToken,
  isAdminConfigured,
  sessionCookie,
} from '@/lib/auth';
import { checkRateLimit, resetRateLimit, getClientIp, LIMITS } from '@/lib/rate-limit';

// POST /api/admin/login — validates credentials and sets the session cookie.
//
// This is the one endpoint where an attacker can *guess* their way in, so it is
// rate limited twice: per IP (stops a single machine grinding through a wordlist)
// and site-wide (stops a botnet spreading those guesses over thousands of IPs).
export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const ipKey = `admin-login:${ip}`;

  const perIp = await checkRateLimit(ipKey, LIMITS.adminLogin.limit, LIMITS.adminLogin.windowMs);
  if (!perIp.ok) return tooMany(perIp.retryAfterSec);

  const global = await checkRateLimit(
    'admin-login:all',
    LIMITS.adminLoginGlobal.limit,
    LIMITS.adminLoginGlobal.windowMs,
  );
  if (!global.ok) return tooMany(global.retryAfterSec);

  if (!isAdminConfigured()) {
    console.error(
      '[auth] Admin login blocked: set ADMIN_USERNAME, ADMIN_PASSWORD (12+ chars) and ADMIN_SESSION_SECRET (32+ chars).',
    );
    return invalid();
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 });
  }

  if (!body.username || !body.password || !checkCredentials(body.username, body.password)) {
    return invalid();
  }

  const token = createSessionToken();
  if (!token) return invalid();

  // Legitimate operator — clear their counter so a few typos earlier today can't
  // lock them out later.
  await resetRateLimit(ipKey);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie.name, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: sessionCookie.maxAge,
  });
  return res;
}

function tooMany(retryAfterSec: number) {
  return NextResponse.json(
    { error: 'RATE_LIMIT' },
    { status: 429, headers: { 'Retry-After': String(retryAfterSec) } },
  );
}

// One shared response for every failure mode, so probing can't distinguish
// "wrong password" from "server not configured".
function invalid() {
  return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
}
