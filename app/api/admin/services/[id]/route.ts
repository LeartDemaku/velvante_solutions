import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, serverError } from '@/lib/api/response';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.service.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return successResponse({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('[admin/services/[id] DELETE] error:', err);
    return serverError();
  }
}
