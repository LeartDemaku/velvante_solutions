'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsletterFormProps {
  compact?: boolean;
  className?: string;
}

export function NewsletterForm({ compact = false, className }: NewsletterFormProps) {
  const t = useTranslations('forms.newsletter');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError(t('placeholder'));
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else if (res.status === 409) {
        setStatus('duplicate');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-green-400', className)}>
        <CheckCircle size={16} className="shrink-0" />
        <span>{t('success')}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', className)} noValidate>
      <div className="flex-1">
        <label htmlFor={`newsletter-email-${compact}`} className="sr-only">
          {t('label')}
        </label>
        <input
          id={`newsletter-email-${compact}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('placeholder')}
          autoComplete="email"
          required
          disabled={status === 'loading'}
          className="w-full h-9 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-[var(--radius-sm)] px-3 text-xs text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-text-subtle))] focus:outline-none focus:border-[rgb(var(--color-accent))] transition-colors"
          aria-describedby={error ? 'newsletter-error' : undefined}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="shrink-0 h-9 w-9 flex items-center justify-center bg-[rgb(var(--color-accent))] text-white rounded-[var(--radius-sm)] hover:bg-[rgb(var(--color-accent-dark))] transition-colors disabled:opacity-50"
        aria-label={t('label') || 'Subscribe'}
      >
        {status === 'loading' ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <ArrowRight size={14} />
        )}
      </button>
      {(error || status === 'error' || status === 'duplicate') && (
        <p id="newsletter-error" className="sr-only" role="alert">
          {status === 'duplicate' ? t('alreadySubscribed') : status === 'error' ? t('error') : error}
        </p>
      )}
    </form>
  );
}
