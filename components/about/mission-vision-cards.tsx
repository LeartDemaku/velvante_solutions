'use client';

import { Target, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MissionVisionCardsProps {
  mission: {
    badge: string;
    headline: string;
    description: string;
  };
  vision: {
    badge: string;
    headline: string;
    description: string;
  };
  locale: string;
}

export function MissionVisionCards({ mission, vision, locale }: MissionVisionCardsProps) {
  const cards = [
    {
      icon: Target,
      badge: mission.badge,
      headline: mission.headline,
      description: mission.description,
      gradient: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
      accentColor: 'text-[rgb(var(--color-accent-light))]',
      tags: locale === 'sq' ? ['Integritet Teknik', 'Zero Kompromise', 'Qasje për të Gjithë'] : ['Technical Integrity', 'Zero Compromise', 'Accessible to All'],
    },
    {
      icon: Eye,
      badge: vision.badge,
      headline: vision.headline,
      description: vision.description,
      gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
      accentColor: 'text-cyan-400',
      tags: locale === 'sq' ? ['Standard Global', 'Shkallëzim Afatgjatë', 'Përparësi Inxhinierike'] : ['Global Standard', 'Long-term Scale', 'Engineering Excellence'],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="group relative flex flex-col justify-between p-6 sm:p-10 rounded-3xl bg-[rgb(var(--color-surface)/0.75)] backdrop-blur-xl border border-[rgb(var(--color-border)/0.8)] hover:border-[rgb(var(--color-accent)/0.5)] transition-all duration-300 shadow-sm hover:shadow-[0_16px_40px_rgba(99,102,241,0.15)] overflow-hidden h-full"
          >
            <div
              className={`absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br ${card.gradient} blur-3xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`}
            />

            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[rgb(var(--color-accent-light))] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="space-y-5 sm:space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] flex items-center justify-center group-hover:scale-110 group-hover:bg-[rgb(var(--color-accent))] group-hover:text-white transition-all duration-300 shadow-sm">
                  <Icon size={24} className={`${card.accentColor} group-hover:text-white transition-colors`} />
                </div>
                <Badge variant="accent" dot>
                  {card.badge}
                </Badge>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                <h2 className="text-xl sm:text-2xl font-black text-[rgb(var(--color-text))] group-hover:text-[rgb(var(--color-accent-light))] transition-colors leading-snug">
                  {card.headline}
                </h2>
                <p className="text-sm sm:text-base text-[rgb(var(--color-text-muted))] leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>

            <div className="pt-5 sm:pt-6 mt-6 sm:mt-8 border-t border-[rgb(var(--color-border-subtle))] flex flex-wrap gap-2 relative z-10">
              {card.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="text-xs font-mono px-3 py-1 rounded-full bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-subtle))] group-hover:text-[rgb(var(--color-text))] transition-colors"
                >
                  ✦ {tag}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
