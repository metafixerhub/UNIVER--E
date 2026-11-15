'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="bg-[#F5F8FC]/50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#13A8E8] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#082B59]">Privacy & Data Governance Policy</h1>
              <p className="text-xs text-slate-400">Effective Date: November 2026 • Compliant with Indian DPDP Act 2023</p>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 border-t border-gray-100 pt-6">
            <h3 className="text-base font-bold text-[#082B59]">1. Information Collection & Purpose</h3>
            <p>
              UNIVER-E collects only necessary registration details (name, email address, password hash) and learning metadata (quiz attempts, video progress timestamps, certificate records) solely to personalize student progress and issue verifiable credentials.
            </p>

            <h3 className="text-base font-bold text-[#082B59]">2. Payment Data & Gateway Security</h3>
            <p>
              UNIVER-E never retains or stores raw credit/debit card numbers or UPI MPINs. All transactions are securely routed through PCI-DSS Level 1 certified Indian payment aggregators utilizing 256-bit SSL encryption.
            </p>

            <h3 className="text-base font-bold text-[#082B59]">3. Public Certificate Verification</h3>
            <p>
              When a student earns an official UNIVER-E credential, the recipient name, course title, and completion date are recorded in our public verification registry accessible via unique identifier and QR code.
            </p>

            <h3 className="text-base font-bold text-[#082B59]">4. Student Data Rights & Erasure</h3>
            <p>
              Learners retain the right to download their full learning transcript, request account anonymization, or contact our Data Protection Officer at privacy@univer-e.in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
