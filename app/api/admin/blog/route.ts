import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, validationError, serverError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        category: true,
        translations: true,
      },
    });

    const formatted = posts.map((p) => {
      const en = p.translations.find((t) => t.locale === 'en');
      const sq = p.translations.find((t) => t.locale === 'sq');
      return {
        id: p.id,
        slug: p.slug,
        coverImage: p.coverImage,
        status: p.status,
        readingTime: p.readingTime,
        publishedAt: p.publishedAt,
        author: p.author.name,
        category: p.category.name,
        titleEn: en?.title ?? '',
        excerptEn: en?.excerpt ?? '',
        titleSq: sq?.title ?? '',
      };
    });

    return successResponse(formatted);
  } catch (err) {
    console.error('[admin/blog GET] error:', err);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, titleEn, excerptEn, contentEn, titleSq, excerptSq, contentSq, coverImage, readingTime } = body;

    if (!slug || !titleEn) {
      return validationError({ slug: 'Slug and title are required' });
    }

    let author = await prisma.author.findFirst();
    if (!author) {
      author = await prisma.author.create({
        data: {
          name: 'Artan Krasniqi',
          bio: 'CEO & Founder',
          bioAl: 'Drejtor Ekzekutiv',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          role: 'CEO',
          roleAl: 'Drejtor',
        },
      });
    }

    let category = await prisma.blogCategory.findFirst();
    if (!category) {
      category = await prisma.blogCategory.create({
        data: { slug: 'web-development', name: 'Web Development', nameAl: 'Zhvillim Web' },
      });
    }

    const created = await prisma.blogPost.create({
      data: {
        slug,
        authorId: author.id,
        categoryId: category.id,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        readingTime: parseInt(readingTime || '5', 10),
        translations: {
          create: [
            {
              locale: 'en',
              title: titleEn,
              excerpt: excerptEn || titleEn,
              content: contentEn || titleEn,
              metaTitle: titleEn,
              metaDesc: excerptEn || titleEn,
            },
            {
              locale: 'sq',
              title: titleSq || titleEn,
              excerpt: excerptSq || excerptEn || titleEn,
              content: contentSq || contentEn || titleEn,
              metaTitle: titleSq || titleEn,
              metaDesc: excerptSq || excerptEn || titleEn,
            },
          ],
        },
      },
    });

    return successResponse(created, 201);
  } catch (err) {
    console.error('[admin/blog POST] error:', err);
    return serverError();
  }
}
