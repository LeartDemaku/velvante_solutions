import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, notFoundError, serverError } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const service = await prisma.service.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!service || service.deletedAt) {
      return notFoundError('Service not found');
    }

    const en = service.translations.find((t) => t.locale === 'en');
    const sq = service.translations.find((t) => t.locale === 'sq');

    return successResponse({
      id: service.id,
      slug: service.slug,
      icon: service.icon,
      published: service.published,
      featured: service.featured,
      titleEn: en?.title ?? '',
      shortDescEn: en?.shortDesc ?? '',
      titleSq: sq?.title ?? '',
      shortDescSq: sq?.shortDesc ?? '',
    });
  } catch (err) {
    console.error('[admin/services/[id] GET] error:', err);
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
    const { slug, icon, published, featured, titleEn, shortDescEn, titleSq, shortDescSq } = body;

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      return notFoundError('Service not found');
    }

    const cleanSlug = slug
      ? String(slug).trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-')
      : existing.slug;

    await prisma.service.update({
      where: { id },
      data: {
        slug: cleanSlug,
        icon: icon ?? existing.icon,
        published: published !== undefined ? Boolean(published) : existing.published,
        featured: featured !== undefined ? Boolean(featured) : existing.featured,
      },
    });

    if (titleEn !== undefined) {
      await prisma.serviceTranslation.upsert({
        where: {
          serviceId_locale: {
            serviceId: id,
            locale: 'en',
          },
        },
        create: {
          serviceId: id,
          locale: 'en',
          title: String(titleEn).trim(),
          shortDesc: shortDescEn || titleEn,
          description: shortDescEn || titleEn,
          capabilities: ['Engineering', 'Architecture', 'Optimization'],
          technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
          deliverables: ['Production System', 'Documentation'],
          benefits: ['Scalability', 'Performance'],
          metaTitle: `${titleEn} — Velvante Solutions`,
          metaDesc: shortDescEn || titleEn,
        },
        update: {
          title: String(titleEn).trim(),
          shortDesc: shortDescEn ?? undefined,
          description: shortDescEn ?? undefined,
          metaTitle: `${titleEn} — Velvante Solutions`,
          metaDesc: shortDescEn ?? undefined,
        },
      });
    }

    if (titleSq !== undefined || titleEn !== undefined) {
      const sqTitle = titleSq ? String(titleSq).trim() : titleEn ? String(titleEn).trim() : 'Shërbim';
      await prisma.serviceTranslation.upsert({
        where: {
          serviceId_locale: {
            serviceId: id,
            locale: 'sq',
          },
        },
        create: {
          serviceId: id,
          locale: 'sq',
          title: sqTitle,
          shortDesc: shortDescSq || shortDescEn || sqTitle,
          description: shortDescSq || shortDescEn || sqTitle,
          capabilities: ['Inxhinieri', 'Arkitekturë', 'Optimizim'],
          technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
          deliverables: ['Sistem Funksional', 'Dokumentacion'],
          benefits: ['Shkallëzim', 'Performancë'],
          metaTitle: `${sqTitle} — Velvante Solutions`,
          metaDesc: shortDescSq || shortDescEn || sqTitle,
        },
        update: {
          title: sqTitle,
          shortDesc: shortDescSq ?? undefined,
          description: shortDescSq ?? undefined,
          metaTitle: `${sqTitle} — Velvante Solutions`,
          metaDesc: shortDescSq ?? undefined,
        },
      });
    }

    return successResponse({ id, message: 'Service updated successfully' });
  } catch (err) {
    console.error('[admin/services/[id] PUT] error:', err);
    return serverError();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.service.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return successResponse({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('[admin/services/[id] DELETE] error:', err);
    return serverError();
  }
}
