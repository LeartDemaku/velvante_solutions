import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, serverError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = (searchParams.get('locale') ?? 'en') as 'en' | 'sq';
  const category = searchParams.get('category');
  const featured = searchParams.get('featured') === 'true';
  const search = searchParams.get('q');
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(20, parseInt(searchParams.get('limit') ?? '9', 10));
  const skip = (page - 1) * limit;

  try {
    const where = {
      status: 'PUBLISHED' as const,
      deletedAt: null,
      ...(category ? { category: { slug: category } } : {}),
      ...(featured ? { featured: true } : {}),
      ...(search ? {
        translations: {
          some: {
            locale,
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              { excerpt: { contains: search, mode: 'insensitive' as const } },
            ],
          },
        },
      } : {}),
    };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
        include: {
          author: true,
          category: true,
          translations: { where: { locale } },
          tags: { include: { tag: true } },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    const data = posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      coverImage: p.coverImage,
      publishedAt: p.publishedAt,
      readingTime: p.readingTime,
      featured: p.featured,
      author: { name: p.author.name, image: p.author.image, role: locale === 'sq' ? p.author.roleAl : p.author.role },
      category: { slug: p.category.slug, name: locale === 'sq' ? p.category.nameAl : p.category.name },
      tags: p.tags.map((t) => ({ slug: t.tag.slug, name: locale === 'sq' ? t.tag.nameAl : t.tag.name })),
      ...p.translations[0],
    }));

    return successResponse(data, 200, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[blog/route] error:', err);
    return serverError();
  }
}
