'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, Share2, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import QRCode from 'qrcode';
import { Certificate } from '@/types';
import { useApp } from '@/context/AppContext';

interface CertificateModalProps {
  certificate: Certificate;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, isOpen, onClose }) => {
  const { showToast } = useApp();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    if (certificate && isOpen) {
      const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://univer-e.in'}/certificates/${certificate.certificateNumber}`;
      QRCode.toDataURL(verifyUrl, { width: 120, margin: 1 })
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error(err));
    }
  }, [certificate, isOpen]);

  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(
        `${window.location.origin}/certificates/${certificate.certificateNumber}`
      );
      showToast('Certificate verification link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl relative border-4 border-double border-amber-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition no-print"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Body Container */}
        <div className="border-2 border-slate-200 rounded-2xl p-6 sm:p-10 bg-gradient-to-b from-white via-[#F5F8FC]/60 to-white text-center relative overflow-hidden">
          {/* Subtle Decorative Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <span className="text-9xl font-black text-[#082B59]">UNIVER-E</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-xl bg-[#082B59] flex items-center justify-center text-white font-black text-xl">
                U-E
              </div>
              <div>
                <h2 className="text-xl font-black text-[#082B59] font-brand tracking-tight">UNIVER-E</h2>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                  Digital Academy & Skill Credentials
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Credential</span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 mt-1">ID: {certificate.certificateNumber}</p>
            </div>
          </div>

          {/* Certificate Awarded To */}
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">
            This is to certify that
          </p>
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

          {/* Signatures & QR Code */}
          <div className="grid grid-cols-3 gap-4 items-end pt-6 border-t border-gray-200 mt-6 text-left">
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
              {qrCodeDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code Verification"
                  className="w-20 h-20 border border-slate-200 rounded p-1 bg-white shadow-sm"
                />
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
                <p className="text-[11px] font-bold text-slate-800">Issuance Date</p>
                <p className="text-[10px] text-slate-500">Tamper-Proof Ledger</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 no-print">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Publicly shareable on LinkedIn, resumes & portfolio.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Link</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#082B59] hover:bg-navy-800 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
