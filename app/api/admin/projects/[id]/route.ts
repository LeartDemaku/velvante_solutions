import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, notFoundError, validationError, serverError } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        category: true,
        translations: true,
      },
    });

    if (!project || project.deletedAt) {
      return notFoundError('Project not found');
    }

    const en = project.translations.find((t) => t.locale === 'en');
    const sq = project.translations.find((t) => t.locale === 'sq');

    let parsedTechs: string[] = [];
    if (Array.isArray(project.technologies)) {
      parsedTechs = project.technologies as string[];
    } else if (typeof project.technologies === 'string') {
      try {
        const parsed = JSON.parse(project.technologies);
        parsedTechs = Array.isArray(parsed) ? parsed : [project.technologies];
      } catch {
        parsedTechs = (project.technologies as string).split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    return successResponse({
      id: project.id,
      slug: project.slug,
      coverImage: project.coverImage,
      technologies: parsedTechs,
      featured: project.featured,
      published: project.published,
      year: project.year,
      categoryId: project.categoryId,
      categorySlug: project.category?.slug || 'websites',
      category: project.category?.name || 'Websites',
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
    });
  } catch (err) {
    console.error('[admin/projects/[id] GET] error:', err);
    return serverError();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const {
      slug, coverImage, technologies, year, published, featured, categorySlug,
      titleEn, clientEn, industryEn, taglineEn, challengeEn, solutionEn, resultsEn,
      titleSq, clientSq, industrySq, taglineSq, challengeSq, solutionSq, resultsSq,
    } = body;

    const existing = await prisma.project.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!existing || existing.deletedAt) {
      return notFoundError('Project not found');
    }

    let categoryId = existing.categoryId;
    if (categorySlug) {
      let category = await prisma.projectCategory.findUnique({ where: { slug: categorySlug } });
      if (!category) {
        category = await prisma.projectCategory.create({
          data: {
            slug: categorySlug,
            name: categorySlug === 'ecommerce' ? 'E-Commerce' : categorySlug === 'web-applications' ? 'Web Applications' : 'Websites',
            nameAl: categorySlug === 'ecommerce' ? 'E-Commerce' : categorySlug === 'web-applications' ? 'Aplikacione Web' : 'Faqe Interneti',
          },
        });
      }
      categoryId = category.id;
    }

    let finalTechs = existing.technologies as string[];
    if (technologies !== undefined) {
      if (Array.isArray(technologies)) {
        finalTechs = technologies.map(String).map((s) => s.trim()).filter(Boolean);
      } else if (typeof technologies === 'string') {
        finalTechs = technologies.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    const cleanSlug = slug
      ? String(slug).trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-')
      : existing.slug;

    const updated = await prisma.project.update({
      where: { id },
      data: {
        slug: cleanSlug,
        categoryId,
        coverImage: coverImage ?? existing.coverImage,
        technologies: finalTechs,
        year: year ? parseInt(year, 10) : existing.year,
        published: published !== undefined ? Boolean(published) : existing.published,
        featured: featured !== undefined ? Boolean(featured) : existing.featured,
      },
      include: {
        category: true,
        translations: true,
      },
    });

    if (titleEn !== undefined) {
      await prisma.projectTranslation.upsert({
        where: {
          projectId_locale: {
            projectId: id,
            locale: 'en',
          },
        },
        create: {
          projectId: id,
          locale: 'en',
          title: String(titleEn).trim(),
          client: clientEn || 'Client',
          industry: industryEn || 'Technology',
          tagline: taglineEn || titleEn,
          challenge: challengeEn || 'Project requirements and challenge.',
          solution: solutionEn || 'Custom full-stack architecture.',
          results: resultsEn || 'Delivered with high performance.',
          metaTitle: `${titleEn} — Case Study`,
          metaDesc: taglineEn || titleEn,
        },
        update: {
          title: String(titleEn).trim(),
          client: clientEn ?? undefined,
          industry: industryEn ?? undefined,
          tagline: taglineEn ?? undefined,
          challenge: challengeEn ?? undefined,
          solution: solutionEn ?? undefined,
          results: resultsEn ?? undefined,
          metaTitle: `${titleEn} — Case Study`,
          metaDesc: taglineEn ?? titleEn,
        },
      });
    }

    if (titleSq !== undefined || titleEn !== undefined) {
      const sqTitle = titleSq ? String(titleSq).trim() : titleEn ? String(titleEn).trim() : 'Projekti';
      await prisma.projectTranslation.upsert({
        where: {
          projectId_locale: {
            projectId: id,
            locale: 'sq',
          },
        },
        create: {
          projectId: id,
          locale: 'sq',
          title: sqTitle,
          client: clientSq || clientEn || 'Klienti',
          industry: industrySq || industryEn || 'Teknologji',
          tagline: taglineSq || taglineEn || sqTitle,
          challenge: challengeSq || challengeEn || 'Përshkrimi i sfidës së projektit.',
          solution: solutionSq || solutionEn || 'Zgjidhje dixhitale e inxhinieruar.',
          results: resultsSq || resultsEn || 'Performancë dhe stabilitet i lartë.',
          metaTitle: `${sqTitle} — Studim Rasti`,
          metaDesc: taglineSq || taglineEn || sqTitle,
        },
        update: {
          title: sqTitle,
          client: clientSq ?? undefined,
          industry: industrySq ?? undefined,
          tagline: taglineSq ?? undefined,
          challenge: challengeSq ?? undefined,
          solution: solutionSq ?? undefined,
          results: resultsSq ?? undefined,
          metaTitle: `${sqTitle} — Studim Rasti`,
          metaDesc: taglineSq ?? taglineEn ?? sqTitle,
        },
      });
    }

    const refetched = await prisma.project.findUnique({
      where: { id },
      include: {
        category: true,
        translations: true,
      },
    });

    const en = refetched?.translations.find((t) => t.locale === 'en');
    const sq = refetched?.translations.find((t) => t.locale === 'sq');

    return successResponse({
      id: refetched?.id,
      slug: refetched?.slug,
      coverImage: refetched?.coverImage,
      technologies: finalTechs,
      featured: refetched?.featured,
      published: refetched?.published,
      year: refetched?.year,
      categoryId: refetched?.categoryId,
      categorySlug: refetched?.category?.slug || 'websites',
      category: refetched?.category?.name || 'Websites',
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
    });
  } catch (err) {
    console.error('[admin/projects/[id] PUT] error:', err);
    return serverError();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return notFoundError('Project not found');
    }

    const url = new URL(request.url);
    const permanent = url.searchParams.get('permanent') === 'true';

    if (permanent) {
      await prisma.project.delete({ where: { id } });
    } else {
      await prisma.project.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    }

    return successResponse({ id, message: 'Project deleted successfully' });
  } catch (err) {
    console.error('[admin/projects/[id] DELETE] error:', err);
    return serverError();
  }
}
