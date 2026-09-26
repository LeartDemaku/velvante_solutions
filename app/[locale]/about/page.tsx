import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MotionWrapper } from '@/components/animations/motion-wrapper';
import { MissionVisionCards } from '@/components/about/mission-vision-cards';
import { ValuesGrid } from '@/components/about/values-grid';
import { FounderCard } from '@/components/about/founder-card';
import { StandardsRibbon } from '@/components/about/standards-ribbon';
import { prisma } from '@/lib/db/client';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tAbout = await getTranslations('about');
  const tCommon = await getTranslations('common');

  let teamMembers: Array<{
    id: string;
    name: string;
    image: string | null;
    linkedin: string | null;
    role: string;
    bio: string;
  }> = [];

  try {
    const rawTeam = await prisma.teamMember.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
      include: { translations: { where: { locale } } },
    });

    teamMembers = rawTeam.map((m) => ({
      id: m.id,
      name: m.name,
      image: m.image,
      linkedin: m.linkedin,
      role: m.translations[0]?.role ?? '',
      bio: m.translations[0]?.bio ?? '',
    }));
  } catch (err) {
    console.error('Failed to load team members:', err);
  }

  return (
    <div className="relative bg-[rgb(var(--color-background))]">
      <section className="relative overflow-hidden grid-overlay pt-32 pb-24 border-b border-[rgb(var(--color-border)/0.4)]">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[rgb(var(--color-accent)/0.2)] to-transparent rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-[20%] -left-32 w-[550px] h-[450px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-[30%] -right-32 w-[600px] h-[500px] bg-indigo-500/12 rounded-full blur-[160px] pointer-events-none" />

        <div className="container-velvante relative z-10 text-center max-w-4xl mx-auto space-y-7">
          <MotionWrapper variant="fadeUp" delay={0.1} immediate>
            <Badge variant="accent" dot className="px-3.5 py-1 text-xs">
              {tAbout('hero.badge')}
            </Badge>
          </MotionWrapper>

          <MotionWrapper variant="fadeUp" delay={0.2} immediate>
            <h1 className="text-display-lg sm:text-display-xl font-black text-[rgb(var(--color-text))] tracking-tight leading-[1.08]">
              {tAbout('hero.headline')}
            </h1>
          </MotionWrapper>

          <MotionWrapper variant="fadeUp" delay={0.3} immediate>
            <p className="text-body-lg text-[rgb(var(--color-text-muted))] max-w-2xl mx-auto leading-relaxed">
              {tAbout('hero.subheadline')}
            </p>
          </MotionWrapper>

          <MotionWrapper variant="fadeUp" delay={0.4} immediate>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 pt-3 text-xs font-mono text-[rgb(var(--color-text-subtle))]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {locale === 'sq' ? 'Inxhinieri Senior' : 'Senior Engineering'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-accent-light))]" />
                {locale === 'sq' ? 'Arkitekturë e Shkallëzueshme' : 'Scalable Architecture'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {locale === 'sq' ? 'Transparencë 100%' : '100% Transparency'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {locale === 'sq' ? 'Pronësi e Plotë e Kodit' : 'Full Code Ownership'}
              </span>
            </div>
          </MotionWrapper>
        </div>
      </section>

      <section className="py-14 border-b border-[rgb(var(--color-border)/0.4)] bg-[rgb(var(--color-surface)/0.2)] backdrop-blur-sm">
        <div className="container-velvante">
          <StandardsRibbon locale={locale} />
        </div>
      </section>

      <section className="section-padding bg-transparent">
        <div className="container-velvante space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="accent" dot>
              {locale === 'sq' ? 'Qëllimi Ynë' : 'Our Purpose'}
            </Badge>
            <h2 className="text-display-md font-extrabold text-[rgb(var(--color-text))]">
              {locale === 'sq' ? 'Pse Ekziston Velvante Solutions' : 'Why Velvante Solutions Exists'}
            </h2>
          </div>

          <MissionVisionCards
            mission={{
              badge: tAbout('mission.badge'),
              headline: tAbout('mission.headline'),
              description: tAbout('mission.description'),
            }}
            vision={{
              badge: tAbout('vision.badge'),
              headline: tAbout('vision.headline'),
              description: tAbout('vision.description'),
            }}
            locale={locale}
          />
        </div>
      </section>

      <section className="section-padding bg-transparent border-t border-[rgb(var(--color-border)/0.4)]">
        <div className="container-velvante space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <Badge variant="accent">{tAbout('values.badge')}</Badge>
            <h2 className="text-display-md font-extrabold text-[rgb(var(--color-text))]">
              {tAbout('values.headline')}
            </h2>
            <p className="text-body-sm text-[rgb(var(--color-text-muted))]">
              {locale === 'sq'
                ? 'Standardet inxhinierike dhe etika profesionale mbi të cilat ndërtojmë çdo projekt.'
                : 'The engineering standards and professional ethics upon which we build every project.'}
            </p>
          </div>

          <ValuesGrid
            values={(tAbout.raw('values.items') as Array<{ title: string; description: string }>) || []}
            locale={locale}
          />
        </div>
      </section>

      {teamMembers.length > 0 && (
        <section className="section-padding bg-transparent border-t border-[rgb(var(--color-border)/0.4)]">
          <div className="container-velvante space-y-14">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <Badge variant="accent">{tAbout('team.badge')}</Badge>
              <h2 className="text-display-md font-extrabold text-[rgb(var(--color-text))]">
                {tAbout('team.headline')}
              </h2>
              <p className="text-body-sm text-[rgb(var(--color-text-muted))]">
                {tAbout('team.subheadline')}
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              {teamMembers.map((member) => (
                <FounderCard key={member.id} member={member} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-transparent relative">
        <div className="container-velvante">
          <div className="relative p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-[rgb(var(--color-surface))] via-[rgb(var(--color-surface-elevated))] to-[rgb(var(--color-surface))] border border-[rgb(var(--color-accent)/0.35)] text-center space-y-7 overflow-hidden shadow-2xl glow-accent">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[rgb(var(--color-accent)/0.2)] rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
              <Badge variant="accent" dot>
                {locale === 'sq' ? 'Partneritet Inxhinierik' : 'Engineering Partnership'}
              </Badge>
              <h2 className="text-display-lg sm:text-display-xl font-black text-[rgb(var(--color-text))] tracking-tight">
                {tAbout('cta.headline')}
              </h2>
              <p className="text-body-md text-[rgb(var(--color-text-muted))] leading-relaxed">
                {tAbout('cta.subheadline')}
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
                {tAbout('cta.primary')}
              </Button>
              <Button
                as="a"
                href={`/${locale}/services`}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto backdrop-blur-md bg-[rgb(var(--color-surface)/0.6)]"
              >
                {locale === 'sq' ? 'Eksploroni Shërbimet' : 'Explore Services'}
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
