import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, Calendar, Building, CheckCircle2, ExternalLink } from 'lucide-react';
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
        translations: true,
      },
    });

    if (raw) {
      const tr = raw.translations.find((t) => t.locale === locale) || raw.translations[0];
      const fallbackClient = raw.translations.find((t) => t.client && t.client.trim().length > 1)?.client || '';
      if (tr) {
        project = {
          id: raw.id,
          slug: raw.slug,
          coverImage: raw.coverImage,
          liveUrl: raw.liveUrl,
          images: toStringArray(raw.images),
          technologies: toStringArray(raw.technologies),
          year: raw.year,
          categoryName: locale === 'sq' ? raw.category.nameAl : raw.category.name,
          title: tr.title,
          client: (tr.client && tr.client.trim().length > 1) ? tr.client.trim() : (fallbackClient || tr.client || ''),
          industry: tr.industry,
          tagline: tr.tagline,
          challenge: tr.challenge,
          solution: tr.solution,
          results: tr.results,
        };
      }
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

        {project.liveUrl && (
          <div className="pt-2">
            <Button
              as="a"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              rightIcon={<ExternalLink size={14} />}
            >
              {locale === 'sq' ? 'Vizito Projektin Live' : 'Visit Live Project'}
            </Button>
          </div>
        )}
      </div>

      <div className="relative rounded-[var(--radius-2xl)] overflow-hidden border border-[rgb(var(--color-border))] bg-zinc-950/80 shadow-2xl backdrop-blur-xl p-2 sm:p-4 md:p-6">
        <div
          className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 pointer-events-none scale-105"
          style={{ backgroundImage: `url(${project.coverImage})` }}
        />
        <img
          src={project.coverImage}
          alt={project.title}
          className="relative z-10 w-full h-auto max-h-[85vh] object-contain rounded-[var(--radius-xl)] mx-auto block shadow-2xl"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8 space-y-8 sm:space-y-12">
          {project.challenge ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[rgb(var(--color-text))] flex items-center gap-2">
                <span className="w-2 h-6 bg-[rgb(var(--color-accent))] rounded-full" />
                {tProjects('caseStudy.challenge')}
              </h2>
              <p className="text-body-md text-[rgb(var(--color-text-muted))] leading-relaxed whitespace-pre-wrap">
                {project.challenge}
              </p>
            </div>
          ) : null}

          {project.solution ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[rgb(var(--color-text))] flex items-center gap-2">
                <span className="w-2 h-6 bg-indigo-500 rounded-full" />
                {tProjects('caseStudy.solution')}
              </h2>
              <p className="text-body-md text-[rgb(var(--color-text-muted))] leading-relaxed whitespace-pre-wrap">
                {project.solution}
              </p>
            </div>
          ) : null}

          {project.results ? (
            <div className="p-6 sm:p-8 rounded-[var(--radius-xl)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-accent)/0.3)] space-y-4 glow-accent-sm">
              <h2 className="text-2xl font-bold text-[rgb(var(--color-text))] text-green-400 flex items-center gap-2">
                <CheckCircle2 size={24} />
                {tProjects('caseStudy.results')}
              </h2>
              <p className="text-body-md text-[rgb(var(--color-text))] leading-relaxed whitespace-pre-wrap">
                {project.results}
              </p>
            </div>
          ) : null}
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
