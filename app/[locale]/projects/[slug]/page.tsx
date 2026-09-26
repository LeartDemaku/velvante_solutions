import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, Calendar, Building, CheckCircle2 } from 'lucide-react';
import { prisma } from '@/lib/db/client';
import { toStringArray } from '@/lib/utils';

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tProjects = await getTranslations('projects');
  const tCommon = await getTranslations('common');

  let project = null;

  try {
    const raw = await prisma.project.findFirst({
      where: { slug, published: true, deletedAt: null },
      include: {
        category: true,
        translations: { where: { locale } },
      },
    });

    if (raw && raw.translations[0]) {
      project = {
        id: raw.id,
        slug: raw.slug,
        coverImage: raw.coverImage,
        images: toStringArray(raw.images),
        technologies: toStringArray(raw.technologies),
        year: raw.year,
        categoryName: locale === 'sq' ? raw.category.nameAl : raw.category.name,
        title: raw.translations[0].title,
        client: raw.translations[0].client,
        industry: raw.translations[0].industry,
        tagline: raw.translations[0].tagline,
        challenge: raw.translations[0].challenge,
        solution: raw.translations[0].solution,
        results: raw.translations[0].results,
      };
    }
  } catch (err) {
    console.error('Failed to load project case study:', err);
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="pt-28 pb-20 space-y-12 sm:space-y-16 container-velvante">
      <div>
        <Link href={`/${locale}/projects`} className="inline-flex items-center gap-1.5 text-xs text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors">
          <ChevronLeft size={14} /> {locale === 'sq' ? 'Kthehu te të gjitha projektet' : 'Back to all projects'}
        </Link>
      </div>

      <div className="space-y-6 max-w-4xl">
        <Badge variant="accent">{project.categoryName}</Badge>
        <h1 className="text-display-lg font-black text-[rgb(var(--color-text))]">
          {project.title}
        </h1>
        <p className="text-body-lg text-[rgb(var(--color-text-muted))]">
          {project.tagline}
        </p>

        <div className="flex flex-wrap gap-6 sm:gap-8 pt-4 border-t border-[rgb(var(--color-border))] text-sm">
          <div>
            <span className="text-xs text-[rgb(var(--color-text-subtle))] uppercase tracking-wider block font-mono">{tProjects('caseStudy.client')}</span>
            <span className="font-semibold text-[rgb(var(--color-text))] mt-1 block">{project.client}</span>
          </div>
          <div>
            <span className="text-xs text-[rgb(var(--color-text-subtle))] uppercase tracking-wider block font-mono">{tProjects('caseStudy.industry')}</span>
            <span className="font-semibold text-[rgb(var(--color-text))] mt-1 block">{project.industry}</span>
          </div>
          <div>
            <span className="text-xs text-[rgb(var(--color-text-subtle))] uppercase tracking-wider block font-mono">{locale === 'sq' ? 'Viti' : 'Year'}</span>
            <span className="font-semibold text-[rgb(var(--color-text))] mt-1 block">{project.year}</span>
          </div>
        </div>
      </div>

      <div className="rounded-[var(--radius-xl)] overflow-hidden h-64 sm:h-80 md:h-[450px] bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))]">
        <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8 space-y-8 sm:space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[rgb(var(--color-text))] flex items-center gap-2">
              <span className="w-2 h-6 bg-[rgb(var(--color-accent))] rounded-full" />
              {tProjects('caseStudy.challenge')}
            </h2>
            <p className="text-body-md text-[rgb(var(--color-text-muted))] leading-relaxed whitespace-pre-wrap">
              {project.challenge}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[rgb(var(--color-text))] flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-500 rounded-full" />
              {tProjects('caseStudy.solution')}
            </h2>
            <p className="text-body-md text-[rgb(var(--color-text-muted))] leading-relaxed whitespace-pre-wrap">
              {project.solution}
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-[var(--radius-xl)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-accent)/0.3)] space-y-4 glow-accent-sm">
            <h2 className="text-2xl font-bold text-[rgb(var(--color-text))] text-green-400 flex items-center gap-2">
              <CheckCircle2 size={24} />
              {tProjects('caseStudy.results')}
            </h2>
            <p className="text-body-md text-[rgb(var(--color-text))] leading-relaxed whitespace-pre-wrap">
              {project.results}
            </p>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-mono text-[rgb(var(--color-text-subtle))]">{tProjects('caseStudy.technologies')}</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="default" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </Card>

          <Card className="p-6 space-y-4 bg-[rgb(var(--color-surface-elevated))] text-center">
            <h3 className="text-lg font-bold text-[rgb(var(--color-text))]">
              {locale === 'sq' ? 'Keni një projekt të ngjashëm?' : 'Have a similar project?'}
            </h3>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              {locale === 'sq'
                ? 'Ne mund të projektojmë një platformë dixhitale të personalizuar për biznesin tuaj.'
                : 'We can architect a tailored digital platform for your business.'}
            </p>
            <Button as="a" href={`/${locale}/start-project`} fullWidth rightIcon={<ArrowRight size={14} />}>
              {tCommon('cta.startProject')}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
