'use client';

import Link from 'next/link';
import {
  Palette, Code2, ShoppingCart, AppWindow, Layers, Server,
  Database, TrendingUp, Zap, Shield, Wrench, ArrowRight
} from 'lucide-react';

interface ServiceItem {
  id: string;
  slug: string;
  icon: string;
  title: string;
  shortDesc: string;
}

interface ServicesGridProps {
  services: ServiceItem[];
  locale: string;
  learnMoreText: string;
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

export function ServicesGrid({ services, locale, learnMoreText }: ServicesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 items-stretch">
      {services.map((svc, idx) => {
        const IconComp = iconMap[svc.icon] || Code2;
        return (
          <div key={svc.id} className="h-full flex flex-col">
            <Link
              href={`/${locale}/services/${svc.slug}`}
              className="group relative flex flex-col justify-between h-full p-6 sm:p-7 rounded-2xl bg-[rgb(var(--color-surface)/0.75)] backdrop-blur-xl border border-[rgb(var(--color-border)/0.8)] hover:border-[rgb(var(--color-accent)/0.5)] transition-all duration-300 shadow-sm hover:shadow-[0_16px_36px_rgba(99,102,241,0.15)] hover:-translate-y-1.5 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[rgb(var(--color-accent-light))] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-accent-light))] flex items-center justify-center group-hover:bg-[rgb(var(--color-accent))] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                    <IconComp size={24} />
                  </div>
                  <span className="text-[11px] font-mono text-[rgb(var(--color-text-subtle))] bg-[rgb(var(--color-background))] px-2.5 py-1 rounded-full border border-[rgb(var(--color-border-subtle))]">
                    0{idx + 1}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-[rgb(var(--color-text))] group-hover:text-[rgb(var(--color-accent-light))] transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-[rgb(var(--color-text-muted))] leading-relaxed line-clamp-3">
                    {svc.shortDesc}
                  </p>
                </div>
              </div>

              <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-[rgb(var(--color-border-subtle))] flex items-center justify-between">
                <span className="text-xs font-semibold text-[rgb(var(--color-accent-light))] flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                  {learnMoreText}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
                <span className="w-2 h-2 rounded-full bg-[rgb(var(--color-border))] group-hover:bg-[rgb(var(--color-accent-light))] transition-colors" />
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
