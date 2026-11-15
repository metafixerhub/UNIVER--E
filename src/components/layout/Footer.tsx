'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Youtube, Instagram, Facebook, Linkedin, Twitter, CheckCircle2, Mail } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useApp();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      showToast('Thank you for subscribing to UNIVER-E updates!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#082B59] text-white pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 select-none">
              <div className="w-10 h-10 relative flex-shrink-0 bg-white rounded-lg p-0.5">
                <Image
                  src="/images/logo.jpg"
                  alt="UNIVER-E Logo"
                  width={38}
                  height={38}
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <div className="font-black text-2xl tracking-tight font-brand whitespace-nowrap leading-none flex items-baseline">
                <span className="text-white">UNIVER</span>
                <span className="text-[#F5A900] inline-block whitespace-nowrap">&#8209;E</span>
              </div>
            </Link>

            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              A modern e-learning platform to build skills, knowledge and a better future for learners, creators and professionals across India and the globe.
            </p>

            <div className="pt-1 text-xs text-slate-300 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#F5A900]" />
              <a href="mailto:univer-e-services@protonmail.com" className="hover:text-[#F5A900] font-mono transition">
                univer-e-services@protonmail.com
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F5A900] hover:text-[#082B59] flex items-center justify-center transition text-slate-200"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F5A900] hover:text-[#082B59] flex items-center justify-center transition text-slate-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F5A900] hover:text-[#082B59] flex items-center justify-center transition text-slate-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F5A900] hover:text-[#082B59] flex items-center justify-center transition text-slate-200"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F5A900] hover:text-[#082B59] flex items-center justify-center transition text-slate-200"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Learn Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Learn</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/courses" className="hover:text-[#F5A900] transition">
                  Explore Courses
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-[#F5A900] transition">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/departments" className="hover:text-[#F5A900] transition">
                  Departments
                </Link>
              </li>
              <li>
                <Link href="/courses?price=free" className="hover:text-[#F5A900] transition">
                  Free Courses
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="hover:text-[#F5A900] transition">
                  Verify Certificate
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/about" className="hover:text-[#F5A900] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/instructors" className="hover:text-[#F5A900] transition">
                  Academic Faculty
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F5A900] transition">
                  Careers &amp; Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F5A900] transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Newsletter Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Stay Updated</h4>
            <p className="text-xs text-slate-300 mb-3">
              Subscribe to get new courses, free tutorials and promotional offers directly to your inbox.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Subscribed successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-3 pr-11 py-2.5 text-xs rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A900]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 w-8 h-8 rounded-md bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] flex items-center justify-center transition"
                >
                  <ArrowRight className="w-4 h-4 font-bold" />
                </button>
              </form>
            )}

            <div className="mt-5 space-y-1.5 text-xs text-slate-400">
              <Link href="/help" className="block hover:text-white transition">
                Help Center &amp; FAQs
              </Link>
              <div className="flex items-center gap-3 pt-1">
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-white transition">
                  Terms &amp; Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 UNIVER-E. All Rights Reserved. Empowering Education in India &amp; Worldwide.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>ISO 9001:2015 Compliant Pedagogical Framework</span>
            <span>•</span>
            <span>100% Encrypted &amp; Secure Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
