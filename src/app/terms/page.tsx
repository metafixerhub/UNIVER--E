'use client';

import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-[#F5F8FC]/50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#F5A900] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#082B59]">Terms & Conditions of Service</h1>
              <p className="text-xs text-slate-400">Effective Date: November 2026 • UNIVER-E Digital Academy</p>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 border-t border-gray-100 pt-6">
            <h3 className="text-base font-bold text-[#082B59]">1. Platform Nature & Educational Scope</h3>
            <p>
              UNIVER-E provides industry-grade digital training programs and skill-based certificates. Unless explicitly stated in specific degree tracks, standard courses represent professional skill credentials and do not imply formal UGC/AICTE degree recognition.
            </p>

            <h3 className="text-base font-bold text-[#082B59]">2. Lifetime Access & Content Rights</h3>
            <p>
              Enrolled students receive lifetime non-exclusive access to course lectures and materials for personal study. Redistribution, screen recording, or unauthorized public re-broadcasting is strictly prohibited.
            </p>

            <h3 className="text-base font-bold text-[#082B59]">3. Refund Policy (30-Day Guarantee)</h3>
            <p>
              Paid courses carry a 30-day satisfaction guarantee, provided less than 25% of the curriculum video duration has been consumed and no official final examination certificate has been issued.
            </p>

            <h3 className="text-base font-bold text-[#082B59]">4. Academic Honor Code</h3>
            <p>
              Candidates agree to take all certification assessments independently without unauthorized collaboration or automated answer generation scripts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
