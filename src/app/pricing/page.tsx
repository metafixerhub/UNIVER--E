'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ShieldCheck, Zap, Sparkles, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="bg-[#F5F8FC]/50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#F5A900] text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>Accessible Indian Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#082B59] tracking-tight">
            Transparent Education Plans
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pay per individual course or unlock unlimited access with UNIVER-E Pro All-Access Membership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Individual Courses */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#13A8E8] uppercase tracking-wider">Per Course</span>
              <h3 className="text-2xl font-black text-[#082B59]">Single Enrollment</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#082B59]">₹799 - ₹1,999</span>
                <span className="text-xs text-slate-400">/ one-time</span>
              </div>
              <p className="text-xs text-slate-500">Lifetime access to any single chosen course.</p>

              <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-gray-100">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#28A745]" /> Lifetime video access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#28A745]" /> Downloadable code notes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#28A745]" /> Verifiable digital certificate</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#28A745]" /> Direct Q&A forum access</li>
              </ul>
            </div>

            <Link
              href="/courses"
              className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#082B59] font-bold text-xs text-center block"
            >
              Browse Individual Courses
            </Link>
          </div>

          {/* UNIVER-E Pro Monthly */}
          <div className="bg-white rounded-3xl p-8 border-2 border-[#F5A900] shadow-xl relative flex flex-col justify-between space-y-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#F5A900] text-[#082B59] text-xs font-black uppercase tracking-wider shadow">
              Most Popular
            </div>

            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold text-[#F5A900] uppercase tracking-wider">Pro Annual</span>
              <h3 className="text-2xl font-black text-[#082B59]">UNIVER-E Scholar</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#082B59]">₹6,999</span>
                <span className="text-xs text-slate-400">/ year (₹583/mo)</span>
              </div>
              <p className="text-xs text-slate-500">Unlimited access to all 500+ courses and all departments.</p>

              <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-gray-100">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#28A745]" /> Unlimited access to 500+ courses</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#28A745]" /> Unlimited certificates</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#28A745]" /> Priority mentor support</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#28A745]" /> Career placement network</li>
              </ul>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3.5 rounded-xl bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-xs text-center block shadow-md"
            >
              Get All-Access Scholar Plan →
            </Link>
          </div>

          {/* Enterprise / University Bulk */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Institutions</span>
              <h3 className="text-2xl font-black text-[#082B59]">University Campus</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#082B59]">Custom</span>
              </div>
              <p className="text-xs text-slate-500">For colleges, universities, and corporate engineering teams.</p>

              <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-gray-100">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#28A745]" /> Custom LMS integration</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#28A745]" /> Dedicated dean & admin analytics</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#28A745]" /> Institutional co-branded certificates</li>
              </ul>
            </div>

            <Link
              href="/contact"
              className="w-full py-3 rounded-xl bg-[#082B59] hover:bg-navy-800 text-white font-bold text-xs text-center block"
            >
              Contact Campus Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
