'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Trash2,
  ShieldCheck,
  QrCode,
  CreditCard,
  Building2,
  Tag,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { COURSES } from '@/data/courses';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, enrollCourse, showToast } = useApp();

  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fallback demo course if cart is empty
  const displayItems = cart.length > 0 ? cart : [COURSES[1]]; // Full Stack Web Development

  const subtotal = displayItems.reduce((acc, c) => acc + (c.isFree ? 0 : c.price), 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'UNIVERE50') {
      setDiscountPercent(50);
      showToast('Coupon UNIVERE50 applied! 50% discount added.');
    } else {
      showToast('Invalid coupon. Try "UNIVERE50"');
    }
  };

  const handleCompleteOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      displayItems.forEach(c => enrollCourse(c.id));
      clearCart();

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }, 1400);
  };

  return (
    <div className="bg-[#F5F8FC]/60 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-3xl font-black text-[#082B59]">Shopping Cart & Checkout</h1>

        {isSuccess ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-emerald-200 shadow-xl space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#28A745] mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-[#082B59]">Payment Successful!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your courses have been activated in your Student Dashboard. Redirecting to classroom...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cart Items */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-base font-bold text-[#082B59]">
                    Selected Courses ({displayItems.length})
                  </h3>
                  {cart.length > 0 && (
                    <button onClick={clearCart} className="text-xs text-red-500 hover:underline">
                      Clear Cart
                    </button>
                  )}
                </div>

                <div className="divide-y divide-gray-100">
                  {displayItems.map(item => (
                    <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.thumbnail} alt={item.title} className="w-16 h-11 rounded-lg object-cover" />
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#082B59] line-clamp-1">{item.title}</h4>
                          <span className="text-[11px] text-slate-500">By {item.instructor.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <span className="text-sm font-black text-[#082B59]">
                          {item.isFree ? 'Free' : `₹${item.price.toLocaleString('en-IN')}`}
                        </span>
                        {cart.length > 0 && (
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Indian Payment Method Selector */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-[#082B59]">Select Payment Method (India)</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                      paymentMethod === 'upi'
                        ? 'border-[#13A8E8] bg-sky-50 text-[#082B59]'
                        : 'border-gray-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#13A8E8]" />
                    <span>Instant UPI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                      paymentMethod === 'card'
                        ? 'border-[#13A8E8] bg-sky-50 text-[#082B59]'
                        : 'border-gray-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#F5A900]" />
                    <span>RuPay / Cards</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
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
                  <div className="p-4 bg-[#F5F8FC] rounded-2xl border border-gray-200 text-center space-y-2">
                    <p className="text-xs text-slate-600">Scan QR with PhonePe, Google Pay, Paytm, or BHIM</p>
                    <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl border border-gray-200 flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-slate-800" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border">
                      upi.univere@icici
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-[#082B59]">Order Summary</h3>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Coupon code (UNIVERE50)"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none"
                  />
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Apply
                </button>
              </form>

              <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount (-{discountPercent}%)</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-[#082B59] pt-3 border-t border-gray-200">
                  <span>Total Payable:</span>
                  <span className="text-2xl text-[#082B59]">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleCompleteOrder}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-sm tracking-wide shadow-md transition disabled:opacity-75 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-[#082B59] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  `Pay ₹${finalTotal.toLocaleString('en-IN')} & Start Learning →`
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted 256-Bit SSL Checkout. No raw card storage.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
