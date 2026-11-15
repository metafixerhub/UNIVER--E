'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquareText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ContactPage() {
  const { submitInquiry } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitInquiry({ name, email, message });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F5F8FC]/50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#13A8E8] text-xs font-bold">
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>Connect with Us</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#082B59] tracking-tight">
            We are here to help you succeed
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Have questions regarding admissions, course syllabus, university partnerships, or technical issues? All inquiries route directly to the Admin Portal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-[#082B59]">Campus & Headquarters</h3>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#13A8E8] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Academic Secretariat</h4>
                    <p>UNIVER-E Tower, Tech Hub, Whitefield, Bengaluru, Karnataka 560066, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F5A900] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Email Inquiries</h4>
                    <p>support@univer-e.in (Learner Support)</p>
                    <p>admin@univer-e.in (Direct Administration)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#28A745] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Toll-Free Helpline</h4>
                    <p>+91 (080) 4123-8900 (Mon - Sat, 9:00 AM - 7:00 PM IST)</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#F5A900]" />
                  <span>Direct Admin Routing</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Submissions are instantly stored in the central MongoDB Atlas registry and surfaced in the verified Admin Portal.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-[#28A745] mx-auto animate-bounce" />
                <h3 className="text-2xl font-black text-[#082B59]">Inquiry Transmitted to Admin!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. Your inquiry has been routed directly into the UNIVER-E Admin Portal and logged into the secure database.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-slate-700 transition"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="text-xl font-black text-[#082B59] mb-4">Send an Inquiry</h3>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Arham Khan"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="arham.khan@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inquiry Details</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Describe your inquiry, course question, or feedback for the admin team..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-[#082B59] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 font-bold" />
                      <span>Transmit to Admin Portal →</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
