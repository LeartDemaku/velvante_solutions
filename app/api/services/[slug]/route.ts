import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, notFoundError, serverError } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const locale = (new URL(request.url).searchParams.get('locale') ?? 'en') as 'en' | 'sq';

  try {
    const service = await prisma.service.findFirst({
      where: { slug, published: true, deletedAt: null },
      include: { translations: { where: { locale } } },
    });

    if (!service || !service.translations[0]) return notFoundError('Service');

    const { id: _tId, ...transData } = service.translations[0];

    return successResponse({
      id: service.id,
      slug: service.slug,
      icon: service.icon,
      featured: service.featured,
      ...transData,
    });
  } catch (err) {
    console.error('[services/[slug]/route] error:', err);
    return serverError();
  }
}
