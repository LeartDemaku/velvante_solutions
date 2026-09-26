import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, serverError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();
  const locale = (searchParams.get('locale') ?? 'en') as 'en' | 'sq';

  if (!query || query.length < 2) {
    return successResponse({ projects: [], services: [], posts: [] });
  }

  try {
    const [projects, services, posts] = await Promise.all([
      prisma.project.findMany({
        where: {
          published: true,
          deletedAt: null,
          translations: { some: { locale, title: { contains: query } } },
        },
        take: 5,
        include: { translations: { where: { locale } } },
      }),
      prisma.service.findMany({
        where: {
          published: true,
          deletedAt: null,
          translations: { some: { locale, title: { contains: query } } },
        },
        take: 5,
        include: { translations: { where: { locale } } },
      }),
      prisma.blogPost.findMany({
        where: {
          status: 'PUBLISHED',
          deletedAt: null,
          translations: {
            some: {
              locale,
              OR: [
                { title: { contains: query } },
                { excerpt: { contains: query } },
              ],
            },
          },
        },
        take: 5,
        include: { translations: { where: { locale } }, author: true },
      }),
    ]);

    return successResponse({
      projects: projects.map((p) => ({
        slug: p.slug,
        coverImage: p.coverImage,
        title: p.translations[0]?.title ?? '',
        type: 'project' as const,
      })),
      services: services.map((s) => ({
        slug: s.slug,
        icon: s.icon,
        title: s.translations[0]?.title ?? '',
        type: 'service' as const,
      })),
      posts: posts.map((p) => ({
        slug: p.slug,
        coverImage: p.coverImage,
        title: p.translations[0]?.title ?? '',
        excerpt: p.translations[0]?.excerpt ?? '',
        type: 'blog' as const,
      })),
    });
  } catch (err) {
    console.error('[search/route] error:', err);
    return serverError();
  }
}
