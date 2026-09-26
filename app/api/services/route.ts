import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, serverError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  const locale = (new URL(request.url).searchParams.get('locale') ?? 'en') as 'en' | 'sq';

  try {
    const services = await prisma.service.findMany({
      where: { published: true, deletedAt: null },
      orderBy: { order: 'asc' },
      include: { translations: { where: { locale } } },
    });

    const data = services.map((s) => ({
      id: s.id,
      slug: s.slug,
      icon: s.icon,
      featured: s.featured,
      ...s.translations[0],
    }));

    return successResponse(data);
  } catch (err) {
    console.error('[services/route] error:', err);
    return serverError();
  }
}
