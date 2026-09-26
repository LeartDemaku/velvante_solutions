'use client';

import { ShieldCheck, Zap, Eye, HeartHandshake, BarChart3, KeyRound } from 'lucide-react';

interface WhyReason {
  title: string;
  description: string;
}

interface WhyUsGridProps {
  reasons: WhyReason[];
  locale: string;
}

const whyIcons = [ShieldCheck, Zap, Eye, HeartHandshake, BarChart3, KeyRound];

export function WhyUsGrid({ reasons, locale }: WhyUsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 items-stretch">
      {reasons.map((reason, idx) => {
        const Icon = whyIcons[idx] || ShieldCheck;
        return (
          <div
            key={idx}
            className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[rgb(var(--color-surface)/0.75)] backdrop-blur-xl border border-[rgb(var(--color-border)/0.8)] hover:border-[rgb(var(--color-accent)/0.5)] transition-all duration-300 shadow-sm hover:shadow-[0_12px_32px_rgba(99,102,241,0.12)] overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[rgb(var(--color-accent-light))] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="p-3 rounded-xl bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-accent-light))] group-hover:scale-110 group-hover:bg-[rgb(var(--color-accent))] group-hover:text-white transition-all duration-300 shadow-sm">
                  <Icon size={20} />
                </span>
                <span className="text-[11px] font-mono text-[rgb(var(--color-text-subtle))] bg-[rgb(var(--color-background))] px-2.5 py-1 rounded-full border border-[rgb(var(--color-border-subtle))]">
                  0{idx + 1}
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[rgb(var(--color-text))] group-hover:text-[rgb(var(--color-accent-light))] transition-colors">
                  {reason.title}
                </h3>
                <p className="text-sm text-[rgb(var(--color-text-muted))] leading-relaxed mt-2.5">
                  {reason.description}
                </p>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[rgb(var(--color-border-subtle))] flex items-center justify-between text-[11px] font-mono text-[rgb(var(--color-text-subtle))]">
              <span>{locale === 'sq' ? 'Standart Velvante' : 'Velvante Standard'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-150 transition-transform" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
