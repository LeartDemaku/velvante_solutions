'use client';

import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, placeholder, options, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[rgb(var(--color-text))]">
            {label}
            {props.required && <span className="text-[rgb(var(--color-accent-light))] ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full h-11 appearance-none bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-[var(--radius-md)]',
              'px-4 pr-10 text-sm text-[rgb(var(--color-text))]',
              'transition-colors duration-[var(--duration-fast)] cursor-pointer',
              'focus:outline-none focus:border-[rgb(var(--color-accent))] focus:ring-1 focus:ring-[rgb(var(--color-accent)/0.3)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-[rgb(var(--color-error))]',
              className
            )}
            aria-invalid={!!error}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: 'rgb(15 15 26)' }}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[rgb(var(--color-text-muted))]"
            size={16}
          />
        </div>
        {error && (
          <p className="text-xs text-[rgb(var(--color-error))]" role="alert">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-[rgb(var(--color-text-muted))]">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
