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
    title: isSq ? 'Kushtet e Shërbimit' : 'Terms of Service',
    description: isSq
      ? 'Kushtet ligjore dhe rregullat e përdorimit të platformës dhe shërbimeve dixhitale të Velvante Solutions.'
      : 'Terms and conditions governing the use of Velvante Solutions website and digital services.',
  };
}

export default async function TermsPage({
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
        {isSq ? 'Kushtet e Shërbimit' : 'Terms of Service'}
      </h1>
      <p className="text-xs font-mono text-[rgb(var(--color-text-subtle))]">
        {isSq ? 'Përditësuar së fundmi: Nëntor 2024' : 'Last updated: November 2024'}
      </p>

      <div className="prose prose-invert max-w-none text-[rgb(var(--color-text-muted))] space-y-6 text-sm leading-relaxed">
        <p>
          {isSq
            ? 'Duke vizituar ose përdorur faqen e internetit dhe shërbimet dixhitale të Velvante Solutions, ju pranoni të jeni të detyruar nga këto Kushte të Shërbimit dhe të veproni në përputhje me të gjitha ligjet në fuqi.'
            : 'By accessing or using the Velvante Solutions website and digital services, you agree to be bound by these Terms of Service.'}
        </p>

        <h2 className="text-xl font-bold text-[rgb(var(--color-text))]">
          {isSq ? '1. Shërbimet Dixhitale dhe Pronësia Intelektuale' : '1. Digital Services & Intellectual Property'}
        </h2>
        <p>
          {isSq
            ? 'E gjithë përmbajtja, identiteti i markës, kodi burimor, materialet vizuale dhe asetet e dizajnit të prodhuara nga Velvante Solutions mbeten pronë ekskluzive e jona derisa të transferohen zyrtarisht sipas kushteve të një kontrate specifike shërbimi me klientin.'
            : 'All content, branding, source code, and design assets produced by Velvante Solutions remain our property until transferred under a specific client service contract.'}
        </p>

        <h2 className="text-xl font-bold text-[rgb(var(--color-text))]">
          {isSq ? '2. Kufizimi i Përgjegjësisë' : '2. Limitation of Liability'}
        </h2>
        <p>
          {isSq
            ? 'Velvante Solutions ofron sisteme dixhitale me kontrolle rigoroze të cilësisë dhe performancës. Në asnjë rrethanë Velvante Solutions nuk mban përgjegjësi për dëme indirekte, të rastësishme apo rrjedhimore që rezultojnë nga aksesi ose pamundësia për të përdorur faqen.'
            : 'Velvante Solutions provides digital systems "as is" with strict quality control. In no event shall Velvante Solutions be liable for any indirect or consequential damages arising from site access.'}
        </p>

        <h2 className="text-xl font-bold text-[rgb(var(--color-text))]">
          {isSq ? '3. Angazhimet Kontraktuale dhe Bashkëpunimi' : '3. Client Engagements & Scope'}
        </h2>
        <p>
          {isSq
            ? 'Të gjitha marrëveshjet për zhvillim softueri të personalizuar, konsulencë teknike apo mirëmbajtje rregullohen në mënyrë të detajuar përmes kontratave individuale të punës dhe specifikimeve teknike të miratuara reciprokisht.'
            : 'All custom software development, technical consulting, and maintenance agreements are governed by individual client contracts and approved statements of work.'}
        </p>
      </div>
    </div>
  );
}
