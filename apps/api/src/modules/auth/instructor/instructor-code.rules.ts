import { createHash, randomInt, timingSafeEqual } from 'crypto';

export const CODE_LENGTH = 6;
export const CODE_TTL_MS = 10 * 60 * 1000;
export const MAX_ATTEMPTS = 5;
export const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_DISPLAY_NAME_LENGTH = 60;

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

// Exact match on the part after the last "@": "sena.edu.co" is allowed but
// "misena.edu.co" (a different domain that merely ends the same way) is not.
export function isInstructorEmail(email: string, domains: string[]): boolean {
  const at = email.lastIndexOf('@');
  if (at < 1) {
    return false;
  }
  return domains.includes(email.slice(at + 1));
}

export function generateCode(): string {
  return randomInt(0, 10 ** CODE_LENGTH)
    .toString()
    .padStart(CODE_LENGTH, '0');
}

// Codes are stored hashed (with the email and a server secret), so reading
// the table never reveals a usable code.
export function hashCode(email: string, code: string, secret: string): string {
  return createHash('sha256')
    .update(`${email}:${code}:${secret}`)
    .digest('hex');
}

export function hashesMatch(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

// "juan.perez@sena.edu.co" -> "Juan Perez": a readable starting name for the
// account, since instructors sign in without ever filling a registration form.
export function displayNameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? '';
  const name = local
    .split(/[._-]+/)
    .filter((part) => part.length > 0)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
    .slice(0, MAX_DISPLAY_NAME_LENGTH);
  return name.length >= 2 ? name : 'Instructor';
}
