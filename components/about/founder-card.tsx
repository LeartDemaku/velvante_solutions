'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Mail, FileDown, GraduationCap, Cpu, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FounderCardProps {
  member: {
    id: string;
    name: string;
    image: string | null;
    linkedin: string | null;
    role: string;
    bio: string;
  };
  locale: string;
}

const skills = [
  'Next.js 16',
  'React 19',
  'TypeScript',
  'Node.js',
  'Python',
  'Tailwind CSS',
  'SQL / Prisma',
  'Figma UI/UX',
  'AI-Assisted Dev',
];

export function FounderCard({ member, locale }: FounderCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface)/0.75)] backdrop-blur-xl p-8 sm:p-12 shadow-2xl glow-accent-sm"
    >
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[rgb(var(--color-accent)/0.12)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        <div className="lg:col-span-5 flex flex-col items-center text-center">
          <div className="relative group">
            <div className="w-64 h-72 sm:w-72 sm:h-80 rounded-2xl overflow-hidden border-2 border-[rgb(var(--color-accent)/0.6)] shadow-2xl relative bg-[rgb(var(--color-surface-elevated))]">
              {member.image && (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-accent)/0.5)] shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-[rgb(var(--color-text))] font-mono">
                {locale === 'sq' ? 'Themelues & CEO' : 'Founder & CEO'}
              </span>
            </div>
          </div>

          <div className="mt-7 w-full max-w-xs space-y-1">
            <p className="text-xs font-mono text-[rgb(var(--color-accent-light))] uppercase tracking-wider font-semibold">
              {member.role}
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-3xl sm:text-4xl font-black text-[rgb(var(--color-text))] tracking-tight">
                {member.name}
              </h3>
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified Founder
              </span>
            </div>
            <p className="text-base sm:text-lg font-mono text-[rgb(var(--color-accent-light))] font-semibold">
              {locale === 'sq' ? 'Zhvillues Web Full-Stack' : 'Full-Stack Web Developer'}
            </p>
          </div>

          <p className="text-sm sm:text-base text-[rgb(var(--color-text-muted))] leading-relaxed">
            {member.bio}
          </p>

          <div className="space-y-2 pt-2">
            <p className="text-xs font-mono uppercase tracking-wider text-[rgb(var(--color-text-subtle))]">
              {locale === 'sq' ? 'Aftësitë & Teknologjitë Kryesore:' : 'Core Competencies & Stack:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] hover:border-[rgb(var(--color-accent)/0.5)] transition-colors shadow-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[rgb(var(--color-background)/0.7)] border border-[rgb(var(--color-border-subtle))] space-y-2.5 text-xs text-[rgb(var(--color-text-muted))] font-mono">
            <div className="flex items-start gap-2.5">
              <GraduationCap size={16} className="text-[rgb(var(--color-accent-light))] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[rgb(var(--color-text))] font-semibold">
                  {locale === 'sq' ? 'Edukimi:' : 'Education:'}
                </strong>{' '}
                British College of Sciences{' '}
                {locale === 'sq' ? '(Zhvillues Softueri 2024–2026)' : '(Software Developer 2024–2026)'} • Flutura Academy
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Cpu size={16} className="text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[rgb(var(--color-text))] font-semibold">
                  {locale === 'sq' ? 'Fokusi Inxhinierik:' : 'Engineering Focus:'}
                </strong>{' '}
                {locale === 'sq'
                  ? 'Arkitekturë Web • Sisteme Backend • Ndërfaqe Moderne UI/UX • AI Automation'
                  : 'Web Architecture • Backend Systems • Modern UI/UX • AI Automation'}
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3.5 items-center">
            <Button
              as="a"
              href="/documents/cv-leart-demaku.pdf"
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              leftIcon={<FileDown size={15} />}
              className="shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_28px_rgba(99,102,241,0.5)] transition-shadow"
            >
              {locale === 'sq' ? 'Shkarko CV Zyrtare' : 'Download Official CV'}
            </Button>
            <Button
              as="a"
              href="https://portfolio-leartdemaku.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="sm"
              rightIcon={<ExternalLink size={14} />}
              className="backdrop-blur-md bg-[rgb(var(--color-surface)/0.6)]"
            >
              {locale === 'sq' ? 'Shiko Portofolin' : 'View Portfolio'}
            </Button>
            <Button
              as="a"
              href="mailto:velvantesolutions@outlook.com"
              variant="secondary"
              size="sm"
              leftIcon={<Mail size={14} />}
              className="backdrop-blur-md bg-[rgb(var(--color-surface)/0.6)]"
            >
              velvantesolutions@outlook.com
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
