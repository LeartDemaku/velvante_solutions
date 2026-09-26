'use client';

import { cn } from '@/lib/utils';

export function LogoIcon({
  size = 52,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src="/logo.png"
      alt="Velvante Solutions"
      width={size}
      height={size}
      className={cn(
        'shrink-0 object-contain block transition-transform duration-300 group-hover:scale-105 select-none bg-transparent',
        className
      )}
      style={{ width: `${size}px`, height: `${size}px` }}
      loading="eager"
    />
  );
}

export function Logo({
  size = 52,
  showText = true,
  className,
  textClassName,
}: {
  size?: number;
  showText?: boolean;
  className?: string;
  textClassName?: string;
}) {
  return (
    <div className={cn('flex items-center gap-3 group select-none', className)}>
      <LogoIcon size={size} />
      {showText && (
        <span className={cn('font-black text-xl tracking-[-0.04em] text-[rgb(var(--color-text))]', textClassName)}>
          Velvante Solutions
        </span>
      )}
    </div>
  );
}
