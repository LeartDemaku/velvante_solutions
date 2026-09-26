'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[rgb(var(--color-accent))] text-white hover:bg-[rgb(var(--color-accent-dark))] focus-visible:ring-[rgb(var(--color-accent))] shadow-[0_0_20px_rgb(99_102_241/0.3)] hover:shadow-[0_0_30px_rgb(99_102_241/0.5)]',
  secondary:
    'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent)/0.5)] hover:bg-[rgb(var(--color-surface-overlay))]',
  ghost:
    'text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-surface))]',
  outline:
    'border border-[rgb(var(--color-accent))] text-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent)/0.1)] focus-visible:ring-[rgb(var(--color-accent))]',
  danger:
    'bg-[rgb(var(--color-error))] text-white hover:bg-red-700 focus-visible:ring-red-500',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-4 text-sm gap-1.5',
  md: 'h-10 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-base gap-2.5',
  xl: 'h-14 px-9 text-lg gap-3',
};

export const Button = forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      as = 'button',
      href,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const buttonClasses = cn(
      'inline-flex items-center justify-center font-medium rounded-[var(--radius-sm)]',
      'transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-background))]',
      'select-none cursor-pointer touch-manipulation active:scale-[0.98]',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className
    );

    const content = (
      <>
        {loading ? (
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'xl' ? 20 : 16} />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </>
    );

    if (as === 'a' && href) {
      if (href.startsWith('/')) {
        return (
          <Link
            ref={ref as any}
            href={href}
            className={buttonClasses}
            aria-disabled={isDisabled}
            {...(props as any)}
          >
            {content}
          </Link>
        );
      }
      return (
        <a
          ref={ref as any}
          href={href}
          className={buttonClasses}
          aria-disabled={isDisabled}
          {...(props as any)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as any}
        disabled={isDisabled}
        className={buttonClasses}
        {...(props as any)}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
