'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-[rgb(var(--color-text))]"
          >
            {label}
            {props.required && (
              <span className="text-[rgb(var(--color-accent-light))] ml-1" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-[var(--radius-md)]',
            'px-4 py-3 text-sm text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-text-subtle))]',
            'transition-colors duration-[var(--duration-fast)] resize-y min-h-[120px]',
            'focus:outline-none focus:border-[rgb(var(--color-accent))] focus:ring-1 focus:ring-[rgb(var(--color-accent)/0.3)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[rgb(var(--color-error))] focus:border-[rgb(var(--color-error))]',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="text-xs text-[rgb(var(--color-error))]" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="text-xs text-[rgb(var(--color-text-muted))]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
