import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MotionWrapper } from '@/components/animations/motion-wrapper';
import { HeroInteractive } from '@/components/home/hero-interactive';
import { TechTicker } from '@/components/home/tech-ticker';
import { StatsRibbon } from '@/components/home/stats-ribbon';
import { ProblemSolutionGrid } from '@/components/home/problem-solution-grid';
import { ServicesGrid } from '@/components/home/services-grid';
import { ProcessStepsGrid } from '@/components/home/process-steps-grid';
import { FeaturedProjectsGrid } from '@/components/home/featured-projects-grid';
import { WhyUsGrid } from '@/components/home/why-us-grid';
import { TestimonialsGrid } from '@/components/home/testimonials-grid';
import { prisma } from '@/lib/db/client';
import { toStringArray } from '@/lib/utils';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tCommon = await getTranslations('common');
  const tHome = await getTranslations('home');

  let featuredProjects: Array<{
    id: string;
    slug: string;
    coverImage: string;
    technologies: string[];
    year: number;
    title: string;
    tagline: string;
    client: string;
    categoryName: string;
  }> = [];

  let servicesList: Array<{
    id: string;
    slug: string;
    icon: string;
    title: string;
    shortDesc: string;
  }> = [];

  let testimonialsList: Array<{
    id: string;
    name: string;
    role: string;
    company: string;
    rating: number;
    quote: string;
  }> = [];

  try {
    const [rawProjects, rawServices, rawTestimonials] = await Promise.all([
      prisma.project.findMany({
        where: { published: true, featured: true, deletedAt: null },
        take: 3,
        orderBy: { order: 'asc' },
        include: {
          category: true,
          translations: { where: { locale } },
        },
      }),
      prisma.service.findMany({
        where: { published: true, featured: true, deletedAt: null, slug: { notIn: ['cloud-devops'] } },
        take: 6,
        orderBy: { order: 'asc' },
        include: {
          translations: { where: { locale } },
        },
      }),
      prisma.testimonial.findMany({
        where: { published: true, featured: true },
        take: 3,
        orderBy: { order: 'asc' },
        include: {
          translations: { where: { locale } },
        },
      }),
    ]);

    featuredProjects = rawProjects.map((p) => ({
      id: p.id,
      slug: p.slug,
      coverImage: p.coverImage,
      technologies: toStringArray(p.technologies),
      year: p.year,
      title: p.translations[0]?.title ?? 'Project',
      tagline: p.translations[0]?.tagline ?? '',
      client: p.translations[0]?.client ?? '',
      categoryName: locale === 'sq' ? p.category.nameAl : p.category.name,
    }));

    servicesList = rawServices.map((s) => ({
      id: s.id,
      slug: s.slug,
      icon: s.icon,
      title: s.translations[0]?.title ?? 'Service',
      shortDesc: s.translations[0]?.shortDesc ?? '',
    }));

    testimonialsList = rawTestimonials.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      company: t.company,
      rating: t.rating,
      quote: t.translations[0]?.quote ?? '',
    }));
  } catch (err) {
    console.error('Failed to load DB data for homepage:', err);
  }

  return (
    <div className="relative overflow-hidden bg-[rgb(var(--color-background))] grid-overlay">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[rgb(var(--color-accent)/0.18)] to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[18%] -left-32 w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[35%] -right-32 w-[700px] h-[550px] bg-indigo-500/12 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[55%] left-[-80px] w-[650px] h-[500px] bg-[rgb(var(--color-accent)/0.1)] rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-[75%] -right-20 w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-indigo-500/12 rounded-full blur-[180px] pointer-events-none" />

      <section className="relative min-h-0 lg:min-h-[85vh] pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 flex items-center justify-center z-10">
        <div className="container-velvante relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <MotionWrapper variant="fadeUp" delay={0.1} immediate>
                <Badge variant="accent" dot className="mb-2 px-3 py-1 text-xs">
                  {tHome('hero.badge')}
                </Badge>
              </MotionWrapper>

              <MotionWrapper variant="fadeUp" delay={0.2} immediate>
                <h1 className="text-display-xl sm:text-display-2xl font-black tracking-tight text-[rgb(var(--color-text))] leading-[1.05]">
                  {tHome('hero.headline')}
                </h1>
              </MotionWrapper>

              <MotionWrapper variant="fadeUp" delay={0.3} immediate>
                <p className="text-body-lg text-[rgb(var(--color-text-muted))] max-w-2xl leading-relaxed">
                  {tHome('hero.subheadline')}
                </p>
              </MotionWrapper>

              <MotionWrapper variant="fadeUp" delay={0.4} immediate>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
                  <Button
                    as="a"
                    href={`/${locale}/start-project`}
                    size="lg"
                    rightIcon={<ArrowRight size={18} />}
                    className="w-full sm:w-auto text-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.35)] hover:shadow-[0_0_36px_rgba(99,102,241,0.55)] transition-shadow"
                  >
                    {tHome('hero.cta.primary')}
                  </Button>
                  <Button
                    as="a"
                    href={`/${locale}/projects`}
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto text-center justify-center backdrop-blur-md bg-[rgb(var(--color-surface)/0.6)]"
                  >
                    {tHome('hero.cta.secondary')}
                  </Button>
                </div>
              </MotionWrapper>

              <MotionWrapper variant="fadeUp" delay={0.5} immediate>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-mono text-[rgb(var(--color-text-subtle))]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {locale === 'sq' ? 'Performancë 100/100' : '100/100 Performance'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-accent-light))]" />
                    {locale === 'sq' ? 'Kod 100% i Pastër' : 'Clean Architecture'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {locale === 'sq' ? 'Mbështetje e Plotë' : 'Full Support'}
                  </span>
                </div>
              </MotionWrapper>
            </div>

            <div className="lg:col-span-5">
              <MotionWrapper variant="scaleIn" delay={0.3} immediate>
                <HeroInteractive locale={locale} />
              </MotionWrapper>
            </div>
          </div>
        </div>
      </section>

      <TechTicker label={locale === 'sq' ? 'Teknologjitë & Arkitektura që Përdorim' : 'Technologies & Architecture We Deploy'} />

      <section className="py-16 border-y border-[rgb(var(--color-border)/0.4)] bg-[rgb(var(--color-surface)/0.2)] backdrop-blur-sm">
        <div className="container-velvante space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <p className="text-xs uppercase tracking-widest font-mono text-[rgb(var(--color-accent-light))]">
              {locale === 'sq' ? 'Matje e Suksesit' : 'Verified Track Record'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[rgb(var(--color-text))]">
              {tHome('trust.title')}
            </h2>
          </div>
          <StatsRibbon
            stats={{
              projects: {
                value: tHome('trust.metrics.projects.value') || '80+',
                label: tHome('trust.metrics.projects.label'),
              },
              clients: {
                value: tHome('trust.metrics.clients.value') || '60+',
                label: tHome('trust.metrics.clients.label'),
              },
              performance: {
                value: tHome('trust.metrics.performance.value') || '99%',
                label: tHome('trust.metrics.performance.label'),
              },
              countries: {
                value: tHome('trust.metrics.countries.value') || '12+',
                label: tHome('trust.metrics.countries.label'),
              },
            }}
          />
        </div>
      </section>

      <section className="section-padding bg-transparent">
        <div className="container-velvante space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="error" dot>{tHome('problem.badge')}</Badge>
            <h2 className="text-display-md font-extrabold text-[rgb(var(--color-text))]">
              {tHome('problem.headline')}
            </h2>
            <p className="text-body-md text-[rgb(var(--color-text-muted))]">
              {tHome('problem.subheadline')}
            </p>
          </div>

          <ProblemSolutionGrid
            problems={(tHome.raw('problem.problems') as Array<{ title: string; description: string }>) || []}
            locale={locale}
          />

          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[rgb(var(--color-surface))] to-indigo-500/10 border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 size={22} />
              </div>
              <p className="text-base sm:text-lg font-bold text-[rgb(var(--color-text))]">
                {tHome('problem.solution')}
              </p>
            </div>
            <Button as="a" href={`/${locale}/contact`} size="sm" rightIcon={<ArrowRight size={14} />}>
              {locale === 'sq' ? 'Kërko Zgjidhjen Tuaj' : 'Get Your Solution'}
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-transparent border-y border-[rgb(var(--color-border)/0.4)]">
        <div className="container-velvante space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <Badge variant="accent" dot>{tHome('services.badge')}</Badge>
              <h2 className="text-display-md font-extrabold text-[rgb(var(--color-text))]">
                {tHome('services.headline')}
              </h2>
              <p className="text-body-sm text-[rgb(var(--color-text-muted))]">
                {tHome('services.subheadline')}
              </p>
            </div>
            <Button as="a" href={`/${locale}/services`} variant="secondary" rightIcon={<ArrowRight size={16} />}>
              {tCommon('cta.seeAllServices')}
            </Button>
          </div>

          <ServicesGrid
            services={servicesList}
            locale={locale}
            learnMoreText={tCommon('cta.learnMore')}
          />
        </div>
      </section>

      <section className="section-padding bg-transparent">
        <div className="container-velvante space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <Badge variant="accent">{tHome('process.badge')}</Badge>
            <h2 className="text-display-md font-extrabold text-[rgb(var(--color-text))]">
              {tHome('process.headline')}
            </h2>
            <p className="text-body-sm text-[rgb(var(--color-text-muted))]">
              {tHome('process.subheadline')}
            </p>
          </div>

          <ProcessStepsGrid
            steps={(tHome.raw('process.steps') as Array<{ number: string; title: string; description: string }>) || []}
            locale={locale}
          />
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="section-padding bg-transparent border-t border-[rgb(var(--color-border)/0.4)]">
          <div className="container-velvante space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <Badge variant="accent">{tHome('projects.badge')}</Badge>
                <h2 className="text-display-md font-extrabold text-[rgb(var(--color-text))]">
                  {tHome('projects.headline')}
                </h2>
                <p className="text-body-sm text-[rgb(var(--color-text-muted))]">
                  {tHome('projects.subheadline')}
                </p>
              </div>
              <Button as="a" href={`/${locale}/projects`} variant="secondary" rightIcon={<ArrowRight size={16} />}>
                {tCommon('cta.seeAllProjects')}
              </Button>
            </div>

            <FeaturedProjectsGrid projects={featuredProjects} locale={locale} />
          </div>
        </section>
      )}

      <section className="section-padding bg-transparent border-t border-[rgb(var(--color-border)/0.4)]">
        <div className="container-velvante space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <Badge variant="accent">{tHome('why.badge')}</Badge>
            <h2 className="text-display-md font-extrabold text-[rgb(var(--color-text))]">
              {tHome('why.headline')}
            </h2>
            <p className="text-body-sm text-[rgb(var(--color-text-muted))]">
              {tHome('why.subheadline')}
            </p>
          </div>

          <WhyUsGrid
            reasons={(tHome.raw('why.reasons') as Array<{ title: string; description: string }>) || []}
            locale={locale}
          />
        </div>
      </section>

      {testimonialsList.length > 0 && (
        <section className="section-padding bg-transparent border-t border-[rgb(var(--color-border)/0.4)]">
          <div className="container-velvante space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <Badge variant="accent">{tHome('testimonials.badge')}</Badge>
              <h2 className="text-display-md font-extrabold text-[rgb(var(--color-text))]">
                {tHome('testimonials.headline')}
              </h2>
              <p className="text-body-sm text-[rgb(var(--color-text-muted))]">
                {tHome('testimonials.subheadline')}
              </p>
            </div>

            <TestimonialsGrid testimonials={testimonialsList} />
          </div>
        </section>
      )}

      <section className="section-padding bg-transparent relative">
        <div className="container-velvante">
          <div className="relative p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-[rgb(var(--color-surface))] via-[rgb(var(--color-surface-elevated))] to-[rgb(var(--color-surface))] border border-[rgb(var(--color-accent)/0.35)] text-center space-y-7 overflow-hidden shadow-2xl glow-accent">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[rgb(var(--color-accent)/0.2)] rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
              <Badge variant="accent" dot>{tHome('cta.badge')}</Badge>
              <h2 className="text-display-lg sm:text-display-xl font-black text-[rgb(var(--color-text))] tracking-tight">
                {tHome('cta.headline')}
              </h2>
              <p className="text-body-md text-[rgb(var(--color-text-muted))] leading-relaxed">
                {tHome('cta.subheadline')}
              </p>
            </div>

            <div className="relative z-10 pt-2 flex flex-col sm:flex-row justify-center gap-4">
              <Button
                as="a"
                href={`/${locale}/start-project`}
                size="lg"
                rightIcon={<ArrowRight size={18} />}
                className="w-full sm:w-auto shadow-[0_0_24px_rgba(99,102,241,0.4)] hover:shadow-[0_0_36px_rgba(99,102,241,0.6)] transition-shadow"
              >
                {tHome('cta.primary')}
              </Button>
              <Button
                as="a"
                href={`/${locale}/contact`}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto backdrop-blur-md bg-[rgb(var(--color-surface)/0.6)]"
              >
                {tHome('cta.secondary')}
              </Button>
            </div>

            <div className="relative z-10 pt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-mono text-[rgb(var(--color-text-subtle))] border-t border-[rgb(var(--color-border)/0.5)] max-w-xl mx-auto">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {locale === 'sq' ? 'Konsultim Fillestar Falas' : 'Free Initial Consultation'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                {locale === 'sq' ? 'Përgjigje brenda 24 orëve' : '24-Hour Response'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {locale === 'sq' ? 'Pa Asnjë Detyrim' : 'No Commitment'}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
