"use client";

import * as React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/types/user';

interface UserGrowthChartProps {
  users: User[];
}

export function UserGrowthChart({ users }: UserGrowthChartProps) {
  // Parse and group registrations chronologically
  const chartData = React.useMemo(() => {
    if (!users || users.length === 0) return [];

    // Group counts by date
    const dateCounts: { [key: string]: number } = {};
    users.forEach((user) => {
      if (!user.createdAt) return;
      const date = new Date(user.createdAt);
      const dateStr = date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
      });
      dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
    });

    // Sort users by raw createdAt timestamp
    const sortedUsers = [...users].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Build cumulative timeline points
    const timeline: { label: string; count: number; rawDate: Date }[] = [];
    let cumulative = 0;
    const addedDates = new Set<string>();

    sortedUsers.forEach((user) => {
      const date = new Date(user.createdAt);
      const dateStr = date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
      });
      
      if (!addedDates.has(dateStr)) {
        addedDates.add(dateStr);
        // Find cumulative count up to this date
        const usersUpToDate = sortedUsers.filter(
          (u) => new Date(u.createdAt).getTime() <= new Date(user.createdAt).getTime()
        );
        cumulative = usersUpToDate.length;
        timeline.push({
          label: dateStr,
          count: cumulative,
          rawDate: new Date(user.createdAt),
        });
      }
    });

    // If only one data point, pad it for better chart visual flow
    if (timeline.length === 1) {
      const single = timeline[0];
      const prevDate = new Date(single.rawDate);
      prevDate.setDate(prevDate.getDate() - 3);
      const prevLabel = prevDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
      });
      return [
        { label: prevLabel, count: 0 },
        { label: single.label, count: single.count },
      ];
    }

    return timeline.map(t => ({ label: t.label, count: t.count }));
  }, [users]);

  // SVG dimensions
  const width = 600;
  const height = 220;
  const paddingLeft = 45;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 35;

  const maxVal = chartData.length > 0 ? Math.max(...chartData.map(d => d.count), 5) : 5;
  const pointsCount = chartData.length;

  // Calculate coordinates for points
  const points = React.useMemo(() => {
    if (pointsCount === 0) return [];
    
    return chartData.map((d, index) => {
      const x = paddingLeft + (index / (pointsCount - 1)) * (width - paddingLeft - paddingRight);
      // Invert Y coordinate so 0 is at bottom
      const y = height - paddingBottom - (d.count / maxVal) * (height - paddingTop - paddingBottom);
      return { x, y, label: d.label, count: d.count };
    });
  }, [chartData, pointsCount, maxVal]);

  // Generate SVG path string
  const linePath = React.useMemo(() => {
    if (points.length === 0) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, [points]);

  // Shaded area gradient path
  const areaPath = React.useMemo(() => {
    if (points.length === 0) return '';
    const startX = points[0].x;
    const endX = points[points.length - 1].x;
    const baselineY = height - paddingBottom;
    return `${linePath} L ${endX} ${baselineY} L ${startX} ${baselineY} Z`;
  }, [points, linePath]);

  // Generate grid values for Y-axis
  const gridLinesY = [0, 0.25, 0.5, 0.75, 1];

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-slate-350">
      <CardContent className="p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] text-violet-650 font-extrabold tracking-wider uppercase">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Acquisition Analytics</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">User Growth</h3>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200/60 text-xs text-slate-650 font-semibold">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>Cumulative growth</span>
          </div>
        </div>

        {points.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-400 text-sm font-medium">
            No registration records available to plot
          </div>
        ) : (
          <div className="relative w-full">
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full h-auto overflow-visible"
              aria-label="User growth line graph"
            >
              {/* Gradients */}
              <defs>
                <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.00" />
                </linearGradient>
                <linearGradient id="chartLineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Horizontal Gridlines & Y-Axis Labels */}
              {gridLinesY.map((ratio, i) => {
                const y = height - paddingBottom - ratio * (height - paddingTop - paddingBottom);
                const value = Math.round(ratio * maxVal);
                return (
                  <g key={i} className="opacity-45 hover:opacity-80 transition-opacity">
                    <line 
                      x1={paddingLeft} 
                      y1={y} 
                      x2={width - paddingRight} 
                      y2={y} 
                      stroke="#e2e8f0" 
                      strokeWidth="1" 
                      strokeDasharray="4 4"
                    />
                    <text 
                      x={paddingLeft - 8} 
                      y={y + 4} 
                      textAnchor="end" 
                      className="fill-slate-400 font-mono text-[10px] font-semibold"
                    >
                      {value}
                    </text>
                  </g>
                );
              })}

              {/* Shaded area underneath line */}
              <path d={areaPath} fill="url(#chartAreaGradient)" />

              {/* Grid vertical line boundary */}
              <line 
                x1={paddingLeft} 
                y1={paddingTop} 
                x2={paddingLeft} 
                y2={height - paddingBottom} 
                stroke="#cbd5e1" 
                strokeWidth="1.2"
              />
              <line 
                x1={paddingLeft} 
                y1={height - paddingBottom} 
                x2={width - paddingRight} 
                y2={height - paddingBottom} 
                stroke="#cbd5e1" 
                strokeWidth="1.2"
              />

              {/* The Line Graph Path */}
              <path 
                d={linePath} 
                fill="none" 
                stroke="url(#chartLineGradient)" 
                strokeWidth="3" 
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#shadow)"
              />

              {/* Data points (circles) & Tooltip overlays */}
              {points.map((p, i) => (
                <g key={i} className="group/point cursor-pointer">
                  {/* Outer pulsing glow on hover */}
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="8" 
                    fill="#a855f7" 
                    className="opacity-0 group-hover/point:opacity-15 transition-opacity duration-200"
                  />
                  {/* Point circle */}
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="4.5" 
                    fill="#ffffff" 
                    stroke="#8b5cf6" 
                    strokeWidth="2.5" 
                    className="transition-all duration-300 group-hover/point:r-5.5 group-hover/point:stroke-violet-600"
                  />

                  {/* Tooltip background & text on hover */}
                  <g className="opacity-0 group-hover/point:opacity-100 pointer-events-none transition-all duration-300 transform -translate-y-1">
                    <rect 
                      x={p.x - 30} 
                      y={p.y - 32} 
                      width="60" 
                      height="20" 
                      rx="6" 
                      fill="#0f172a" 
                      className="shadow-md"
                    />
                    <text 
                      x={p.x} 
                      y={p.y - 19} 
                      textAnchor="middle" 
                      fill="#ffffff" 
                      className="text-[9px] font-bold font-mono"
                    >
                      {p.count} users
                    </text>
                  </g>

                  {/* X-Axis labels */}
                  <text 
                    x={p.x} 
                    y={height - paddingBottom + 18} 
                    textAnchor="middle" 
                    className="fill-slate-500 font-mono text-[9px] font-semibold"
                  >
                    {p.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
