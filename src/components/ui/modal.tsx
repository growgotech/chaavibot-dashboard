"use client";

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Sheet({ isOpen, onClose, title, children }: SheetProps) {
  // Listen for Escape key to close modal
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Translucent backdrop filter */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Sliding Sheet Panel */}
      <div
        className={cn(
          'relative w-full max-w-2xl h-full border-l border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl p-6 flex flex-col overflow-y-auto transform transition-transform duration-300 ease-out z-10',
          'animate-slide-in'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}
