import * as React from 'react';
import { Users, IndianRupee, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/types/user';

interface MetricsProps {
  users: User[];
}

export function Metrics({ users }: MetricsProps) {
  const totalUsers = users.length;

  // Calculate total revenue from successful payments (minor units, divide by 100)
  const totalRevenue = users.reduce((acc, user) => {
    if (user.payment && user.payment.status === 'success') {
      return acc + (user.payment.amount || 0);
    }
    return acc;
  }, 0) / 100;

  // Calculate completion rate (isCompleted === true vs total)
  const completedUsers = users.filter((user) => user.isCompleted).length;
  const completionRate = totalUsers > 0 ? (completedUsers / totalUsers) * 100 : 0;

  const metricsData = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString('en-IN'),
      description: 'Registered users on the platform',
      icon: Users,
      iconBg: 'bg-violet-50/60 text-violet-600 border-violet-100',
      glowColor: 'bg-violet-500/10 group-hover:bg-violet-500/20',
      gradient: 'from-violet-500 to-fuchsia-500',
      hoverTextColor: 'group-hover:text-violet-650 group-hover:text-violet-600',
      progressBar: null,
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: 'Generated from successful transactions',
      icon: IndianRupee,
      iconBg: 'bg-emerald-50/60 text-emerald-600 border-emerald-100',
      glowColor: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
      gradient: 'from-emerald-500 to-teal-500',
      hoverTextColor: 'group-hover:text-emerald-600',
      progressBar: null,
    },
    {
      title: 'Onboarding Completion',
      value: `${completionRate.toFixed(1)}%`,
      description: `${completedUsers} of ${totalUsers} users completed onboarding`,
      icon: CheckCircle2,
      iconBg: 'bg-indigo-50/60 text-indigo-600 border-indigo-100',
      glowColor: 'bg-indigo-500/10 group-hover:bg-indigo-500/20',
      gradient: 'from-indigo-500 to-violet-500',
      hoverTextColor: 'group-hover:text-indigo-600',
      progressBar: completionRate,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {metricsData.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <Card key={index} className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-100/80 hover:border-slate-300">
            {/* Slide-out Top border accent */}
            <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${item.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out`} />
            
            {/* Ambient Background Glow Effect */}
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${item.glowColor} blur-2xl transition-all duration-500`} />

            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  {item.title}
                </p>
                <div className={`p-2.5 rounded-xl border flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-xs ${item.iconBg}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 flex flex-col justify-end">
                <h3 className={`text-3xl font-extrabold tracking-tight text-slate-900 transition-colors duration-300 ${item.hoverTextColor}`}>
                  {item.value}
                </h3>
                <p className="mt-1 text-xs text-slate-500 font-medium">
                  {item.description}
                </p>
              </div>

              {item.progressBar !== null && (
                <div className="mt-5 w-full">
                  <div className="flex justify-between text-xs mb-1.5 text-slate-500 font-medium">
                    <span>Progress</span>
                    <span className="font-bold text-indigo-650">{item.progressBar.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_8px_rgba(99,102,241,0.2)] transition-all duration-1000 ease-out"
                      style={{ width: `${item.progressBar}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
