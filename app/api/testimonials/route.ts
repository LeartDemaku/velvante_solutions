import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, serverError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  const locale = (new URL(request.url).searchParams.get('locale') ?? 'en') as 'en' | 'sq';
  const featured = new URL(request.url).searchParams.get('featured') === 'true';

  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { published: true, ...(featured ? { featured: true } : {}) },
      orderBy: { order: 'asc' },
      include: { translations: { where: { locale } } },
    });

    const data = testimonials.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      company: t.company,
      image: t.image,
      rating: t.rating,
      quote: t.translations[0]?.quote ?? '',
    }));

    return successResponse(data);
  } catch (err) {
    console.error('[testimonials/route] error:', err);
    return serverError();
  }
}
