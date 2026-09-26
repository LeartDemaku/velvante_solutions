'use client';

import { AlertCircle, ArrowUpRight, CheckCircle2, Smartphone, Gauge, Search, DollarSign, Layers } from 'lucide-react';

interface ProblemItem {
  title: string;
  description: string;
}

interface ProblemSolutionGridProps {
  problems: ProblemItem[];
  locale: string;
}

const problemIcons = [AlertCircle, Smartphone, Gauge, Search, DollarSign, Layers];

export function ProblemSolutionGrid({ problems, locale }: ProblemSolutionGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {problems.map((prob, idx) => {
        const Icon = problemIcons[idx] || AlertCircle;
        return (
          <div
            key={idx}
            className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[rgb(var(--color-surface)/0.75)] backdrop-blur-xl border border-[rgb(var(--color-border)/0.8)] hover:border-red-500/40 transition-all duration-300 shadow-sm hover:shadow-[0_12px_32px_rgba(239,68,68,0.12)] overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500/20 via-red-500/50 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center font-bold text-sm font-mono group-hover:scale-105 transition-transform">
                  0{idx + 1}
                </span>
                <span className="text-[11px] font-mono text-red-400/90 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                  {locale === 'sq' ? 'Humbje e Biznesit' : 'Business Bottleneck'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[rgb(var(--color-text))] group-hover:text-red-300 transition-colors">
                  {prob.title}
                </h3>
                <p className="text-sm text-[rgb(var(--color-text-muted))] leading-relaxed mt-2">
                  {prob.description}
                </p>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[rgb(var(--color-border-subtle))] flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                {locale === 'sq' ? 'Zgjidhja me Velvante' : 'Velvante Fix Available'}
              </span>
              <ArrowUpRight size={14} className="text-[rgb(var(--color-text-subtle))] group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
