import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, errorResponse } from '@/lib/api/response';
import { getSessionUser } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) {
    return errorResponse('UNAUTHORIZED', 'Session expired or not found', 401);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return errorResponse('UNAUTHORIZED', 'User account no longer exists', 401);
    }

    return successResponse(user);
  } catch (err) {
    console.error('[auth/me] error:', err);
    return errorResponse('SERVER_ERROR', 'Could not retrieve user profile', 500);
  }
}
