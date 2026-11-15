'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Mail, Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function InstructorLoginPage() {
  const router = useRouter();
  const { setUserRole, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter your faculty credentials.');
      return;
    }
    setUserRole('instructor');
    showToast('Signed in successfully to Faculty Workspace');
    router.push('/instructor/dashboard');
  };

  return (
    <div className="bg-[#F5F8FC]/60 min-h-screen py-16 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-gray-200/90 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#F5A900] text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Faculty Login</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#082B59]">Instructor Workspace</h1>
          <p className="text-xs text-slate-500">Sign in to manage your students, lectures, and curriculum.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Faculty Email</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="faculty@univer-e.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#082B59] hover:bg-navy-800 text-white font-black text-sm rounded-xl shadow-md transition"
          >
            Enter Instructor Portal &rarr;
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 border-t border-gray-100 pt-4">
          Want to teach on UNIVER-E?{' '}
          <Link href="/instructor/register" className="font-bold text-[#082B59] hover:text-[#13A8E8]">
            Apply to become an instructor
          </Link>
        </div>
      </div>
    </div>
  );
}
