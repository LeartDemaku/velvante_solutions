'use client';

import { Target, Sparkles, Eye, Gauge, ShieldCheck, HeartHandshake } from 'lucide-react';

interface ValueItem {
  title: string;
  description: string;
}

interface ValuesGridProps {
  values: ValueItem[];
  locale: string;
}

const valueIcons = [Target, Sparkles, Eye, Gauge, ShieldCheck, HeartHandshake];

export function ValuesGrid({ values, locale }: ValuesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 items-stretch">
      {values.map((val, idx) => {
        const Icon = valueIcons[idx] || ShieldCheck;
        return (
          <div
            key={idx}
            className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[rgb(var(--color-surface)/0.75)] backdrop-blur-xl border border-[rgb(var(--color-border)/0.8)] hover:border-[rgb(var(--color-accent)/0.5)] transition-all duration-300 shadow-sm hover:shadow-[0_16px_36px_rgba(99,102,241,0.12)] overflow-hidden h-full"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[rgb(var(--color-accent-light))] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between">
                <span className="p-3 sm:p-3.5 rounded-2xl bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-accent-light))] group-hover:bg-[rgb(var(--color-accent))] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <Icon size={20} />
                </span>
                <span className="text-xs sm:text-sm font-mono text-[rgb(var(--color-text-subtle))] bg-[rgb(var(--color-background))] px-3 py-1 rounded-full border border-[rgb(var(--color-border-subtle))]">
                  0{idx + 1}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-[rgb(var(--color-text))] group-hover:text-[rgb(var(--color-accent-light))] transition-colors">
                  {val.title}
                </h3>
                <p className="text-sm text-[rgb(var(--color-text-muted))] leading-relaxed">
                  {val.description}
                </p>
              </div>
            </div>

            <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-[rgb(var(--color-border-subtle))] flex items-center justify-between text-xs font-mono text-[rgb(var(--color-text-subtle))]">
              <span>{locale === 'sq' ? 'Parim Themelor' : 'Core Principle'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-150 transition-transform" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
