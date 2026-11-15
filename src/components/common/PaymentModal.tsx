'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ShieldCheck, CheckCircle2, QrCode, CreditCard, Building2, Tag } from 'lucide-react';
import { Course } from '@/types';
import { useApp } from '@/context/AppContext';

interface PaymentModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ course, isOpen, onClose }) => {
  const router = useRouter();
  const { enrollCourse, showToast } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [coupon, setCoupon] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const basePrice = course.isFree ? 0 : course.price;
  const finalPrice = discountApplied ? Math.round(basePrice * 0.5) : basePrice;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'UNIVERE50' || coupon.trim().toUpperCase() === 'WELCOME') {
      setDiscountApplied(true);
      showToast('Promo code applied! 50% discount added.');
    } else {
      showToast('Invalid promo code. Try "UNIVERE50"');
    }
  };

  const handlePayAndEnroll = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      enrollCourse(course.id);

      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        router.push(`/learn/${course.id}`);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#28A745] mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-[#082B59]">Enrollment Confirmed!</h3>
            <p className="text-sm text-slate-600 max-w-xs mx-auto">
              Welcome to <strong>{course.title}</strong>. Redirecting you to the interactive classroom...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#13A8E8]">
                Secure Enrollment & Payment
              </span>
              <h3 className="text-xl font-black text-[#082B59] mt-1">{course.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Instructor: {course.instructor.name}</p>
            </div>

            {/* Price Summary */}
            <div className="bg-[#F5F8FC] rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Course Fee:</span>
                <span className="font-bold text-slate-900">
                  {course.isFree ? 'Free' : `₹${basePrice.toLocaleString('en-IN')}`}
                </span>
              </div>
              {discountApplied && (
                <div className="flex items-center justify-between text-sm text-emerald-600 pt-1 font-semibold">
                  <span>Special Scholarship (-50%):</span>
                  <span>-₹{(basePrice * 0.5).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-base font-black text-[#082B59] pt-2 mt-2 border-t border-gray-200">
                <span>Total Payable:</span>
                <span className="text-xl text-[#082B59]">
                  {finalPrice === 0 ? 'FREE' : `₹${finalPrice.toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>

            {/* Coupon Code Input */}
            {!course.isFree && !discountApplied && (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter coupon code (try UNIVERE50)"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#13A8E8]"
                  />
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Payment Method Selector (Only for paid courses) */}
            {!course.isFree && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">Select Payment Gateway (India):</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                      paymentMethod === 'upi'
                        ? 'border-[#13A8E8] bg-sky-50 text-[#082B59]'
                        : 'border-gray-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#13A8E8]" />
                    <span>UPI / QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                      paymentMethod === 'card'
                        ? 'border-[#13A8E8] bg-sky-50 text-[#082B59]'
                        : 'border-gray-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#F5A900]" />
                    <span>Cards / RuPay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                      paymentMethod === 'netbanking'
                        ? 'border-[#13A8E8] bg-sky-50 text-[#082B59]'
                        : 'border-gray-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <span>Net Banking</span>
                  </button>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 text-center">
                    <p className="text-xs text-slate-600 mb-2">
                      Scan with any UPI App: <strong>GPay, PhonePe, Paytm, BHIM</strong>
                    </p>
                    <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl border border-gray-200 shadow-inner flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-slate-900" />
                    </div>
                    <span className="inline-block mt-2 text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                      upi.univere@icici
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action CTA */}
            <button
              onClick={handlePayAndEnroll}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-sm tracking-wide shadow-md hover:shadow-lg transition duration-200 disabled:opacity-75 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-[#082B59] border-t-transparent rounded-full animate-spin"></div>
              ) : course.isFree ? (
                'Enroll Now for Free →'
              ) : (
                `Complete Payment (₹${finalPrice.toLocaleString('en-IN')}) →`
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>256-Bit SSL Encrypted. 30-Day Money-Back Guarantee.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
