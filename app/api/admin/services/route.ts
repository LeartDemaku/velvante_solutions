import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, validationError, serverError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const services = await prisma.service.findMany({
      where: { deletedAt: null },
      orderBy: { order: 'asc' },
      include: { translations: true },
    });

    const formatted = services.map((s) => {
      const en = s.translations.find((t) => t.locale === 'en');
      const sq = s.translations.find((t) => t.locale === 'sq');
      return {
        id: s.id,
        slug: s.slug,
        icon: s.icon,
        published: s.published,
        featured: s.featured,
        titleEn: en?.title ?? '',
        shortDescEn: en?.shortDesc ?? '',
        titleSq: sq?.title ?? '',
        shortDescSq: sq?.shortDesc ?? '',
      };
    });

    return successResponse(formatted);
  } catch (err) {
    console.error('[admin/services GET] error:', err);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, icon, published, featured, titleEn, shortDescEn, titleSq, shortDescSq } = body;

    if (!slug || !titleEn) {
      return validationError({ slug: 'Slug and title are required' });
    }

    const created = await prisma.service.create({
      data: {
        slug,
        icon: icon || 'Code2',
        published: published ?? true,
        featured: featured ?? true,
        translations: {
          create: [
            {
              locale: 'en',
              title: titleEn,
              shortDesc: shortDescEn || titleEn,
              description: shortDescEn || titleEn,
              capabilities: ['Engineering', 'Design', 'Optimization'],
              technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
              deliverables: ['Source Code', 'Design Assets'],
              benefits: ['Scalability', 'High Speed'],
              metaTitle: `${titleEn} Services`,
              metaDesc: shortDescEn || titleEn,
            },
            {
              locale: 'sq',
              title: titleSq || titleEn,
              shortDesc: shortDescSq || shortDescEn || titleEn,
              description: shortDescSq || shortDescEn || titleEn,
              capabilities: ['Inxhinieri', 'Dizajn', 'Optimizim'],
              technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
              deliverables: ['Kodi Burimor', 'Asetet e Dizajnit'],
              benefits: ['Shkallëzim', 'Shpejtësi e lartë'],
              metaTitle: `Shërbime ${titleSq || titleEn}`,
              metaDesc: shortDescSq || shortDescEn || titleEn,
            },
          ],
        },
      },
    });

    return successResponse(created, 201);
  } catch (err) {
    console.error('[admin/services POST] error:', err);
    return serverError();
  }
}
