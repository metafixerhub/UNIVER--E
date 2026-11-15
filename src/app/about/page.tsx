'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap,
  Award,
  Globe2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { INSTRUCTORS } from '@/data/courses';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen space-y-16 py-12">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-[#13A8E8] text-xs font-bold border border-blue-100">
          <GraduationCap className="w-4 h-4" />
          <span>About UNIVER-E</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-[#082B59] tracking-tight max-w-3xl mx-auto leading-tight">
          Democratizing World-Class Digital Education for Millions of Learners.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Founded with a mission to bridge the gap between academic theory and real-world industrial mastery, UNIVER-E combines university-caliber curriculum rigor with the agility of modern tech bootcamps.
        </p>
      </section>

      {/* Core Values & Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#F5F8FC] border border-gray-100 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#082B59] text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-[#082B59]">Academic Excellence</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every course is built by seasoned industry fellows with rigorous review cycles, hands-on capstone projects, and real code evaluations.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F5F8FC] border border-gray-100 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F5A900] text-[#082B59] flex items-center justify-center font-bold">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-[#082B59]">National & Global Reach</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Designed from India for the world, supporting regional subtitles, affordable Indian rupee pricing, and UPI payments for seamless access.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F5F8FC] border border-gray-100 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#28A745] text-white flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-[#082B59]">Verifiable Credentials</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Digital certificates equipped with unique tamper-evident verification numbers and public QR scanning for employers and LinkedIn.
            </p>
          </div>
        </div>
      </section>

      {/* Meet Academic Leadership */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-[#082B59]">Our Academic & Industry Mentors</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Learn from engineers and educators who have architected systems at top technology enterprises.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(INSTRUCTORS).slice(0, 3).map(mentor => (
            <div key={mentor.id} className="p-6 rounded-3xl border border-gray-200 bg-white shadow-sm flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mentor.avatar} alt={mentor.name} className="w-16 h-16 rounded-2xl object-cover" />
              <div>
                <h4 className="text-base font-bold text-[#082B59]">{mentor.name}</h4>
                <p className="text-xs text-[#13A8E8] font-semibold">{mentor.title}</p>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{mentor.bio}</p>
                <Link href={`/instructors/${mentor.id}`} className="text-xs font-bold text-[#082B59] hover:underline mt-2 inline-block">
                  View Profile & Courses →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#082B59] rounded-3xl p-8 sm:p-12 text-white text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-black">Ready to Begin Your Educational Journey?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Join over 50,000 learners advancing their careers in AI, Software Engineering, and Digital Design.
          </p>
          <div className="pt-2">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-sm"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-4 h-4 font-bold" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
