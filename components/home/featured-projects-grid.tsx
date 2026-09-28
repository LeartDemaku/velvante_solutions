'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface ProjectItem {
  id: string;
  slug: string;
  coverImage: string;
  technologies: string[];
  year: number;
  title: string;
  tagline: string;
  client: string;
  categoryName: string;
}

interface FeaturedProjectsGridProps {
  projects: ProjectItem[];
  locale: string;
}

export function FeaturedProjectsGrid({ projects, locale }: FeaturedProjectsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 items-stretch">
      {projects.map((proj) => (
        <div key={proj.id} className="h-full flex flex-col">
          <Link
            href={`/${locale}/projects/${proj.slug}`}
            className="group relative flex flex-col justify-between h-full rounded-2xl bg-[rgb(var(--color-surface)/0.75)] backdrop-blur-xl border border-[rgb(var(--color-border)/0.8)] hover:border-[rgb(var(--color-accent)/0.5)] transition-all duration-300 shadow-sm hover:shadow-[0_16px_36px_rgba(99,102,241,0.15)] hover:-translate-y-1.5 overflow-hidden"
          >
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-zinc-950/80 border-b border-[rgb(var(--color-border))] flex items-center justify-center p-2.5 sm:p-3">
              <div
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 pointer-events-none scale-110"
                style={{ backgroundImage: `url(${proj.coverImage})` }}
              />
              <img
                src={proj.coverImage}
                alt={proj.title}
                className="relative z-10 w-full h-full object-contain rounded-xl transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>

            <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-[rgb(var(--color-accent)/0.12)] text-[rgb(var(--color-accent-light))] border border-[rgb(var(--color-accent)/0.25)] px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {proj.categoryName}
                  </span>
                  <span className="text-[11px] font-mono text-[rgb(var(--color-text-subtle))] bg-[rgb(var(--color-surface-elevated))] px-2.5 py-0.5 rounded-md border border-[rgb(var(--color-border)/0.5)]">
                    {proj.year}
                  </span>
                </div>
                <p className="text-xs font-mono text-[rgb(var(--color-accent-light))] uppercase tracking-wider">
                  {proj.client}
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-[rgb(var(--color-text))] group-hover:text-[rgb(var(--color-accent-light))] transition-colors mt-1">
                  {proj.title}
                </h3>
                <p className="text-sm text-[rgb(var(--color-text-muted))] mt-2 line-clamp-2 leading-relaxed">
                  {proj.tagline}
                </p>
              </div>

              <div className="pt-4 sm:pt-5 border-t border-[rgb(var(--color-border-subtle))] flex items-center justify-between gap-5">
                <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
                  {proj.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-subtle))] break-words"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="w-9 h-9 shrink-0 ml-auto rounded-full bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] flex items-center justify-center text-[rgb(var(--color-text-muted))] group-hover:text-white group-hover:bg-[rgb(var(--color-accent))] group-hover:border-[rgb(var(--color-accent))] group-hover:scale-110 transition-all shadow-sm">
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
