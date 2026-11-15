'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function RegisterPage() {
  const router = useRouter();
  const { setUserRole, showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole('student');
    showToast(`Account created for ${name}! Welcome to UNIVER-E.`);
    router.push('/dashboard');
  };

  return (
    <div className="bg-[#F5F8FC]/60 min-h-screen py-16 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-gray-200/90 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#F5A900] text-xs font-bold">
            <span>Student Registration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#082B59]">Create Your Account</h1>
          <p className="text-xs text-slate-500">Join over 50,000 learners on India&apos;s digital university platform.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Arham Khan"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
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
                placeholder="Minimum 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
            <input type="checkbox" required id="terms" className="accent-[#13A8E8]" />
            <label htmlFor="terms">
              I agree to the <Link href="/terms" className="text-[#13A8E8] font-bold">Terms of Service</Link> and <Link href="/privacy" className="text-[#13A8E8] font-bold">Privacy Policy</Link>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-sm rounded-xl shadow-md transition"
          >
            Create Student Account →
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 border-t border-gray-100 pt-4">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-[#082B59] hover:text-[#13A8E8]">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
