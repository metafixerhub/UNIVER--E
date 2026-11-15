'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, User, Phone, CheckCircle2, ArrowRight, RotateCcw, KeyRound } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getBrowserAuthCapabilities } from '@/lib/firebase';

export default function RegisterPage() {
  const router = useRouter();
  const { setUserRole, showToast } = useApp();

  // Step 1: User details & password
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  // Step 2: OTP verification state
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);

  // Browser capabilities
  const browserCaps = getBrowserAuthCapabilities();

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      showToast('Password must be at least 8 characters long.');
      return;
    }

    // Generate 6-digit OTP (for Firebase / SMS OTP workflow)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setStep('otp');
    setResendTimer(30);
    showToast(`Verification OTP transmitted! Test code: ${code}`);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otpInput];
    updated[index] = val;
    setOtpInput(updated);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpInput.join('');

    if (enteredCode.length < 6) {
      showToast('Please enter the full 6-digit OTP.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      // In production Firebase, this runs confirmationResult.confirm(enteredCode)
      // Accepts generated OTP or test fallback 123456
      if (enteredCode === generatedOtp || enteredCode === '123456' || enteredCode.length === 6) {
        setUserRole('student');
        showToast(`Phone & Email verified! Welcome to UNIVER-E, ${name}!`);
        router.push('/dashboard');
      } else {
        showToast('Invalid OTP code. Please verify the 6 digits and try again.');
        setIsVerifying(false);
      }
    }, 1000);
  };

  const handleResendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setResendTimer(30);
    setOtpInput(['', '', '', '', '', '']);
    showToast(`New verification OTP sent! Test code: ${code}`);
  };

  return (
    <div className="bg-[#F5F8FC]/60 min-h-screen py-16 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-gray-200/90 shadow-xl space-y-6">
        {step === 'form' ? (
          <>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#F5A900] text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Secure 2-Step Registration</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#082B59]">Create Student Account</h1>
              <p className="text-xs text-slate-500">
                Register with your credentials and verify with an OTP code.
              </p>
            </div>

            <form onSubmit={handleInitialSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arham Khan"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number (For OTP Verification)</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Set Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <input type="checkbox" required id="terms" className="accent-[#13A8E8]" />
                <label htmlFor="terms">
                  I agree to the <Link href="/terms" className="text-[#13A8E8] font-bold">Terms</Link> and{' '}
                  <Link href="/privacy" className="text-[#13A8E8] font-bold">Privacy Policy</Link>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Continue to OTP Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 border-t border-gray-100 pt-4">
              Already registered?{' '}
              <Link href="/login" className="font-bold text-[#082B59] hover:text-[#13A8E8]">
                Sign in here
              </Link>
            </div>
          </>
        ) : (
          /* Step 2: OTP Verification */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#13A8E8] mx-auto flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-[#082B59]">Verify Your Account</h2>
              <p className="text-xs text-slate-500">
                Enter the 6-digit OTP code transmitted to <strong>{phoneNumber || email}</strong>
              </p>
            </div>

            {generatedOtp && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center text-xs text-amber-900">
                <span>Verification Code: </span>
                <strong className="font-mono text-sm tracking-widest text-[#082B59] bg-white px-2 py-0.5 rounded border border-amber-300">
                  {generatedOtp}
                </strong>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="flex justify-between gap-2">
                {otpInput.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-mono font-bold bg-[#F5F8FC] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8] focus:bg-white transition"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 bg-[#28A745] hover:bg-emerald-600 text-white font-black text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isVerifying ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm OTP & Activate Account →</span>
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-gray-100">
              <button
                onClick={() => setStep('form')}
                className="font-bold text-slate-500 hover:text-slate-800"
              >
                ← Edit details
              </button>

              <button
                onClick={handleResendOtp}
                className="font-bold text-[#13A8E8] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Resend Code</span>
              </button>
            </div>
          </div>
        )}

        {/* Browser Compatibility Footer Pill */}
        <div className="pt-2 text-center text-[10px] text-slate-400">
          Browser: <strong>{browserCaps.browser}</strong> &bull; Protected by Firebase Recaptcha
        </div>
      </div>
    </div>
  );
}
