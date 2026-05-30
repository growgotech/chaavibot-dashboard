"use client";

import * as React from 'react';
import { RefreshCcw, Landmark, Users, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Metrics } from '@/components/dashboard/metrics';
import { UserTable } from '@/components/dashboard/user-table';
import { Sheet } from '@/components/ui/modal';
import { UserModal } from '@/components/dashboard/user-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UsersAPIResponse, User } from '@/types/user';

interface DashboardClientProps {
  initialData: UsersAPIResponse;
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const [users, setUsers] = React.useState<User[]>(initialData.users || []);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [lastRefreshed, setLastRefreshed] = React.useState<Date>(new Date());
  const [error, setError] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);

  // Selected User Modal States
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Keep user state momentarily for closing exit animation
    setTimeout(() => setSelectedUser(null), 300);
  };

  // Client-Side Dynamic Data Re-fetching
  const handleRefresh = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    setError(null);
    try {
      const res = await fetch('/api/users', {
        cache: 'no-store'
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch live API data. Status: ${res.status}`);
      }
      const data: UsersAPIResponse = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setLastRefreshed(new Date());
      } else {
        throw new Error('API returned success=false on load');
      }
    } catch (err: any) {
      console.error('Error fetching live users client-side:', err);
      setError('Failed to connect to the live API endpoint. Please check your internet connection.');
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  // Mount effect to sync live data directly in user's browser
  React.useEffect(() => {
    setMounted(true);
    handleRefresh(true);
  }, []);

  const formatLastRefreshed = () => {
    if (!mounted) return '--:--:--';
    return lastRefreshed.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-semibold tracking-widest uppercase">
            <ShieldCheck className="h-4 w-4 text-violet-500" />
            <span>Secure Admin Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1.5 flex items-center gap-2.5">
            User Workspace
            <Badge variant="secondary" className="font-semibold text-xs tracking-normal px-2 py-0.5 border-zinc-800/80">
              chaavi.ai bot
            </Badge>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage WhatsApp client registration, onboarding steps, and digital checkout summaries.
          </p>
        </div>

        {/* Dynamic Controls & Logs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
          <div className="flex flex-col text-right justify-center">
            <span className="text-xs text-zinc-500 font-medium flex items-center gap-1 sm:justify-end">
              <Clock className="h-3 w-3" /> Last fetched: {formatLastRefreshed()}
            </span>
            {error && (
              <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1 mt-0.5">
                <AlertTriangle className="h-3 w-3 shrink-0" /> {error}
              </span>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => handleRefresh()}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 cursor-pointer border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-200 font-bold transition-all text-xs h-9 px-4.5"
          >
            <RefreshCcw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-violet-400' : ''}`} />
            {isRefreshing ? 'Syncing...' : 'Reload Data'}
          </Button>
        </div>
      </div>

      {/* 1. Metric summary panels */}
      <Metrics users={users} />

      {/* 2. Main data management table */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-white tracking-tight">Active Client Registrations</h2>
          <span className="h-5 px-2 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
            {users.length} TOTAL
          </span>
        </div>
        
        <UserTable users={users} onViewDetails={handleOpenModal} />
      </div>

      {/* 3. Sliding Profile sheet details modal */}
      {selectedUser && (
        <Sheet 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          title="Client Registration Dossier"
        >
          <UserModal user={selectedUser} />
        </Sheet>
      )}
    </div>
  );
}
