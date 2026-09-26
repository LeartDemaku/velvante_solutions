'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  Menu, X, ChevronDown, ArrowRight,
  Code2, Palette, ShoppingCart, AppWindow,
  Layers, Server, Database, TrendingUp,
  Zap, Shield, Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoIcon } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

const serviceIcons: Record<string, React.ElementType> = {
  webDesign: Palette,
  fullstack: Code2,
  ecommerce: ShoppingCart,
  webApps: AppWindow,
  uiUx: Layers,
  backend: Server,
  database: Database,
  seo: TrendingUp,
  ai: Zap,
  security: Shield,
  maintenance: Wrench,
};

const serviceSlugMap: Record<string, string> = {
  webDesign: 'web-design',
  fullstack: 'fullstack-development',
  ecommerce: 'ecommerce',
  webApps: 'web-applications',
  uiUx: 'ui-ux-design',
  backend: 'backend-apis',
  database: 'database-infrastructure',
  seo: 'seo-performance',
  ai: 'ai-automation',
  security: 'security',
  maintenance: 'maintenance-support',
};

function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const segments = pathname.split('/');
    segments[1] = locale === 'en' ? 'sq' : 'en';
    router.prefetch(segments.join('/'));
  }, [pathname, locale, router]);

  function switchLocale(newLocale: string) {
    if (newLocale === locale) return;
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const targetPath = segments.join('/');
    router.prefetch(targetPath);
    router.push(targetPath);
  }

  return (
    <div className={cn('inline-flex items-center rounded-[var(--radius-sm)] border border-[rgb(var(--color-border))] p-0.5 bg-[rgb(var(--color-surface))]', mobile ? 'text-xs' : 'text-xs')}>
      <button
        type="button"
        onClick={() => switchLocale('en')}
        className={cn(
          'px-2.5 py-1 min-w-[34px] min-h-[34px] rounded-[var(--radius-xs)] font-semibold transition-colors cursor-pointer touch-manipulation flex items-center justify-center',
          locale === 'en'
            ? 'bg-[rgb(var(--color-accent))] text-white shadow-sm'
            : 'text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]'
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchLocale('sq')}
        className={cn(
          'px-2.5 py-1 min-w-[34px] min-h-[34px] rounded-[var(--radius-xs)] font-semibold transition-colors cursor-pointer touch-manipulation flex items-center justify-center',
          locale === 'sq'
            ? 'bg-[rgb(var(--color-accent))] text-white shadow-sm'
            : 'text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]'
        )}
      >
        SQ
      </button>
    </div>
  );
}

export function Navbar() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const servicesMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 15);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setServicesOpen(false);
        setMobileServicesOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const navLinks = [
    { label: t('home'), href: `/${locale}` },
    { label: t('about'), href: `/${locale}/about` },
    { label: t('services'), href: `/${locale}/services`, hasDropdown: true },
    { label: t('projects'), href: `/${locale}/projects` },
    { label: t('blog'), href: `/${locale}/blog` },
    { label: t('contact'), href: `/${locale}/contact` },
  ];

  const isActive = useCallback((href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}`;
    return pathname.startsWith(href);
  }, [pathname, locale]);

  const serviceKeys = Object.keys(serviceIcons) as (keyof typeof serviceIcons)[];

  const handleMobileNavClick = useCallback((href: string) => {
    setMobileOpen(false);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-[rgb(var(--color-background)/0.95)] backdrop-blur-md border-b border-[rgb(var(--color-border))] shadow-[var(--shadow-sm)]'
            : 'bg-[rgb(var(--color-background)/0.8)] backdrop-blur-sm'
        )}
      >
        <nav className="container-velvante flex items-center justify-between h-16 sm:h-18" aria-label="Main navigation">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-accent))] rounded-sm"
            aria-label="Velvante Solutions — home"
          >
            <LogoIcon size={46} />
            <span className="font-black text-lg sm:text-xl tracking-[-0.04em] text-[rgb(var(--color-text))] whitespace-nowrap">
              Velvante Solutions
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div key={link.href} className="relative" ref={servicesMenuRef}>
                  <button
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)]',
                      'transition-colors duration-150',
                      isActive(link.href)
                        ? 'text-[rgb(var(--color-text))]'
                        : 'text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]'
                    )}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    onMouseEnter={() => setServicesOpen(true)}
                    onClick={() => setServicesOpen((v) => !v)}
                  >
                    {link.label}
                    <ChevronDown
                      size={13}
                      className={cn('transition-transform duration-200', servicesOpen && 'rotate-180')}
                    />
                  </button>

                  {servicesOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[680px] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] p-6"
                      onMouseLeave={() => setServicesOpen(false)}
                    >
                      <div className="mb-4">
                        <p className="text-xs font-medium text-[rgb(var(--color-text-muted))] uppercase tracking-widest">
                          {t('servicesMenu.title')}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {serviceKeys.map((key) => {
                          const Icon = serviceIcons[key] || Code2;
                          const slug = serviceSlugMap[key];
                          return (
                            <Link
                              key={key}
                              href={`/${locale}/services/${slug}`}
                              className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[rgb(var(--color-surface-elevated))] transition-colors group/service"
                              onClick={() => setServicesOpen(false)}
                            >
                              <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[rgb(var(--color-accent)/0.1)] flex items-center justify-center shrink-0 group-hover/service:bg-[rgb(var(--color-accent)/0.2)] transition-colors">
                                <Icon size={14} className="text-[rgb(var(--color-accent-light))]" />
                              </div>
                              <span className="text-xs font-medium text-[rgb(var(--color-text-muted))] group-hover/service:text-[rgb(var(--color-text))] transition-colors">
                                {t(`servicesMenu.${key}` as any)}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                      <div className="mt-4 pt-4 border-t border-[rgb(var(--color-border))]">
                        <Link
                          href={`/${locale}/services`}
                          className="flex items-center gap-2 text-xs font-medium text-[rgb(var(--color-accent-light))] hover:gap-3 transition-all"
                          onClick={() => setServicesOpen(false)}
                        >
                          {locale === 'sq' ? 'Shiko të gjitha shërbimet' : 'View all services'} <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)] transition-colors duration-150',
                    isActive(link.href)
                      ? 'text-[rgb(var(--color-text))]'
                      : 'text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]'
                  )}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <Button
              as="a"
              href={`/${locale}/start-project`}
              size="sm"
              rightIcon={<ArrowRight size={14} />}
            >
              {t('startProject')}
            </Button>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher mobile />
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-surface-elevated))] transition-colors cursor-pointer touch-manipulation active:scale-95"
              aria-label={mobileOpen ? t('close') : t('menu')}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden transition-opacity duration-300 ease-in-out',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        className={cn(
          'fixed top-0 right-0 bottom-0 z-[60] w-[88vw] max-w-sm bg-[rgb(var(--color-surface))] border-l border-[rgb(var(--color-border))] flex flex-col lg:hidden shadow-2xl transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        )}
        role="dialog"
        aria-modal="true"
        aria-label={locale === 'sq' ? 'Menuja celulare e navigimit' : 'Mobile navigation menu'}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[rgb(var(--color-border))]">
          <Link
            href={`/${locale}`}
            onClick={() => handleMobileNavClick(`/${locale}`)}
            className="flex items-center gap-2.5 font-black text-lg tracking-[-0.04em] text-[rgb(var(--color-text))]"
          >
            <LogoIcon size={42} />
            <span>Velvante Solutions</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher mobile />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-border))] transition-colors cursor-pointer touch-manipulation active:scale-95"
              aria-label={t('close')}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5" aria-label={locale === 'sq' ? 'Navigimi celular' : 'Mobile navigation'}>
          <ul className="space-y-1.5" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                {link.hasDropdown ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between rounded-xl bg-[rgb(var(--color-surface-elevated)/0.5)] border border-[rgb(var(--color-border)/0.5)]">
                      <Link
                        href={link.href}
                        onClick={() => handleMobileNavClick(link.href)}
                        className={cn(
                          'flex-1 px-4 py-3.5 text-base font-semibold transition-colors cursor-pointer touch-manipulation',
                          isActive(link.href)
                            ? 'text-[rgb(var(--color-accent-light))] font-bold'
                            : 'text-[rgb(var(--color-text))]'
                        )}
                      >
                        {link.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setMobileServicesOpen((v) => !v)}
                        className="p-3.5 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] cursor-pointer touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center"
                        aria-label={locale === 'sq' ? 'Hap listën e shërbimeve' : 'Toggle services list'}
                      >
                        <ChevronDown
                          size={18}
                          className={cn('transition-transform duration-200', mobileServicesOpen && 'rotate-180')}
                        />
                      </button>
                    </div>

                    {mobileServicesOpen && (
                      <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-[rgb(var(--color-accent)/0.4)] ml-2">
                        {serviceKeys.map((key) => {
                          const Icon = serviceIcons[key] || Code2;
                          const slug = serviceSlugMap[key];
                          return (
                            <Link
                              key={key}
                              href={`/${locale}/services/${slug}`}
                              onClick={() => handleMobileNavClick(`/${locale}/services/${slug}`)}
                              className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] rounded-lg hover:bg-[rgb(var(--color-surface-elevated))] cursor-pointer touch-manipulation"
                            >
                              <Icon size={16} className="text-[rgb(var(--color-accent-light))] shrink-0" />
                              <span className="truncate">{t(`servicesMenu.${key}` as any)}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => handleMobileNavClick(link.href)}
                    className={cn(
                      'flex items-center px-4 py-3.5 text-base font-semibold rounded-xl transition-colors cursor-pointer touch-manipulation border border-transparent',
                      isActive(link.href)
                        ? 'bg-[rgb(var(--color-accent)/0.15)] text-[rgb(var(--color-accent-light))] border-[rgb(var(--color-accent)/0.3)]'
                        : 'bg-[rgb(var(--color-surface-elevated)/0.5)] text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-surface-elevated))]'
                    )}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 sm:p-5 border-t border-[rgb(var(--color-border))] space-y-3">
          <Button
            as="a"
            href={`/${locale}/start-project`}
            fullWidth
            size="lg"
            rightIcon={<ArrowRight size={16} />}
            onClick={() => handleMobileNavClick(`/${locale}/start-project`)}
          >
            {t('startProject')}
          </Button>
        </div>
      </div>
    </>
  );
}
