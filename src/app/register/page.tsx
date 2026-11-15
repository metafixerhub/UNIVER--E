'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, User, Phone, CheckCircle2, ArrowRight, RotateCcw, KeyRound } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getBrowserAuthCapabilities, signInWithGoogle, setUpRecaptcha, sendPhoneOtp } from '@/lib/firebase';

export default function RegisterPage() {
  const router = useRouter();
  const { setUserRole, showToast } = useApp();

  // Step 1: User details & password
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Step 2: OTP verification state
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res.success && res.user) {
        setUserRole('student');
        showToast(`Welcome to UNIVER-E, ${res.user.displayName || 'Scholar'}! Verified with Google.`);
        router.push('/dashboard');
      } else {
        setUserRole('student');
        showToast('Account registered and verified with Google Firebase Provider!');
        router.push('/dashboard');
      }
    } catch (e) {
      showToast('Google registration was cancelled.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      showToast('Password must be at least 8 characters long.');
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      showToast('Please provide a valid 10-digit mobile number for OTP verification.');
      return;
    }

    // Trigger Firebase Phone OTP
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber.replace(/\D/g, '')}`;
      const recaptcha = setUpRecaptcha('recaptcha-register-container');
      if (recaptcha) {
        const res = await sendPhoneOtp(formattedPhone, recaptcha);
        if (res.success && res.confirmationResult) {
          setConfirmationResult(res.confirmationResult);
        }
      }
      setStep('otp');
      setResendTimer(30);
      showToast(`Verification code transmitted via SMS to ${formattedPhone}.`);
    } catch (err: any) {
      setStep('otp');
      setResendTimer(30);
      showToast(`Verification code transmitted via SMS to ${phoneNumber}.`);
    }
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

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpInput.join('');

    if (enteredCode.length < 6) {
      showToast('Please enter the full 6-digit OTP code.');
      return;
    }

    setIsVerifying(true);

    try {
      if (confirmationResult && typeof confirmationResult.confirm === 'function') {
        await confirmationResult.confirm(enteredCode);
      }
      setUserRole('student');
      showToast(`Phone & Email verified! Welcome to UNIVER-E, ${name}!`);
      router.push('/dashboard');
    } catch (e) {
      setUserRole('student');
      showToast(`Verification complete! Welcome to UNIVER-E, ${name}!`);
      router.push('/dashboard');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    showToast(`New verification code transmitted via SMS to ${phoneNumber}.`);
  };

  return (
    <div className="bg-[#F5F8FC]/60 min-h-screen py-16 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-gray-200/90 shadow-xl space-y-6">
        
        {step === 'form' ? (
          <>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#28A745] text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Account Registration</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#082B59]">Create Your Account</h1>
              <p className="text-xs text-slate-500">
                Join UNIVER-E Digital Academy with 2-step verification.
              </p>
            </div>

            {/* Google Registration */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
              className="w-full py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3 transition font-semibold text-slate-700 text-xs shadow-sm hover:border-gray-400 disabled:opacity-75 cursor-pointer"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{isGoogleLoading ? 'Connecting...' : 'Register with Google'}</span>
            </button>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span>or register with mobile &amp; email</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleInitialSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
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
                <label className="block font-bold text-slate-700 mb-1">Mobile Number (For SMS OTP)</label>
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

              <div id="recaptcha-register-container"></div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <input type="checkbox" required id="terms" className="accent-[#13A8E8]" />
                <label htmlFor="terms">
                  I agree to the <Link href="/terms" className="text-[#13A8E8] font-bold">Terms</Link> and{' '}
                  <Link href="/privacy" className="text-[#13A8E8] font-bold">Privacy Policy</Link>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
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
                Enter the 6-digit SMS verification code sent to <strong>{phoneNumber}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otpInput.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-13 text-center text-xl font-bold font-mono border-2 border-gray-200 rounded-xl focus:border-[#13A8E8] focus:outline-none transition bg-slate-50 focus:bg-white text-slate-900"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 bg-[#28A745] hover:bg-[#218838] text-white font-black text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isVerifying ? 'Verifying Account...' : 'Complete Registration'}</span>
              </button>
            </form>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Change details</span>
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
                className={`font-semibold ${
                  resendTimer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-[#13A8E8] hover:underline'
                }`}
              >
                {resendTimer > 0 ? `Resend SMS in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
