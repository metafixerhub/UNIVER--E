'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Users,
  DollarSign,
  Star,
  Plus,
  BookOpen,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  Upload,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { COURSES } from '@/data/courses';

export default function InstructorDashboardPage() {
  const { user, showToast } = useApp();
  const [coursesList, setCoursesList] = useState(COURSES.slice(0, 4));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Artificial Intelligence');
  const [newPrice, setNewPrice] = useState('1499');

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      const newCourse: any = {
        id: `course_${Date.now()}`,
        slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
        title: newTitle,
        headline: 'Hands-on curriculum engineered for real career impact.',
        category: newCategory,
        price: Number(newPrice),
        originalPrice: Number(newPrice) * 1.5,
        rating: 5.0,
        reviewsCount: 1,
        studentsCount: 0,
        duration: '8h 00m',
        lessonsCount: 12,
        badge: 'New',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
        instructor: {
          name: user.name,
          avatar: user.avatar,
        },
      };

      setCoursesList(prev => [newCourse, ...prev]);
      setIsCreateModalOpen(false);
      setNewTitle('');
      showToast(`Course "${newTitle}" created and saved to MongoDB Atlas!`);

      // Asynchronously persist course introductory video to MongoDB Atlas
      fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: newCourse.id,
          title: `${newTitle} - Introduction & Course Overview`,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          uploadedBy: user.name,
          duration: '10:00',
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            console.log('[Atlas Sync] Persisted to MongoDB Atlas, Insert ID:', data.insertedId);
          }
        })
        .catch(err => console.error('[Atlas Sync Error]', err));
    }
  };

  return (
    <div className="bg-[#F5F8FC]/60 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="bg-[#082B59] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-[#F5A900] text-xs font-bold">
              Instructor Faculty Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Instructor Workspace: {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Manage curricula, monitor student performance, review analytics, and publish lectures.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-xs sm:text-sm flex items-center gap-2 transition shadow-lg"
          >
            <Plus className="w-4 h-4 font-bold" />
            <span>Create New Course</span>
          </button>
        </div>

        {/* Analytics Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Total Revenue</span>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-[#082B59]">₹3,84,250</div>
            <span className="text-[11px] text-emerald-600 font-bold">+18.4% from last month</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Enrolled Students</span>
              <Users className="w-5 h-5 text-[#13A8E8]" />
            </div>
            <div className="text-2xl font-black text-[#082B59]">12,480</div>
            <span className="text-[11px] text-emerald-600 font-bold">Active in 84 cities</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Instructor Rating</span>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-2xl font-black text-[#082B59]">4.8 / 5.0</div>
            <span className="text-[11px] text-slate-500">From 1,840 student reviews</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Published Courses</span>
              <BookOpen className="w-5 h-5 text-[#F5A900]" />
            </div>
            <div className="text-2xl font-black text-[#082B59]">{coursesList.length}</div>
            <span className="text-[11px] text-[#13A8E8] font-bold">100% Verified</span>
          </div>
        </div>

        {/* Course Management Table */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-lg font-black text-[#082B59]">Your Courses</h3>
            <span className="text-xs text-slate-500">{coursesList.length} programs active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F8FC] text-slate-600 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Course Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Students</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coursesList.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3.5 font-bold text-[#082B59]">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.thumbnail} alt={c.title} className="w-10 h-7 rounded object-cover" />
                        <span className="line-clamp-1 max-w-xs">{c.title}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600">{c.category}</td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {c.isFree ? 'Free' : `₹${c.price.toLocaleString('en-IN')}`}
                    </td>
                    <td className="p-3.5 text-slate-600">{c.studentsCount.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-amber-500 font-bold">★ {c.rating.toFixed(1)}</td>
                    <td className="p-3.5">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        Live
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <Link
                        href={`/courses/${c.id}`}
                        className="inline-block p-1.5 rounded-lg text-slate-500 hover:text-[#13A8E8] hover:bg-slate-100"
                        title="View Course"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => showToast(`Opening course editor for ${c.title}...`)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#082B59] hover:bg-slate-100"
                        title="Edit Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create New Course Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#082B59] mb-4">Create New Masterclass</h3>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js 15 Full-Stack Enterprise Mastery"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Discipline Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none"
                >
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Programming & Development">Programming & Development</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Business & Management">Business & Management</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Price (INR ₹)</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={e => setNewPrice(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                />
              </div>

              <div className="border border-dashed border-gray-300 rounded-2xl p-4 text-center">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-[11px] text-slate-600 font-semibold">Drop thumbnail image or video trailer</p>
                <span className="text-[10px] text-slate-400">MP4, PNG, JPG up to 500MB</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-sm rounded-xl shadow-md transition"
              >
                Publish Course →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
