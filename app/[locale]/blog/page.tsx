import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { MotionWrapper } from '@/components/animations/motion-wrapper';
import { BlogView } from '@/components/blog/blog-view';
import { prisma } from '@/lib/db/client';

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tBlog = await getTranslations('blog');

  let posts: Array<{
    id: string;
    slug: string;
    coverImage: string;
    publishedAt: Date | null;
    readingTime: number;
    title: string;
    excerpt: string;
    authorName: string;
    categoryName: string;
  }> = [];

  try {
    const raw = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      orderBy: { publishedAt: 'desc' },
      include: {
        author: true,
        category: true,
        translations: { where: { locale } },
      },
    });

    posts = raw.map((p) => ({
      id: p.id,
      slug: p.slug,
      coverImage: p.coverImage,
      publishedAt: p.publishedAt,
      readingTime: p.readingTime,
      title: p.translations[0]?.title ?? 'Article',
      excerpt: p.translations[0]?.excerpt ?? '',
      authorName: p.author.name,
      categoryName: locale === 'sq' ? p.category.nameAl : p.category.name,
    }));
  } catch (err) {
    console.error('Failed to load blog posts:', err);
  }

  return (
    <div className="relative bg-[rgb(var(--color-background))] min-h-screen">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[rgb(var(--color-accent)/0.15)] rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-[35%] -right-20 w-[550px] h-[400px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[600px] h-[450px] bg-indigo-500/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="pt-32 pb-24 space-y-16 container-velvante relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <MotionWrapper variant="fadeUp" delay={0.1} immediate>
            <Badge variant="accent" dot className="px-3.5 py-1 text-xs">
              {tBlog('hero.badge')}
            </Badge>
          </MotionWrapper>

          <MotionWrapper variant="fadeUp" delay={0.2} immediate>
            <h1 className="text-display-lg sm:text-display-xl font-black text-[rgb(var(--color-text))] tracking-tight leading-[1.08]">
              {tBlog('hero.headline')}
            </h1>
          </MotionWrapper>

          <MotionWrapper variant="fadeUp" delay={0.3} immediate>
            <p className="text-body-lg text-[rgb(var(--color-text-muted))] leading-relaxed max-w-2xl mx-auto">
              {tBlog('hero.subheadline')}
            </p>
          </MotionWrapper>
        </div>

        <BlogView posts={posts} locale={locale} />
      </div>
    </div>
  );
}
