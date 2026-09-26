import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/lib/i18n/routing';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CookieBanner } from '@/components/layout/cookie-banner';
import { BackToTop } from '@/components/layout/back-to-top';
import { ToastProvider } from '@/components/ui/toast';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isSq = locale === 'sq';

  return {
    title: {
      default: isSq
        ? 'Velvante Solutions — Përvoja Dixhitale dhe Zgjidhje Full-Stack'
        : 'Velvante Solutions — Digital Experiences & Full-Stack Solutions',
      template: '%s | Velvante Solutions',
    },
    description: isSq
      ? 'Ne ndërtojmë sisteme dixhitale me performancë të lartë që lëvizin bizneset përpara.'
      : 'We build high-performance websites, web applications, and digital systems that move businesses forward.',
    keywords: [
      'Web Development',
      'Software Engineering',
      'Next.js',
      'UI/UX Design',
      'E-Commerce',
      'Full-Stack',
      'Technical SEO',
      'Kosovo',
      'Europe',
    ],
    authors: [{ name: 'Velvante Solutions' }],
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        sq: '/sq',
      },
    },
    openGraph: {
      type: 'website',
      locale: isSq ? 'sq_AL' : 'en_US',
      url: `/${locale}`,
      siteName: 'Velvante Solutions',
      title: isSq
        ? 'Velvante Solutions — Përvoja Dixhitale dhe Zgjidhje Full-Stack'
        : 'Velvante Solutions — Digital Experiences & Full-Stack Solutions',
      description: isSq
        ? 'Ne ndërtojmë sisteme dixhitale me performancë të lartë që lëvizin bizneset përpara.'
        : 'We build digital systems that move businesses forward.',
      images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Velvante Solutions' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Velvante Solutions',
      description: isSq
        ? 'Përvoja Dixhitale dhe Zgjidhje Full-Stack'
        : 'Digital Experiences & Full-Stack Solutions',
      creator: '@velvante',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
      },
    },
    icons: {
      icon: [
        { url: '/icon.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon.ico' },
      ],
      apple: [
        { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="bg-[rgb(var(--color-background))] text-[rgb(var(--color-text))] font-sans antialiased min-h-screen flex flex-col selection:bg-[rgb(var(--color-accent)/0.3)]" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CookieBanner />
            <BackToTop />
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
