import { NextResponse } from 'next/server';
import { successResponse } from '@/lib/api/response';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';

export async function POST() {
  const response = successResponse({ message: 'Logged out successfully' });
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
