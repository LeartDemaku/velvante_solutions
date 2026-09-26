'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Cookie, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_KEY = 'velvante_cookie_consent';

function loadPreferences(): CookiePreferences | null {
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePreferences(prefs: CookiePreferences) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify(prefs));
}

export function CookieBanner() {
  const t = useTranslations('common.cookie');
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = loadPreferences();
    if (!saved) setVisible(true);
  }, []);

  function acceptAll() {
    const all: CookiePreferences = { essential: true, analytics: true, marketing: true };
    savePreferences(all);
    setVisible(false);
  }

  function rejectNonEssential() {
    const essential: CookiePreferences = { essential: true, analytics: false, marketing: false };
    savePreferences(essential);
    setVisible(false);
  }

  function saveCustom() {
    savePreferences(prefs);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm z-40 animate-slide-up"
      role="dialog"
      aria-labelledby="cookie-title"
      aria-modal="false"
    >
      <div className="bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] rounded-2xl p-4 sm:p-5 shadow-2xl">
        <div className="flex items-start gap-3 mb-3">
          <Cookie size={18} className="text-[rgb(var(--color-accent-light))] shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 id="cookie-title" className="text-sm font-semibold text-[rgb(var(--color-text))]">
              {t('banner.title')}
            </h3>
            <p className="text-xs text-[rgb(var(--color-text-muted))] mt-1 leading-relaxed">
              {t('banner.description')}
            </p>
          </div>
          <button
            type="button"
            onClick={rejectNonEssential}
            className="w-8 h-8 min-w-[32px] min-h-[32px] -mr-1 -mt-1 flex items-center justify-center rounded-lg text-[rgb(var(--color-text-subtle))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-surface))] transition-colors cursor-pointer touch-manipulation"
            aria-label="Reject non-essential cookies and close"
          >
            <X size={16} />
          </button>
        </div>

        {customizing && (
          <div className="space-y-3 pt-2 mb-4 border-t border-[rgb(var(--color-border-subtle))]">
            {(['essential', 'analytics', 'marketing'] as const).map((cat) => (
              <div key={cat} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={`cookie-${cat}`}
                  checked={prefs[cat]}
                  disabled={cat === 'essential'}
                  onChange={(e) => setPrefs((p) => ({ ...p, [cat]: e.target.checked }))}
                  className="mt-0.5 shrink-0 accent-[rgb(var(--color-accent))]"
                  aria-label={t(`categories.${cat}.title`)}
                />
                <label htmlFor={`cookie-${cat}`} className="cursor-pointer">
                  <p className="text-xs font-medium text-[rgb(var(--color-text))]">
                    {t(`categories.${cat}.title`)}
                  </p>
                  <p className="text-xs text-[rgb(var(--color-text-subtle))]">
                    {t(`categories.${cat}.description`)}
                  </p>
                </label>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {customizing ? (
            <Button size="sm" onClick={saveCustom} fullWidth>
              {t('banner.save')}
            </Button>
          ) : (
            <Button size="sm" onClick={acceptAll} fullWidth>
              {t('banner.acceptAll')}
            </Button>
          )}
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={rejectNonEssential} fullWidth>
              {t('banner.rejectNonEssential')}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCustomizing((v) => !v)}
              fullWidth
              rightIcon={<ChevronDown size={12} className={cn(customizing && 'rotate-180')} />}
            >
              {t('banner.customize')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
