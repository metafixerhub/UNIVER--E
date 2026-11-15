'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, User, KeyRound, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin, isAdminAuthenticated } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAdminAuthenticated) {
      router.push('/admin');
    }
  }, [isAdminAuthenticated, router]);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const success = adminLogin(username, password);
      setIsLoading(false);
      if (success) {
        router.push('/admin');
      } else {
        setErrorMsg('Authentication Rejected: Invalid administrator credentials.');
      }
    }, 600);
  };

  return (
    <div className="bg-[#051C3A] min-h-screen py-16 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-gray-100 shadow-2xl relative z-10 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#082B59] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </Link>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#082B59]">Admin Operations Gateway</h1>
          <p className="text-xs text-slate-500">
            Protected Console. Authorized Root Access Only.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Admin Username</label>
            <div className="relative">
              <input
                type="text"
                required
                autoFocus
                placeholder="Enter administrator ID"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Admin Root Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-gray-200 text-[11px] text-slate-500">
            <strong>Access Credentials:</strong> <br />
            Username: <code className="text-[#082B59] font-mono font-bold">nur</code> &bull; Password: <code className="text-[#082B59] font-mono font-bold">nur1438nur</code>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Verify & Enter Admin Console →</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-slate-400">
          All access attempts are logged and encrypted.
        </div>
      </div>
    </div>
  );
}
