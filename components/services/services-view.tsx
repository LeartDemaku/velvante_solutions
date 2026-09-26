'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette, Code2, ShoppingCart, AppWindow, Layers,
  Server, Database, TrendingUp, Zap, Shield, Wrench, ArrowRight, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceItem {
  id: string;
  slug: string;
  icon: string;
  title: string;
  shortDesc: string;
  capabilities: string[];
}

interface ServicesViewProps {
  services: ServiceItem[];
  locale: string;
  learnMoreText: string;
  ctaHeadline: string;
  ctaSubheadline: string;
  ctaButtonText: string;
}

const iconMap: Record<string, React.ElementType> = {
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

export function ServicesView({
  services,
  locale,
  learnMoreText,
  ctaHeadline,
  ctaSubheadline,
  ctaButtonText,
}: ServicesViewProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'dev' | 'design' | 'infra'>('all');

  const filters = [
    { id: 'all' as const, label: locale === 'sq' ? 'Të Gjitha Shërbimet' : 'All Services' },
    { id: 'dev' as const, label: locale === 'sq' ? 'Zhvillim & Web' : 'Development & Web' },
    { id: 'design' as const, label: locale === 'sq' ? 'Dizajn & UI/UX' : 'Design & UI/UX' },
    { id: 'infra' as const, label: locale === 'sq' ? 'Infrastrukturë & Siguri' : 'Infrastructure & Security' },
  ];

  const devSlugs = ['fullstack-development', 'web-applications', 'ecommerce', 'backend-apis'];
  const designSlugs = ['web-design', 'ui-ux-design'];
  const infraSlugs = ['database-infrastructure', 'seo-performance', 'ai-automation', 'security', 'maintenance-support'];

  const filteredServices = services.filter((s) => {
    if (activeFilter === 'dev') return devSlugs.includes(s.slug);
    if (activeFilter === 'design') return designSlugs.includes(s.slug);
    if (activeFilter === 'infra') return infraSlugs.includes(s.slug);
    return true;
  });

  return (
    <div className="space-y-14">
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeFilter === f.id
                ? 'bg-[rgb(var(--color-accent))] text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]'
                : 'bg-[rgb(var(--color-surface)/0.7)] text-[rgb(var(--color-text-muted))] border border-[rgb(var(--color-border)/0.8)] hover:text-[rgb(var(--color-text))] hover:border-[rgb(var(--color-accent)/0.4)]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
      >
        <AnimatePresence mode="popLayout">
          {filteredServices.map((svc, idx) => {
            const IconComp = iconMap[svc.icon] || Code2;
            return (
              <motion.div
                key={svc.id}
                layout
                initial={false}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
              >
                <Link
                  href={`/${locale}/services/${svc.slug}`}
                  className="group relative flex flex-col justify-between h-full p-8 rounded-3xl bg-[rgb(var(--color-surface)/0.65)] backdrop-blur-xl border border-[rgb(var(--color-border)/0.8)] hover:border-[rgb(var(--color-accent)/0.5)] transition-all duration-300 shadow-sm hover:shadow-[0_16px_40px_rgba(99,102,241,0.15)] hover:-translate-y-1.5 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[rgb(var(--color-accent-light))] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-accent-light))] flex items-center justify-center group-hover:bg-[rgb(var(--color-accent))] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                        <IconComp size={26} />
                      </div>
                      <span className="text-xs font-mono text-[rgb(var(--color-text-subtle))] bg-[rgb(var(--color-background))] px-3 py-1 rounded-full border border-[rgb(var(--color-border-subtle))]">
                        0{idx + 1}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-xl sm:text-2xl font-bold text-[rgb(var(--color-text))] group-hover:text-[rgb(var(--color-accent-light))] transition-colors">
                        {svc.title}
                      </h2>
                      <p className="text-sm text-[rgb(var(--color-text-muted))] leading-relaxed line-clamp-3">
                        {svc.shortDesc}
                      </p>
                    </div>

                    {svc.capabilities.length > 0 && (
                      <div className="pt-4 border-t border-[rgb(var(--color-border-subtle))] space-y-2">
                        <p className="text-[11px] uppercase tracking-wider font-mono text-[rgb(var(--color-text-subtle))]">
                          {locale === 'sq' ? 'Kapacitetet Inxhinierike' : 'Core Capabilities'}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {svc.capabilities.slice(0, 3).map((cap) => (
                            <span
                              key={cap}
                              className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-text))] transition-colors"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 mt-6 border-t border-[rgb(var(--color-border-subtle))] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[rgb(var(--color-accent-light))] flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      {learnMoreText}
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[rgb(var(--color-border))] group-hover:bg-[rgb(var(--color-accent-light))] transition-colors" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[rgb(var(--color-surface))] via-[rgb(var(--color-surface-elevated))] to-[rgb(var(--color-surface))] border border-[rgb(var(--color-accent)/0.35)] text-center space-y-6 overflow-hidden shadow-2xl glow-accent">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-[rgb(var(--color-accent)/0.2)] rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-black text-[rgb(var(--color-text))] tracking-tight">
            {ctaHeadline}
          </h3>
          <p className="text-sm sm:text-base text-[rgb(var(--color-text-muted))] leading-relaxed">
            {ctaSubheadline}
          </p>
        </div>

        <div className="relative z-10 pt-2 flex justify-center">
          <Button
            as="a"
            href={`/${locale}/start-project`}
            size="lg"
            rightIcon={<ArrowRight size={18} />}
            className="shadow-[0_0_24px_rgba(99,102,241,0.4)] hover:shadow-[0_0_36px_rgba(99,102,241,0.6)] transition-shadow"
          >
            {ctaButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
