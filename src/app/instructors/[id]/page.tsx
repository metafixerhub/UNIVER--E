'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, Users, BookOpen, Award, ArrowLeft } from 'lucide-react';
import { INSTRUCTORS, COURSES } from '@/data/courses';
import { CourseCard } from '@/components/common/CourseCard';
import { useApp } from '@/context/AppContext';

export default function InstructorDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { instructors: appInstructors, courses: appCourses } = useApp();

  const instructor =
    (appInstructors && appInstructors[id]) ||
    INSTRUCTORS[id] ||
    (appInstructors && Object.values(appInstructors)[0]) ||
    INSTRUCTORS.nur;

  const courseList = appCourses && appCourses.length > 0 ? appCourses : COURSES;
  const instructorCourses = courseList.filter(
    c => c.instructor.id === instructor.id || c.instructor.name === instructor.name
  );

  return (
    <div className="bg-[#F5F8FC]/50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link href="/instructors" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#082B59]">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Faculty Directory</span>
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={instructor.avatar}
            alt={instructor.name}
            className="w-28 h-28 rounded-3xl object-cover border-4 border-[#F5A900] shadow-md"
          />

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#082B59]">{instructor.name}</h1>
              {instructor.badge && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                  {instructor.badge}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#13A8E8] font-bold">{instructor.title}</p>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">{instructor.bio}</p>

            <div className="flex items-center gap-6 pt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{instructor.rating} Rating</span>
              </span>
              <span>•</span>
              <span className="font-semibold text-slate-800">{instructor.studentsCount.toLocaleString('en-IN')} Scholars</span>
              <span>•</span>
              <span className="font-semibold text-slate-800">{instructorCourses.length} Courses Taught</span>
            </div>
          </div>
        </div>

        {/* Instructor Courses */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-[#082B59]">Courses by {instructor.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructorCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
