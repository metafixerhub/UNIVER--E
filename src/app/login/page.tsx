'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, Phone, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { setUserRole, adminLogin, showToast } = useApp();

  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [emailOrUser, setEmailOrUser] = useState('arham.khan@univer-e.in');
  const [password, setPassword] = useState('password123');

  // Phone OTP login state
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otpSent, setOtpSent] = useState(false);
  const [demoCode, setDemoCode] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logging in as root admin ("nur" / "nur1438nur")
    if (emailOrUser.trim().toLowerCase() === 'nur') {
      const success = adminLogin('nur', password);
      if (success) {
        router.push('/admin');
        return;
      }
    }

    // Default student login
    setUserRole('student');
    showToast('Signed in successfully as Student');
    router.push('/dashboard');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setDemoCode(code);
    setOtpSent(true);
    showToast(`Firebase OTP sent to ${phone}! Demo code: ${code}`);
  };

  const handleVerifyOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp === demoCode || enteredOtp === '123456' || enteredOtp.length === 6) {
      setUserRole('student');
      showToast('Phone verified via Firebase! Logged in.');
      router.push('/dashboard');
    } else {
      showToast('Invalid OTP. Please check the 6-digit code.');
    }
  };

  return (
    <div className="bg-[#F5F8FC]/60 min-h-screen py-16 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-gray-200/90 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#13A8E8] text-xs font-bold">
            <LogIn className="w-3.5 h-3.5" />
            <span>Unified Authentication Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#082B59]">Sign In to UNIVER-E</h1>
          <p className="text-xs text-slate-500">Access student classrooms, course player, or faculty portals.</p>
        </div>

        {/* Tab Selector: Password vs Phone OTP */}
        <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setAuthMethod('password')}
            className={`flex-1 py-2 rounded-lg transition ${
              authMethod === 'password'
                ? 'bg-white text-[#082B59] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Email / Username
          </button>
          <button
            onClick={() => setAuthMethod('otp')}
            className={`flex-1 py-2 rounded-lg transition ${
              authMethod === 'otp'
                ? 'bg-white text-[#082B59] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Phone OTP
          </button>
        </div>

        {authMethod === 'password' ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email or Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="name@univer-e.in or username"
                  value={emailOrUser}
                  onChange={e => setEmailOrUser(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Password</label>
                <a href="#" className="text-[#13A8E8] font-bold hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-sm rounded-xl shadow-md transition"
            >
              Sign In to Classroom →
            </button>
          </form>
        ) : !otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mobile Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#082B59] hover:bg-navy-800 text-white font-black text-sm rounded-xl shadow-md transition"
            >
              Send Firebase OTP →
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtpLogin} className="space-y-4 text-xs">
            {demoCode && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <span className="text-amber-900">SMS OTP Code: </span>
                <strong className="font-mono text-sm tracking-widest text-[#082B59]">{demoCode}</strong>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Enter 6-Digit OTP</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="123456"
                  value={enteredOtp}
                  onChange={e => setEnteredOtp(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 text-center text-lg font-mono tracking-widest border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#28A745] hover:bg-emerald-600 text-white font-black text-sm rounded-xl shadow-md transition"
            >
              Verify OTP & Sign In →
            </button>

            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800"
            >
              Change phone number
            </button>
          </form>
        )}

        {/* Dedicated Admin Portal Direct Access Button */}
        <div className="pt-2 border-t border-gray-100">
          <Link
            href="/admin/login"
            className="w-full py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator Direct Login (user: nur) →</span>
          </Link>
        </div>

        <div className="text-center text-xs text-slate-500 pt-1">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="font-bold text-[#082B59] hover:text-[#13A8E8]">
            Register with OTP verification
          </Link>
        </div>
      </div>
    </div>
  );
}
