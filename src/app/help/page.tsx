'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, Search, ChevronDown, ChevronUp, FileQuestion, BookOpen, CreditCard, Award } from 'lucide-react';
import { FAQS } from '@/data/categories';

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter(
    f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#F5F8FC]/50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#13A8E8] text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support & Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#082B59] tracking-tight">
            How can we assist you today?
          </h1>

          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search help articles, certificates, refunds..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>
        </div>

        {/* Quick Topic Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center space-y-2 hover:border-[#13A8E8] transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#13A8E8] mx-auto flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-[#082B59]">Course Access</h4>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center space-y-2 hover:border-[#13A8E8] transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#28A745] mx-auto flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-[#082B59]">Certificates</h4>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center space-y-2 hover:border-[#13A8E8] transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#F5A900] mx-auto flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-[#082B59]">UPI & Payments</h4>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center space-y-2 hover:border-[#13A8E8] transition">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#13A8E8] mx-auto flex items-center justify-center">
              <FileQuestion className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-[#082B59]">Final Exams</h4>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-xl font-black text-[#082B59] mb-4">Frequently Asked Questions</h3>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-[#082B59] hover:bg-slate-50 transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-gray-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
