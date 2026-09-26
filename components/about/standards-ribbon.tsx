'use client';

import { KeyRound, Zap, ShieldCheck, Clock } from 'lucide-react';

interface StandardsRibbonProps {
  locale: string;
}

export function StandardsRibbon({ locale }: StandardsRibbonProps) {
  const items = [
    {
      value: '100%',
      title: locale === 'sq' ? 'Pronësi e Plotë e Kodit' : '100% Code Ownership',
      subtitle: locale === 'sq' ? 'Pa vendor lock-in' : 'Zero vendor lock-in',
      icon: KeyRound,
      color: 'text-[rgb(var(--color-accent-light))]',
    },
    {
      value: '< 50ms',
      title: locale === 'sq' ? 'Latencë Ultra e Ulët' : 'Sub-50ms Edge Latency',
      subtitle: locale === 'sq' ? 'Optimizuar me SSR & Edge' : 'Edge SSR optimization',
      icon: Zap,
      color: 'text-amber-400',
    },
    {
      value: 'A+',
      title: locale === 'sq' ? 'Standard Sigurie Ndërkombëtar' : 'A+ Security Standard',
      subtitle: locale === 'sq' ? 'Mbrojtje e nivelit bankar' : 'Enterprise grade protection',
      icon: ShieldCheck,
      color: 'text-emerald-400',
    },
    {
      value: '24/7',
      title: locale === 'sq' ? 'Besueshmëri & Monitorim' : 'Uptime & Reliability',
      subtitle: locale === 'sq' ? '99.99% disponueshmëri' : '99.99% availability SLA',
      icon: Clock,
      color: 'text-sky-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="group relative p-4 sm:p-6 rounded-2xl bg-[rgb(var(--color-surface)/0.75)] backdrop-blur-xl border border-[rgb(var(--color-border)/0.8)] hover:border-[rgb(var(--color-accent)/0.4)] shadow-sm hover:shadow-[0_12px_32px_rgba(99,102,241,0.12)] transition-all overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="p-2 sm:p-2.5 rounded-xl bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] group-hover:scale-110 transition-transform">
                <Icon size={18} className={item.color} />
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>

            <div>
              <p className="text-xl sm:text-3xl font-black text-[rgb(var(--color-text))] font-mono tracking-tight">
                {item.value}
              </p>
              <p className="text-xs sm:text-sm font-bold text-[rgb(var(--color-text))] mt-1">
                {item.title}
              </p>
              <p className="text-[11px] sm:text-xs text-[rgb(var(--color-text-subtle))] mt-0.5 font-mono">
                {item.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
