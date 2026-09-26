import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Clock, Calendar, Share2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { prisma } from '@/lib/db/client';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tBlog = await getTranslations('blog');

  let post = null;

  try {
    const raw = await prisma.blogPost.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: {
        author: true,
        category: true,
        translations: { where: { locale } },
      },
    });

    if (raw && raw.translations[0]) {
      post = {
        id: raw.id,
        slug: raw.slug,
        coverImage: raw.coverImage,
        publishedAt: raw.publishedAt,
        readingTime: raw.readingTime,
        categoryName: locale === 'sq' ? raw.category.nameAl : raw.category.name,
        author: {
          name: raw.author.name,
          role: locale === 'sq' ? raw.author.roleAl : raw.author.role,
          image: raw.author.image,
          bio: locale === 'sq' ? raw.author.bioAl : raw.author.bio,
        },
        title: raw.translations[0].title,
        excerpt: raw.translations[0].excerpt,
        content: raw.translations[0].content,
      };
    }
  } catch (err) {
    console.error('Failed to load blog post:', err);
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="pt-28 pb-20 space-y-12 container-velvante max-w-4xl">
      <div>
        <Link href={`/${locale}/blog`} className="inline-flex items-center gap-1.5 text-xs text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors">
          <ChevronLeft size={14} /> {locale === 'sq' ? 'Kthehu te të gjithë artikujt' : 'Back to all articles'}
        </Link>
      </div>

      <div className="space-y-6">
        <Badge variant="accent">{post.categoryName}</Badge>
        <h1 className="text-display-md font-black text-[rgb(var(--color-text))]">
          {post.title}
        </h1>
        <p className="text-body-lg text-[rgb(var(--color-text-muted))]">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-4 pt-4 border-t border-[rgb(var(--color-border))]">
          {post.author.image && (
            <img src={post.author.image} alt={post.author.name} className="w-12 h-12 rounded-full object-cover" />
          )}
          <div>
            <p className="text-sm font-bold text-[rgb(var(--color-text))]">{post.author.name}</p>
            <p className="text-xs text-[rgb(var(--color-text-subtle))]">
              {post.author.role} • {post.publishedAt ? formatDate(post.publishedAt, locale) : ''} • {post.readingTime} {locale === 'sq' ? 'min lexim' : 'min read'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[var(--radius-xl)] overflow-hidden h-64 sm:h-80 md:h-[400px] bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))]">
        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
      </div>

      <article className="prose prose-invert max-w-none space-y-6 text-[rgb(var(--color-text))] text-body-md leading-relaxed">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('# ')) {
            return <h1 key={idx} className="text-3xl font-extrabold mt-8 mb-4 text-[rgb(var(--color-text))]">{paragraph.replace('# ', '')}</h1>;
          }
          if (paragraph.startsWith('## ')) {
            return <h2 key={idx} className="text-2xl font-bold mt-8 mb-4 text-[rgb(var(--color-text))]">{paragraph.replace('## ', '')}</h2>;
          }
          if (paragraph.startsWith('### ')) {
            return <h3 key={idx} className="text-xl font-bold mt-6 mb-3 text-[rgb(var(--color-accent-light))]">{paragraph.replace('### ', '')}</h3>;
          }
          return <p key={idx} className="text-[rgb(var(--color-text-muted))] leading-relaxed">{paragraph}</p>;
        })}
      </article>

      <Card className="p-6 bg-[rgb(var(--color-surface))] flex items-start gap-4">
        {post.author.image && (
          <img src={post.author.image} alt={post.author.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
        )}
        <div className="space-y-1">
          <p className="text-sm font-bold text-[rgb(var(--color-text))]">
            {locale === 'sq' ? 'Shkruar nga' : 'Written by'} {post.author.name}
          </p>
          <p className="text-xs text-[rgb(var(--color-text-muted))]">{post.author.bio}</p>
        </div>
      </Card>
    </div>
  );
}
