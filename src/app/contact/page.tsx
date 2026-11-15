'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquareText, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ContactPage() {
  const { showToast } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been received by the UNIVER-E support team!');
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
            Have questions regarding admissions, course syllabus, university partnerships, or technical issues?
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
                    <p>admissions@univer-e.in (Programs)</p>
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
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#28A745] mx-auto" />
                <h3 className="text-2xl font-black text-[#082B59]">Message Transmitted!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thank you for contacting UNIVER-E. An academic counselor will reach out via email within 4 business hours.
                </p>
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
                    placeholder="Describe your inquiry, course question, or feedback..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 font-bold" />
                  <span>Transmit Message →</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
