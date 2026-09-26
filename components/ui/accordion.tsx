'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, allowMultiple = false, className }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className={cn('space-y-2', className)} role="list">
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        const panelId = `accordion-panel-${item.id}`;
        const headingId = `accordion-heading-${item.id}`;

        return (
          <div
            key={item.id}
            className={cn(
              'border border-[rgb(var(--color-border))] rounded-[var(--radius-md)]',
              'bg-[rgb(var(--color-surface))] transition-colors duration-[var(--duration-fast)]',
              isOpen && 'border-[rgb(var(--color-accent)/0.3)]'
            )}
            role="listitem"
          >
            <button
              id={headingId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
              className="flex items-center justify-between w-full px-5 py-4 text-left text-sm font-medium text-[rgb(var(--color-text))] hover:text-[rgb(var(--color-accent-light))] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-accent))] rounded-[var(--radius-md)]"
            >
              <span>{item.question}</span>
              <ChevronDown
                size={16}
                className={cn(
                  'shrink-0 ml-4 text-[rgb(var(--color-text-muted))] transition-transform duration-[var(--duration-normal)]',
                  isOpen && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headingId}
              className={cn(
                'overflow-hidden transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)]',
                isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <p className="px-5 pb-4 text-sm text-[rgb(var(--color-text-muted))] leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
