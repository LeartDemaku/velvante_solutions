import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'error' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))] border border-[rgb(var(--color-border))]',
  accent: 'bg-[rgb(var(--color-accent)/0.12)] text-[rgb(var(--color-accent-light))] border border-[rgb(var(--color-accent)/0.25)]',
  success: 'bg-green-500/10 text-green-400 border border-green-500/25',
  warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/25',
  error: 'bg-red-500/10 text-red-400 border border-red-500/25',
  muted: 'bg-transparent text-[rgb(var(--color-text-muted))]',
};

export function Badge({ children, variant = 'default', className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide',
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span className={cn(
          'size-1.5 rounded-full',
          variant === 'accent' ? 'bg-[rgb(var(--color-accent-light))]' :
          variant === 'success' ? 'bg-green-400' :
          variant === 'warning' ? 'bg-yellow-400' :
          variant === 'error' ? 'bg-red-400' :
          'bg-[rgb(var(--color-text-muted))]'
        )} />
      )}
      {children}
    </span>
  );
}
