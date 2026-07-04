"use client";

import * as React from 'react';
import { CalendarDays, Sparkles, X, ChevronLeft, ChevronRight, Gift } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Major Indian festivals with their static dates for 2026/2027
const FESTIVALS_LIST = [
  { name: 'Raksha Bandhan', date: '2026-08-28', icon: '📿' },
  { name: 'Janmashtami', date: '2026-09-04', icon: '🏺' },
  { name: 'Ganesh Chaturthi', date: '2026-09-14', icon: '🐘' },
  { name: 'Dussehra', date: '2026-10-20', icon: '🏹' },
  { name: 'Dhanteras', date: '2026-11-06', icon: '💰' },
  { name: 'Diwali', date: '2026-11-08', icon: '🪔' },
  { name: 'Bhai Dooj', date: '2026-11-10', icon: '🌸' },
  { name: 'Guru Nanak Jayanti', date: '2026-11-24', icon: '🕌' },
  { name: 'Christmas', date: '2026-12-25', icon: '🎄' },
  { name: 'New Year', date: '2027-01-01', icon: '🎆' },
  { name: 'Republic Day', date: '2027-01-26', icon: '🇮🇳' },
  { name: 'Maha Shivratri', date: '2027-03-06', icon: '🔱' },
  { name: 'Holi', date: '2027-03-22', icon: '🎨' },
];

export function FestivalCalendar() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // Starting month for calendar grid view (August 2026 is month index 7)
  const [viewYear, setViewYear] = React.useState(2026);
  const [viewMonth, setViewMonth] = React.useState(7); // 0-indexed, so 7 = August

  const upcomingFestivals = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return FESTIVALS_LIST.map((fest) => {
      const festDate = new Date(fest.date);
      festDate.setHours(0, 0, 0, 0);

      const diffTime = festDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        ...fest,
        daysLeft: diffDays,
        formattedDate: festDate.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      };
    })
      .filter((fest) => fest.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 5);
  }, []);

  const getCountdownBadgeStyle = (daysLeft: number) => {
    if (daysLeft === 0) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/60 animate-pulse';
    }
    if (daysLeft <= 7) {
      return 'bg-rose-50 text-rose-700 border-rose-200/60';
    }
    if (daysLeft <= 30) {
      return 'bg-amber-50 text-amber-700 border-amber-200/60';
    }
    return 'bg-violet-50 text-violet-750 border-violet-100';
  };

  // Generate calendar grid days for selected viewMonth/viewYear
  const calendarGrid = React.useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun, 1 = Mon ...
    
    const days = [];
    
    // Fill initial empty cells
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: null, dateStr: '', festival: null });
    }
    
    // Fill dates of month
    for (let d = 1; d <= daysInMonth; d++) {
      const padDay = String(d).padStart(2, '0');
      const padMonth = String(viewMonth + 1).padStart(2, '0');
      const dateStr = `${viewYear}-${padMonth}-${padDay}`;
      
      const festival = FESTIVALS_LIST.find(f => f.date === dateStr) || null;
      days.push({ day: d, dateStr, festival });
    }
    
    return days;
  }, [viewMonth, viewYear]);

  const monthLabel = React.useMemo(() => {
    return new Date(viewYear, viewMonth).toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric'
    });
  }, [viewMonth, viewYear]);

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const monthFestivals = React.useMemo(() => {
    return FESTIVALS_LIST.filter(fest => {
      const d = new Date(fest.date);
      return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
    });
  }, [viewMonth, viewYear]);

  return (
    <>
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-slate-350">
        <CardContent className="p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-violet-50 text-violet-650 border border-violet-100">
                <CalendarDays className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-tight">Upcoming Festivals</h3>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">National & Cultural</p>
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-[10px] font-bold text-violet-600 hover:text-violet-750 cursor-pointer transition-colors select-none flex items-center gap-0.5 outline-none focus:underline"
            >
              <Sparkles className="h-3 w-3" /> View Calendar
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingFestivals.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-slate-400 text-xs">
                No upcoming festivals recorded
              </div>
            ) : (
              upcomingFestivals.map((fest, idx) => (
                <div key={idx} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 group">
                  <div className="flex items-center gap-3">
                    <span className="text-xl group-hover:scale-115 transition-transform duration-200" role="img" aria-label={fest.name}>
                      {fest.icon}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-violet-650 transition-colors">
                        {fest.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{fest.formattedDate}</p>
                    </div>
                  </div>

                  <div className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border shadow-3xs ${getCountdownBadgeStyle(fest.daysLeft)}`}>
                    {fest.daysLeft === 0 ? 'Today' : `${fest.daysLeft} ${fest.daysLeft === 1 ? 'Day' : 'Days'}`}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Calendar Modal Viewport */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-violet-50 text-violet-650 border border-violet-100">
                  <CalendarDays className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Festival Calendar Sheet
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Calendar Controls */}
            <div className="flex items-center justify-between mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200/50">
              <Button
                variant="outline"
                size="icon"
                onClick={prevMonth}
                className="h-7 w-7 rounded-lg cursor-pointer border-slate-200 hover:bg-white shrink-0"
              >
                <ChevronLeft className="h-4 w-4 text-slate-650" />
              </Button>
              <span className="text-xs font-extrabold text-slate-800 tracking-wide uppercase">
                {monthLabel}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
                className="h-7 w-7 rounded-lg cursor-pointer border-slate-200 hover:bg-white shrink-0"
              >
                <ChevronRight className="h-4 w-4 text-slate-650" />
              </Button>
            </div>

            {/* Days grid header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                <span key={i} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-1">
                  {d}
                </span>
              ))}
            </div>

            {/* Grid days */}
            <div className="grid grid-cols-7 gap-1 text-center mb-5">
              {calendarGrid.map((cell, idx) => {
                const isFestival = cell.festival !== null;
                
                return (
                  <div 
                    key={idx} 
                    className={`relative aspect-square flex items-center justify-center text-xs font-semibold rounded-lg transition-all ${
                      cell.day === null 
                        ? 'bg-transparent text-transparent pointer-events-none'
                        : isFestival
                          ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-250/30 scale-100 hover:scale-105'
                          : 'text-slate-700 hover:bg-slate-100 cursor-default'
                    }`}
                    title={cell.festival ? `${cell.festival.icon} ${cell.festival.name}` : ''}
                  >
                    {cell.day}
                    {isFestival && (
                      <span className="absolute top-1 right-1 text-[8px] leading-none">
                        ✦
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Month festivals list info */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Gift className="h-3.5 w-3.5 text-violet-500" />
                <span>Festivals this month ({monthFestivals.length})</span>
              </h4>
              
              {monthFestivals.length === 0 ? (
                <p className="text-xs text-slate-450 italic py-2 text-center">
                  No festival holidays in {monthLabel}
                </p>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1 scrollbar-thin">
                  {monthFestivals.map((fest, idx) => {
                    const dStr = new Date(fest.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short'
                    });
                    
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs py-1.5 px-2 bg-slate-50 border border-slate-200/50 rounded-lg hover:border-violet-100 transition-colors">
                        <div className="flex items-center gap-2">
                          <span>{fest.icon}</span>
                          <span className="font-bold text-slate-700">{fest.name}</span>
                        </div>
                        <span className="font-mono font-semibold text-violet-650 bg-violet-50/70 px-2 py-0.5 rounded border border-violet-100/50 text-[10px]">
                          {dStr}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer font-bold border-slate-200 hover:bg-slate-50"
              >
                Close Calendar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
