'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw] max-h-[95vh]',
};

export function Modal({ open, onClose, title, description, children, size = 'md', className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();

      if (e.key === 'Tab') {
        const focusableElements = panelRef.current?.querySelectorAll<HTMLElement>(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    if (panelRef.current && !panelRef.current.contains(document.activeElement)) {
      panelRef.current.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-desc' : undefined}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          'relative w-full bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))]',
          'rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] animate-scale-in',
          'overflow-auto max-h-[90vh] focus:outline-none',
          sizeClasses[size],
          className
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between p-6 pb-4 border-b border-[rgb(var(--color-border))]">
            <div>
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-[rgb(var(--color-text))]">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-desc" className="text-sm text-[rgb(var(--color-text-muted))] mt-1">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-4 shrink-0 text-[rgb(var(--color-text-subtle))] hover:text-[rgb(var(--color-text))] transition-colors rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--color-accent))]"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
