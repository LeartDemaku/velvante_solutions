import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, errorResponse, validationError, serverError } from '@/lib/api/response';
import { createPasswordResetToken } from '@/lib/auth/session';
import { sendPasswordResetEmail } from '@/lib/email/service';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !String(email).includes('@')) {
      return validationError({ email: 'A valid email address is required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (normalizedEmail !== 'velvantesolutions@outlook.com') {
      return errorResponse(
        'FORBIDDEN',
        'Only the authorized administrator account (velvantesolutions@outlook.com) is eligible for password recovery.',
        403
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return errorResponse('NOT_FOUND', 'Administrative account not found', 404);
    }

    const token = await createPasswordResetToken(normalizedEmail);

    const origin =
      request.headers.get('origin') ||
      (request.headers.get('x-forwarded-proto') && request.headers.get('host')
        ? `${request.headers.get('x-forwarded-proto')}://${request.headers.get('host')}`
        : 'http://localhost:3000');

    const resetLink = `${origin}/admin/reset-password?token=${encodeURIComponent(token)}`;

    const emailResult = await sendPasswordResetEmail(normalizedEmail, resetLink);

    return successResponse({
      message: 'Password reset link dispatched successfully to your email address.',
      email: normalizedEmail,
      delivered: emailResult.ok,
    });
  } catch (err) {
    console.error('[auth/forgot-password] error:', err);
    return serverError();
  }
}
