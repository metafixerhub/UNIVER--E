'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  Star,
  X,
  RotateCcw,
} from 'lucide-react';
import { COURSES } from '@/data/courses';
import { CATEGORIES } from '@/data/categories';
import { CourseCard } from '@/components/common/CourseCard';
import { Course } from '@/types';
import { useApp } from '@/context/AppContext';

function CoursesContent() {
  const { courses: appCourses } = useApp();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPrice, setSelectedPrice] = useState<'all' | 'free' | 'paid'>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'popularity' | 'newest' | 'price-asc' | 'price-desc'>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Filter & Sort Logic using dynamic AppContext courses with fallback
  const filteredCourses = useMemo(() => {
    const list = appCourses && appCourses.length > 0 ? appCourses : COURSES;
    return list.filter(course => {
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(q);
        const matchesDesc = course.description.toLowerCase().includes(q);
        const matchesInstructor = course.instructor.name.toLowerCase().includes(q);
        const matchesCategory = course.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesInstructor && !matchesCategory) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && course.category !== selectedCategory) {
        return false;
      }

      // Price filter
      if (selectedPrice === 'free' && !course.isFree) return false;
      if (selectedPrice === 'paid' && course.isFree) return false;

      // Level filter
      if (selectedLevel !== 'all' && course.level !== selectedLevel) return false;

      // Rating filter
      if (minRating > 0 && course.rating < minRating) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popularity') return b.studentsCount - a.studentsCount;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0);
      return 0;
    });
  }, [appCourses, search, selectedCategory, selectedPrice, selectedLevel, minRating, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedPrice('all');
    setSelectedLevel('all');
    setMinRating(0);
    setSortBy('popularity');
  };

  const totalCourseCount = (appCourses && appCourses.length > 0) ? appCourses.length : COURSES.length;

  return (
    <div className="bg-[#F5F8FC]/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#13A8E8]">
              Comprehensive Academic Catalog
            </span>
            <h1 className="text-3xl font-black text-[#082B59] mt-1 tracking-tight">Explore Courses</h1>
            <p className="text-sm text-slate-500 mt-1">
              Discover industry-approved programs taught by distinguished Indian and global leaders.
            </p>
          </div>

          {/* Search bar inside header */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by title, instructor, skill..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#F5F8FC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Layout: Sidebar Filter + Course Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm h-fit sticky top-28">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 font-black text-sm text-[#082B59]">
                <Filter className="w-4 h-4 text-[#F5A900]" />
                <span>Filter Courses</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Category
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedCategory === 'All'
                      ? 'bg-[#082B59] text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All Categories ({totalCourseCount})
                </button>
                {CATEGORIES.filter(c => c.id !== 'more').map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedCategory === cat.name
                        ? 'bg-[#082B59] text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="border-t border-gray-100 pt-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Price
              </label>
              <div className="flex flex-col gap-1.5">
                {[
                  { id: 'all', label: 'All Courses' },
                  { id: 'free', label: 'Free Only' },
                  { id: 'paid', label: 'Paid Courses' },
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPrice === opt.id}
                      onChange={() => setSelectedPrice(opt.id as any)}
                      className="accent-[#13A8E8]"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="border-t border-gray-100 pt-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Skill Level
              </label>
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Minimum Rating */}
            <div className="border-t border-gray-100 pt-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Minimum Rating
              </label>
              <div className="space-y-1">
                {[4.5, 4.0, 3.5].map(ratingVal => (
                  <button
                    key={ratingVal}
                    onClick={() => setMinRating(minRating === ratingVal ? 0 : ratingVal)}
                    className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs transition ${
                      minRating === ratingVal ? 'bg-amber-50 text-amber-800 font-bold' : 'text-slate-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </div>
                    <span>{ratingVal} Stars &amp; above</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Control Bar: Count, Sort, Grid/List */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-600 font-medium">
                Showing <strong className="text-[#082B59]">{filteredCourses.length}</strong> matching courses
                {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilter(!showMobileFilter)}
                  className="lg:hidden px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 flex items-center gap-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-slate-700 focus:outline-none"
                  >
                    <option value="popularity">Most Popular</option>
                    <option value="newest">Newly Added</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>

                {/* Grid / List View Toggle */}
                <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid View"
                    className={`p-1.5 rounded-md transition ${
                      viewMode === 'grid' ? 'bg-white shadow text-[#082B59]' : 'text-slate-500'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    aria-label="List View"
                    className={`p-1.5 rounded-md transition ${
                      viewMode === 'list' ? 'bg-white shadow text-[#082B59]' : 'text-slate-500'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filter Drawer */}
            {showMobileFilter && (
              <div className="lg:hidden bg-white p-4 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="font-bold text-xs uppercase text-slate-700">Filter By Category</span>
                  <button onClick={resetFilters} className="text-xs text-red-500">
                    Reset
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedCategory === 'All' ? 'bg-[#082B59] text-white' : 'bg-gray-100 text-slate-700'
                    }`}
                  >
                    All
                  </button>
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.name)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedCategory === c.name ? 'bg-[#082B59] text-white' : 'bg-gray-100 text-slate-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Course Cards Container */}
            {filteredCourses.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredCourses.map(course => (
                  <CourseCard key={course.id} course={course} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#082B59]">No courses matched your filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing the category filter or searching with different keywords.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#F5A900] text-[#082B59] font-bold text-xs rounded-xl shadow-sm hover:bg-[#D99500]"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F8FC]/50 flex items-center justify-center p-12">
          <div className="w-10 h-10 border-4 border-[#082B59] border-t-[#F5A900] rounded-full animate-spin"></div>
        </div>
      }
    >
      <CoursesContent />
    </Suspense>
  );
}
