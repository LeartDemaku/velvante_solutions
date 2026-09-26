import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, serverError } from '@/lib/api/response';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.blogPost.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return successResponse({ message: 'Blog post deleted' });
  } catch (err) {
    console.error('[admin/blog/[id] DELETE] error:', err);
    return serverError();
  }
}
