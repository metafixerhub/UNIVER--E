'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, Mail, Database } from 'lucide-react';

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
              <p className="text-xs text-slate-400">Effective Date: November 15, 2026 • UNIVER-E Digital Academy</p>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-6 border-t border-gray-100 pt-6">
            <section className="space-y-2">
              <h3 className="text-base font-bold text-[#082B59] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#13A8E8]" />
                <span>1. Information Collection &amp; Purpose</span>
              </h3>
              <p>
                UNIVER-E Digital Academy collects personal data including student names, email addresses, verified mobile numbers, and learning progress solely to deliver educational courses, issue verified certificates, and maintain student accounts.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-[#082B59] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#28A745]" />
                <span>2. Payment Security &amp; Zero Card Storage</span>
              </h3>
              <p>
                UNIVER-E never retains or stores raw credit/debit card numbers or UPI MPINs. All transactions are securely routed through PCI-DSS Level 1 certified Indian payment aggregators utilizing 256-bit SSL encryption.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-[#082B59] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#F5A900]" />
                <span>3. Public Certificate Verification Registry</span>
              </h3>
              <p>
                When a student successfully earns a certificate, their registered name, course title, completion date, and unique certificate ID are stored in the tamper-evident registry for public employer verification.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-[#082B59] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#13A8E8]" />
                <span>4. Student Data Rights &amp; Privacy Officer Contact</span>
              </h3>
              <p>
                Learners retain the right to review their learning transcript, request account anonymization, or file privacy inquiries. Contact our dedicated privacy desk directly at:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200">
                <a
                  href="mailto:univer-e-services@protonmail.com"
                  className="text-[#13A8E8] font-bold text-sm hover:underline font-mono"
                >
                  univer-e-services@protonmail.com
                </a>
                <p className="text-[11px] text-slate-500 mt-1">
                  UNIVER-E Digital Academy Secretariat • Response time: 24–48 business hours
                </p>
              </div>
            </section>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-slate-500">
              <Link href="/terms" className="text-[#13A8E8] font-bold hover:underline flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>View Full Terms &amp; Conditions of Service</span>
              </Link>
              <span>Bengaluru, Karnataka, India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
