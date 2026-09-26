import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isSq = locale === 'sq';

  return {
    title: isSq ? 'Deklarata e Aksesueshmërisë' : 'Accessibility Statement',
    description: isSq
      ? 'Përkushtimi i Velvante Solutions ndaj standardeve universale të aksesueshmërisë dixhitale WCAG 2.2 AA.'
      : 'Velvante Solutions commitment to digital accessibility standards and WCAG 2.2 AA compliance.',
  };
}

export default async function AccessibilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isSq = locale === 'sq';

  return (
    <div className="pt-28 pb-20 container-velvante max-w-4xl space-y-8">
      <Badge variant="accent">{isSq ? 'Aksesueshmëria' : 'Accessibility'}</Badge>
      <h1 className="text-display-md font-black text-[rgb(var(--color-text))]">
        {isSq ? 'Deklarata e Aksesueshmërisë' : 'Accessibility Statement'}
      </h1>
      <p className="text-xs font-mono text-[rgb(var(--color-text-subtle))]">
        {isSq ? 'Standardi i synuar: WCAG 2.2 AA' : 'Target standard: WCAG 2.2 AA'}
      </p>

      <div className="prose prose-invert max-w-none text-[rgb(var(--color-text-muted))] space-y-6 text-sm leading-relaxed">
        <p>
          {isSq
            ? 'Velvante Solutions është thellësisht e përkushtuar për të garantuar aksesueshmëri dixhitale për të gjithë individët, pavarësisht aftësive apo pajisjeve të tyre ndihmëse. Ne zbatojmë dhe testojmë vazhdimisht praktikat më të mira të aksesueshmërisë për të ofruar një përvojë të barabartë dhe intuitive për këdo.'
            : 'Velvante Solutions is committed to ensuring digital accessibility for people of all abilities. We continuously apply relevant accessibility standards to improve user experience for everyone.'}
        </p>

        <h2 className="text-xl font-bold text-[rgb(var(--color-text))]">
          {isSq ? '1. Standardet Teknike dhe Përputhshmëria' : '1. Technical Standards'}
        </h2>
        <p>
          {isSq
            ? 'Platforma jonë është inxhinieruar sipas udhëzimeve WCAG 2.2 Niveli AA. Kjo përfshin lundrimin e plotë me tastierë pa pengesa bllokuese, mbështetjen e strukturuar semantike për lexuesit e ekranit, treguesit e qartë të fokusit, atributet e sakta ARIA dhe kontrastin e lartë të ngjyrave në të gjitha elementet grafike.'
            : 'Our platform is engineered to comply with WCAG 2.2 AA standards, incorporating full keyboard navigation, screen reader accessibility, visible focus indicators, proper ARIA semantics, and contrast ratios.'}
        </p>

        <h2 className="text-xl font-bold text-[rgb(var(--color-text))]">
          {isSq ? '2. Reagime, Pyetje dhe Ndihmë' : '2. Feedback & Assistance'}
        </h2>
        <p>
          {isSq
            ? 'Nëse hasni ndonjë vështirësi gjatë navigimit ose keni sugjerime për përmirësimin e aksesueshmërisë, ju lutemi na kontaktoni në velvantesolutions@outlook.com dhe ekipi ynë teknik do ta shqyrtojë me prioritet të lartë.'
            : 'If you encounter accessibility barriers on our website, please email us at velvantesolutions@outlook.com and we will address it promptly.'}
        </p>
      </div>
    </div>
  );
}
