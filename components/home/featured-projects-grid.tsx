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
            <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-[rgb(var(--color-surface-elevated))]">
              <img
                src={proj.coverImage}
                alt={proj.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-surface))] via-transparent to-black/30" />

              <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-white uppercase tracking-wider border border-white/10">
                  {proj.categoryName}
                </span>
              </div>

              <div className="absolute top-3.5 right-3.5">
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-zinc-300 border border-white/10">
                  {proj.year}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
              <div>
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

              <div className="pt-4 sm:pt-5 border-t border-[rgb(var(--color-border-subtle))] flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {proj.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-subtle))]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="w-8 h-8 rounded-full bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] flex items-center justify-center text-[rgb(var(--color-text-muted))] group-hover:text-white group-hover:bg-[rgb(var(--color-accent))] group-hover:border-[rgb(var(--color-accent))] transition-all">
                  <ArrowUpRight size={15} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
