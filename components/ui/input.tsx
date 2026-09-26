'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[rgb(var(--color-text))]"
          >
            {label}
            {props.required && (
              <span className="text-[rgb(var(--color-accent-light))] ml-1" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-subtle))] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-11 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-[var(--radius-md)]',
              'px-4 text-sm text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-text-subtle))]',
              'transition-colors duration-[var(--duration-fast)]',
              'focus:outline-none focus:border-[rgb(var(--color-accent))] focus:ring-1 focus:ring-[rgb(var(--color-accent)/0.3)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-[rgb(var(--color-error))] focus:border-[rgb(var(--color-error))] focus:ring-[rgb(var(--color-error)/0.3)]',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-subtle))]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-[rgb(var(--color-error))]" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-[rgb(var(--color-text-muted))]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
