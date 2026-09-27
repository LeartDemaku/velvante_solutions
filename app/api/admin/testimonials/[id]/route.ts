import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, notFoundError, serverError } from '@/lib/api/response';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return notFoundError('Testimonial not found');
    }

    await prisma.testimonial.delete({ where: { id } });
    return successResponse({ id, message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('[admin/testimonials/[id] DELETE] error:', err);
    return serverError();
  }
}
