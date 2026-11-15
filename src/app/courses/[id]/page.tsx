'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Clock,
  BookOpen,
  Award,
  Globe,
  CheckCircle2,
  Play,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  FileText,
  Users,
} from 'lucide-react';
import { COURSES } from '@/data/courses';
import { useApp } from '@/context/AppContext';
import { PaymentModal } from '@/components/common/PaymentModal';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { wishlistIds, toggleWishlist, addToCart, enrolledCourseIds, showToast } = useApp();

  const courseId = params?.id as string;
  const course = COURSES.find(c => c.id === courseId || c.slug === courseId) || COURSES[0];

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    [course.curriculum[0]?.id || 'sec-1']: true,
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const isEnrolled = enrolledCourseIds.includes(course.id);
  const isWishlisted = wishlistIds.includes(course.id);

  const toggleSection = (secId: string) => {
    setExpandedSections(prev => ({ ...prev, [secId]: !prev[secId] }));
  };

  const handleEnrollClick = () => {
    if (isEnrolled) {
      router.push(`/learn/${course.id}`);
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Course link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Top Breadcrumb & Hero Area (Navy Background) */}
      <div className="bg-[#082B59] text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-300">
                <Link href="/courses" className="hover:underline">
                  Courses
                </Link>
                <span>/</span>
                <Link href={`/courses?category=${encodeURIComponent(course.category)}`} className="hover:underline">
                  {course.category}
                </Link>
                <span>/</span>
                <span className="text-slate-300 truncate">{course.title}</span>
              </div>

              {course.badge && (
                <span className="inline-block px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-[#F5A900] text-[#082B59]">
                  {course.badge}
                </span>
              )}

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
                {course.headline}
              </p>

              {/* Meta information row */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{course.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({course.reviewsCount} reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{course.studentsCount.toLocaleString('en-IN')} students enrolled</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{course.duration}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>{course.language}</span>
                </div>
              </div>

              {/* Instructor snippet */}
              <div className="flex items-center gap-3 pt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#F5A900]"
                />
                <div className="text-xs">
                  <p className="text-slate-400">Created by</p>
                  <Link href={`/instructors/${course.instructor.id}`} className="font-bold text-white hover:underline">
                    {course.instructor.name}
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Sticky Preview Card on Desktop */}
            <div className="lg:col-span-4 lg:relative">
              <div className="bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 text-slate-900 sticky top-28">
                {/* Video Preview Box */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 group mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => alert('Starting lesson preview trailer...')}
                      className="w-14 h-14 rounded-full bg-[#F5A900] text-[#082B59] flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-200"
                    >
                      <Play className="w-6 h-6 fill-[#082B59] ml-1" />
                    </button>
                  </div>
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-black/70 text-white px-2 py-0.5 rounded">
                    Preview Available
                  </span>
                </div>

                {/* Pricing Block */}
                <div className="flex items-baseline gap-3 mb-4">
                  {course.isFree ? (
                    <span className="text-3xl font-black text-[#28A745]">FREE</span>
                  ) : (
                    <>
                      <span className="text-3xl font-black text-[#082B59]">
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                      {course.originalPrice > course.price && (
                        <span className="text-sm text-slate-400 line-through">
                          ₹{course.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      {course.discountPercent && (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                          {course.discountPercent}% OFF
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Primary CTA */}
                <div className="space-y-2.5">
                  <button
                    onClick={handleEnrollClick}
                    className="w-full py-3.5 rounded-2xl bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-sm tracking-wide shadow-md transition duration-200"
                  >
                    {isEnrolled ? 'Go to Classroom →' : course.isFree ? 'Enroll Now for Free' : 'Buy Now'}
                  </button>

                  {!isEnrolled && !course.isFree && (
                    <button
                      onClick={() => addToCart(course)}
                      className="w-full py-3 rounded-2xl border border-gray-300 hover:bg-slate-50 text-[#082B59] font-bold text-xs transition"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>

                {/* Features included */}
                <div className="mt-6 pt-5 border-t border-gray-100 space-y-2 text-xs text-slate-600">
                  <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-2">
                    This course includes:
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#13A8E8]" />
                    <span>{course.duration} on-demand video</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#13A8E8]" />
                    <span>{course.lessonsCount} interactive lessons & code files</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#28A745]" />
                    <span>Official Verifiable Certificate of Completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#082B59]" />
                    <span>Lifetime access on Mobile and Desktop</span>
                  </div>
                </div>

                {/* Wishlist & Share buttons */}
                <div className="flex items-center justify-around pt-4 mt-4 border-t border-gray-100 text-xs">
                  <button
                    onClick={() => toggleWishlist(course.id)}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-red-500 font-semibold transition"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-[#082B59] font-semibold transition"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-12">
            {/* Learning Objectives */}
            <section className="bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-gray-200">
              <h3 className="text-xl font-black text-[#082B59] mb-4">What you will learn</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {course.learningObjectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#28A745] flex-shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Course Description */}
            <section className="space-y-4">
              <h3 className="text-2xl font-black text-[#082B59]">Course Overview</h3>
              <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                <p>{course.description}</p>
                <p>
                  Every module in this course is designed around experiential learning. Rather than passively watching, you will write code, solve challenges, and construct a real-world capstone project that you can showcase on LinkedIn, GitHub, and your professional resume.
                </p>
              </div>
            </section>

            {/* Curriculum Accordion */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-[#082B59]">Course Curriculum</h3>
                <span className="text-xs text-slate-500 font-semibold">
                  {course.curriculum.length} sections • {course.lessonsCount} lessons • {course.duration} total
                </span>
              </div>

              <div className="space-y-3">
                {course.curriculum.map(sec => {
                  const isExpanded = expandedSections[sec.id];
                  return (
                    <div key={sec.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => toggleSection(sec.id)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50/80 hover:bg-gray-100 text-left transition"
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          )}
                          <span className="text-sm font-bold text-[#082B59]">{sec.title}</span>
                        </div>
                        <span className="text-xs text-slate-500">{sec.lessons.length} lectures</span>
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-gray-100 bg-white">
                          {sec.lessons.map(lesson => (
                            <div key={lesson.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 text-xs">
                              <div className="flex items-center gap-3">
                                <Play className="w-3.5 h-3.5 text-[#13A8E8]" />
                                <span className="font-medium text-slate-800">{lesson.title}</span>
                              </div>
                              <span className="text-slate-400 font-mono">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Instructor Details */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 space-y-4">
              <h3 className="text-xl font-black text-[#082B59]">Meet Your Instructor</h3>
              <div className="flex flex-col sm:flex-row items-start gap-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-20 h-20 rounded-2xl object-cover shadow-sm"
                />
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-[#082B59]">{course.instructor.name}</h4>
                  <p className="text-xs text-[#13A8E8] font-bold">{course.instructor.title}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{course.instructor.bio}</p>

                  <div className="flex items-center gap-5 pt-2 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{course.instructor.rating} Instructor Rating</span>
                    </span>
                    <span>•</span>
                    <span>{course.instructor.studentsCount.toLocaleString('en-IN')} Students</span>
                    <span>•</span>
                    <span>{course.instructor.coursesCount} Courses</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Student Reviews */}
            <section className="space-y-4">
              <h3 className="text-2xl font-black text-[#082B59]">Student Feedback & Reviews</h3>
              <div className="space-y-4">
                {course.reviews.map(rev => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-slate-50/70 border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={rev.userAvatar} alt={rev.userName} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <h5 className="text-xs font-bold text-[#082B59]">{rev.userName}</h5>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">&ldquo;{rev.comment}&rdquo;</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        course={course}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}
