'use client';

import { motion } from 'framer-motion';

const techItems = [
  { name: 'Next.js 16', category: 'Framework' },
  { name: 'React 19', category: 'Frontend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Tailwind CSS', category: 'Design System' },
  { name: 'Node.js', category: 'Runtime' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Python', category: 'AI & Backend' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'Prisma ORM', category: 'Data Layer' },
  { name: 'Framer Motion', category: 'Animation' },
  { name: 'Redis', category: 'Caching' },
  { name: 'GraphQL', category: 'API' },
  { name: 'Cloudflare', category: 'Edge CDN' },
];

export function TechTicker({ label }: { label?: string }) {
  const repeatedItems = [...techItems, ...techItems];

  return (
    <div className="relative w-full overflow-hidden py-6 border-y border-[rgb(var(--color-border)/0.3)] bg-[rgb(var(--color-surface)/0.3)] backdrop-blur-sm">
      <div className="container-velvante mb-3 flex items-center justify-between text-xs text-[rgb(var(--color-text-subtle))] font-mono uppercase tracking-widest">
        <span>{label || 'Modern Stack & Enterprise Technologies'}</span>
        <span className="flex items-center gap-1.5 text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Production-Grade Architecture
        </span>
      </div>

      <div className="relative flex overflow-x-hidden mask-gradient-x">
        <motion.div
          className="flex gap-4 shrink-0"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 28,
              ease: 'linear',
            },
          }}
        >
          {repeatedItems.map((tech, idx) => (
            <div
              key={`${tech.name}-${idx}`}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent)/0.5)] transition-colors shadow-sm group select-none cursor-default"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-accent-light))] group-hover:scale-125 transition-transform" />
              <span className="text-xs font-semibold text-[rgb(var(--color-text))] font-mono">
                {tech.name}
              </span>
              <span className="text-[10px] text-[rgb(var(--color-text-subtle))] font-mono border-l border-[rgb(var(--color-border))] pl-2">
                {tech.category}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
