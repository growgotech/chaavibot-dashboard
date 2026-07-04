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
    { name: 'Overview', icon: LayoutDashboard, current: false, enabled: false, comingSoon: true },
    { name: 'User Management', icon: Users, current: true, enabled: true },
    { name: 'Settings', icon: Settings, current: false, enabled: false, comingSoon: true },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#3b32a6] p-5 justify-between">
      <div className="space-y-7">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-2.5 px-1 pb-4 border-b border-white/10">
          <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-md">
            <Radio className="h-5 w-5 text-[#3b32a6]" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-white">
              chaavi<span className="text-indigo-200 font-black">.ai</span>
            </span>
            <div className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest leading-none mt-0.5">
              Control Panel
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200/60 px-3">
            Main Console
          </span>
          <nav className="mt-2 space-y-1.5">
            {navigationItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  disabled={!item.enabled}
                  className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-300 font-semibold group cursor-pointer ${
                    item.current
                      ? 'bg-white/12 text-white border border-white/10 shadow-xs'
                      : 'text-indigo-200 hover:text-white hover:bg-white/5 border border-transparent disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
                >
                  {item.current && (
                    <div className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r bg-white" />
                  )}
                  <div className={`flex items-center gap-3 ${item.current ? 'pl-1.5' : ''}`}>
                    <Icon className={`h-4.5 w-4.5 ${item.current ? 'text-white' : 'text-indigo-300 group-hover:text-white'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.comingSoon && (
                    <span className="text-[8px] font-bold uppercase tracking-wider text-indigo-300 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
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
      <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-sm font-bold text-[#3b32a6] shadow">
            C
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">Chaavi.ai</div>
            <div className="text-[10px] text-indigo-200 font-semibold uppercase tracking-wider flex items-center gap-0.5 mt-0.5">
              <ShieldCheck className="h-3 w-3 text-white shrink-0" />
              <span>Admin</span>
            </div>
          </div>
        </div>
        <button className="p-2 rounded-lg border border-white/10 bg-white/5 text-indigo-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
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
        <header className="md:hidden flex items-center justify-between h-16 bg-[#3b32a6] text-white border-b border-indigo-900/50 px-4 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-white" />
            <span className="font-black text-white text-base">
              chaavi<span className="text-indigo-200">.ai</span>
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-lg border border-white/10 text-white hover:bg-white/10 cursor-pointer"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {/* 3. Mobile Hamburger Menu Drawer */}
        {isOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsOpen(false)}
            />
            {/* Menu container */}
            <div className="relative w-64 max-w-xs h-full bg-white animate-slide-in">
              {sidebarContent}
            </div>
          </div>
        )}

        {/* 4. Page Main Viewport Panel */}
        <main className="flex-1 p-6 md:p-8 bg-slate-50 text-slate-800 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
