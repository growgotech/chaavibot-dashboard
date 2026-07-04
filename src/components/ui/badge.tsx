import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-slate-900 text-white border-slate-800',
    secondary: 'bg-slate-100 text-slate-600 border-slate-200/80',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100/50',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/60 hover:bg-amber-100/50',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/60 hover:bg-rose-100/50',
    info: 'bg-violet-50 text-violet-700 border-violet-200/60 hover:bg-violet-100/50',
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
