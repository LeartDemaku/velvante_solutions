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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
      {projects.map((proj) => (
        <div key={proj.id}>
          <Link
            href={`/${locale}/projects/${proj.slug}`}
            className="group relative flex flex-col rounded-2xl overflow-hidden bg-[rgb(var(--color-surface)/0.6)] border border-[rgb(var(--color-border)/0.7)] hover:border-[rgb(var(--color-accent)/0.6)] transition-all duration-500 shadow-lg hover:shadow-[0_20px_60px_rgba(99,102,241,0.18)] hover:-translate-y-2"
          >
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-zinc-950">
              <div
                className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-25 pointer-events-none"
                style={{ backgroundImage: `url(${proj.coverImage})` }}
              />
              <img
                src={proj.coverImage}
                alt={proj.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-[rgb(var(--color-accent)/0.0)] group-hover:bg-[rgb(var(--color-accent)/0.08)] transition-colors duration-500" />

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="bg-black/50 backdrop-blur-md text-[rgb(var(--color-accent-light))] border border-[rgb(var(--color-accent)/0.3)] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {proj.categoryName}
                </span>
                <span className="bg-black/50 backdrop-blur-md text-white/70 border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-mono">
                  {proj.year}
                </span>
              </div>

              <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-[rgb(var(--color-accent))] group-hover:border-[rgb(var(--color-accent))] group-hover:scale-110 transition-all duration-300 shadow-lg">
                <ArrowUpRight size={16} />
              </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col gap-2.5">
              <div>
                <p className="text-[10px] font-mono text-[rgb(var(--color-accent-light))] uppercase tracking-widest mb-1">
                  {proj.client}
                </p>
                <h3 className="text-base sm:text-lg font-bold text-[rgb(var(--color-text))] group-hover:text-[rgb(var(--color-accent-light))] transition-colors leading-tight line-clamp-2">
                  {proj.title}
                </h3>
                <p className="text-xs text-[rgb(var(--color-text-muted))] mt-1 line-clamp-2 leading-relaxed">
                  {proj.tagline}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[rgb(var(--color-border)/0.5)]">
                {proj.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-subtle))]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
