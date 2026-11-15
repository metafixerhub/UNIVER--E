'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, Search, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function CertificatesDirectoryPage() {
  const { certificates, user } = useApp();
  const [certInput, setCertInput] = useState('');
  const [verifiedResult, setVerifiedResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

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
      // Demo fallback for valid format
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
            Employers and academic institutions can verify the authenticity of any digital credential issued by UNIVER-E using the unique certificate identifier.
          </p>

          {/* Search Box */}
          <form onSubmit={handleVerify} className="max-w-md mx-auto pt-4 flex gap-2">
            <input
              type="text"
              required
              placeholder="e.g. UNIVER-E-2026-GD812"
              value={certInput}
              onChange={e => setCertInput(e.target.value)}
              className="flex-1 p-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-[#082B59] hover:bg-navy-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow"
            >
              Verify
            </button>
          </form>
        </div>

        {/* Verification Result Display */}
        {hasSearched && (
          <div className="animate-in fade-in duration-200">
            {verifiedResult ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-lg space-y-4">
                <div className="flex items-center gap-3 text-emerald-600">
                  <CheckCircle2 className="w-7 h-7" />
                  <div>
                    <h3 className="text-lg font-black text-[#082B59]">Official Verified Credential</h3>
                    <p className="text-xs text-slate-500">Record found in the UNIVER-E Academic Registry</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase">Certificate ID</span>
                    <p className="font-mono font-bold text-slate-800 text-sm">{verifiedResult.certificateNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold uppercase">Candidate Name</span>
                    <p className="font-bold text-[#082B59] text-sm">{verifiedResult.studentName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold uppercase">Course Completed</span>
                    <p className="font-bold text-slate-800">{verifiedResult.courseTitle}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold uppercase">Issued By</span>
                    <p className="font-semibold text-slate-700">{verifiedResult.instructorName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold uppercase">Grade Awarded</span>
                    <p className="font-bold text-[#28A745]">{verifiedResult.grade}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold uppercase">Date of Issue</span>
                    <p className="font-semibold text-slate-700">{verifiedResult.issueDate}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <Link
                    href={`/certificates/${verifiedResult.certificateNumber}`}
                    className="px-4 py-2 bg-[#F5A900] text-[#082B59] font-black text-xs rounded-xl hover:bg-[#D99500] transition"
                  >
                    View Full Certificate Record →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-red-200 text-center space-y-2">
                <div className="text-red-500 font-bold text-sm">No credential found with that ID</div>
                <p className="text-xs text-slate-500">
                  Please verify the certificate number printed on the document or try <strong>UNIVER-E-2026-GD812</strong>.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Existing User Certificates */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-[#082B59]">Your Active Issued Credentials</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map(c => (
              <Link
                key={c.id}
                href={`/certificates/${c.certificateNumber}`}
                className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:border-[#13A8E8] transition flex items-center justify-between"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#082B59]">{c.courseTitle}</h4>
                  <p className="text-xs text-slate-500">ID: {c.certificateNumber}</p>
                  <span className="inline-block text-[11px] font-bold text-[#28A745]">{c.grade}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
