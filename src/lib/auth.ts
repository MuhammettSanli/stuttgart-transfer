import crypto from 'crypto';
import { cookies } from 'next/headers';

// Minimal single-admin auth. A signed, httpOnly cookie holds an expiry-stamped
// token verified with an HMAC over ADMIN_SESSION_SECRET. No external auth lib.

const COOKIE_NAME = 'admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? 'insecure-dev-secret-change-me';
}

function sign(value: string): string {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

/** Create a signed token "expiry.signature". */
export function createSessionToken(): string {
  const expiry = String(Date.now() + MAX_AGE_SECONDS * 1000);
  return `${expiry}.${sign(expiry)}`;
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expiry, signature] = token.split('.');
  if (!expiry || !signature) return false;
  if (sign(expiry) !== signature) return false;
  return Number(expiry) > Date.now();
}

/** Validate the submitted username/password against env credentials. */
export function checkCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME ?? 'admin';
  const p = process.env.ADMIN_PASSWORD ?? 'change-me';
  // Constant-time-ish comparison.
  return (
    username.length === u.length &&
    password.length === p.length &&
    crypto.timingSafeEqual(Buffer.from(username), Buffer.from(u)) &&
    crypto.timingSafeEqual(Buffer.from(password), Buffer.from(p))
  );
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
