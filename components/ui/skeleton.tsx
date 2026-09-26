import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[var(--radius-sm)] bg-[rgb(var(--color-surface-elevated))]',
        className
      )}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ lines = 3, className }: SkeletonProps) {
  return (
    <div className={cn('space-y-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-[var(--radius-lg)] p-6 space-y-4',
        className
      )}
      aria-hidden="true"
    >
      <Skeleton className="h-48 w-full rounded-[var(--radius-md)]" />
      <Skeleton className="h-5 w-3/4" />
      <SkeletonText lines={2} />
    </div>
  );
}
