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
      <div className="flex flex-col gap-4 p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {user.registrationData?.businessName || 'Unnamed Business'}
            </h3>
            <div className="mt-1.5 flex items-center gap-2 text-zinc-400 text-sm">
              <Phone className="h-4 w-4 text-zinc-500" />
              <span>+{user.phoneNumber}</span>
              <button
                onClick={() => handleCopy(user.phoneNumber, 'phone')}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Copy Phone Number"
              >
                {copiedText === 'phone' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
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
      <div className="flex border-b border-zinc-850 gap-2">
        {(['business', 'payment', 'system'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold tracking-wide border-b-2 transition-all duration-300 capitalize cursor-pointer -mb-[2px] ${
              activeTab === tab
                ? 'border-violet-500 text-white font-bold bg-violet-950/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
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
              <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-900/10 space-y-1">
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Business Type Code</span>
                <p className="text-zinc-200 font-medium">{user.registrationData?.businessType || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-900/10 space-y-1">
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Post Frequency</span>
                <p className="text-zinc-200 font-medium">{user.registrationData?.postFrequency || 'N/A'}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-900/10 space-y-1">
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-zinc-400" /> Location
              </span>
              <p className="text-zinc-200">{user.registrationData?.location || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-900/10 space-y-2">
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-850 pb-1.5 w-full">
                <Building className="h-3.5 w-3.5 text-zinc-400" /> Business Description & Services
              </span>
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line p-2 bg-zinc-950/40 rounded border border-zinc-850/50">
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
              <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-900/10 space-y-1">
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Amount Paid</span>
                <p className="text-2xl font-bold text-white flex items-center">
                  <IndianRupee className="h-5 w-5 text-emerald-400" />
                  {user.payment ? ((user.payment.amount || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
                  <span className="ml-1 text-xs text-zinc-400 font-normal">({user.payment?.currency || 'INR'})</span>
                </p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-900/10 space-y-1">
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Transaction Status</span>
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
                  <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-900/10 space-y-1.5">
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Order ID</span>
                    <div className="flex items-center justify-between text-sm text-zinc-200">
                      <span className="font-mono text-xs truncate max-w-[190px]">{user.payment.orderId || 'N/A'}</span>
                      {user.payment.orderId && (
                        <button
                          onClick={() => handleCopy(user.payment.orderId, 'orderId')}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                        >
                          {copiedText === 'orderId' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-900/10 space-y-1.5">
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Payment ID</span>
                    <div className="flex items-center justify-between text-sm text-zinc-200">
                      <span className="font-mono text-xs truncate max-w-[190px]">{user.payment.paymentId || 'N/A'}</span>
                      {user.payment.paymentId && (
                        <button
                          onClick={() => handleCopy(user.payment.paymentId, 'paymentId')}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                        >
                          {copiedText === 'paymentId' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-900/10 space-y-1.5">
                  <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Paid Timestamp</span>
                  <p className="text-sm text-zinc-300 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-zinc-500" />
                    {formatDate(user.payment.paidAt)}
                  </p>
                </div>

                {user.payment.failureReason && (
                  <div className="p-4 rounded-xl border border-rose-900/20 bg-rose-950/10 space-y-2 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">Failure Diagnosis</span>
                      <p className="text-sm text-rose-300 mt-0.5">{user.payment.failureReason}</p>
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
                      <Button variant="outline" className="w-full flex items-center justify-center gap-2 cursor-pointer border-zinc-700/60 hover:bg-zinc-900 text-white font-semibold">
                        View Razorpay Checkout Link <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-zinc-500">
                No payment information recorded.
              </div>
            )}
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl border border-zinc-850 bg-zinc-900/10">
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-850 pb-2 mb-4 w-full">
                <ShieldCheck className="h-4 w-4 text-zinc-400" /> Onboarding Process Milestones
              </span>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-medium">Platform Onboarding Status</span>
                  <Badge variant={user.isCompleted ? 'success' : 'warning'}>
                    {user.isCompleted ? 'COMPLETED' : 'IN PROGRESS'}
                  </Badge>
                </div>

                <div className="flex justify-between items-center text-sm border-t border-zinc-850/50 pt-3">
                  <span className="text-zinc-500 font-medium">Record Created</span>
                  <span className="text-zinc-300 font-mono text-xs">{formatDate(user.createdAt)}</span>
                </div>

                <div className="flex justify-between items-center text-sm border-t border-zinc-850/50 pt-3">
                  <span className="text-zinc-500 font-medium">Last Record Modification</span>
                  <span className="text-zinc-300 font-mono text-xs">{formatDate(user.updatedAt)}</span>
                </div>

                <div className="flex justify-between items-center text-sm border-t border-zinc-850/50 pt-3">
                  <span className="text-zinc-500 font-medium">Onboarding Completed At</span>
                  <span className="text-zinc-300 font-mono text-xs">{formatDate(user.completedAt)}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-zinc-850 bg-zinc-900/10">
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-850 pb-2 mb-4 w-full">
                <MessageSquare className="h-4 w-4 text-zinc-400" /> WhatsApp Messenger Timestamps
              </span>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-medium">Last Inbound Message Received</span>
                  <span className="text-zinc-300 font-mono text-xs">{formatDate(user.lastInboundMessageAt)}</span>
                </div>

                <div className="flex justify-between items-center text-sm border-t border-zinc-850/50 pt-3">
                  <span className="text-zinc-500 font-medium">Last Promo Template Sent</span>
                  <span className="text-zinc-300 font-mono text-xs">{formatDate(user.lastPromoTemplateSentAt)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
