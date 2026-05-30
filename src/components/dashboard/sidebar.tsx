"use client";

import * as React from 'react';
import { 
  LayoutDashboard, Users, Send, BarChart3, Settings, LogOut, 
  Menu, X, Radio, Server, Activity, ShieldCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navigationItems = [
    { name: 'Overview', icon: LayoutDashboard, active: true },
    { name: 'User Management', icon: Users, active: true },
    { name: 'Settings', icon: Settings, active: false, comingSoon: true },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800/80 p-5 justify-between">
      <div className="space-y-7">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-2.5 px-1 pb-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-950/40">
            <Radio className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              chaavi<span className="text-violet-400">.ai</span>
            </span>
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
              Control Panel
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 px-3">
            Main Console
          </span>
          <nav className="mt-2 space-y-1.5">
            {navigationItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  disabled={!item.active}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-300 font-semibold group cursor-pointer ${
                    item.active
                      ? 'bg-violet-950/20 text-white border border-violet-900/30'
                      : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4.5 w-4.5 ${item.active ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.comingSoon && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-violet-400/80 bg-violet-950/30 px-1.5 py-0.5 rounded border border-violet-900/20">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      
      </div>

      {/* Admin Profile block */}
      <div className="border-t border-zinc-900 pt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white shadow shadow-violet-950">
            P
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">Chaavi.ai</div>
            <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-0.5 mt-0.5">
              <ShieldCheck className="h-3 w-3 text-violet-400 shrink-0" />
              <span>Admin</span>
            </div>
          </div>
        </div>
        <button className="p-2 rounded-lg border border-zinc-900 bg-zinc-950/40 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-all cursor-pointer">
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full min-h-screen">
      {/* 1. Desktop Sidebar (hidden on mobile, visible from md) */}
      <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Responsive Topbar */}
      <div className="flex flex-col flex-1 h-full min-h-screen md:pl-64">
        <header className="md:hidden flex items-center justify-between h-16 bg-zinc-950 border-b border-zinc-800/80 px-4 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-violet-500" />
            <span className="font-black text-white text-base">
              chaavi<span className="text-violet-400">.ai</span>
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-lg border border-zinc-800 text-zinc-400 cursor-pointer"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {/* 3. Mobile Hamburger Menu Drawer */}
        {isOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsOpen(false)}
            />
            {/* Menu container */}
            <div className="relative w-64 max-w-xs h-full bg-zinc-950 animate-slide-in">
              {sidebarContent}
            </div>
          </div>
        )}

        {/* 4. Page Main Viewport Panel */}
        <main className="flex-1 p-6 md:p-8 bg-zinc-950 text-zinc-100 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
