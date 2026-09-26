import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: 'div' | 'article' | 'section' | 'li';
}

export function Card({ children, className, hover = false, as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={cn(
        'bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-[var(--radius-lg)]',
        'transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)]',
        hover && [
          'hover:border-[rgb(var(--color-accent)/0.35)]',
          'hover:shadow-[0_0_24px_rgb(99_102_241/0.12)]',
          'hover:-translate-y-0.5',
        ],
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-6 pb-0', className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-6', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 pt-0 border-t border-[rgb(var(--color-border))] mt-6', className)}>
      {children}
    </div>
  );
}
