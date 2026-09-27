import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, notFoundError, serverError } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: true,
        translations: true,
      },
    });

    if (!post || post.deletedAt) {
      return notFoundError('Blog post not found');
    }

    const en = post.translations.find((t) => t.locale === 'en');
    const sq = post.translations.find((t) => t.locale === 'sq');

    return successResponse({
      id: post.id,
      slug: post.slug,
      coverImage: post.coverImage,
      status: post.status,
      readingTime: post.readingTime,
      titleEn: en?.title ?? '',
      excerptEn: en?.excerpt ?? '',
      contentEn: en?.content ?? '',
      titleSq: sq?.title ?? '',
      excerptSq: sq?.excerpt ?? '',
      contentSq: sq?.content ?? '',
    });
  } catch (err) {
    console.error('[admin/blog/[id] GET] error:', err);
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
    const { slug, coverImage, status, readingTime, titleEn, excerptEn, contentEn, titleSq, excerptSq, contentSq } = body;

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      return notFoundError('Blog post not found');
    }

    const cleanSlug = slug
      ? String(slug).trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-')
      : existing.slug;

    await prisma.blogPost.update({
      where: { id },
      data: {
        slug: cleanSlug,
        coverImage: coverImage ?? existing.coverImage,
        status: status ?? existing.status,
        readingTime: readingTime ? parseInt(readingTime, 10) : existing.readingTime,
      },
    });

    if (titleEn !== undefined) {
      await prisma.blogTranslation.upsert({
        where: {
          postId_locale: {
            postId: id,
            locale: 'en',
          },
        },
        create: {
          postId: id,
          locale: 'en',
          title: String(titleEn).trim(),
          excerpt: excerptEn || titleEn,
          content: contentEn || titleEn,
          metaTitle: titleEn,
          metaDesc: excerptEn || titleEn,
        },
        update: {
          title: String(titleEn).trim(),
          excerpt: excerptEn ?? undefined,
          content: contentEn ?? undefined,
          metaTitle: titleEn,
          metaDesc: excerptEn ?? undefined,
        },
      });
    }

    if (titleSq !== undefined || titleEn !== undefined) {
      const sqTitle = titleSq ? String(titleSq).trim() : titleEn ? String(titleEn).trim() : 'Artikull';
      await prisma.blogTranslation.upsert({
        where: {
          postId_locale: {
            postId: id,
            locale: 'sq',
          },
        },
        create: {
          postId: id,
          locale: 'sq',
          title: sqTitle,
          excerpt: excerptSq || excerptEn || sqTitle,
          content: contentSq || contentEn || sqTitle,
          metaTitle: sqTitle,
          metaDesc: excerptSq || excerptEn || sqTitle,
        },
        update: {
          title: sqTitle,
          excerpt: excerptSq ?? undefined,
          content: contentSq ?? undefined,
          metaTitle: sqTitle,
          metaDesc: excerptSq ?? undefined,
        },
      });
    }

    return successResponse({ id, message: 'Blog post updated successfully' });
  } catch (err) {
    console.error('[admin/blog/[id] PUT] error:', err);
    return serverError();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.blogPost.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return successResponse({ message: 'Blog post deleted' });
  } catch (err) {
    console.error('[admin/blog/[id] DELETE] error:', err);
    return serverError();
  }
}
