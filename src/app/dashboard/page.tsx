'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  Clock,
  BookOpen,
  Heart,
  TrendingUp,
  Play,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { COURSES } from '@/data/courses';
import { CertificateModal } from '@/components/common/CertificateModal';
import { Certificate } from '@/types';

export default function StudentDashboardPage() {
  const { user, enrolledCourses, wishlistIds, certificates, getCourseProgress } = useApp();
  const [activeTab, setActiveTab] = useState<'enrolled' | 'completed' | 'certificates' | 'wishlist'>('enrolled');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const completedCourses = COURSES.filter(c => user.completedCourseIds.includes(c.id));
  const wishlistedCourses = COURSES.filter(c => wishlistIds.includes(c.id));

  // Determine course to continue learning
  const primaryCourse = enrolledCourses[0] || COURSES[0];
  const primaryProgress = getCourseProgress(primaryCourse.id);

  return (
    <div className="bg-[#F5F8FC]/60 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-[#082B59] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
              Student Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              You are on a <strong>5-day learning streak</strong>. Keep progressing toward your UNIVER-E verified certifications!
            </p>
          </div>

          <div className="flex items-center gap-4 z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#F5A900] shadow-md"
            />
          </div>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#13A8E8] flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#082B59]">{enrolledCourses.length}</div>
              <div className="text-xs font-semibold text-slate-500">Enrolled Courses</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#28A745] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#082B59]">{completedCourses.length}</div>
              <div className="text-xs font-semibold text-slate-500">Completed Courses</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F5A900] flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#082B59]">{certificates.length}</div>
              <div className="text-xs font-semibold text-slate-500">Certificates Earned</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#13A8E8] flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#082B59]">18.5h</div>
              <div className="text-xs font-semibold text-slate-500">Learning Hours</div>
            </div>
          </div>
        </div>

        {/* Continue Learning Featured Box */}
        {primaryCourse && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="relative w-28 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={primaryCourse.thumbnail} alt={primaryCourse.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play className="w-6 h-6 fill-white text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#13A8E8]">
                  Continue Learning
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#082B59] line-clamp-1">
                  {primaryCourse.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Instructor: {primaryCourse.instructor.name}</span>
                  <span>•</span>
                  <span>{primaryProgress}% Completed</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-80 flex flex-col items-end gap-2">
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#28A745] h-full rounded-full transition-all duration-500"
                  style={{ width: `${primaryProgress}%` }}
                ></div>
              </div>
              <Link
                href={`/learn/${primaryCourse.id}`}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-xs flex items-center justify-center gap-2 transition shadow-sm"
              >
                <span>Resume Lesson</span>
                <ChevronRight className="w-4 h-4 font-bold" />
              </Link>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'enrolled'
                ? 'bg-[#082B59] text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Enrolled Courses ({enrolledCourses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'completed'
                ? 'bg-[#082B59] text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed ({completedCourses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'certificates'
                ? 'bg-[#082B59] text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>My Certificates ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'wishlist'
                ? 'bg-[#082B59] text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlistedCourses.length})</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'enrolled' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(course => {
              const prog = getCourseProgress(course.id);
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="text-base font-bold text-[#082B59] line-clamp-1">{course.title}</h4>
                    <p className="text-xs text-slate-500">Instructor: {course.instructor.name}</p>

                    {/* Progress indicator */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                        <span>Progress</span>
                        <span className="text-[#28A745] font-bold">{prog}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#28A745] h-full rounded-full transition-all duration-300"
                          style={{ width: `${prog}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      href={`/learn/${course.id}`}
                      className="px-4 py-2 rounded-xl bg-[#13A8E8] hover:bg-[#0D8EC7] text-white font-bold text-xs transition"
                    >
                      Enter Classroom
                    </Link>
                    <Link
                      href={`/assessment/${course.id}`}
                      className="text-xs font-bold text-[#082B59] hover:underline"
                    >
                      Take Exam →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="space-y-4">
            {certificates.map(cert => (
              <div
                key={cert.id}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F5A900] flex items-center justify-center font-bold">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#082B59]">{cert.courseTitle}</h4>
                    <p className="text-xs text-slate-500">
                      Issued on: {cert.issueDate} • Grade: {cert.grade}
                    </p>
                    <span className="inline-block mt-1 font-mono text-[10px] text-slate-400">
                      ID: {cert.certificateNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="px-4 py-2 rounded-xl bg-[#082B59] hover:bg-navy-800 text-white font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <span>View & Download</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <Link
                    href={`/certificates/${cert.certificateNumber}`}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-slate-700 font-bold text-xs hover:bg-gray-50 transition"
                  >
                    Public Verify
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistedCourses.map(course => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-sm font-bold text-[#082B59] line-clamp-1">{course.title}</h4>
                  <div className="text-sm font-black text-[#082B59]">
                    {course.isFree ? 'Free' : `₹${course.price.toLocaleString('en-IN')}`}
                  </div>
                </div>
                <div className="pt-4 mt-3 border-t border-gray-100">
                  <Link
                    href={`/courses/${course.id}`}
                    className="w-full block text-center py-2 rounded-xl bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-bold text-xs"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
}
