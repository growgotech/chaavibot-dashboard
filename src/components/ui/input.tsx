import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-350 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50 shadow-2xs',
            icon ? 'pl-10' : 'px-3.5',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';
