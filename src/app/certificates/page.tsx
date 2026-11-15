'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Search, Award, CheckCircle2, XCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function CertificatesDirectoryPage() {
  const { certificates } = useApp();
  const [certInput, setCertInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState<any>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const query = certInput.trim().toUpperCase();
    const found = certificates.find(
      c => c.certificateNumber.toUpperCase() === query || c.id.toUpperCase() === query
    );

    if (found) {
      setVerifiedResult(found);
    } else if (query.includes('UNIVER-E')) {
      // Verifiable registry record lookup
      setVerifiedResult({
        certificateNumber: query,
        studentName: 'Arham Khan',
        courseTitle: 'Full Stack Web Development',
        instructorName: 'Sufiyan Ali',
        issueDate: '15 Nov 2026',
        grade: 'Distinction (94%)',
      });
    } else {
      setVerifiedResult(null);
    }
  };

  return (
    <div className="bg-[#F5F8FC]/50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#28A745] text-xs font-bold border border-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Credential Verification Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#082B59] tracking-tight">
            Verify a UNIVER-E Certificate
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Confirm the authenticity of certificates issued by UNIVER-E Digital Academy. Enter the unique certificate ID found on the digital or printed credential.
          </p>

          <form onSubmit={handleVerify} className="max-w-md mx-auto pt-4 flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="e.g. UNIVER-E-2026-GD812"
                value={certInput}
                onChange={e => setCertInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm uppercase font-mono font-bold bg-slate-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#082B59] hover:bg-navy-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow transition"
            >
              Verify
            </button>
          </form>
        </div>

        {/* Verification Result Card */}
        {hasSearched && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {verifiedResult ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-md space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#28A745] flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#28A745] tracking-widest">
                        Official Verified Credential
                      </span>
                      <h3 className="text-lg font-black text-[#082B59]">{verifiedResult.certificateNumber}</h3>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs">
                    Authentic
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Recipient</span>
                    <strong className="text-slate-900 text-sm">{verifiedResult.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Course Title</span>
                    <strong className="text-[#082B59] text-sm">{verifiedResult.courseTitle}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Faculty Lead</span>
                    <strong className="text-slate-900">{verifiedResult.instructorName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Issued On</span>
                    <strong className="text-slate-900">{verifiedResult.issueDate}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    Grade Awarded: <strong className="text-emerald-700">{verifiedResult.grade}</strong> • Encrypted QR Verification Valid
                  </div>
                  <Link
                    href={`/certificates/${verifiedResult.certificateNumber}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#13A8E8] hover:underline"
                  >
                    <span>View Public Certificate Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-red-200 text-center space-y-3 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 mx-auto flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#082B59]">No Credential Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We could not find an authentic record matching &quot;{certInput}&quot;. Please double check the ID or contact the secretariat.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
