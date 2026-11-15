'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Users,
  BookOpen,
  DollarSign,
  Award,
  Check,
  X,
  Search,
  Filter,
  AlertTriangle,
  Settings,
  Activity,
  Layers,
  Mail,
  Clock,
  LogOut,
  KeyRound,
  ExternalLink,
  MessageSquare,
  CreditCard,
  QrCode,
  Copy,
  Smartphone,
  CheckCircle2,
  UploadCloud,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { COURSES } from '@/data/courses';
import QRCode from 'qrcode';

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    showToast,
    inquiries,
    updateInquiryStatus,
    isAdminAuthenticated,
    adminLogout,
    adminLogin,
    paymentSettings,
    updatePaymentSettings,
    transactions,
    updateTransactionStatus,
  } = useApp();

  const [courses, setCourses] = useState(COURSES);
  const [activeTab, setActiveTab] = useState<'inquiries' | 'courses' | 'users' | 'certificates' | 'atlas' | 'payments'>('payments');
  const [atlasStats, setAtlasStats] = useState<any>(null);
  const [loadingAtlas, setLoadingAtlas] = useState(false);

  // Payments / UPI Provider Editor State
  const [upiIdInput, setUpiIdInput] = useState(paymentSettings.upiId || '7557060447-5@ybl');
  const [merchantNameInput, setMerchantNameInput] = useState(paymentSettings.merchantName || 'UNIVER-E Digital Academy');
  const [providerSelection, setProviderSelection] = useState<'direct_upi' | 'upi_gateway' | 'cashfree' | 'razorpay'>('direct_upi');
  const [testAmount, setTestAmount] = useState('2999');
  const [adminQrPreview, setAdminQrPreview] = useState<string>('');

  // Quick inline login state if unauthenticated
  const [gateUser, setGateUser] = useState('nur');
  const [gatePass, setGatePass] = useState('');
  const [gateError, setGateError] = useState(false);

  // Generate test QR code inside Admin Portal
  useEffect(() => {
    const intent = `upi://pay?pa=${upiIdInput}&pn=${encodeURIComponent(
      merchantNameInput
    )}&am=${testAmount}&cu=INR&tn=${encodeURIComponent('UNIVER-E Admin Test Payment')}`;

    QRCode.toDataURL(intent, {
      width: 220,
      margin: 1.5,
      color: {
        dark: '#082B59',
        light: '#FFFFFF',
      },
    })
      .then(url => setAdminQrPreview(url))
      .catch(err => console.error('Admin QR err:', err));
  }, [upiIdInput, merchantNameInput, testAmount]);

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(gateUser, gatePass);
    if (!success) {
      setGateError(true);
    } else {
      setGateError(false);
    }
  };

  const handlePublishPaymentSettings = () => {
    updatePaymentSettings({
      upiId: upiIdInput.trim(),
      merchantName: merchantNameInput.trim(),
      activeProvider: providerSelection,
      isAutoVerify: true,
    });
  };

  const handleApprove = (id: string) => {
    showToast('Course approved and published to the live public catalog!');
  };

  const handleFlag = (id: string) => {
    showToast('Course flagged for academic quality review.');
  };

  const fetchAtlasStats = async () => {
    setLoadingAtlas(true);
    try {
      const res = await fetch('/api/atlas/stats');
      const data = await res.json();
      setAtlasStats(data);
      showToast('Fetched live MongoDB Atlas cluster metrics!');
    } catch (err: any) {
      showToast(`Error connecting to Atlas server: ${err.message}`);
    } finally {
      setLoadingAtlas(false);
    }
  };

  // If NOT authenticated as admin, show secure gate
  if (!isAdminAuthenticated) {
    return (
      <div className="bg-[#051C3A] min-h-screen py-16 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-gray-100 shadow-2xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center">
            <KeyRound className="w-8 h-8" />
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-[#082B59]">Admin Authentication Required</h2>
            <p className="text-xs text-slate-500">
              Please enter your root administrator password to access the governance console.
            </p>
          </div>

          {gateError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              Authentication failed. Username &quot;nur&quot; requires the designated root password.
            </div>
          )}

          <form onSubmit={handleGateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Admin Username</label>
              <input
                type="text"
                required
                value={gateUser}
                onChange={e => setGateUser(e.target.value)}
                className="w-full px-3.5 py-3 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Admin Root Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={gatePass}
                onChange={e => setGatePass(e.target.value)}
                className="w-full px-3.5 py-3 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition shadow"
            >
              Unlock Administration Panel
            </button>
          </form>

          <div className="text-center">
            <Link href="/" className="text-xs text-[#13A8E8] hover:underline">
              ← Return to UNIVER-E Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F8FC]/60 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Banner */}
        <div className="bg-[#082B59] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                Admin &amp; Governance Console
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                Logged in as: nur
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              UNIVER-E Central Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Platform administration, UPI payment provider management, course moderation, and MongoDB Atlas telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-navy-950/70 px-3 py-1.5 rounded-xl border border-navy-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono text-emerald-300 font-bold">Status: Online</span>
            </div>

            <button
              onClick={adminLogout}
              className="px-4 py-2 bg-white/10 hover:bg-red-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Admin</span>
            </button>
          </div>
        </div>

        {/* 4 Core Admin KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Active UPI Merchant</span>
              <QrCode className="w-5 h-5 text-[#28A745]" />
            </div>
            <div className="text-base sm:text-lg font-mono font-black text-[#082B59] truncate">
              {paymentSettings.upiId}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold">0% Fee Direct UPI</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Total Learners</span>
              <Users className="w-5 h-5 text-[#13A8E8]" />
            </div>
            <div className="text-2xl font-black text-[#082B59]">54,290</div>
            <span className="text-[11px] text-emerald-600 font-bold">+1,420 this week</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Inquiries Pending</span>
              <Mail className="w-5 h-5 text-[#F5A900]" />
            </div>
            <div className="text-2xl font-black text-[#082B59]">{inquiries.length}</div>
            <span className="text-[11px] text-amber-700 font-bold">Direct from /contact</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Platform Volume</span>
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-[#082B59]">₹1.48 Cr</div>
            <span className="text-[11px] text-emerald-600 font-bold">Year to Date</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'payments' ? 'bg-[#F5A900] text-[#082B59] shadow' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#082B59]" />
            <span>Payments &amp; UPI Provider</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'inquiries' ? 'bg-[#082B59] text-white shadow' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Mail className="w-4 h-4 text-[#F5A900]" />
            <span>Contact Inquiries ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex-shrink-0 ${
              activeTab === 'courses' ? 'bg-[#082B59] text-white shadow' : 'text-slate-600 hover:bg-white'
            }`}
          >
            Course Moderation
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex-shrink-0 ${
              activeTab === 'users' ? 'bg-[#082B59] text-white shadow' : 'text-slate-600 hover:bg-white'
            }`}
          >
            Users &amp; Roles
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex-shrink-0 ${
              activeTab === 'certificates' ? 'bg-[#082B59] text-white shadow' : 'text-slate-600 hover:bg-white'
            }`}
          >
            Certificates Audit
          </button>

          <button
            onClick={() => {
              setActiveTab('atlas');
              if (!atlasStats) fetchAtlasStats();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === 'atlas' ? 'bg-[#28A745] text-white shadow' : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <span>MongoDB Atlas Telemetry</span>
          </button>
        </div>

        {/* Tab: Payments & UPI Provider Management */}
        {activeTab === 'payments' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: UPI Configuration & Provider Switcher */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-xl font-black text-[#082B59]">Payment Provider &amp; UPI Configuration</h3>
                    <p className="text-xs text-slate-500">
                      Configure and publish any free UPI payment provider to the live checkout page.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-[#28A745] font-bold text-xs rounded-full border border-emerald-200">
                    Live Active
                  </span>
                </div>

                {/* UPI ID Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Merchant UPI ID (All student payments route here):
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={upiIdInput}
                        onChange={e => setUpiIdInput(e.target.value)}
                        placeholder="e.g. 7557060447-5@ybl"
                        className="w-full px-4 py-3 border-2 border-emerald-300 rounded-xl font-mono text-sm font-bold text-[#082B59] focus:outline-none focus:ring-2 focus:ring-[#28A745] bg-emerald-50/20"
                      />
                      <QrCode className="w-5 h-5 text-[#28A745] absolute right-3 top-3.5" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Current official UPI ID: <code className="font-bold text-[#082B59]">7557060447-5@ybl</code> (PhonePe / YES Bank).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Merchant Display Name (Shown in GPay / PhonePe / Paytm):
                    </label>
                    <input
                      type="text"
                      value={merchantNameInput}
                      onChange={e => setMerchantNameInput(e.target.value)}
                      placeholder="UNIVER-E Digital Academy"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                    />
                  </div>
                </div>

                {/* Free Payment Providers Directory */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Select &amp; Publish Payment Provider Engine:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setProviderSelection('direct_upi')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition space-y-1.5 ${
                        providerSelection === 'direct_upi'
                          ? 'border-[#28A745] bg-emerald-50/40'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#082B59]">Direct Dynamic UPI (Free)</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#28A745] text-white">
                          0% Fee
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Generates dynamic UPI QR codes and deep-link intent for all Indian UPI apps with direct bank credit.
                      </p>
                    </div>

                    <div
                      onClick={() => setProviderSelection('upi_gateway')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition space-y-1.5 ${
                        providerSelection === 'upi_gateway'
                          ? 'border-[#13A8E8] bg-sky-50/40'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#082B59]">UPI Webhook Engine</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Free API
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Automatic webhook listener for instantaneous 12-digit UTR confirmation without third-party commission.
                      </p>
                    </div>

                    <div
                      onClick={() => setProviderSelection('cashfree')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition space-y-1.5 ${
                        providerSelection === 'cashfree'
                          ? 'border-[#F5A900] bg-amber-50/40'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#082B59]">Cashfree Free UPI Tier</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Auto Collect
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Virtual UPI addresses for auto-matching student payments and refunds.
                      </p>
                    </div>

                    <div
                      onClick={() => setProviderSelection('razorpay')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition space-y-1.5 ${
                        providerSelection === 'razorpay'
                          ? 'border-[#082B59] bg-slate-100'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#082B59]">Razorpay Standard</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          Cards &amp; UPI
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Indian payment gateway for domestic credit/debit cards and Net Banking.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Last published: <strong>{paymentSettings.publishedAt}</strong>
                  </div>

                  <button
                    onClick={handlePublishPaymentSettings}
                    className="px-6 py-3 rounded-xl bg-[#28A745] hover:bg-[#218838] text-white font-black text-xs flex items-center gap-2 shadow-md transition"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Publish &amp; Deploy Payment Gateway</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Dynamic QR Test Terminal */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 text-center">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase text-[#13A8E8]">
                    Live Simulator
                  </span>
                  <h3 className="text-lg font-black text-[#082B59]">Admin QR Code Verification</h3>
                  <p className="text-xs text-slate-500">
                    Scan with PhonePe or GPay to verify live UPI parameters.
                  </p>
                </div>

                {/* Amount Slider / Input */}
                <div className="bg-[#F5F8FC] p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Test Order Amount:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900">₹</span>
                    <input
                      type="number"
                      value={testAmount}
                      onChange={e => setTestAmount(e.target.value)}
                      className="w-20 px-2 py-1 text-sm font-black font-mono border rounded-lg bg-white text-right"
                    />
                  </div>
                </div>

                {/* Dynamic QR Display */}
                <div className="inline-block p-4 bg-white rounded-2xl border-2 border-[#082B59]/20 shadow-md">
                  {adminQrPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={adminQrPreview} alt="Live UPI QR Code" className="w-48 h-48 mx-auto object-contain" />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                      Generating Preview...
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-[#082B59] bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200 break-all">
                    {upiIdInput}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Zero transaction fee direct settlement active.
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex gap-2">
                  <Link
                    href="/checkout"
                    target="_blank"
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#082B59] font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Student Checkout</span>
                  </Link>
                </div>
              </div>

            </div>

            {/* UPI Transaction Audit & UTR Verification Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-black text-[#082B59]">Student UPI Transaction Ledger</h3>
                  <p className="text-xs text-slate-500">
                    Real-time transaction reference (UTR) verification log for all course enrollments.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  Total Recorded: {transactions.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-gray-200">
                      <th className="p-3">Transaction ID</th>
                      <th className="p-3">Bank UTR Reference</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Course Enrolled</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-slate-600">
                    {transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-slate-900">{tx.id}</td>
                        <td className="p-3 font-mono font-bold text-[#13A8E8]">{tx.utrNumber}</td>
                        <td className="p-3 font-semibold text-slate-900">
                          {tx.studentName}
                          <span className="block text-[10px] text-slate-400 font-normal">{tx.studentEmail}</span>
                        </td>
                        <td className="p-3 font-medium text-[#082B59]">{tx.courseTitle}</td>
                        <td className="p-3 font-black text-slate-900">₹{tx.amount.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-slate-500 whitespace-nowrap">{tx.timestamp}</td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              tx.status === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : tx.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                          {tx.status !== 'verified' && (
                            <button
                              onClick={() => updateTransactionStatus(tx.id, 'verified')}
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                            >
                              Verify
                            </button>
                          )}
                          {tx.status !== 'rejected' && (
                            <button
                              onClick={() => updateTransactionStatus(tx.id, 'rejected')}
                              className="px-2 py-1 rounded bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 font-bold text-[10px]"
                            >
                              Reject
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 1: Contact Inquiries (Direct from Contact Page) */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-[#082B59]">Inquiries Transmitted from Contact Page</h3>
                <p className="text-xs text-slate-500">
                  Every user inquiry submitted via <code>/contact</code> arrives exclusively here for admin review.
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full font-bold text-xs">
                {inquiries.filter(i => i.status === 'new').length} New Pending
              </span>
            </div>

            {inquiries.length > 0 ? (
              <div className="space-y-4">
                {inquiries.map(inq => (
                  <div
                    key={inq.id}
                    className={`p-5 rounded-2xl border transition space-y-3 ${
                      inq.status === 'new'
                        ? 'border-amber-200 bg-amber-50/30'
                        : inq.status === 'replied'
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-gray-200 bg-gray-50/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-[#082B59] flex items-center justify-center font-bold text-sm">
                          {inq.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{inq.name}</h4>
                          <a href={`mailto:${inq.email}`} className="text-xs text-[#13A8E8] hover:underline">
                            {inq.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            inq.status === 'new'
                              ? 'bg-amber-100 text-amber-800'
                              : inq.status === 'replied'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {inq.status}
                        </span>
                        <span className="text-[11px] text-slate-400">{inq.createdAt}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-gray-100 leading-relaxed">
                      &quot;{inq.message}&quot;
                    </p>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">Ref ID: {inq.id}</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${inq.email}?subject=Reply from UNIVER-E Administration&body=Dear ${encodeURIComponent(
                            inq.name
                          )},%0D%0A%0D%0AThank you for reaching out to UNIVER-E.%0D%0A%0D%0A`}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#13A8E8] hover:bg-blue-100 font-bold transition flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Reply via Email</span>
                        </a>

                        {inq.status === 'new' ? (
                          <button
                            onClick={() => updateInquiryStatus(inq.id, 'replied')}
                            className="px-3 py-1.5 rounded-lg bg-[#28A745] text-white hover:bg-[#218838] font-bold transition"
                          >
                            Mark as Replied
                          </button>
                        ) : (
                          <button
                            onClick={() => updateInquiryStatus(inq.id, 'new')}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 text-slate-600 hover:bg-gray-200 font-bold transition"
                          >
                            Mark as New
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <MessageSquare className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs">No contact inquiries have been received yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Course Moderation */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-[#082B59]">Curriculum &amp; Course Moderation</h3>
            <div className="space-y-4">
              {courses.map(course => (
                <div
                  key={course.id}
                  className="p-4 rounded-2xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={course.thumbnail} alt={course.title} className="w-16 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-[#082B59]">{course.title}</h4>
                      <p className="text-xs text-slate-500">Instructor: {course.instructor.name} • {course.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <span className="px-2.5 py-1 bg-emerald-50 text-[#28A745] font-bold text-xs rounded-full">
                      Published
                    </span>
                    <button
                      onClick={() => handleApprove(course.id)}
                      className="px-3 py-1.5 bg-[#082B59] hover:bg-navy-800 text-white rounded-lg text-xs font-bold transition"
                    >
                      Audit
                    </button>
                    <button
                      onClick={() => handleFlag(course.id)}
                      className="px-3 py-1.5 border border-amber-300 text-amber-700 hover:bg-amber-50 rounded-lg text-xs font-bold transition"
                    >
                      Flag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Users */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-[#082B59]">User Roles &amp; Permissions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-gray-200">
                    <th className="p-3">User</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Assigned Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-slate-600">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Nur (Root Admin)</td>
                    <td className="p-3">nur@univer-e.in</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">Admin</span></td>
                    <td className="p-3"><span className="text-[#28A745] font-bold">● Active Root</span></td>
                    <td className="p-3"><button className="text-[#13A8E8] hover:underline font-bold">Protected</button></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Arham Khan</td>
                    <td className="p-3">arham.khan@univer-e.in</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">Student</span></td>
                    <td className="p-3"><span className="text-[#28A745] font-bold">● Verified</span></td>
                    <td className="p-3"><button className="text-[#13A8E8] hover:underline">Edit</button></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Nur Mohammad (Faculty)</td>
                    <td className="p-3">nur.mohammad@univer-e.in</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">Instructor</span></td>
                    <td className="p-3"><span className="text-[#28A745] font-bold">● Active Faculty</span></td>
                    <td className="p-3"><button className="text-[#13A8E8] hover:underline">Edit</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Certificates */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-[#082B59]">Digital Certificate Registry</h3>
            <p className="text-xs text-slate-500">
              Audit all issued verifiable certificates and tamper-evident QR signatures.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#082B59]">UNIVER-E-2026-GD812</span>
                <p className="text-xs text-slate-600">Recipient: Arham Khan • Course: Graphic Design with Canva Pro</p>
              </div>
              <Link
                href="/certificates/UNIVER-E-2026-GD812"
                className="px-3 py-1.5 bg-[#13A8E8] text-white rounded-lg text-xs font-bold hover:bg-sky-600 transition"
              >
                Inspect Record
              </Link>
            </div>
          </div>
        )}

        {/* Tab 5: MongoDB Atlas Telemetry View */}
        {activeTab === 'atlas' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#28A745]">
                  Cluster Health &amp; Metrics
                </span>
                <h3 className="text-xl font-black text-[#082B59]">MongoDB Atlas Cluster Integration</h3>
                <p className="text-xs text-slate-500">
                  Connected to: <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">https://one0l-server-point-234567.onrender.com</code>
                </p>
              </div>

              <button
                onClick={fetchAtlasStats}
                disabled={loadingAtlas}
                className="px-4 py-2 bg-[#082B59] hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 self-start cursor-pointer"
              >
                {loadingAtlas ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Refresh Atlas Stats</span>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-gray-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-700">GET</span>
                  <span className="text-xs font-mono font-bold text-slate-800">/api/external/stats-embed</span>
                </div>
                <p className="text-xs text-slate-600">
                  Reads real-time database stats from all 10 clusters without exposing Atlas passwords.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-gray-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-700">POST</span>
                  <span className="text-xs font-mono font-bold text-slate-800">/api/external/push-data</span>
                </div>
                <p className="text-xs text-slate-600">
                  Saves video metadata, student course progress, and tamper-evident certificate records.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700">Live Server Response:</span>
              <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-80 border border-slate-800">
                {atlasStats ? JSON.stringify(atlasStats, null, 2) : '// Click "Refresh Atlas Stats" to query live MongoDB Atlas metrics...'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
