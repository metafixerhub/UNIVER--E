'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Users, BookOpen, ArrowRight, Award } from 'lucide-react';
import { INSTRUCTORS } from '@/data/courses';

export default function InstructorsPage() {
  return (
    <div className="bg-[#F5F8FC]/50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#13A8E8] text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Faculty & Mentors</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#082B59] tracking-tight">
            Distinguished Global Faculty
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Learn from verified practitioners who bring engineering excellence and deep industry knowledge directly into the classroom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(INSTRUCTORS).map(inst => (
            <div key={inst.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={inst.avatar} alt={inst.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm" />
                  <div>
                    <h3 className="text-base font-bold text-[#082B59]">{inst.name}</h3>
                    <p className="text-xs text-[#13A8E8] font-bold">{inst.title}</p>
                    {inst.badge && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700">
                        {inst.badge}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{inst.bio}</p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center text-xs">
                  <div>
                    <div className="font-bold text-amber-500">★ {inst.rating}</div>
                    <div className="text-[10px] text-slate-400">Rating</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#082B59]">{(inst.studentsCount / 1000).toFixed(1)}K</div>
                    <div className="text-[10px] text-slate-400">Scholars</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#13A8E8]">{inst.coursesCount}</div>
                    <div className="text-[10px] text-slate-400">Courses</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <Link
                  href={`/instructors/${inst.id}`}
                  className="w-full py-2.5 rounded-xl bg-[#082B59] hover:bg-navy-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <span>View Instructor Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
