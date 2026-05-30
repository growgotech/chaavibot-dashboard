"use client";

import * as React from 'react';
import { 
  Search, Filter, ChevronLeft, ChevronRight, Eye, 
  ArrowUpDown, RefreshCcw, Landmark, SlidersHorizontal
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from '@/components/ui/table';
import { User } from '@/types/user';

interface UserTableProps {
  users: User[];
  onViewDetails: (user: User) => void;
}

type SortField = 'createdAt' | 'revenue';
type SortOrder = 'asc' | 'desc';

export function UserTable({ users, onViewDetails }: UserTableProps) {
  // Filter States
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [stepFilter, setStepFilter] = React.useState('all');
  const [frequencyFilter, setFrequencyFilter] = React.useState('all');

  // Sorting States
  const [sortField, setSortField] = React.useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('desc');

  // Pagination States
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Extract unique steps and frequencies for filter dropdowns dynamically
  const uniqueSteps = React.useMemo(() => {
    const steps = users.map(u => u.currentStep).filter(Boolean);
    return Array.from(new Set(steps));
  }, [users]);

  const uniqueFrequencies = React.useMemo(() => {
    const freqs = users.map(u => u.registrationData?.postFrequency).filter(Boolean);
    return Array.from(new Set(freqs));
  }, [users]);

  // Combined Live Filtering Logic
  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      // 1. Search Query Match
      const search = searchQuery.toLowerCase().trim();
      const name = (user.registrationData?.businessName || '').toLowerCase();
      const location = (user.registrationData?.location || '').toLowerCase();
      const phone = (user.phoneNumber || '');
      const searchMatches = 
        search === '' ||
        name.includes(search) || 
        location.includes(search) || 
        phone.includes(search);

      // 2. Status Match
      const paymentStatus = user.payment?.status || 'unpaid';
      const statusMatches = statusFilter === 'all' || paymentStatus === statusFilter;

      // 3. Step Match
      const stepMatches = stepFilter === 'all' || user.currentStep === stepFilter;

      // 4. Frequency Match
      const userFreq = user.registrationData?.postFrequency || '';
      const freqMatches = frequencyFilter === 'all' || userFreq === frequencyFilter;

      return searchMatches && statusMatches && stepMatches && freqMatches;
    });
  }, [users, searchQuery, statusFilter, stepFilter, frequencyFilter]);

  // Sorting Logic
  const sortedUsers = React.useMemo(() => {
    const sorted = [...filteredUsers];
    sorted.sort((a, b) => {
      if (sortField === 'createdAt') {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortField === 'revenue') {
        const revA = a.payment && a.payment.status === 'success' ? a.payment.amount : 0;
        const revB = b.payment && b.payment.status === 'success' ? b.payment.amount : 0;
        return sortOrder === 'asc' ? revA - revB : revB - revA;
      }
      return 0;
    });
    return sorted;
  }, [filteredUsers, sortField, sortOrder]);

  // Pagination Computations
  const totalRows = sortedUsers.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  
  // Reset page to 1 when filters or sorting change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, stepFilter, frequencyFilter, sortField, sortOrder, rowsPerPage]);

  const paginatedUsers = React.useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedUsers, currentPage, rowsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setStepFilter('all');
    setFrequencyFilter('all');
    setSortField('createdAt');
    setSortOrder('desc');
  };

  const getStepBadgeVariant = (step: string) => {
    if (step === 'completed' || step === 'complete') return 'success';
    if (step === 'payment' || step === 'business_details') return 'warning';
    return 'info';
  };

  const getPaymentBadgeVariant = (status: string) => {
    if (status === 'success') return 'success';
    if (status === 'pending') return 'warning';
    return 'danger';
  };

  return (
    <div className="space-y-4">
      {/* Sticky Filter Control Panel */}
      <div className="sticky top-[68px] z-20 backdrop-blur-lg bg-zinc-950/75 border border-zinc-800/80 rounded-xl p-4 transition-all duration-300">
        <div className="flex flex-col gap-4">
          {/* Main search and clear */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="flex-1 max-w-lg">
              <Input
                placeholder="Search by Business Name, Phone, or Location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4.5 w-4.5 text-zinc-500" />}
              />
            </div>
            
            <div className="flex items-center gap-3">
              {(searchQuery !== '' || statusFilter !== 'all' || stepFilter !== 'all' || frequencyFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs border-dashed border-zinc-700 text-zinc-400 hover:text-white"
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Clear Active Filters
                </Button>
              )}
              <div className="text-xs text-zinc-500 font-medium">
                Showing {totalRows} of {users.length} users
              </div>
            </div>
          </div>

          {/* Secondary filter dropdowns */}
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 items-center">
            {/* Status Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Payment Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-300 px-3 py-2 text-xs focus:border-violet-500/60 focus:outline-none transition-colors duration-300 cursor-pointer"
              >
                <option value="all">All Payments</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            {/* Step Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Current Step</label>
              <select
                value={stepFilter}
                onChange={(e) => setStepFilter(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-300 px-3 py-2 text-xs focus:border-violet-500/60 focus:outline-none transition-colors duration-300 cursor-pointer"
              >
                <option value="all">All Steps</option>
                {uniqueSteps.map(step => (
                  <option key={step} value={step}>{step}</option>
                ))}
              </select>
            </div>

            {/* Post Frequency Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Post Frequency</label>
              <select
                value={frequencyFilter}
                onChange={(e) => setFrequencyFilter(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-300 px-3 py-2 text-xs focus:border-violet-500/60 focus:outline-none transition-colors duration-300 cursor-pointer"
              >
                <option value="all">All Frequencies</option>
                {uniqueFrequencies.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>

            {/* Custom Sort */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Sort By</label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort('createdAt')}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2 px-3 border-zinc-800 hover:bg-zinc-900 ${
                    sortField === 'createdAt' ? 'border-violet-500/50 bg-violet-950/20 text-violet-300 font-semibold' : 'text-zinc-400'
                  }`}
                >
                  Date {sortField === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort('revenue')}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2 px-3 border-zinc-800 hover:bg-zinc-900 ${
                    sortField === 'revenue' ? 'border-violet-500/50 bg-violet-950/20 text-violet-300 font-semibold' : 'text-zinc-400'
                  }`}
                >
                  Revenue {sortField === 'revenue' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Table Layout */}
      <div className="overflow-hidden rounded-xl border border-zinc-850">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Business Details</TableHead>
              <TableHead className="w-[18%]">Contact (Phone)</TableHead>
              <TableHead className="w-[18%]">Onboarding Step</TableHead>
              <TableHead className="w-[16%]">Payment Status</TableHead>
              <TableHead className="w-[10%] text-right">Revenue</TableHead>
              <TableHead className="w-[8%] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => {
                const businessName = user.registrationData?.businessName || 'Unnamed Business';
                const location = user.registrationData?.location || 'Unknown location';
                const paymentStatus = user.payment?.status || 'unpaid';
                const revenue = user.payment && user.payment.status === 'success' ? (user.payment.amount || 0) / 100 : 0;
                
                return (
                  <TableRow 
                    key={user._id}
                    onClick={() => onViewDetails(user)}
                    className="group cursor-pointer hover:bg-zinc-900/35 active:bg-zinc-900/50 duration-200"
                  >
                    {/* Business Name & Location */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-white group-hover:text-violet-400 transition-colors duration-300">
                          {businessName}
                        </span>
                        <span className="text-xs text-zinc-500 font-medium">
                          {location}
                        </span>
                      </div>
                    </TableCell>

                    {/* Contact Phone */}
                    <TableCell>
                      <span className="font-mono text-zinc-300">+{user.phoneNumber}</span>
                    </TableCell>

                    {/* Onboarding step badge */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStepBadgeVariant(user.currentStep)}>
                          {user.currentStep}
                        </Badge>
                        {user.isCompleted && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" title="Onboarding complete" />
                        )}
                      </div>
                    </TableCell>

                    {/* Payment badge */}
                    <TableCell>
                      <Badge variant={getPaymentBadgeVariant(paymentStatus)}>
                        {paymentStatus}
                      </Badge>
                    </TableCell>

                    {/* Calculated Revenue */}
                    <TableCell className="text-right font-mono font-semibold">
                      {revenue > 0 ? (
                        <span className="text-emerald-400">
                          ₹{revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-zinc-500">-</span>
                      )}
                    </TableCell>

                    {/* Action trigger */}
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetails(user)}
                        className="opacity-70 group-hover:opacity-100 text-zinc-400 hover:text-white hover:bg-zinc-800/80 cursor-pointer"
                        title="View Full Profile Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-zinc-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <SlidersHorizontal className="h-8 w-8 text-zinc-700 animate-bounce" />
                    <div>
                      <p className="font-semibold text-zinc-400">No matching user records found</p>
                      <p className="text-xs text-zinc-600 mt-1">Try broadening your search inputs or resetting current filters.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={clearFilters} className="mt-2 cursor-pointer border-zinc-800 hover:bg-zinc-900 text-zinc-300">
                      Reset Search Filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer Controls */}
      {totalRows > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-zinc-850 rounded-xl bg-zinc-950/20">
          {/* Rows per page toggle */}
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>Show rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="bg-zinc-950 border border-zinc-800 rounded px-1.5 py-1 text-zinc-400 focus:outline-none cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
            <span className="text-xs text-zinc-400">
              Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-lg cursor-pointer border-zinc-800 hover:bg-zinc-900 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 rounded-lg cursor-pointer border-zinc-800 hover:bg-zinc-900 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
