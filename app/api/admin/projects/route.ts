import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, validationError, serverError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        translations: true,
      },
    });

    const formatted = projects.map((p) => {
      const en = p.translations.find((t) => t.locale === 'en');
      const sq = p.translations.find((t) => t.locale === 'sq');
      return {
        id: p.id,
        slug: p.slug,
        coverImage: p.coverImage,
        technologies: p.technologies,
        featured: p.featured,
        published: p.published,
        year: p.year,
        category: p.category.name,
        titleEn: en?.title ?? '',
        clientEn: en?.client ?? '',
        titleSq: sq?.title ?? '',
        clientSq: sq?.client ?? '',
      };
    });

    return successResponse(formatted);
  } catch (err) {
    console.error('[admin/projects GET] error:', err);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug, coverImage, technologies, year, published, featured, categorySlug,
      titleEn, clientEn, industryEn, taglineEn, challengeEn, solutionEn, resultsEn,
      titleSq, clientSq, industrySq, taglineSq, challengeSq, solutionSq, resultsSq,
    } = body;

    if (!slug || !titleEn) {
      return validationError({ slug: 'Slug and English title are required' });
    }

    let category = await prisma.projectCategory.findUnique({ where: { slug: categorySlug || 'websites' } });
    if (!category) {
      category = await prisma.projectCategory.create({
        data: { slug: 'websites', name: 'Websites', nameAl: 'Faqe Interneti' },
      });
    }

    const created = await prisma.project.create({
      data: {
        slug,
        categoryId: category.id,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        technologies: Array.isArray(technologies) ? technologies : (technologies || '').split(',').map((s: string) => s.trim()).filter(Boolean),
        year: parseInt(year || new Date().getFullYear(), 10),
        published: published ?? true,
        featured: featured ?? false,
        translations: {
          create: [
            {
              locale: 'en',
              title: titleEn,
              client: clientEn || 'Client',
              industry: industryEn || 'Technology',
              tagline: taglineEn || titleEn,
              challenge: challengeEn || 'Project challenge description',
              solution: solutionEn || 'Engineered custom full-stack solution',
              results: resultsEn || 'Increased performance by 80%',
              metaTitle: `${titleEn} — Case Study`,
              metaDesc: taglineEn || titleEn,
            },
            {
              locale: 'sq',
              title: titleSq || titleEn,
              client: clientSq || clientEn || 'Klienti',
              industry: industrySq || industryEn || 'Teknologji',
              tagline: taglineSq || taglineEn || titleEn,
              challenge: challengeSq || challengeEn || 'Përshkrimi i sfidës',
              solution: solutionSq || solutionEn || 'Zgjidhja e inxhinieruar',
              results: resultsSq || resultsEn || 'Rritje e performancës me 80%',
              metaTitle: `${titleSq || titleEn} — Studim Rasti`,
              metaDesc: taglineSq || taglineEn || titleEn,
            },
          ],
        },
      },
    });

    return successResponse(created, 201);
  } catch (err) {
    console.error('[admin/projects POST] error:', err);
    return serverError();
  }
}
