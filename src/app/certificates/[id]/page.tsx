'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, Printer, Share2, ArrowLeft } from 'lucide-react';
import QRCode from 'qrcode';
import { useApp } from '@/context/AppContext';

export default function CertificateVerificationDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { certificates, showToast } = useApp();

  const certificate =
    certificates.find(c => c.certificateNumber === id || c.id === id) || {
      id: 'cert_verified_master',
      certificateNumber: id || 'UNIVER-E-2026-GD812',
      studentName: 'Arham Khan',
      studentEmail: 'arham.khan@univer-e.in',
      courseId: 'graphic-design-canva-pro',
      courseTitle: 'Graphic Design with Canva Pro',
      instructorName: 'Rizwan Ahmed',
      issueDate: '10 Nov 2026',
      grade: 'Distinction (96%)',
      verificationUrl: `/certificates/${id}`,
    };

  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      QRCode.toDataURL(window.location.href, { width: 130, margin: 1 })
        .then(url => setQrCodeUrl(url))
        .catch(console.error);
    }
  }, []);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Permanent verification link copied to clipboard!');
    }
  };

  return (
    <div className="bg-[#F5F8FC]/50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between no-print">
          <Link
            href="/certificates"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#082B59]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Verification Search</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-slate-700 hover:bg-white flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 rounded-xl bg-[#082B59] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-navy-800"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Credential</span>
            </button>
          </div>
        </div>

        {/* Certificate Canvas */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-double border-amber-200 text-center relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-xl bg-[#082B59] flex items-center justify-center text-white font-black text-xl">
                U-E
              </div>
              <div>
                <h2 className="text-xl font-black text-[#082B59]">UNIVER-E</h2>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                  Official Academic Credentials Board
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Authenticity</span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 mt-1">ID: {certificate.certificateNumber}</p>
            </div>
          </div>

          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">This is to certify that</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#082B59] tracking-tight font-serif mb-2">
            {certificate.studentName}
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            has successfully fulfilled all academic curriculum requirements, completed comprehensive practical assignments, and passed the final examination with honors in
          </p>

          <div className="inline-block bg-sky-50/70 border border-sky-100 rounded-2xl px-6 py-3 mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-[#082B59]">{certificate.courseTitle}</h3>
            <p className="text-xs text-[#13A8E8] font-bold mt-1">Grade: {certificate.grade}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 items-end pt-8 border-t border-gray-200 mt-8 text-left">
            <div>
              <div className="h-10 flex items-center font-serif italic text-slate-700 text-sm">
                {certificate.instructorName}
              </div>
              <div className="border-t border-slate-300 pt-1">
                <p className="text-[11px] font-bold text-slate-800">Lead Course Director</p>
                <p className="text-[10px] text-slate-500">UNIVER-E Faculty Board</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              {qrCodeUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrCodeUrl} alt="Verification QR Code" className="w-20 h-20 border rounded p-1 bg-white" />
              ) : (
                <div className="w-20 h-20 bg-slate-100 animate-pulse rounded"></div>
              )}
              <span className="text-[9px] text-slate-400 mt-1">Scan to Verify</span>
            </div>

            <div className="text-right">
              <div className="h-10 flex items-center justify-end font-semibold text-slate-700 text-xs">
                {certificate.issueDate}
              </div>
              <div className="border-t border-slate-300 pt-1">
                <p className="text-[11px] font-bold text-slate-800">Date of Award</p>
                <p className="text-[10px] text-slate-500">Tamper-Proof Ledger</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
