import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, serverError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = (searchParams.get('locale') ?? 'en') as 'en' | 'sq';
  const category = searchParams.get('category');
  const featured = searchParams.get('featured') === 'true';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(20, parseInt(searchParams.get('limit') ?? '9', 10));
  const skip = (page - 1) * limit;

  try {
    const where = {
      published: true,
      deletedAt: null,
      ...(category ? { category: { slug: category } } : {}),
      ...(featured ? { featured: true } : {}),
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
        include: {
          category: true,
          translations: { where: { locale } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    const data = projects.map((p) => ({
      id: p.id,
      slug: p.slug,
      coverImage: p.coverImage,
      technologies: p.technologies,
      featured: p.featured,
      year: p.year,
      category: { slug: p.category.slug, name: locale === 'sq' ? p.category.nameAl : p.category.name },
      ...p.translations[0],
    }));

    return successResponse(data, 200, {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('[projects/route] error:', err);
    return serverError();
  }
}
