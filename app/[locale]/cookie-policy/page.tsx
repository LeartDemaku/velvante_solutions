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
    title: isSq ? 'Politika e Cookies' : 'Cookie Policy',
    description: isSq
      ? 'Mësoni se si Velvante Solutions përdor cookies për të optimizuar funksionimin dhe përvojën e përdoruesit.'
      : 'Understand how Velvante Solutions uses cookies and similar technologies on our website.',
  };
}

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isSq = locale === 'sq';

  return (
    <div className="pt-28 pb-20 container-velvante max-w-4xl space-y-8">
      <Badge variant="accent">{isSq ? 'Ligjore' : 'Legal'}</Badge>
      <h1 className="text-display-md font-black text-[rgb(var(--color-text))]">
        {isSq ? 'Politika e Cookies' : 'Cookie Policy'}
      </h1>
      <p className="text-xs font-mono text-[rgb(var(--color-text-subtle))]">
        {isSq ? 'Përditësuar së fundmi: Nëntor 2024' : 'Last updated: November 2024'}
      </p>

      <div className="prose prose-invert max-w-none text-[rgb(var(--color-text-muted))] space-y-6 text-sm leading-relaxed">
        <p>
          {isSq
            ? 'Kjo Politikë e Cookies shpjegon se si Velvante Solutions përdor cookies dhe teknologji të ngjashme për t\'ju njohur kur vizitoni faqen tonë të internetit, si dhe mënyrën se si mund t\'i menaxhoni këto preferenca.'
            : 'This Cookie Policy explains how Velvante Solutions uses cookies and similar technologies to recognize you when you visit our website.'}
        </p>

        <h2 className="text-xl font-bold text-[rgb(var(--color-text))]">
          {isSq ? '1. Cookies Thelbësore' : '1. Essential Cookies'}
        </h2>
        <p>
          {isSq
            ? 'Cookies thelbësore janë rreptësisht të nevojshme për funksionimin themelor të platformës, si mbajtja mend e preferencave të gjuhës (EN/SQ), siguria e formularëve dhe mbrojtja e sesioneve. Këto cookies nuk mund të çaktivizohen.'
            : 'Essential cookies are necessary for the website to function properly, including storing language preferences and secure session authentication.'}
        </p>

        <h2 className="text-xl font-bold text-[rgb(var(--color-text))]">
          {isSq ? '2. Cookies Analitike dhe të Performancës' : '2. Analytics Cookies'}
        </h2>
        <p>
          {isSq
            ? 'Cookies analitike na ndihmojnë të kuptojmë se si vizitorët bashkëveprojnë me përmbajtjen tonë duke mbledhur të dhëna anonime mbi shpejtësinë e faqeve, ngarkesën dhe gabimet teknike, gjë që na ndihmon të përmirësojmë pandërprerë performancën.'
            : 'Analytics cookies help us understand how visitors interact with our site by collecting anonymous traffic metrics, allowing us to continuously improve performance.'}
        </p>

        <h2 className="text-xl font-bold text-[rgb(var(--color-text))]">
          {isSq ? '3. Menaxhimi i Preferencave Tuaja' : '3. Managing Preferences'}
        </h2>
        <p>
          {isSq
            ? 'Ju mund t\'i përditësoni preferencat tuaja të cookies në çdo moment përmes shiritit tonë të njoftimeve për cookies në fund të faqes ose drejtpërdrejt përmes cilësimeve të shfletuesit tuaj.'
            : 'You can update your cookie preferences at any time using our on-site cookie banner or directly via your web browser settings.'}
        </p>
      </div>
    </div>
  );
}
