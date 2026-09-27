import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, errorResponse, notFoundError, serverError } from '@/lib/api/response';
import { getSessionUser } from '@/lib/auth/session';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getSessionUser(request);
    if (session?.role !== 'ADMIN') {
      return errorResponse('FORBIDDEN', 'Only administrators can delete user accounts', 403);
    }

    if (session?.userId === id) {
      return errorResponse('BAD_REQUEST', 'You cannot delete your own administrative account', 400);
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return notFoundError('User not found');
    }

    await prisma.user.delete({ where: { id } });
    return successResponse({ id, message: 'User deleted successfully' });
  } catch (err) {
    console.error('[admin/users/[id] DELETE] error:', err);
    return serverError();
  }
}
