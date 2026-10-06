'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight, FolderKanban, ExternalLink } from 'lucide-react';
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

  const filteredProjects =
    selectedCategory === 'all'
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
            {locale === 'sq'
              ? 'Nuk u gjet asnjë projekt në këtë kategori.'
              : 'No projects found in this category.'}
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
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
              >
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

                  <div className="p-5 sm:p-6 flex flex-col gap-3">
                    <div>
                      <p className="text-[10px] font-mono text-[rgb(var(--color-accent-light))] uppercase tracking-widest mb-1">
                        {proj.client}
                      </p>
                      <h2 className="text-lg sm:text-xl font-bold text-[rgb(var(--color-text))] group-hover:text-[rgb(var(--color-accent-light))] transition-colors leading-tight line-clamp-2">
                        {proj.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-[rgb(var(--color-text-muted))] mt-1.5 line-clamp-2 leading-relaxed">
                        {proj.tagline}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[rgb(var(--color-border)/0.5)]">
                      {proj.technologies.slice(0, 4).map((tech) => (
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
