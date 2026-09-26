import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { MotionWrapper } from '@/components/animations/motion-wrapper';
import { ServicesView } from '@/components/services/services-view';
import { prisma } from '@/lib/db/client';
import { toStringArray } from '@/lib/utils';

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tServices = await getTranslations('services');
  const tCommon = await getTranslations('common');

  let services: Array<{
    id: string;
    slug: string;
    icon: string;
    title: string;
    shortDesc: string;
    capabilities: string[];
  }> = [];

  try {
    const raw = await prisma.service.findMany({
      where: { published: true, deletedAt: null, slug: { notIn: ['cloud-devops'] } },
      orderBy: { order: 'asc' },
      include: { translations: { where: { locale } } },
    });

    services = raw.map((s) => ({
      id: s.id,
      slug: s.slug,
      icon: s.icon,
      title: s.translations[0]?.title ?? 'Service',
      shortDesc: s.translations[0]?.shortDesc ?? '',
      capabilities: toStringArray(s.translations[0]?.capabilities),
    }));
  } catch (err) {
    console.error('Failed to load services list:', err);
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
              {tServices('hero.badge')}
            </Badge>
          </MotionWrapper>

          <MotionWrapper variant="fadeUp" delay={0.2} immediate>
            <h1 className="text-display-lg sm:text-display-xl font-black text-[rgb(var(--color-text))] tracking-tight leading-[1.08]">
              {tServices('hero.headline')}
            </h1>
          </MotionWrapper>

          <MotionWrapper variant="fadeUp" delay={0.3} immediate>
            <p className="text-body-lg text-[rgb(var(--color-text-muted))] leading-relaxed max-w-2xl mx-auto">
              {tServices('hero.subheadline')}
            </p>
          </MotionWrapper>
        </div>

        <ServicesView
          services={services}
          locale={locale}
          learnMoreText={tCommon('cta.learnMore')}
          ctaHeadline={tServices('cta.headline')}
          ctaSubheadline={tServices('cta.subheadline')}
          ctaButtonText={tServices('cta.primary')}
        />
      </div>
    </div>
  );
}
