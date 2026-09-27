import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/client';
import { successResponse, errorResponse, validationError, serverError } from '@/lib/api/response';
import { verifyPasswordResetToken } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token) {
      return validationError({ token: 'Reset token is required' });
    }

    if (!password || String(password).length < 8) {
      return validationError({ password: 'Password must be at least 8 characters long' });
    }

    const payload = await verifyPasswordResetToken(token);

    if (!payload || !payload.email || payload.purpose !== 'password_reset') {
      return errorResponse(
        'INVALID_TOKEN',
        'Password reset link is invalid or has expired. Please request a new link.',
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      return errorResponse('NOT_FOUND', 'User account no longer exists', 404);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return successResponse({
      message: 'Password has been updated successfully. You can now sign in with your new credentials.',
      email: payload.email,
    });
  } catch (err) {
    console.error('[auth/reset-password] error:', err);
    return serverError();
  }
}
