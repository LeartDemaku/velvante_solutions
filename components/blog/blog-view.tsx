'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { NewsletterForm } from '@/components/forms/newsletter-form';

interface BlogPostItem {
  id: string;
  slug: string;
  coverImage: string;
  publishedAt: Date | null;
  readingTime: number;
  title: string;
  excerpt: string;
  authorName: string;
  categoryName: string;
}

interface BlogViewProps {
  posts: BlogPostItem[];
  locale: string;
}

export function BlogView({ posts, locale }: BlogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(posts.map((p) => p.categoryName)))];

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter((p) => p.categoryName === selectedCategory);

  return (
    <div className="space-y-16">
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
              {cat === 'all' ? (locale === 'sq' ? 'Të Gjithë Artikujt' : 'All Articles') : cat}
            </button>
          ))}
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-[rgb(var(--color-surface)/0.5)] border border-[rgb(var(--color-border))]">
          <BookOpen size={40} className="text-[rgb(var(--color-text-subtle))] mx-auto mb-3" />
          <p className="text-[rgb(var(--color-text-muted))]">
            {locale === 'sq' ? 'Nuk u gjet asnjë artikull në këtë kategori.' : 'No articles found in this category.'}
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                layout
                initial={false}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
              >
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="group relative flex flex-col justify-between h-full rounded-3xl bg-[rgb(var(--color-surface)/0.65)] backdrop-blur-xl border border-[rgb(var(--color-border)/0.8)] hover:border-[rgb(var(--color-accent)/0.5)] transition-all duration-300 shadow-sm hover:shadow-[0_16px_40px_rgba(99,102,241,0.15)] hover:-translate-y-1.5 overflow-hidden"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-[rgb(var(--color-surface-elevated))]">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-surface))] via-transparent to-black/30" />

                    <div className="absolute top-4 left-4">
                      <span className="bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-semibold text-white uppercase tracking-wider border border-white/10">
                        {post.categoryName}
                      </span>
                    </div>
                  </div>

                  <div className="p-7 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-[rgb(var(--color-text-subtle))] font-mono">
                        <span className="flex items-center gap-1.5 text-[rgb(var(--color-accent-light))]">
                          <Clock size={13} /> {post.readingTime} {locale === 'sq' ? 'min lexim' : 'min read'}
                        </span>
                        {post.publishedAt && (
                          <span className="flex items-center gap-1">
                            • {formatDate(post.publishedAt, locale)}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold text-[rgb(var(--color-text))] group-hover:text-[rgb(var(--color-accent-light))] transition-colors leading-snug">
                        {post.title}
                      </h2>

                      <p className="text-sm text-[rgb(var(--color-text-muted))] leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-[rgb(var(--color-border-subtle))] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[rgb(var(--color-accent)/0.2)] text-[rgb(var(--color-accent-light))] border border-[rgb(var(--color-accent)/0.4)] flex items-center justify-center text-xs font-bold font-mono">
                          {post.authorName[0]}
                        </div>
                        <span className="text-xs font-medium text-[rgb(var(--color-text-subtle))]">
                          {post.authorName}
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-[rgb(var(--color-accent-light))] flex items-center gap-1 group-hover:gap-2 transition-all">
                        {locale === 'sq' ? 'Lexo' : 'Read'}
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[rgb(var(--color-surface))] via-[rgb(var(--color-surface-elevated))] to-[rgb(var(--color-surface))] border border-[rgb(var(--color-accent)/0.35)] text-center space-y-6 overflow-hidden shadow-2xl glow-accent max-w-3xl mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-[rgb(var(--color-accent)/0.2)] rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <h3 className="text-2xl sm:text-3xl font-black text-[rgb(var(--color-text))] tracking-tight">
            {locale === 'sq' ? 'Abonohuni në Njohuritë Tona' : 'Subscribe to Our Insights'}
          </h3>
          <p className="text-sm sm:text-base text-[rgb(var(--color-text-muted))] leading-relaxed max-w-lg mx-auto">
            {locale === 'sq'
              ? 'Merni artikuj dhe analiza periodike mbi zhvillimin web, arkitekturën e softuerit dhe sigurinë dixhitale.'
              : 'Receive periodic articles and insights on web development, software architecture, and digital security.'}
          </p>
        </div>

        <div className="relative z-10 max-w-md mx-auto">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
