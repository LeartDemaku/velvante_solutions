import { setRequestLocale } from 'next-intl/server';
import { getSiteSettings } from '@/lib/settings/service';
import { ContactView } from '@/components/contact/contact-view';

export const dynamic = 'force-dynamic';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSiteSettings();

  return <ContactView locale={locale} settings={settings} />;
}
