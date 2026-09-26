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
    title: isSq ? 'Politika e Privatësisë' : 'Privacy Policy',
    description: isSq
      ? 'Mësoni se si Velvante Solutions mbron dhe menaxhon të dhënat tuaja personale me siguri të plotë.'
      : 'Learn how Velvante Solutions collects, protects, and handles your personal information.',
  };
}

export default async function PrivacyPolicyPage({
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
        {isSq ? 'Politika e Privatësisë' : 'Privacy Policy'}
      </h1>
      <p className="text-xs font-mono text-[rgb(var(--color-text-subtle))]">
        {isSq ? 'Përditësuar së fundmi: Nëntor 2024' : 'Last updated: November 2024'}
      </p>

      <div className="prose prose-invert max-w-none text-[rgb(var(--color-text-muted))] space-y-6 text-sm leading-relaxed">
        <p>
          {isSq
            ? 'Në Velvante Solutions, ne e trajtojmë me seriozitet maksimal privatësinë dhe mbrojtjen e të dhënave tuaja personale. Kjo Politikë e Privatësisë përshkruan mënyrën se si ne mbledhim, përdorim dhe mbrojmë informacionin tuaj kur vizitoni faqen tonë të internetit ose ndërveproni me shërbimet tona dixhitale.'
            : 'At Velvante Solutions, we take privacy and data protection seriously. This Privacy Policy describes how we collect, use, and protect your personal information when you visit our website or interact with our services.'}
        </p>

        <h2 className="text-xl font-bold text-[rgb(var(--color-text))]">
          {isSq ? '1. Informacioni që Mbledhim' : '1. Information We Collect'}
        </h2>
        <p>
          {isSq
            ? 'Ne mbledhim informacionin që ju na jepni drejtpërdrejt kur plotësoni formularët e kontaktit, abonoheni në buletinin tonë informativ ose paraqisni kërkesa për projekte. Kjo mund të përfshijë emrin tuaj, adresën e emailit, numrin e telefonit, emrin e kompanisë dhe kërkesat specifike të projektit tuaj.'
            : 'We collect information that you provide directly to us when filling out contact forms, subscribing to newsletters, or submitting project inquiries. This may include your name, email address, phone number, company name, and project requirements.'}
        </p>

        <h2 className="text-xl font-bold text-[rgb(var(--color-text))]">
          {isSq ? '2. Si e Përdorim Informacionin Tuaj' : '2. How We Use Your Information'}
        </h2>
        <p>
          {isSq
            ? 'Ne i përdorim të dhënat tuaja vetëm për t\'iu përgjigjur kërkesave tuaja, për të ofruar shërbimet e dakorduara, për të dërguar njoftime dhe përditësime teknike, si dhe për të optimizuar platformat tona dixhitale. Ne nuk i shesim dhe nuk ua japim me qira të dhënat tuaja palëve të treta në asnjë rrethanë.'
            : 'We use your information solely to respond to your inquiries, deliver agreed services, provide technical updates, and improve our digital platforms. We do not sell or rent personal data to third parties.'}
        </p>

        <h2 className="text-xl font-bold text-[rgb(var(--color-text))]">
          {isSq ? '3. Siguria e të Dhënave' : '3. Data Security'}
        </h2>
        <p>
          {isSq
            ? 'Ne zbatojmë standardet më të rrepta teknike dhe organizative të industrisë për sigurinë, duke përfshirë enkriptimin e avancuar të të dhënave gjatë transmetimit dhe ruajtjes, kontrolle të rrepta qasjeje dhe auditime të vazhdueshme të infrastrukturës.'
            : 'We implement industry-standard technical and organizational security measures, including data encryption in transit and at rest, strict access controls, and regular audits.'}
        </p>

        <h2 className="text-xl font-bold text-[rgb(var(--color-text))]">
          {isSq ? '4. Të Drejtat Tuaja dhe Kontakti' : '4. Your Rights & Contact'}
        </h2>
        <p>
          {isSq
            ? 'Ju gëzoni të drejtën ligjore për të kërkuar qasje, korrigjim ose fshirje të të dhënave tuaja personale në çdo moment. Për çdo pyetje apo kërkesë që lidhet me privatësinë, mund të na kontaktoni drejtpërdrejt në velvantesolutions@outlook.com.'
            : 'You have the right to access, rectify, or request deletion of your personal data at any time. For any privacy-related inquiries, contact us directly at velvantesolutions@outlook.com.'}
        </p>
      </div>
    </div>
  );
}
