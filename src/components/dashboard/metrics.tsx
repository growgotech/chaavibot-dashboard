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
      glowColor: 'group-hover:border-violet-500/30',
      iconBg: 'bg-violet-950/40 text-violet-400 border-violet-900/40',
      progressBar: null,
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: 'Generated from successful transactions',
      icon: IndianRupee,
      glowColor: 'group-hover:border-emerald-500/30',
      iconBg: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40',
      progressBar: null,
    },
    {
      title: 'Onboarding Completion',
      value: `${completionRate.toFixed(1)}%`,
      description: `${completedUsers} of ${totalUsers} users completed onboarding`,
      icon: CheckCircle2,
      glowColor: 'group-hover:border-indigo-500/30',
      iconBg: 'bg-indigo-950/40 text-indigo-400 border-indigo-900/40',
      progressBar: completionRate,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {metricsData.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <Card key={index} className="group relative overflow-hidden transition-all duration-300">
            {/* Ambient Background Glow Effect */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-600/5 blur-2xl transition-all duration-300 group-hover:bg-violet-600/10" />

            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold tracking-wide text-zinc-400 uppercase">
                  {item.title}
                </p>
                <div className={`p-2.5 rounded-lg border flex items-center justify-center transition-colors duration-300 ${item.iconBg}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 flex flex-col justify-end">
                <h3 className="text-3xl font-bold tracking-tight text-white transition-all duration-300 group-hover:text-violet-100">
                  {item.value}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  {item.description}
                </p>
              </div>

              {item.progressBar !== null && (
                <div className="mt-5 w-full">
                  <div className="flex justify-between text-xs mb-1.5 text-zinc-400">
                    <span>Progress</span>
                    <span className="font-semibold">{item.progressBar.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-900 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 shadow-[0_0_8px_rgba(139,92,246,0.3)] transition-all duration-1000 ease-out"
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
