'use client';

import { useState } from 'react';
import { Terminal, Cpu, Gauge, ShieldCheck, Check, Sparkles, Activity, Layers, Database } from 'lucide-react';

interface HeroInteractiveProps {
  locale: string;
}

export function HeroInteractive({ locale }: HeroInteractiveProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'arch' | 'metrics'>('code');

  const tabs = [
    { id: 'code' as const, label: locale === 'sq' ? 'Kodi' : 'Code', icon: Terminal },
    { id: 'arch' as const, label: locale === 'sq' ? 'Arkitektura' : 'Architecture', icon: Layers },
    { id: 'metrics' as const, label: locale === 'sq' ? 'Metrikat' : 'Live Metrics', icon: Gauge },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      <div className="absolute -top-5 -right-2 sm:-right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[rgb(var(--color-surface)/0.95)] backdrop-blur-xl border border-emerald-500/30 shadow-[0_8px_24px_rgba(16,185,129,0.15)] select-none pointer-events-none">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[11px] font-semibold text-emerald-400 font-mono">100/100 Core Web Vitals</span>
      </div>

      <div className="absolute -bottom-5 -left-2 sm:-left-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[rgb(var(--color-surface)/0.95)] backdrop-blur-xl border border-[rgb(var(--color-accent)/0.3)] shadow-[0_8px_24px_rgba(99,102,241,0.18)] select-none pointer-events-none">
        <ShieldCheck size={14} className="text-[rgb(var(--color-accent-light))]" />
        <span className="text-[11px] font-semibold text-[rgb(var(--color-text))] font-mono">
          {locale === 'sq' ? 'Siguri A+ Enterprise' : 'A+ Enterprise Security'}
        </span>
      </div>

      <div className="relative rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface)/0.9)] backdrop-blur-xl shadow-2xl overflow-hidden glow-accent-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated)/0.6)]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>

          <div className="flex items-center p-0.5 rounded-lg bg-[rgb(var(--color-background)/0.7)] border border-[rgb(var(--color-border-subtle))]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer touch-manipulation ${
                    isActive
                      ? 'bg-[rgb(var(--color-accent))] text-white shadow-sm'
                      : 'text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]'
                  }`}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-[rgb(var(--color-text-subtle))]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span>v2.4.0</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 min-h-[290px] flex flex-col justify-center">
          {activeTab === 'code' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[rgb(var(--color-border-subtle))] text-[11px] text-[rgb(var(--color-text-subtle))]">
                <span>velvante-engine.config.ts</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check size={12} /> Compiled
                </span>
              </div>
              <div className="p-3 sm:p-3.5 rounded-xl bg-[rgb(var(--color-background)/0.9)] border border-[rgb(var(--color-border-subtle))] text-[rgb(var(--color-text-muted))] space-y-1 overflow-x-auto leading-relaxed text-[11px] sm:text-xs">
                <div>
                  <span className="text-[rgb(var(--color-accent-light))]">import</span> {'{'} VelvanteCore {'}'}{' '}
                  <span className="text-[rgb(var(--color-accent-light))]">from</span>{' '}
                  <span className="text-emerald-300">&apos;@velvante/solutions&apos;</span>;
                </div>
                <div className="pt-1">
                  <span className="text-[rgb(var(--color-accent-light))]">export const</span> system ={' '}
                  <span className="text-amber-300">new</span> VelvanteCore({'{'}
                </div>
                <div className="pl-4">
                  runtime: <span className="text-emerald-300">&apos;edge-optimized&apos;</span>,
                </div>
                <div className="pl-4">
                  coreWebVitals: <span className="text-amber-400">1.00</span>,
                </div>
                <div className="pl-4">
                  database: <span className="text-sky-300">&apos;PostgreSQL + Prisma&apos;</span>,
                </div>
                <div className="pl-4">
                  architecture: <span className="text-indigo-300">&apos;High-Availability SSR&apos;</span>,
                </div>
                <div className="pl-4">
                  security: {'{'} ssl: <span className="text-emerald-300">&apos;A+&apos;</span>, ddosProtection:{' '}
                  <span className="text-amber-300">true</span> {'}'}
                </div>
                <div>{'}'});</div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-2 sm:p-2.5 rounded-lg bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-center">
                  <p className="text-[9px] sm:text-[10px] text-[rgb(var(--color-text-subtle))] uppercase">Next.js</p>
                  <p className="text-xs sm:text-sm font-bold text-[rgb(var(--color-text))]">16.3 Turbo</p>
                </div>
                <div className="p-2 sm:p-2.5 rounded-lg bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-center">
                  <p className="text-[9px] sm:text-[10px] text-[rgb(var(--color-text-subtle))] uppercase">React</p>
                  <p className="text-xs sm:text-sm font-bold text-sky-400">19 Concurrent</p>
                </div>
                <div className="p-2 sm:p-2.5 rounded-lg bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-center">
                  <p className="text-[9px] sm:text-[10px] text-[rgb(var(--color-text-subtle))] uppercase">TypeScript</p>
                  <p className="text-xs sm:text-sm font-bold text-[rgb(var(--color-accent-light))]">Strict 100%</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'arch' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[rgb(var(--color-border-subtle))] text-[11px] text-[rgb(var(--color-text-subtle))]">
                <span>Distributed Edge Flow</span>
                <span className="text-indigo-400 flex items-center gap-1">
                  <Activity size={12} /> Active
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-[rgb(var(--color-background)/0.8)] border border-[rgb(var(--color-border-subtle))]">
                  <div className="flex items-center gap-2">
                    <Cpu size={15} className="text-sky-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-xs sm:text-sm text-[rgb(var(--color-text))]">1. Cloudflare Edge CDN</p>
                      <p className="text-[10px] text-[rgb(var(--color-text-subtle))]">Global routing & DDoS shield</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400">&lt; 15ms</span>
                </div>

                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-[rgb(var(--color-background)/0.8)] border border-[rgb(var(--color-border-subtle))]">
                  <div className="flex items-center gap-2">
                    <Layers size={15} className="text-[rgb(var(--color-accent-light))] shrink-0" />
                    <div>
                      <p className="font-semibold text-xs sm:text-sm text-[rgb(var(--color-text))]">2. Next.js 16 SSR Engine</p>
                      <p className="text-[10px] text-[rgb(var(--color-text-subtle))]">Zero-layout-shift hydration</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400">&lt; 35ms</span>
                </div>

                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-[rgb(var(--color-background)/0.8)] border border-[rgb(var(--color-border-subtle))]">
                  <div className="flex items-center gap-2">
                    <Database size={15} className="text-amber-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-xs sm:text-sm text-[rgb(var(--color-text))]">3. PostgreSQL & Prisma ORM</p>
                      <p className="text-[10px] text-[rgb(var(--color-text-subtle))]">Connection pooling & indexing</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400">&lt; 10ms</span>
                </div>
              </div>

              <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center justify-between">
                <span>{locale === 'sq' ? 'Koha Mesatare e Përgjigjes' : 'Average End-to-End Latency'}</span>
                <span className="font-bold">~ 48ms</span>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[rgb(var(--color-border-subtle))] font-mono text-[11px] text-[rgb(var(--color-text-subtle))]">
                <span>Google Lighthouse Audit</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Sparkles size={12} /> Flawless
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="p-3 sm:p-3.5 rounded-xl bg-[rgb(var(--color-background)/0.9)] border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[rgb(var(--color-text-muted))]">Performance</p>
                    <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">100</p>
                  </div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    100
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 rounded-xl bg-[rgb(var(--color-background)/0.9)] border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[rgb(var(--color-text-muted))]">Accessibility</p>
                    <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">100</p>
                  </div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    100
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 rounded-xl bg-[rgb(var(--color-background)/0.9)] border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[rgb(var(--color-text-muted))]">Best Practices</p>
                    <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">100</p>
                  </div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    100
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 rounded-xl bg-[rgb(var(--color-background)/0.9)] border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[rgb(var(--color-text-muted))]">SEO Audit</p>
                    <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">100</p>
                  </div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    100
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[rgb(var(--color-surface-elevated))] text-xs font-mono text-[rgb(var(--color-text-muted))]">
                <span>Core Web Vitals Pass Rate:</span>
                <span className="text-emerald-400 font-bold">100% Certified</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
