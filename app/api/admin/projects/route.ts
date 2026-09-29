import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, errorResponse, validationError, serverError } from '@/lib/api/response';

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
      
      let parsedTechs: string[] = [];
      if (Array.isArray(p.technologies)) {
        parsedTechs = p.technologies as string[];
      } else if (typeof p.technologies === 'string') {
        try {
          const parsed = JSON.parse(p.technologies);
          parsedTechs = Array.isArray(parsed) ? parsed : [p.technologies];
        } catch {
          parsedTechs = (p.technologies as string).split(',').map((s) => s.trim()).filter(Boolean);
        }
      }

      return {
        id: p.id,
        slug: p.slug,
        coverImage: p.coverImage,
        liveUrl: p.liveUrl ?? '',
        technologies: parsedTechs,
        featured: p.featured,
        published: p.published,
        year: p.year,
        categoryId: p.categoryId,
        category: p.category?.name || 'General',
        categorySlug: p.category?.slug || 'websites',
        titleEn: en?.title ?? '',
        clientEn: en?.client ?? '',
        industryEn: en?.industry ?? '',
        taglineEn: en?.tagline ?? '',
        challengeEn: en?.challenge ?? '',
        solutionEn: en?.solution ?? '',
        resultsEn: en?.results ?? '',
        titleSq: sq?.title ?? '',
        clientSq: sq?.client ?? '',
        industrySq: sq?.industry ?? '',
        taglineSq: sq?.tagline ?? '',
        challengeSq: sq?.challenge ?? '',
        solutionSq: sq?.solution ?? '',
        resultsSq: sq?.results ?? '',
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
      slug, coverImage, liveUrl, technologies, year, published, featured, categorySlug,
      titleEn, clientEn, industryEn, taglineEn, challengeEn, solutionEn, resultsEn,
      titleSq, clientSq, industrySq, taglineSq, challengeSq, solutionSq, resultsSq,
    } = body;

    const errors: Record<string, string> = {};
    if (!slug || String(slug).trim().length < 2) {
      errors.slug = 'Valid slug is required';
    }
    if (!titleEn || String(titleEn).trim().length < 2) {
      errors.titleEn = 'English title is required';
    }

    if (Object.keys(errors).length > 0) {
      return validationError(errors);
    }

    const cleanSlug = String(slug)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-');

    const existingProject = await prisma.project.findFirst({
      where: { slug: cleanSlug, deletedAt: null },
    });

    if (existingProject) {
      return errorResponse('CONFLICT', `A project with slug "${cleanSlug}" already exists.`, 409);
    }

    let category = await prisma.projectCategory.findUnique({
      where: { slug: categorySlug || 'websites' },
    });

    if (!category) {
      category = await prisma.projectCategory.create({
        data: {
          slug: categorySlug || 'websites',
          name: categorySlug === 'ecommerce' ? 'E-Commerce' : categorySlug === 'web-applications' ? 'Web Applications' : 'Websites',
          nameAl: categorySlug === 'ecommerce' ? 'E-Commerce' : categorySlug === 'web-applications' ? 'Aplikacione Web' : 'Faqe Interneti',
        },
      });
    }

    let finalTechs: string[] = [];
    if (Array.isArray(technologies)) {
      finalTechs = technologies.map(String).map((s) => s.trim()).filter(Boolean);
    } else if (typeof technologies === 'string') {
      finalTechs = technologies.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (finalTechs.length === 0) {
      finalTechs = ['Next.js', 'TypeScript', 'Tailwind CSS'];
    }

    const finalClientEn = clientEn ? String(clientEn).trim() : 'Client';
    const finalClientSq = (clientSq && String(clientSq).trim().length > 1)
      ? String(clientSq).trim()
      : (finalClientEn || 'Klienti');

    const created = await prisma.project.create({
      data: {
        slug: cleanSlug,
        categoryId: category.id,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        liveUrl: liveUrl ? String(liveUrl).trim() : null,
        technologies: finalTechs,
        year: parseInt(year || new Date().getFullYear(), 10) || new Date().getFullYear(),
        published: published !== false,
        featured: Boolean(featured),
        translations: {
          create: [
            {
              locale: 'en',
              title: String(titleEn).trim(),
              client: finalClientEn,
              industry: industryEn || 'Technology',
              tagline: taglineEn || titleEn,
              challenge: challengeEn || '',
              solution: solutionEn || '',
              results: resultsEn || '',
              metaTitle: `${titleEn} — Case Study`,
              metaDesc: taglineEn || titleEn,
            },
            {
              locale: 'sq',
              title: titleSq ? String(titleSq).trim() : String(titleEn).trim(),
              client: finalClientSq,
              industry: industrySq || industryEn || 'Teknologji',
              tagline: taglineSq || taglineEn || titleEn,
              challenge: challengeSq || '',
              solution: solutionSq || '',
              results: resultsSq || '',
              metaTitle: `${titleSq || titleEn} — Studim Rasti`,
              metaDesc: taglineSq || taglineEn || titleEn,
            },
          ],
        },
      },
      include: {
        category: true,
        translations: true,
      },
    });

    const enTrans = created.translations.find((t) => t.locale === 'en');
    const sqTrans = created.translations.find((t) => t.locale === 'sq');

    const formattedOutput = {
      id: created.id,
      slug: created.slug,
      coverImage: created.coverImage,
      liveUrl: created.liveUrl ?? '',
      technologies: finalTechs,
      featured: created.featured,
      published: created.published,
      year: created.year,
      categoryId: created.categoryId,
      category: created.category?.name || 'General',
      categorySlug: created.category?.slug || 'websites',
      titleEn: enTrans?.title ?? '',
      clientEn: enTrans?.client ?? '',
      industryEn: enTrans?.industry ?? '',
      taglineEn: enTrans?.tagline ?? '',
      challengeEn: enTrans?.challenge ?? '',
      solutionEn: enTrans?.solution ?? '',
      resultsEn: enTrans?.results ?? '',
      titleSq: sqTrans?.title ?? '',
      clientSq: sqTrans?.client ?? '',
      industrySq: sqTrans?.industry ?? '',
      taglineSq: sqTrans?.tagline ?? '',
      challengeSq: sqTrans?.challenge ?? '',
      solutionSq: sqTrans?.solution ?? '',
      resultsSq: sqTrans?.results ?? '',
    };

    return successResponse(formattedOutput, 201);
  } catch (err) {
    console.error('[admin/projects POST] error:', err);
    return serverError();
  }
}
