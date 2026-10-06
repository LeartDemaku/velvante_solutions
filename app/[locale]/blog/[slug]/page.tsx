import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Clock, Calendar, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { prisma } from '@/lib/db/client';

const projectSlugMap: Record<string, string> = {
  'workpulse-engineering-modern-job-platform': 'workpulse-is-a-comprehensive-job-platform-demonstrating',
  'avana-villas-luxury-real-estate-web-platform': 'avana-villas-is-a-modern-web-platform-for-an-exclusive-residential-complex',
  'vantalyra-architecting-secure-digital-asset-management': 'vantalyra-is-a-digital-asset-management-dam-platform',
  'korea-pure-beauty-interactive-python-streamlit-web-app': 'korea-pure-beauty-is-an-interactive-web-application-built-with-python-and-streamlit',
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tBlog = await getTranslations('blog');

  let post = null;
  let connectedProject = null;

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

    const targetProjectSlug = projectSlugMap[slug];
    if (targetProjectSlug) {
      const pRaw = await prisma.project.findFirst({
        where: { slug: targetProjectSlug, published: true, deletedAt: null },
        include: {
          category: true,
          translations: true,
        },
      });

      if (pRaw) {
        const trans = pRaw.translations.find((t) => t.locale === locale) || pRaw.translations[0];
        connectedProject = {
          id: pRaw.id,
          slug: pRaw.slug,
          coverImage: pRaw.coverImage,
          liveUrl: pRaw.liveUrl,
          year: pRaw.year,
          title: trans?.title || pRaw.slug,
          client: trans?.client || '',
          tagline: trans?.tagline || '',
          categoryName: pRaw.category?.name || '',
        };
      }
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
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-1.5 text-xs text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors"
        >
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

      <div className="rounded-[var(--radius-xl)] overflow-hidden h-64 sm:h-80 md:h-[450px] bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))]">
        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
      </div>

      <article className="prose prose-invert max-w-none space-y-6 text-[rgb(var(--color-text))] text-body-md leading-relaxed">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-3xl font-extrabold mt-8 mb-4 text-[rgb(var(--color-text))]">
                {paragraph.replace('# ', '')}
              </h1>
            );
          }
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-2xl font-bold mt-8 mb-4 text-[rgb(var(--color-text))]">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl font-bold mt-6 mb-3 text-[rgb(var(--color-accent-light))]">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
            const items = paragraph.split('\n').filter((line) => line.trim().startsWith('- '));
            return (
              <ul key={idx} className="space-y-2 my-4 pl-5 list-disc text-[rgb(var(--color-text-muted))]">
                {items.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">
                    {item.replace(/^- /, '')}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="text-[rgb(var(--color-text-muted))] leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </article>

      {connectedProject && (
        <div className="relative p-6 sm:p-8 rounded-3xl bg-[rgb(var(--color-surface)/0.7)] backdrop-blur-xl border border-[rgb(var(--color-accent)/0.4)] shadow-2xl overflow-hidden glow-accent space-y-6">
          <div className="absolute top-0 right-0 w-80 h-40 bg-[rgb(var(--color-accent)/0.15)] rounded-full blur-[70px] pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[rgb(var(--color-accent-light))]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[rgb(var(--color-accent-light))] font-bold">
                {locale === 'sq' ? 'Projekti i Ndërlidhur' : 'Connected Project'}
              </span>
            </div>
            <span className="text-xs font-mono text-[rgb(var(--color-text-subtle))] bg-[rgb(var(--color-surface-elevated))] px-3 py-1 rounded-full border border-[rgb(var(--color-border)/0.5)]">
              {connectedProject.categoryName} • {connectedProject.year}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            <div className="md:col-span-5 relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-950 border border-[rgb(var(--color-border))] shadow-md">
              <img
                src={connectedProject.coverImage}
                alt={connectedProject.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            <div className="md:col-span-7 space-y-3">
              <p className="text-xs font-mono uppercase tracking-wider text-[rgb(var(--color-accent-light))] font-semibold">
                {connectedProject.client}
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-[rgb(var(--color-text))] leading-tight">
                {connectedProject.title}
              </h3>
              <p className="text-sm text-[rgb(var(--color-text-muted))] leading-relaxed line-clamp-2">
                {connectedProject.tagline}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Button
                  as="a"
                  href={`/${locale}/projects/${connectedProject.slug}`}
                  size="sm"
                  rightIcon={<ArrowRight size={15} />}
                  className="shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]"
                >
                  {locale === 'sq' ? 'Shiko Studimin e Plotë' : 'View Full Case Study'}
                </Button>

                {connectedProject.liveUrl && (
                  <Button
                    as="a"
                    href={connectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                    rightIcon={<ExternalLink size={14} />}
                  >
                    {locale === 'sq' ? 'Vizito Live' : 'Visit Live'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
