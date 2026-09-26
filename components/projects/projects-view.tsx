'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface ProjectsViewProps {
  projects: ProjectItem[];
  locale: string;
}

export function ProjectsView({ projects, locale }: ProjectsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(projects.map((p) => p.categoryName)))];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter((p) => p.categoryName === selectedCategory);

  return (
    <div className="space-y-14">
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[rgb(var(--color-accent))] text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]'
                  : 'bg-[rgb(var(--color-surface)/0.7)] text-[rgb(var(--color-text-muted))] border border-[rgb(var(--color-border)/0.8)] hover:text-[rgb(var(--color-text))] hover:border-[rgb(var(--color-accent)/0.4)]'
              }`}
            >
              {cat === 'all' ? (locale === 'sq' ? 'Të Gjitha Projektet' : 'All Projects') : cat}
            </button>
          ))}
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-[rgb(var(--color-surface)/0.5)] border border-[rgb(var(--color-border))]">
          <FolderKanban size={40} className="text-[rgb(var(--color-text-subtle))] mx-auto mb-3" />
          <p className="text-[rgb(var(--color-text-muted))]">
            {locale === 'sq' ? 'Nuk u gjet asnjë projekt në këtë kategori.' : 'No projects found in this category.'}
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                layout
                initial={false}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
              >
                <Link
                  href={`/${locale}/projects/${proj.slug}`}
                  className="group relative flex flex-col justify-between h-full rounded-3xl bg-[rgb(var(--color-surface)/0.65)] backdrop-blur-xl border border-[rgb(var(--color-border)/0.8)] hover:border-[rgb(var(--color-accent)/0.5)] transition-all duration-300 shadow-sm hover:shadow-[0_16px_40px_rgba(99,102,241,0.15)] hover:-translate-y-1.5 overflow-hidden"
                >
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[rgb(var(--color-surface-elevated))]">
                    <img
                      src={proj.coverImage}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-surface))] via-transparent to-black/30" />

                    <div className="absolute top-4 left-4">
                      <span className="bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-semibold text-white uppercase tracking-wider border border-white/10">
                        {proj.categoryName}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4">
                      <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-zinc-300 border border-white/10">
                        {proj.year}
                      </span>
                    </div>
                  </div>

                  <div className="p-7 flex-1 flex flex-col justify-between space-y-6">
                    <div>
                      <p className="text-xs font-mono text-[rgb(var(--color-accent-light))] uppercase tracking-wider">
                        {proj.client}
                      </p>
                      <h2 className="text-xl sm:text-2xl font-bold text-[rgb(var(--color-text))] group-hover:text-[rgb(var(--color-accent-light))] transition-colors mt-1">
                        {proj.title}
                      </h2>
                      <p className="text-sm text-[rgb(var(--color-text-muted))] mt-3 line-clamp-2 leading-relaxed">
                        {proj.tagline}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-[rgb(var(--color-border-subtle))] flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-subtle))]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="w-9 h-9 rounded-full bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] flex items-center justify-center text-[rgb(var(--color-text-muted))] group-hover:text-white group-hover:bg-[rgb(var(--color-accent))] group-hover:border-[rgb(var(--color-accent))] transition-all">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[rgb(var(--color-surface))] via-[rgb(var(--color-surface-elevated))] to-[rgb(var(--color-surface))] border border-[rgb(var(--color-accent)/0.35)] text-center space-y-6 overflow-hidden shadow-2xl glow-accent">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-[rgb(var(--color-accent)/0.2)] rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-black text-[rgb(var(--color-text))] tracking-tight">
            {locale === 'sq' ? 'Keni një Projekt në Mendje?' : 'Have a Project in Mind?'}
          </h3>
          <p className="text-sm sm:text-base text-[rgb(var(--color-text-muted))] leading-relaxed">
            {locale === 'sq'
              ? 'Le të bashkëpunojmë për të krijuar një sistem dixhital me performancë të lartë dhe dizajn unik.'
              : 'Let us collaborate to build a high-performance digital system with unique design.'}
          </p>
        </div>

        <div className="relative z-10 pt-2 flex justify-center">
          <Button
            as="a"
            href={`/${locale}/start-project`}
            size="lg"
            rightIcon={<ArrowRight size={18} />}
            className="shadow-[0_0_24px_rgba(99,102,241,0.4)] hover:shadow-[0_0_36px_rgba(99,102,241,0.6)] transition-shadow"
          >
            {locale === 'sq' ? 'Fillo një Projekt' : 'Start a Project'}
          </Button>
        </div>
      </div>
    </div>
  );
}
