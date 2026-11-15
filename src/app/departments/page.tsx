'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Users, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';
import { DEPARTMENTS } from '@/data/categories';

export default function DepartmentsPage() {
  return (
    <div className="bg-[#F5F8FC]/50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#F5A900] text-xs font-bold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Academic Faculties</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#082B59] tracking-tight">
            UNIVER-E Academic Departments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Governed by academic deans, providing structured degree-equivalent certification tracks and specialized labs.
          </p>
        </div>

        <div className="space-y-6">
          {DEPARTMENTS.map(dept => (
            <div
              key={dept.id}
              id={dept.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-bold text-[#13A8E8] uppercase tracking-wider">
                  Academic Division
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#082B59]">{dept.name}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{dept.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
                  <span className="font-semibold text-slate-700">Chair: {dept.head}</span>
                  <span>•</span>
                  <span>{dept.programsCount} Structured Courses</span>
                  <span>•</span>
                  <span>{dept.studentsEnrolled.toLocaleString('en-IN')} Active Scholars</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <Link
                  href={`/courses?department=${encodeURIComponent(dept.name)}`}
                  className="px-5 py-3 rounded-2xl bg-[#082B59] hover:bg-navy-800 text-white font-bold text-xs flex items-center gap-2 transition"
                >
                  <span>Explore Department Programs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
