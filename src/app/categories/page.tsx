'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { CategoryCard } from '@/components/common/CategoryCard';

export default function CategoriesPage() {
  return (
    <div className="bg-[#F5F8FC]/50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#13A8E8] text-xs font-bold">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Academic Disciplines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#082B59] tracking-tight">
            Course Categories Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Explore 10+ core domains designed to advance your skills from fundamentals to senior practitioner level.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Detailed Category descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {CATEGORIES.filter(c => c.id !== 'more').map(c => (
            <div key={c.id} className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-[#082B59]">{c.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs font-bold text-slate-400">{c.coursesCount} Programs Available</span>
                <Link
                  href={`/courses?category=${encodeURIComponent(c.name)}`}
                  className="text-xs font-bold text-[#13A8E8] hover:text-[#082B59] flex items-center gap-1"
                >
                  <span>Explore</span>
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
