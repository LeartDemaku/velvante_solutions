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
    const project = await prisma.project.findFirst({
      where: { slug, published: true, deletedAt: null },
      include: {
        category: true,
        translations: { where: { locale } },
        services: {
          include: {
            service: {
              include: { translations: { where: { locale } } },
            },
          },
        },
      },
    });

    if (!project || !project.translations[0]) {
      return notFoundError('Project');
    }

    const { id: _tId, ...transData } = project.translations[0];

    return successResponse({
      id: project.id,
      slug: project.slug,
      coverImage: project.coverImage,
      images: project.images,
      technologies: project.technologies,
      featured: project.featured,
      year: project.year,
      category: {
        slug: project.category.slug,
        name: locale === 'sq' ? project.category.nameAl : project.category.name,
      },
      services: project.services.map((ps) => ({
        slug: ps.service.slug,
        icon: ps.service.icon,
        ...(ps.service.translations[0] ? (({ id: _sId, ...rest }) => rest)(ps.service.translations[0]) : {}),
      })),
      ...transData,
    });
  } catch (err) {
    console.error('[projects/[slug]/route] error:', err);
    return serverError();
  }
}
