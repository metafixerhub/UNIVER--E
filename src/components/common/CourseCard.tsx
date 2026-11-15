'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Clock, Heart, ArrowRight } from 'lucide-react';
import { Course } from '@/types';
import { useApp } from '@/context/AppContext';

interface CourseCardProps {
  course: Course;
  viewMode?: 'grid' | 'list';
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, viewMode = 'grid' }) => {
  const { wishlistIds, toggleWishlist, addToCart, enrolledCourseIds } = useApp();
  const isWishlisted = wishlistIds.includes(course.id);
  const isEnrolled = enrolledCourseIds.includes(course.id);

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'Bestseller':
        return 'bg-[#F5A900] text-[#082B59] font-bold';
      case 'Trending':
        return 'bg-emerald-500 text-white font-bold';
      case 'New':
        return 'bg-[#13A8E8] text-white font-bold';
      case 'Free':
        return 'bg-[#28A745] text-white font-bold';
      case 'Popular':
        return 'bg-pink-600 text-white font-bold';
      default:
        return 'bg-slate-800 text-white';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all p-4 flex flex-col md:flex-row gap-5 group">
        {/* Thumbnail */}
        <div className="relative w-full md:w-64 h-44 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {course.badge && (
            <span
              className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[11px] shadow-sm ${getBadgeStyle(
                course.badge
              )}`}
            >
              {course.badge}
            </span>
          )}
          <button
            onClick={e => {
              e.preventDefault();
              toggleWishlist(course.id);
            }}
            aria-label="Wishlist"
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-600 transition shadow"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#13A8E8] mb-1">
              <span>{course.category}</span>
              <span>•</span>
              <span>{course.level}</span>
            </div>
            <Link href={`/courses/${course.id}`}>
              <h3 className="text-lg font-bold text-[#082B59] group-hover:text-[#13A8E8] transition line-clamp-1">
                {course.title}
              </h3>
            </Link>
            <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{course.headline}</p>

            <div className="flex items-center gap-2 mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-xs text-slate-600 font-medium">{course.instructor.name}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 mt-3">
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{course.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({(course.studentsCount / 1000).toFixed(1)}K)</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{course.duration}</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                {course.isFree ? (
                  <span className="text-base font-extrabold text-[#28A745]">Free</span>
                ) : (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-[#082B59]">₹{course.price.toLocaleString('en-IN')}</span>
                    {course.originalPrice > course.price && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{course.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {isEnrolled ? (
                <Link
                  href={`/learn/${course.id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#13A8E8] text-white hover:bg-[#0D8EC7] transition"
                >
                  Continue
                </Link>
              ) : (
                <Link
                  href={`/courses/${course.id}`}
                  className="w-9 h-9 rounded-full bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] flex items-center justify-center transition shadow-sm"
                >
                  <ArrowRight className="w-4 h-4 font-bold" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Grid Card (Matches the uploaded reference image)
  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge on top-left */}
        {course.badge && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[11px] uppercase tracking-wide shadow-sm ${getBadgeStyle(
              course.badge
            )}`}
          >
            {course.badge}
          </span>
        )}

        {/* Wishlist button top-right */}
        <button
          onClick={e => {
            e.preventDefault();
            toggleWishlist(course.id);
          }}
          aria-label="Wishlist"
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-600 transition shadow"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/courses/${course.id}`}>
            <h3 className="text-base font-bold text-[#082B59] group-hover:text-[#13A8E8] transition line-clamp-2 leading-snug">
              {course.title}
            </h3>
          </Link>

          {/* Instructor info */}
          <div className="flex items-center gap-2 mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-xs text-slate-600 font-medium truncate">{course.instructor.name}</span>
          </div>

          {/* Rating & Duration */}
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
            <span className="flex items-center gap-1 font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{course.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({(course.studentsCount / 1000).toFixed(1)}K)</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{course.duration}</span>
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
          <div>
            {course.isFree ? (
              <span className="text-base font-extrabold text-[#28A745]">Free</span>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-[#082B59]">₹{course.price.toLocaleString('en-IN')}</span>
                {course.originalPrice > course.price && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹{course.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {course.discountPercent && (
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1 rounded">
                    -{course.discountPercent}%
                  </span>
                )}
              </div>
            )}
          </div>

          {isEnrolled ? (
            <Link
              href={`/learn/${course.id}`}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#13A8E8] text-white hover:bg-[#0D8EC7] transition"
            >
              Continue
            </Link>
          ) : (
            <Link
              href={`/courses/${course.id}`}
              aria-label={`View ${course.title}`}
              className="w-8 h-8 rounded-full bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] flex items-center justify-center transition shadow-sm hover:scale-105"
            >
              <ArrowRight className="w-4 h-4 font-bold" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
