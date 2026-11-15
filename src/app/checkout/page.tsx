'use client';

import React, { useState, useEffect } from 'react';
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
  Copy,
  ExternalLink,
  Smartphone,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import QRCode from 'qrcode';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    clearCart,
    enrollCourse,
    showToast,
    user,
    paymentSettings,
    recordUpiTransaction,
    verifyPayment,
  } = useApp();

  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [utrNumber, setUtrNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const displayItems = cart;

  const subtotal = displayItems.reduce((acc, c) => acc + (c.isFree ? 0 : c.price), 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Generate real dynamic UPI payment string & QR Code
  const upiIntentString = `upi://pay?pa=${paymentSettings.upiId}&pn=${encodeURIComponent(
    paymentSettings.merchantName
  )}&am=${finalTotal}&cu=INR&tn=${encodeURIComponent('UNIVER-E Course Enrollment')}`;

  useEffect(() => {
    if (finalTotal > 0) {
      QRCode.toDataURL(upiIntentString, {
        width: 260,
        margin: 1.5,
        color: {
          dark: '#082B59',
          light: '#FFFFFF',
        },
      })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error('QR generation error:', err));
    }
  }, [upiIntentString, finalTotal]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'UNIVERE50') {
      setDiscountPercent(50);
      showToast('Coupon UNIVERE50 applied! 50% discount added.');
    } else {
      showToast('Invalid coupon. Try "UNIVERE50"');
    }
  };

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(paymentSettings.upiId);
      showToast(`Copied UPI ID: ${paymentSettings.upiId}`);
    }
  };

  const handleCompleteOrder = () => {
    if (displayItems.length === 0) {
      showToast('Your shopping cart is empty.');
      return;
    }

    if (finalTotal > 0 && paymentMethod === 'upi') {
      const cleanUtr = utrNumber.trim();
      if (!cleanUtr) {
        showToast('Please enter your 12-digit UPI Transaction Reference / UTR number.');
        return;
      }
      if (!/^\d{12}$/.test(cleanUtr)) {
        showToast('Indian Bank UTR must be exactly 12 digits (e.g. 431902847192).');
        return;
      }
    }

    setIsProcessing(true);

    const runVerification = async () => {
      try {
        if (finalTotal > 0) {
          await verifyPayment({
            method: paymentMethod === 'upi' ? 'upi' : 'razorpay',
            utrNumber: paymentMethod === 'upi' ? utrNumber.trim() : undefined,
            razorpayPaymentId: paymentMethod !== 'upi' ? `pay_${Date.now()}` : undefined,
            studentName: user.name,
            studentEmail: user.email,
            courseTitle: displayItems.map(c => c.title).join(', '),
            amount: finalTotal,
          });
        }

        // Enroll in all purchased courses
        displayItems.forEach(c => {
          enrollCourse(c.id);
        });

        setIsProcessing(false);
        setIsSuccess(true);
        clearCart();

        setTimeout(() => {
          router.push('/dashboard');
        }, 2200);
      } catch (err: any) {
        setIsProcessing(false);
        showToast(err.message || 'Payment processing error.');
      }
    };

    runVerification();
  };

  if (displayItems.length === 0 && !isSuccess) {
    return (
      <div className="bg-[#F5F8FC]/60 min-h-screen py-20">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 bg-blue-50 text-[#13A8E8] rounded-3xl mx-auto flex items-center justify-center">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-[#082B59]">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500">
            Explore our accredited catalog of AI, full stack development, and design courses.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-xs transition shadow-md"
          >
            <span>Explore Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F8FC]/60 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-[#082B59]">Shopping Cart &amp; Checkout</h1>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#28A745] border border-emerald-200">
            0% Fee Direct UPI Payment
          </span>
        </div>

        {isSuccess ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-emerald-200 shadow-xl space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#28A745] mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-[#082B59]">Payment Verified &amp; Enrolled!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your course enrollment has been confirmed with UPI ID <strong>{paymentSettings.upiId}</strong>. Redirecting to your Student Dashboard...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cart Items & Payment Method */}
            <div className="lg:col-span-7 space-y-6">
              {/* Selected Courses */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-base font-bold text-[#082B59]">
                    Selected Courses ({displayItems.length})
                  </h3>
                  <button onClick={clearCart} className="text-xs text-red-500 hover:underline">
                    Clear Cart
                  </button>
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
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#082B59]">Official Payment Gateway (India)</h3>
                  <span className="text-[11px] font-bold text-[#28A745] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Instant Bank Settlement
                  </span>
                </div>

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
                    <span>Instant UPI (Free)</span>
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
                    <span>Cards / RuPay</span>
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
                  <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/20 rounded-2xl border border-blue-100 space-y-4">
                    <div className="text-center space-y-1">
                      <span className="text-[11px] font-bold text-[#13A8E8] uppercase tracking-wider">
                        Scan with Any UPI App
                      </span>
                      <p className="text-xs text-slate-600 font-medium">
                        Google Pay • PhonePe • Paytm • BHIM • Cred • Any Bank UPI
                      </p>
                    </div>

                    {/* Live Scannable Dynamic QR Code */}
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="bg-white p-3 rounded-2xl border-2 border-[#082B59]/20 shadow-md">
                        {qrCodeUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={qrCodeUrl}
                            alt="UNIVER-E Official UPI Payment QR Code"
                            className="w-48 h-48 rounded-xl object-contain"
                          />
                        ) : (
                          <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                            Generating UPI QR...
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 font-bold">UPI ID:</span>
                        <code className="text-xs font-mono font-bold text-[#082B59] bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs">
                          {paymentSettings.upiId}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="p-1.5 text-slate-500 hover:text-[#082B59] hover:bg-white rounded-lg transition"
                          title="Copy UPI ID"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Mobile 1-Click Pay Button */}
                    <div className="pt-1">
                      <a
                        href={upiIntentString}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#082B59] to-[#13A8E8] text-white text-xs font-bold flex items-center justify-center gap-2 shadow hover:opacity-95 transition"
                      >
                        <Smartphone className="w-4 h-4 text-[#F5A900]" />
                        <span>Pay via PhonePe / GPay / Paytm App</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* UTR Reference Input */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-200/60">
                      <label className="block text-xs font-bold text-slate-700">
                        Enter 12-Digit UPI Reference / UTR Number after Payment:
                      </label>
                      <input
                        type="text"
                        maxLength={16}
                        placeholder="e.g. 431902847192"
                        value={utrNumber}
                        onChange={e => setUtrNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-mono border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#28A745]"
                      />
                      <p className="text-[11px] text-slate-500">
                        Found in your payment app under &quot;UPI Transaction ID&quot; or &quot;UTR&quot;.
                      </p>
                    </div>
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
                className="w-full py-4 rounded-2xl bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-sm tracking-wide shadow-md transition disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-[#082B59] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  `Confirm ₹${finalTotal.toLocaleString('en-IN')} UPI Payment →`
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified by Merchant UPI: {paymentSettings.upiId}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
