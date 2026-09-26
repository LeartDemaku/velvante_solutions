'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useLocale } from 'next-intl';

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    function onScroll() { setVisible(window.scrollY > 400); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={scrollTop}
          className="fixed bottom-6 right-6 z-30 w-10 h-10 bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] rounded-full flex items-center justify-center text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] hover:border-[rgb(var(--color-accent)/0.4)] hover:shadow-[var(--shadow-accent-sm)] transition-all duration-200"
          aria-label={locale === 'sq' ? 'Kthehu lart' : 'Scroll to top'}
        >
          <ArrowUp size={16} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
