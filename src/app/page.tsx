'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowRight,
  BookOpen,
  Building2,
  GraduationCap,
  Award,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  Quote,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { COURSES } from '@/data/courses';
import { CATEGORIES, TESTIMONIALS, LEARNING_PATHS } from '@/data/categories';
import { StatsBar } from '@/components/common/StatsBar';
import { CategoryCard } from '@/components/common/CategoryCard';
import { CourseCard } from '@/components/common/CourseCard';

export default function HomePage() {
  const router = useRouter();
  const { setSearchQuery } = useApp();

  const [searchInput, setSearchInput] = useState('');
  const [courseFilter, setCourseFilter] = useState<'all' | 'popular' | 'new' | 'free'>('all');
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      router.push(`/courses?search=${encodeURIComponent(searchInput)}`);
    }
  };

  const filteredCourses = COURSES.filter(course => {
    if (courseFilter === 'popular') return course.badge === 'Popular' || course.rating >= 4.8;
    if (courseFilter === 'new') return course.badge === 'New';
    if (courseFilter === 'free') return course.isFree;
    return true;
  });

  const nextTestimonial = () => {
    setTestimonialIndex(prev => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex(prev => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* =========================================================================
          1. HERO SECTION (Matching Mockup with India Flag, Emblem & Search)
          ========================================================================= */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pb-20 bg-gradient-to-b from-white via-[#F5F8FC]/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline, Search, CTAs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200/80 shadow-sm text-xs font-bold text-slate-800">
                <span className="text-base">🇮🇳</span>
                <span>India&apos;s Next-Gen Learning Platform</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#082B59] tracking-tight leading-[1.15]">
                  Learn Today. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5A900] via-[#E88C00] to-[#F5A900]">
                    Lead Tomorrow.
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                A modern e-learning platform to build skills, knowledge and a better future for learners, creators and professionals.
              </p>

              {/* Prominent Search Bar */}
              <form onSubmit={handleHeroSearch} className="max-w-xl relative flex items-center shadow-lg rounded-2xl overflow-hidden border border-gray-200 bg-white">
                <Search className="w-5 h-5 text-slate-400 absolute left-4" />
                <input
                  type="text"
                  placeholder="What do you want to learn today?"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="w-full pl-12 pr-14 py-4 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-2 w-10 h-10 rounded-xl bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] flex items-center justify-center transition shadow-sm hover:scale-105"
                >
                  <Search className="w-5 h-5 font-bold" />
                </button>
              </form>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-sm tracking-wide shadow-md hover:shadow-lg transition duration-200 hover:-translate-y-0.5"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4 font-bold" />
                </Link>

                <Link
                  href="/departments"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#082B59] font-bold text-sm border border-gray-300 shadow-sm transition hover:border-[#13A8E8]"
                >
                  <Building2 className="w-4 h-4 text-slate-600" />
                  <span>Browse Departments</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Visual from Mockup */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                {/* Visual Emblem Image */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white/60">
                  <Image
                    src="/images/logo.jpg"
                    alt="UNIVER-E Brand Crest"
                    fill
                    className="object-contain p-6"
                    priority
                  />
                </div>
              </div>

              {/* Pagination Dots indicator */}
              <div className="flex items-center gap-2 mt-6">
                <span className="w-2.5 h-2.5 rounded-full bg-[#082B59]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. STATS BAR (Courses, Learners, Instructors, Certificates, Satisfaction)
          ========================================================================= */}
      <StatsBar />

      {/* =========================================================================
          3. EXPLORE TOP CATEGORIES
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-[#F5A900] rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#082B59] tracking-tight">
              Explore Top Categories
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-xs sm:text-sm font-bold text-[#13A8E8] hover:text-[#082B59] flex items-center gap-1 transition"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
          {CATEGORIES.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. FEATURED COURSES (With filter tabs: All, Popular, New, Free)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-[#F5A900] rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#082B59] tracking-tight">
              Featured Courses
            </h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <div className="flex items-center bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setCourseFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  courseFilter === 'all'
                    ? 'bg-[#082B59] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Courses
              </button>
              <button
                onClick={() => setCourseFilter('popular')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  courseFilter === 'popular'
                    ? 'bg-[#082B59] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Popular
              </button>
              <button
                onClick={() => setCourseFilter('new')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  courseFilter === 'new'
                    ? 'bg-[#082B59] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                New
              </button>
              <button
                onClick={() => setCourseFilter('free')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  courseFilter === 'free'
                    ? 'bg-[#082B59] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Free
              </button>
            </div>

            <Link
              href="/courses"
              className="text-xs font-bold text-[#13A8E8] hover:text-[#082B59] flex items-center gap-1 ml-2 transition flex-shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {filteredCourses.slice(0, 5).map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          5. LEARNING PATHS BANNER
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-sky-50 rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EC4899]/15 text-[#EC4899] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#082B59]">
                Choose a Learning Path & Build Your Career
              </h3>
              <p className="text-xs text-slate-500">
                Curated step-by-step tracks with real capstone projects and certifications.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
            {LEARNING_PATHS.map(path => (
              <Link
                key={path.id}
                href={`/courses?path=${path.slug}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-gray-200/80 shadow-sm text-xs font-bold text-slate-700 hover:border-[#13A8E8] hover:text-[#082B59] transition hover:-translate-y-0.5"
              >
                <span>{path.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. WHY CHOOSE UNIVER-E?
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-7 bg-[#F5A900] rounded-full"></div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#082B59] tracking-tight">
            Why Choose UNIVER-E?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#13A8E8] flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#082B59] mb-1">Industry-Relevant Courses</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Learn practical, real-world skills designed in tandem with leading Indian and international technology firms.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F5A900] flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#082B59] mb-1">Expert Instructors</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Learn directly from experienced mentors, veteran engineers, and seasoned industry leaders.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#13A8E8] flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#082B59] mb-1">Flexible Learning</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Learn anytime, anywhere at your own pace with lifetime video access, downloadable notes, and mobile sync.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#28A745] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#082B59] mb-1">Verifiable Certificates</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Showcase your skills with QR-verified digital certificates recognized by recruiters worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. WHAT OUR LEARNERS SAY? (Testimonials)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-[#F5A900] rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#082B59] tracking-tight">
              What Our Learners Say?
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevTestimonial}
              aria-label="Previous Testimonial"
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 text-slate-700 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextTestimonial}
              aria-label="Next Testimonial"
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 text-slate-700 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Testimonials 3-Card Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.slice(0, 3).map(testimonial => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-slate-200 absolute top-5 right-5" />

              <div>
                <div className="flex items-center gap-3 mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#082B59]">{testimonial.name}</h4>
                    <p className="text-[11px] text-slate-400">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  &ldquo;{testimonial.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-50 text-[11px] font-semibold text-[#13A8E8]">
                Enrolled in: {testimonial.courseTaken}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          8. MOBILE APP BANNER ("Learn on the Go!")
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-sky-50 via-blue-50 to-sky-100 p-8 sm:p-12 border border-sky-100 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Smartphone Mockup */}
          <div className="flex-shrink-0 w-36 sm:w-44 bg-slate-900 rounded-[32px] p-2.5 shadow-2xl border-4 border-slate-800 rotate-[-4deg] hover:rotate-0 transition duration-300">
            <div className="bg-white rounded-[24px] p-3 text-center flex flex-col items-center justify-center aspect-[9/18]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo.jpg" alt="App Preview" className="w-14 h-14 object-contain mb-2" />
              <div className="text-[10px] font-black text-[#082B59]">UNIVER-E</div>
              <p className="text-[8px] text-slate-400 mt-1">Mobile Classroom v2.4</p>
              <div className="w-full h-1 bg-amber-400 rounded-full mt-4"></div>
            </div>
          </div>

          {/* Text & Badges */}
          <div className="flex-1 text-center lg:text-left space-y-3">
            <h3 className="text-2xl sm:text-3xl font-black text-[#082B59]">Learn on the Go!</h3>
            <p className="text-sm text-slate-600 max-w-lg leading-relaxed">
              Get the UNIVER-E mobile app and continue your learning anytime, anywhere. Download lessons for offline viewing and receive personalized study notifications.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/univer-e.apk';
                  link.download = 'univer-e.apk';
                  link.click();
                  alert('UNIVER-E Mobile App APK download initiated! Version 2.4 (Android)');
                }}
                className="px-6 py-3.5 rounded-2xl bg-[#082B59] hover:bg-[#051C3A] text-white flex items-center gap-3.5 transition shadow-lg hover:shadow-xl hover:scale-105 border border-navy-700 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F5A900] text-[#082B59] flex items-center justify-center font-black text-xl">
                  🤖
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Direct Android Download</div>
                  <div className="text-sm sm:text-base font-black leading-none text-white">Get it on APK</div>
                </div>
                <span className="ml-2 text-xs font-bold text-slate-300 bg-white/10 px-2.5 py-1 rounded-full group-hover:bg-[#F5A900] group-hover:text-[#082B59] transition">
                  v2.4 APK
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
