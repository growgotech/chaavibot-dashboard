import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-zinc-800 text-zinc-100 border-zinc-700',
    secondary: 'bg-zinc-900/60 text-zinc-400 border-zinc-800',
    success: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40 hover:bg-emerald-950/60',
    warning: 'bg-amber-950/30 text-amber-400 border-amber-900/30 hover:bg-amber-950/40',
    danger: 'bg-rose-950/40 text-rose-400 border-rose-900/40 hover:bg-rose-950/60',
    info: 'bg-violet-950/40 text-violet-400 border-violet-900/40 hover:bg-violet-950/60',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-all duration-300',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
