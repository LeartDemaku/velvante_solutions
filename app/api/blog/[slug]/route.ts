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
    const post = await prisma.blogPost.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: {
        author: true,
        category: true,
        translations: { where: { locale } },
        tags: { include: { tag: true } },
      },
    });

    if (!post || !post.translations[0]) return notFoundError('Blog post');

    const { id: _tId, ...transData } = post.translations[0];

    return successResponse({
      id: post.id,
      slug: post.slug,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt,
      readingTime: post.readingTime,
      featured: post.featured,
      author: {
        name: post.author.name,
        image: post.author.image,
        role: locale === 'sq' ? post.author.roleAl : post.author.role,
        bio: locale === 'sq' ? post.author.bioAl : post.author.bio,
        linkedin: post.author.linkedin,
        twitter: post.author.twitter,
      },
      category: { slug: post.category.slug, name: locale === 'sq' ? post.category.nameAl : post.category.name },
      tags: post.tags.map((t) => ({ slug: t.tag.slug, name: locale === 'sq' ? t.tag.nameAl : t.tag.name })),
      ...transData,
    });
  } catch (err) {
    console.error('[blog/[slug]/route] error:', err);
    return serverError();
  }
}
