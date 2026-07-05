"use client";

import * as React from 'react';
import { 
  Search, Filter, ChevronLeft, ChevronRight, Eye, 
  ArrowUpDown, RefreshCcw, Landmark, SlidersHorizontal,
  MapPin, Phone, Briefcase, X, Sparkles
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

export function getBusinessTypeName(type: string | number | undefined): string {
  if (type === undefined || type === null) return 'N/A';
  const val = String(type).trim();
  const mapping: Record<string, string> = {
    '1': 'Kirana / General Store',
    '2': 'Medical / Pharmacy Store',
    '3': 'Doctor / CA / Trainer / Freelancer',
    '4': 'Salon / Beauty Parlour',
    '5': 'Other Business',
  };
  return mapping[val] || val;
}

export function UserTable({ users, onViewDetails }: UserTableProps) {
  // Filter States
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [stepFilter, setStepFilter] = React.useState('all');
  const [selectedServicesText, setSelectedServicesText] = React.useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = React.useState<string | null>(null);

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



  // Combined Live Filtering Logic
  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      // 1. Search Query Match
      const search = searchQuery.toLowerCase().trim();
      const name = (user.registrationData?.businessName || '').toLowerCase();
      const location = (user.registrationData?.location || '').toLowerCase();
      const phone = (user.phoneNumber || '');
      const rawBusinessType = (user.registrationData?.businessType || '').toLowerCase();
      const mappedBusinessType = getBusinessTypeName(user.registrationData?.businessType).toLowerCase();
      
      const searchMatches = 
        search === '' ||
        name.includes(search) || 
        location.includes(search) || 
        phone.includes(search) ||
        rawBusinessType.includes(search) ||
        mappedBusinessType.includes(search);

      // 2. Status Match
      const paymentStatus = user.payment?.status || 'unpaid';
      const statusMatches = statusFilter === 'all' || paymentStatus === statusFilter;

      // 3. Step Match
      const stepMatches = stepFilter === 'all' || user.currentStep === stepFilter;

      return searchMatches && statusMatches && stepMatches;
    });
  }, [users, searchQuery, statusFilter, stepFilter]);

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
  }, [searchQuery, statusFilter, stepFilter, sortField, sortOrder, rowsPerPage]);

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
      <div className="sticky top-[68px] z-20 backdrop-blur-lg bg-white/80 border border-slate-200/80 rounded-xl p-4 shadow-xs transition-all duration-300">
        <div className="flex flex-col gap-4">
          {/* Main search and clear */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="flex-1 max-w-lg">
              <Input
                placeholder="Search by Business Name, Phone, or Location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4.5 w-4.5 text-slate-400" />}
              />
            </div>
            
            <div className="flex items-center gap-3">
              {(searchQuery !== '' || statusFilter !== 'all' || stepFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs border-dashed border-slate-300 text-slate-500 hover:text-slate-900"
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Clear Active Filters
                </Button>
              )}
              <div className="text-xs text-slate-500 font-medium">
                Showing {totalRows} of {users.length} users
              </div>
            </div>
          </div>

          {/* Secondary filter dropdowns */}
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 items-center">
            {/* Status Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-extrabold tracking-wider text-slate-400">Payment Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50/20 rounded-xl text-slate-800 px-3 py-2.5 text-xs font-semibold focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/10 shadow-xs transition-all duration-300 cursor-pointer"
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
              <label className="text-[9px] uppercase font-extrabold tracking-wider text-slate-400">Current Step</label>
              <select
                value={stepFilter}
                onChange={(e) => setStepFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50/20 rounded-xl text-slate-800 px-3 py-2.5 text-xs font-semibold focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/10 shadow-xs transition-all duration-300 cursor-pointer"
              >
                <option value="all">All Steps</option>
                {uniqueSteps.map(step => (
                  <option key={step} value={step}>{step}</option>
                ))}
              </select>
            </div>

            {/* Custom Sort */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-extrabold tracking-wider text-slate-400">Sort By</label>
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 w-full shadow-xs">
                <button
                  type="button"
                  onClick={() => handleSort('createdAt')}
                  className={`flex-1 flex items-center justify-center gap-1 text-xs py-1.5 px-2 rounded-lg font-bold transition-all duration-200 cursor-pointer ${
                    sortField === 'createdAt' 
                      ? 'bg-white text-violet-750 shadow-xs border-transparent' 
                      : 'text-slate-500 hover:text-slate-800 bg-transparent border-transparent'
                  }`}
                >
                  Date {sortField === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  type="button"
                  onClick={() => handleSort('revenue')}
                  className={`flex-1 flex items-center justify-center gap-1 text-xs py-1.5 px-2 rounded-lg font-bold transition-all duration-200 cursor-pointer ${
                    sortField === 'revenue' 
                      ? 'bg-white text-violet-750 shadow-xs border-transparent' 
                      : 'text-slate-500 hover:text-slate-800 bg-transparent border-transparent'
                  }`}
                >
                  Revenue {sortField === 'revenue' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Table Layout */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Business Details</TableHead>
            <TableHead className="w-[11%]">Business Type</TableHead>
            <TableHead className="w-[15%]">Services Details</TableHead>
            <TableHead className="w-[14%]">Contact (Phone)</TableHead>
            <TableHead className="w-[14%]">Onboarding Step</TableHead>
            <TableHead className="w-[12%]">Payment Status</TableHead>
            <TableHead className="w-[8%] text-right">Revenue</TableHead>
            <TableHead className="w-[6%] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => {
              const businessName = user.registrationData?.businessName || 'Unnamed Business';
              const location = user.registrationData?.location || 'Unknown location';
              const businessType = user.registrationData?.businessType || 'N/A';
              const services = user.registrationData?.services || '';
              const paymentStatus = user.payment?.status || 'unpaid';
              const revenue = user.payment && user.payment.status === 'success' ? (user.payment.amount || 0) / 100 : 0;
              
              return (
                <TableRow 
                  key={user._id}
                  onClick={() => onViewDetails(user)}
                  className="group cursor-pointer hover:bg-slate-50/80 active:bg-slate-100/80 duration-200"
                >
                  {/* Business Name & Location */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-slate-900 group-hover:text-violet-650 transition-colors duration-300">
                        {businessName}
                      </span>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {location}
                      </span>
                    </div>
                  </TableCell>

                  {/* Business Type */}
                  <TableCell>
                    <span className="text-[11px] font-bold text-slate-650 bg-slate-100/80 border border-slate-200/50 px-2.5 py-1 rounded-lg">
                      {getBusinessTypeName(businessType)}
                    </span>
                  </TableCell>

                  {/* Services Details (Truncated & Interactive) */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {services ? (
                      <button
                        onClick={() => setSelectedServicesText(services)}
                        className="text-xs text-left max-w-[130px] truncate text-slate-550 hover:text-violet-600 hover:underline transition-colors font-medium cursor-pointer flex items-center gap-1"
                        title="Click to view full description"
                      >
                        {services}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </TableCell>

                  {/* Contact Phone */}
                  <TableCell>
                    <span className="font-mono text-xs font-medium text-slate-650 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      +{user.phoneNumber}
                    </span>
                  </TableCell>

                  {/* Onboarding step badge */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStepBadgeVariant(user.currentStep)}>
                        {user.currentStep}
                      </Badge>
                      {user.isCompleted && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" title="Onboarding complete" />
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
                      <span className="text-emerald-600 font-bold">
                        ₹{revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </TableCell>

                  {/* Action trigger */}
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Image Preview Action */}
                      {(() => {
                        const imgUrl = user.posterS3Url;
                        const hasImg = !!imgUrl;
                        return (
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={!hasImg}
                            onClick={() => imgUrl && setPreviewImageUrl(imgUrl)}
                            className={`h-8 w-8 rounded-lg border border-transparent transition-all cursor-pointer ${
                              hasImg 
                                ? 'text-violet-650 hover:text-violet-750 hover:bg-violet-50' 
                                : 'text-slate-350 disabled:opacity-30 disabled:hover:bg-transparent cursor-not-allowed'
                            }`}
                            title={hasImg ? "Preview daily sent poster artwork" : "No sent artwork available"}
                          >
                            <Sparkles className="h-4 w-4" />
                          </Button>
                        );
                      })()}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetails(user)}
                        className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                        title="View Full Profile Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-48 text-center text-slate-500">
                <div className="flex flex-col items-center justify-center gap-3">
                  <SlidersHorizontal className="h-8 w-8 text-slate-350 animate-bounce" />
                  <div>
                    <p className="font-semibold text-slate-500">No matching user records found</p>
                    <p className="text-xs text-slate-400 mt-1">Try broadening your search inputs or resetting current filters.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearFilters} className="mt-2 cursor-pointer border-slate-200 hover:bg-slate-50 text-slate-600">
                    Reset Search Filters
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Footer Controls */}
      {totalRows > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
          {/* Rows per page toggle */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Show rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-650 focus:outline-none cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
            <span className="text-xs text-slate-500">
              Page <strong className="text-slate-800">{currentPage}</strong> of <strong className="text-slate-800">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-lg cursor-pointer border-slate-200 hover:bg-slate-50 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 rounded-lg cursor-pointer border-slate-200 hover:bg-slate-50 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Services Popup Modal Overlay */}
      {selectedServicesText !== null && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedServicesText(null)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-violet-50 text-violet-650 border border-violet-100">
                  <Briefcase className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Services Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedServicesText(null)}
                className="p-1 rounded-lg border border-slate-205 border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs font-semibold text-slate-600 leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto scrollbar-thin">
              {selectedServicesText}
            </div>
            <div className="mt-5 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedServicesText(null)}
                className="cursor-pointer font-bold border-slate-200 hover:bg-slate-50"
              >
                Close details
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Image Preview Modal Overlay */}
      {previewImageUrl !== null && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-violet-50 text-violet-650 border border-violet-100">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Sent Content Preview
                </h3>
              </div>
              <button
                onClick={() => setPreviewImageUrl(null)}
                className="p-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-200/85 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={previewImageUrl} 
                alt="Daily sent template artwork" 
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <a 
                href={previewImageUrl} 
                target="_blank" 
                rel="noreferrer"
              >
                <Button
                  variant="outline"
                  className="flex items-center gap-1.5 text-xs font-bold border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  Open Original
                </Button>
              </a>
              <Button
                variant="default"
                onClick={() => setPreviewImageUrl(null)}
                className="cursor-pointer font-bold"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
