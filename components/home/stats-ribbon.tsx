'use client';

import { Award, Users, Zap, Globe2 } from 'lucide-react';

interface StatsRibbonProps {
  stats: {
    projects: { value: string; label: string };
    clients: { value: string; label: string };
    performance: { value: string; label: string };
    countries: { value: string; label: string };
  };
}

export function StatsRibbon({ stats }: StatsRibbonProps) {
  const items = [
    {
      value: stats.projects.value || '80+',
      label: stats.projects.label,
      icon: Award,
      color: 'from-indigo-500/20 to-indigo-500/5',
      iconColor: 'text-[rgb(var(--color-accent-light))]',
    },
    {
      value: stats.clients.value || '60+',
      label: stats.clients.label,
      icon: Users,
      color: 'from-sky-500/20 to-sky-500/5',
      iconColor: 'text-sky-400',
    },
    {
      value: stats.performance.value || '99%',
      label: stats.performance.label,
      icon: Zap,
      color: 'from-amber-500/20 to-amber-500/5',
      iconColor: 'text-amber-400',
    },
    {
      value: stats.countries.value || '12+',
      label: stats.countries.label,
      icon: Globe2,
      color: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="group relative p-4 sm:p-6 rounded-2xl bg-[rgb(var(--color-surface)/0.75)] backdrop-blur-xl border border-[rgb(var(--color-border)/0.8)] hover:border-[rgb(var(--color-accent)/0.4)] shadow-sm hover:shadow-[0_12px_32px_rgba(99,102,241,0.12)] transition-all overflow-hidden"
          >
            <div
              className={`absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br ${item.color} blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`}
            />

            <div className="relative z-10 flex flex-col justify-between h-full space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="p-2 sm:p-2.5 rounded-xl bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] group-hover:scale-110 transition-transform">
                  <Icon size={18} className={item.iconColor} />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-text-subtle))] px-2 py-0.5 rounded-full bg-[rgb(var(--color-background))]">
                  Verified
                </span>
              </div>

              <div>
                <p className="text-2xl sm:text-4xl font-black text-[rgb(var(--color-text))] tracking-tight font-mono">
                  {item.value}
                </p>
                <p className="text-xs sm:text-sm font-medium text-[rgb(var(--color-text-muted))] mt-1 leading-snug">
                  {item.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
