"use client";

import * as React from 'react';
import { 
  Building, MapPin, Phone, MessageSquare, IndianRupee, 
  Layers, Image as ImageIcon, Calendar, Copy, Check, ExternalLink, 
  AlertCircle, ShieldCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';
import { getBusinessTypeName } from '@/components/dashboard/user-table';

interface UserModalProps {
  user: User;
}

export function UserModal({ user }: UserModalProps) {
  const [activeTab, setActiveTab] = React.useState<'business' | 'payment' | 'system'>('business');
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(identifier);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
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
    <div className="space-y-6">
      {/* Top Profile Header */}
      <div className="flex flex-col gap-4 p-5 rounded-xl border border-slate-200 bg-slate-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {user.registrationData?.businessName || 'Unnamed Business'}
            </h3>
            <div className="mt-1.5 flex items-center gap-2 text-slate-500 text-sm">
              <Phone className="h-4 w-4 text-slate-400" />
              <span className="font-mono">+{user.phoneNumber}</span>
              <button
                onClick={() => handleCopy(user.phoneNumber, 'phone')}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                title="Copy Phone Number"
              >
                {copiedText === 'phone' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getStepBadgeVariant(user.currentStep)}>
              Step: {user.currentStep}
            </Badge>
            <Badge variant={getPaymentBadgeVariant(user.payment?.status)}>
              Payment: {user.payment?.status || 'unpaid'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 gap-2">
        {(['business', 'payment', 'system'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold tracking-wide border-b-2 transition-all duration-300 capitalize cursor-pointer -mb-[2px] ${
              activeTab === tab
                ? 'border-violet-600 text-violet-700 font-bold bg-violet-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab === 'system' ? 'System Timestamps' : `${tab} Info`}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="mt-6 min-h-[250px]">
        {/* Business Tab */}
        {activeTab === 'business' && (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Business Category</span>
                <p className="text-slate-800 font-medium">{getBusinessTypeName(user.registrationData?.businessType)}</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Post Frequency</span>
                <p className="text-slate-800 font-medium">{user.registrationData?.postFrequency || 'N/A'}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" /> Location
              </span>
              <p className="text-slate-800">{user.registrationData?.location || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5 w-full">
                <Building className="h-3.5 w-3.5 text-slate-400" /> Business Description & Services
              </span>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line p-2.5 bg-white rounded border border-slate-200/60">
                {user.registrationData?.services || 'No services description provided.'}
              </p>
            </div>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Amount Paid</span>
                <p className="text-2xl font-bold text-slate-900 flex items-center">
                  <IndianRupee className="h-5 w-5 text-emerald-600" />
                  {user.payment ? ((user.payment.amount || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
                  <span className="ml-1 text-xs text-slate-500 font-normal">({user.payment?.currency || 'INR'})</span>
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Transaction Status</span>
                <div>
                  <Badge variant={getPaymentBadgeVariant(user.payment?.status)} className="mt-1">
                    {user.payment?.status ? user.payment.status.toUpperCase() : 'NO PAYMENTS'}
                  </Badge>
                </div>
              </div>
            </div>

            {user.payment ? (
              <div className="space-y-4">
                {/* Payment Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Order ID</span>
                    <div className="flex items-center justify-between text-sm text-slate-800">
                      <span className="font-mono text-xs truncate max-w-[190px]">{user.payment.orderId || 'N/A'}</span>
                      {user.payment.orderId && (
                        <button
                          onClick={() => handleCopy(user.payment.orderId, 'orderId')}
                          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          {copiedText === 'orderId' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Payment ID</span>
                    <div className="flex items-center justify-between text-sm text-slate-800">
                      <span className="font-mono text-xs truncate max-w-[190px]">{user.payment.paymentId || 'N/A'}</span>
                      {user.payment.paymentId && (
                        <button
                          onClick={() => handleCopy(user.payment.paymentId, 'paymentId')}
                          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          {copiedText === 'paymentId' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Paid Timestamp</span>
                  <p className="text-sm text-slate-700 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {formatDate(user.payment.paidAt)}
                  </p>
                </div>

                {user.payment.failureReason && (
                  <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-rose-700 font-bold uppercase tracking-wider">Failure Diagnosis</span>
                      <p className="text-sm text-rose-600 mt-0.5">{user.payment.failureReason}</p>
                    </div>
                  </div>
                )}

                {user.payment.paymentLink && (
                  <div className="pt-2">
                    <a 
                      href={user.payment.paymentLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full flex items-center justify-center gap-2 cursor-pointer font-semibold shadow-sm">
                        View Razorpay Checkout Link <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-450">
                No payment information recorded.
              </div>
            )}
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-4 w-full">
                <ShieldCheck className="h-4 w-4 text-slate-400" /> Onboarding Process Milestones
              </span>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Platform Onboarding Status</span>
                  <Badge variant={user.isCompleted ? 'success' : 'warning'}>
                    {user.isCompleted ? 'COMPLETED' : 'IN PROGRESS'}
                  </Badge>
                </div>

                <div className="flex justify-between items-center text-sm border-t border-slate-200/60 pt-3">
                  <span className="text-slate-500 font-medium">Record Created</span>
                  <span className="text-slate-700 font-mono text-xs">{formatDate(user.createdAt)}</span>
                </div>

                <div className="flex justify-between items-center text-sm border-t border-slate-200/60 pt-3">
                  <span className="text-slate-500 font-medium">Last Record Modification</span>
                  <span className="text-slate-700 font-mono text-xs">{formatDate(user.updatedAt)}</span>
                </div>

                <div className="flex justify-between items-center text-sm border-t border-slate-200/60 pt-3">
                  <span className="text-slate-500 font-medium">Onboarding Completed At</span>
                  <span className="text-slate-700 font-mono text-xs">{formatDate(user.completedAt)}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-4 w-full">
                <MessageSquare className="h-4 w-4 text-slate-400" /> WhatsApp Messenger Timestamps
              </span>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Last Inbound Message Received</span>
                  <span className="text-slate-700 font-mono text-xs">{formatDate(user.lastInboundMessageAt)}</span>
                </div>

                <div className="flex justify-between items-center text-sm border-t border-slate-200/60 pt-3">
                  <span className="text-slate-500 font-medium">Last Promo Template Sent</span>
                  <span className="text-slate-700 font-mono text-xs">{formatDate(user.lastPromoTemplateSentAt)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
