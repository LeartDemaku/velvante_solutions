'use client';

import { Star, Quote } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  quote: string;
}

interface TestimonialsGridProps {
  testimonials: TestimonialItem[];
}

export function TestimonialsGrid({ testimonials }: TestimonialsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 items-stretch">
      {testimonials.map((t) => (
        <div
          key={t.id}
          className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[rgb(var(--color-surface)/0.75)] backdrop-blur-xl border border-[rgb(var(--color-border)/0.8)] hover:border-[rgb(var(--color-accent)/0.5)] transition-all duration-300 shadow-sm hover:shadow-[0_16px_36px_rgba(99,102,241,0.12)] overflow-hidden"
        >
          <div className="absolute top-4 right-5 text-[rgb(var(--color-accent)/0.08)] group-hover:text-[rgb(var(--color-accent)/0.15)] transition-colors pointer-events-none">
            <Quote size={48} />
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: t.rating || 5 }).map((_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>

            <p className="text-sm sm:text-base text-[rgb(var(--color-text-muted))] italic leading-relaxed">
              &quot;{t.quote}&quot;
            </p>
          </div>

          <div className="pt-5 mt-6 border-t border-[rgb(var(--color-border-subtle))] flex items-center gap-3.5 relative z-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[rgb(var(--color-accent))] to-cyan-400 p-[1.5px] shrink-0">
              <div className="w-full h-full rounded-full bg-[rgb(var(--color-surface))] flex items-center justify-center font-bold text-xs text-[rgb(var(--color-text))]">
                {t.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-[rgb(var(--color-text))] group-hover:text-[rgb(var(--color-accent-light))] transition-colors">
                {t.name}
              </p>
              <p className="text-xs text-[rgb(var(--color-text-subtle))]">
                {t.role}, {t.company}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
