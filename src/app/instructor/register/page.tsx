'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Mail, Lock, User, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function InstructorRegisterPage() {
  const router = useRouter();
  const { setUserRole, showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [expertise, setExpertise] = useState('Artificial Intelligence & Machine Learning');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole('instructor');
    showToast(`Instructor profile initiated for ${name}! Welcome to the Faculty.`);
    router.push('/instructor/dashboard');
  };

  return (
    <div className="bg-[#F5F8FC]/60 min-h-screen py-16 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-lg w-full border border-gray-200/90 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#F5A900] text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Faculty Onboarding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#082B59]">Become an Instructor</h1>
          <p className="text-xs text-slate-500">
            Inspire the next generation, earn high revenue splits, and build your digital academic legacy.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Legal Name & Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Prof. Priya Sharma, Ph.D."
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Professional Email</label>
            <input
              type="email"
              required
              placeholder="instructor@domain.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Primary Discipline / Domain</label>
            <select
              value={expertise}
              onChange={e => setExpertise(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none"
            >
              <option value="Artificial Intelligence">Artificial Intelligence & ML</option>
              <option value="Computer Science">Computer Science & Full Stack</option>
              <option value="Cybersecurity">Cybersecurity & Defense</option>
              <option value="Design">UI/UX & Creative Arts</option>
              <option value="Business">Business, Finance & Leadership</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#082B59] hover:bg-navy-800 text-white font-black text-sm rounded-xl shadow-md transition"
          >
            Submit Instructor Application →
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 border-t border-gray-100 pt-4">
          Already an approved instructor?{' '}
          <Link href="/instructor/login" className="font-bold text-[#082B59] hover:text-[#13A8E8]">
            Sign in to Faculty Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
