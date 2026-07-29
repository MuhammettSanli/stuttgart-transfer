import crypto from 'crypto';
import { cookies } from 'next/headers';

// Minimal single-admin auth. A signed, httpOnly cookie holds an expiry-stamped
// token verified with an HMAC over ADMIN_SESSION_SECRET. No external auth lib.

const COOKIE_NAME = 'admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

const isProd = process.env.NODE_ENV === 'production';

/**
 * HMAC key for session cookies. In production a real secret is mandatory: the
 * old hardcoded dev fallback lives in source control, so anyone who has seen the
 * repo could forge an `admin_session` cookie and walk into the panel. Returning
 * null there makes every session invalid until the env var is set — locked out
 * beats wide open.
 */
function secret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) {
    if (isProd) return null;
    return 'insecure-dev-secret-change-me';
  }
  return s;
}

function sign(value: string, key: string): string {
  return crypto.createHmac('sha256', key).update(value).digest('hex');
}

/** Compare two strings without leaking their length or contents via timing. */
function safeEqual(a: string, b: string): boolean {
  // Hashing first gives both sides a fixed 32-byte length, so timingSafeEqual
  // never throws and the comparison reveals nothing about the real length.
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/** Create a signed token "expiry.signature". Null if auth isn't configured. */
export function createSessionToken(): string | null {
  const key = secret();
  if (!key) return null;
  const expiry = String(Date.now() + MAX_AGE_SECONDS * 1000);
  return `${expiry}.${sign(expiry, key)}`;
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const key = secret();
  if (!key) return false;
  const [expiry, signature] = token.split('.');
  if (!expiry || !signature) return false;
  if (!safeEqual(sign(expiry, key), signature)) return false;
  return Number(expiry) > Date.now();
}

/**
 * Resolve the admin credentials. Returns null when the panel must stay closed:
 * unset credentials, or an unchanged/weak password in production. The dev
 * fallback exists only so `npm run dev` works before `.env.local` is filled in.
 */
function adminCredentials(): { username: string; password: string } | null {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    if (isProd) return null;
    return { username: 'admin', password: 'change-me' };
  }
  if (isProd && (password === 'change-me' || password.length < 12)) return null;

  return { username, password };
}

/** Whether the admin panel is safely configured (credentials + session secret). */
export function isAdminConfigured(): boolean {
  return adminCredentials() !== null && secret() !== null;
}

/** Validate the submitted username/password against env credentials. */
export function checkCredentials(username: string, password: string): boolean {
  const creds = adminCredentials();
  if (!creds) return false;
  // Both comparisons always run, so a wrong username and a wrong password take
  // the same time — no hint about which half was correct.
  const userOk = safeEqual(username, creds.username);
  const passOk = safeEqual(password, creds.password);
  return userOk && passOk;
}

export const sessionCookie = {
  name: COOKIE_NAME,
  maxAge: MAX_AGE_SECONDS,
};

/** Read the admin session cookie and return whether it is currently valid. */
export function isAdminAuthed(): boolean {
  const token = cookies().get(COOKIE_NAME)?.value;
  return isValidToken(token);
}
