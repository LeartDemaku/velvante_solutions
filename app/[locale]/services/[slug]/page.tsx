import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Code2, Palette, ShoppingCart, AppWindow, Layers, Server, Database, TrendingUp, Zap, Shield, Wrench, ChevronLeft } from 'lucide-react';
import { prisma } from '@/lib/db/client';
import { toStringArray } from '@/lib/utils';

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tCommon = await getTranslations('common');

  let service = null;

  try {
    const raw = await prisma.service.findFirst({
      where: { slug, published: true, deletedAt: null },
      include: {
        translations: { where: { locale } },
      },
    });

    if (raw && raw.translations[0]) {
      service = {
        id: raw.id,
        slug: raw.slug,
        icon: raw.icon,
        title: raw.translations[0].title,
        shortDesc: raw.translations[0].shortDesc,
        description: raw.translations[0].description,
        capabilities: toStringArray(raw.translations[0].capabilities),
        technologies: toStringArray(raw.translations[0].technologies),
        deliverables: toStringArray(raw.translations[0].deliverables),
        benefits: toStringArray(raw.translations[0].benefits),
      };
    }
  } catch (err) {
    console.error('Failed to load service detail:', err);
  }

  if (!service) {
    notFound();
  }

  const iconMap: Record<string, React.ElementType> = {
    Palette, Code2, ShoppingCart, AppWindow, Layers, Server,
    Database, TrendingUp, Zap, Shield, Wrench
  };

  const IconComp = iconMap[service.icon] || Code2;

  return (
    <div className="pt-28 pb-20 space-y-12 sm:space-y-16 container-velvante">
      <div>
        <Link href={`/${locale}/services`} className="inline-flex items-center gap-1.5 text-xs text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors">
          <ChevronLeft size={14} /> {locale === 'sq' ? 'Kthehu te të gjitha shërbimet' : 'Back to all services'}
        </Link>
      </div>

      <div className="max-w-4xl space-y-6">
        <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-[rgb(var(--color-accent)/0.15)] text-[rgb(var(--color-accent-light))] flex items-center justify-center">
          <IconComp size={32} />
        </div>
        <h1 className="text-display-md font-black text-[rgb(var(--color-text))]">
          {service.title}
        </h1>
        <p className="text-body-lg text-[rgb(var(--color-text-muted))] leading-relaxed">
          {service.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">
            {locale === 'sq' ? 'Kapacitetet' : 'Capabilities'}
          </h2>
          <ul className="space-y-2">
            {service.capabilities.map((cap) => (
              <li key={cap} className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-muted))]">
                <CheckCircle2 size={16} className="text-[rgb(var(--color-accent-light))] shrink-0" />
                {cap}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">
            {locale === 'sq' ? 'Dorëzimet' : 'Deliverables'}
          </h2>
          <ul className="space-y-2">
            {service.deliverables.map((del) => (
              <li key={del} className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-muted))]">
                <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                {del}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">
            {locale === 'sq' ? 'Përfitimet e Biznesit' : 'Business Benefits'}
          </h2>
          <ul className="space-y-2">
            {service.benefits.map((ben) => (
              <li key={ben} className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-muted))]">
                <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                {ben}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {service.technologies.length > 0 && (
        <div className="p-6 sm:p-8 rounded-[var(--radius-lg)] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] space-y-4">
          <h3 className="text-xs uppercase tracking-widest font-mono text-[rgb(var(--color-text-subtle))]">
            {locale === 'sq' ? 'Teknologjitë e Përdorura' : 'Technologies Used'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {service.technologies.map((tech) => (
              <Badge key={tech} variant="default" className="text-sm px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="p-8 sm:p-10 rounded-[var(--radius-xl)] bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-accent)/0.3)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
            {locale === 'sq' ? `Gati për të filluar me ${service.title}?` : `Ready to get started with ${service.title}?`}
          </h2>
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            {locale === 'sq'
              ? 'Planifikoni një konsultim falas strategjik me ekspertët tanë teknikë.'
              : 'Schedule a free strategy consultation with our technical leads.'}
          </p>
        </div>
        <Button as="a" href={`/${locale}/start-project`} size="lg" rightIcon={<ArrowRight size={16} />} className="w-full md:w-auto">
          {tCommon('cta.startProject')}
        </Button>
      </div>
    </div>
  );
}
