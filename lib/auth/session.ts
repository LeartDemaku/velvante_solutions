import { NextRequest } from 'next/server';

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

const SECRET = process.env.NEXTAUTH_SECRET || 'velvante-solutions-enterprise-auth-key-2026';
export const SESSION_COOKIE_NAME = 'velvante_admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();

function base64UrlEncode(str: string): string {
  const bytes = encoder.encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i] ?? 0);
  }
  return btoa(binary)
    .replaceAll('=', '')
    .replaceAll('+', '-')
    .replaceAll('/', '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replaceAll('-', '+').replaceAll('_', '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function signString(str: string, secret: string): Promise<string> {
  const key = await getCryptoKey(secret);
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(str));
  const bytes = new Uint8Array(signatureBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i] ?? 0);
  }
  return btoa(binary)
    .replaceAll('=', '')
    .replaceAll('+', '-')
    .replaceAll('/', '_');
}

export async function createSessionToken(user: { id: string; email: string; role: string }): Promise<string> {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };

  const payloadString = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(payloadString);
  const signature = await signString(encodedPayload, SECRET);

  return `${encodedPayload}.${signature}`;
}

export async function verifySessionToken(token?: string | null): Promise<SessionPayload | null> {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const encodedPayload = parts[0];
  const signature = parts[1];
  if (!encodedPayload || !signature) return null;

  const expectedSignature = await signString(encodedPayload, SECRET);
  if (signature !== expectedSignature) return null;

  try {
    const decodedJson = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(decodedJson) as SessionPayload;

    if (!payload.userId || !payload.exp) return null;

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTimestamp) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function getSessionUser(request: NextRequest): Promise<SessionPayload | null> {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  return await verifySessionToken(cookie?.value);
}

export interface PasswordResetPayload {
  email: string;
  exp: number;
  purpose: 'password_reset';
}

export async function createPasswordResetToken(email: string): Promise<string> {
  const payload: PasswordResetPayload = {
    email: email.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + 3600,
    purpose: 'password_reset',
  };

  const payloadString = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(payloadString);
  const signature = await signString(encodedPayload, SECRET);

  return `${encodedPayload}.${signature}`;
}

export async function verifyPasswordResetToken(token?: string | null): Promise<PasswordResetPayload | null> {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const encodedPayload = parts[0];
  const signature = parts[1];
  if (!encodedPayload || !signature) return null;

  const expectedSignature = await signString(encodedPayload, SECRET);
  if (signature !== expectedSignature) return null;

  try {
    const decodedJson = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(decodedJson) as PasswordResetPayload;

    if (!payload.email || payload.purpose !== 'password_reset' || !payload.exp) return null;

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTimestamp) return null;

    return payload;
  } catch {
    return null;
  }
}
