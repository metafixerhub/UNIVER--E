'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, Sparkles, User, Briefcase, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { setUserRole, showToast } = useApp();

  const [email, setEmail] = useState('arham.khan@univer-e.in');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole('student');
    showToast('Signed in successfully as Student');
    router.push('/dashboard');
  };

  const handleQuickDemo = (role: 'student' | 'instructor' | 'admin') => {
    setUserRole(role);
    if (role === 'student') router.push('/dashboard');
    else if (role === 'instructor') router.push('/instructor/dashboard');
    else if (role === 'admin') router.push('/admin');
  };

  return (
    <div className="bg-[#F5F8FC]/60 min-h-screen py-16 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-gray-200/90 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#13A8E8] text-xs font-bold">
            <LogIn className="w-3.5 h-3.5" />
            <span>Portal Authentication</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#082B59]">Sign in to UNIVER-E</h1>
          <p className="text-xs text-slate-500">Access your courses, certificates, and learning history.</p>
        </div>

        {/* 1-Click Demo Login Box */}
        <div className="bg-[#F5F8FC] rounded-2xl p-4 border border-gray-200/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#082B59]">
            <Sparkles className="w-3.5 h-3.5 text-[#F5A900]" />
            <span>Instant Demo Logins:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemo('student')}
              className="py-1.5 px-2 bg-white rounded-lg border border-gray-200 text-[11px] font-bold text-[#082B59] hover:border-[#13A8E8] hover:bg-sky-50 transition"
            >
              Student
            </button>
            <button
              onClick={() => handleQuickDemo('instructor')}
              className="py-1.5 px-2 bg-white rounded-lg border border-gray-200 text-[11px] font-bold text-[#082B59] hover:border-[#F5A900] hover:bg-amber-50 transition"
            >
              Instructor
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2 bg-white rounded-lg border border-gray-200 text-[11px] font-bold text-red-600 hover:border-red-400 hover:bg-red-50 transition"
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Password</label>
              <a href="#" className="text-[#13A8E8] font-bold hover:underline">
                Forgot password?
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
            Sign In to Dashboard →
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 border-t border-gray-100 pt-4">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="font-bold text-[#082B59] hover:text-[#13A8E8]">
            Register as a student
          </Link>
        </div>
      </div>
    </div>
  );
}
