import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { MotionWrapper } from '@/components/animations/motion-wrapper';
import { ProjectsView } from '@/components/projects/projects-view';
import { prisma } from '@/lib/db/client';
import { toStringArray } from '@/lib/utils';

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tProjects = await getTranslations('projects');

  let projects: Array<{
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

  try {
    const raw = await prisma.project.findMany({
      where: { published: true, deletedAt: null },
      orderBy: [{ featured: 'desc' }, { order: 'asc' }],
      include: {
        category: true,
        translations: { where: { locale } },
      },
    });

    projects = raw.map((p) => ({
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
  } catch (err) {
    console.error('Failed to load projects:', err);
  }

  return (
    <div className="relative bg-[rgb(var(--color-background))] min-h-screen">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[rgb(var(--color-accent)/0.15)] rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-[35%] -left-20 w-[550px] h-[400px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[600px] h-[450px] bg-indigo-500/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="pt-32 pb-24 space-y-16 container-velvante relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <MotionWrapper variant="fadeUp" delay={0.1} immediate>
            <Badge variant="accent" dot className="px-3.5 py-1 text-xs">
              {tProjects('hero.badge')}
            </Badge>
          </MotionWrapper>

          <MotionWrapper variant="fadeUp" delay={0.2} immediate>
            <h1 className="text-display-lg sm:text-display-xl font-black text-[rgb(var(--color-text))] tracking-tight leading-[1.08]">
              {tProjects('hero.headline')}
            </h1>
          </MotionWrapper>

          <MotionWrapper variant="fadeUp" delay={0.3} immediate>
            <p className="text-body-lg text-[rgb(var(--color-text-muted))] leading-relaxed max-w-2xl mx-auto">
              {tProjects('hero.subheadline')}
            </p>
          </MotionWrapper>
        </div>

        <ProjectsView projects={projects} locale={locale} />
      </div>
    </div>
  );
}
