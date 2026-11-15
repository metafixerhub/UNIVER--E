'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  BookOpen,
  DollarSign,
  Award,
  Check,
  X,
  Search,
  Filter,
  AlertTriangle,
  Settings,
  Activity,
  Layers,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { COURSES } from '@/data/courses';

export default function AdminDashboardPage() {
  const { showToast } = useApp();
  const [courses, setCourses] = useState(COURSES);
  const [activeTab, setActiveTab] = useState<'courses' | 'users' | 'certificates' | 'atlas'>('courses');
  const [atlasStats, setAtlasStats] = useState<any>(null);
  const [loadingAtlas, setLoadingAtlas] = useState(false);

  const fetchAtlasStats = async () => {
    setLoadingAtlas(true);
    try {
      const res = await fetch('/api/atlas/stats');
      const data = await res.json();
      setAtlasStats(data);
      showToast('Fetched live MongoDB Atlas cluster metrics!');
    } catch (err: any) {
      showToast(`Error connecting to Atlas server: ${err.message}`);
    } finally {
      setLoadingAtlas(false);
    }
  };

  const handleApprove = (id: string) => {
    showToast('Course approved and published to the live public catalog!');
  };

  const handleFlag = (id: string) => {
    showToast('Course flagged for academic quality review.');
  };

  return (
    <div className="bg-[#F5F8FC]/60 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-[#082B59] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
              Admin & Governance Console
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              UNIVER-E Central Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Platform administration, course moderation, student credentials, and ecosystem metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono text-emerald-300 font-bold">System Status: Optimal (99.99%)</span>
          </div>
        </div>

        {/* 4 Core Admin KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Total Learners</span>
              <Users className="w-5 h-5 text-[#13A8E8]" />
            </div>
            <div className="text-2xl font-black text-[#082B59]">54,290</div>
            <span className="text-[11px] text-emerald-600 font-bold">+1,420 this week</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Active Faculty</span>
              <Award className="w-5 h-5 text-[#F5A900]" />
            </div>
            <div className="text-2xl font-black text-[#082B59]">218</div>
            <span className="text-[11px] text-slate-500">Across 10 departments</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Platform Volume</span>
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-[#082B59]">₹1.48 Cr</div>
            <span className="text-[11px] text-emerald-600 font-bold">Year to Date</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Issued Certs</span>
              <ShieldCheck className="w-5 h-5 text-[#28A745]" />
            </div>
            <div className="text-2xl font-black text-[#082B59]">26,140</div>
            <span className="text-[11px] text-[#13A8E8] font-bold">100% Cryptographically Verified</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'courses' ? 'bg-[#082B59] text-white shadow' : 'text-slate-600 hover:bg-white'
            }`}
          >
            Course Moderation
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'users' ? 'bg-[#082B59] text-white shadow' : 'text-slate-600 hover:bg-white'
            }`}
          >
            Users & Roles
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'certificates' ? 'bg-[#082B59] text-white shadow' : 'text-slate-600 hover:bg-white'
            }`}
          >
            Certificates Audit
          </button>
          <button
            onClick={() => {
              setActiveTab('atlas');
              if (!atlasStats) fetchAtlasStats();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === 'atlas' ? 'bg-[#28A745] text-white shadow' : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <span>MongoDB Atlas Telemetry</span>
          </button>
        </div>

        {/* Course Moderation Table */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-[#082B59]">Curriculum Moderation Queue</h3>
              <span className="text-xs text-slate-500">All submissions reviewed against NEP-2020 pedagogical quality</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F8FC] text-slate-600 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Course Title</th>
                    <th className="p-3.5">Instructor</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Fee</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 rounded-r-xl text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {courses.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-bold text-[#082B59]">{c.title}</td>
                      <td className="p-3.5 text-slate-600">{c.instructor.name}</td>
                      <td className="p-3.5 text-slate-600">{c.category}</td>
                      <td className="p-3.5 font-bold">
                        {c.isFree ? 'Free' : `₹${c.price.toLocaleString('en-IN')}`}
                      </td>
                      <td className="p-3.5">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          Active & Verified
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleApprove(c.id)}
                          className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleFlag(c.id)}
                          className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 hover:bg-amber-200 font-bold transition"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Table */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-[#082B59]">Registered Accounts & Roles</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F8FC] text-slate-600 uppercase font-bold">
                  <tr>
                    <th className="p-3 rounded-l-xl">User Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Assigned Role</th>
                    <th className="p-3 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-[#082B59]">Arham Khan</td>
                    <td className="p-3 text-slate-600">arham.khan@univer-e.in</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-blue-50 text-[#13A8E8] font-bold rounded">Student</span></td>
                    <td className="p-3 text-emerald-600 font-bold">Active</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-[#082B59]">Nur Mohammad</td>
                    <td className="p-3 text-slate-600">nur.mohammad@univer-e.in</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-amber-50 text-[#F5A900] font-bold rounded">Instructor</span></td>
                    <td className="p-3 text-emerald-600 font-bold">Verified Faculty</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-[#082B59]">Dr. Sufiyan Ali</td>
                    <td className="p-3 text-slate-600">admin@univer-e.in</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-red-50 text-red-600 font-bold rounded">Administrator</span></td>
                    <td className="p-3 text-emerald-600 font-bold">Root Master</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Certificates Audit */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-[#082B59]">Public Verification Registry</h3>
            <p className="text-xs text-slate-500">Every certificate issued by UNIVER-E is permanently verified here.</p>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 font-mono text-xs space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span>UNIVER-E-2026-GD812</span>
                <span className="text-emerald-600 font-bold">VERIFIED [Arham Khan - Graphic Design with Canva Pro]</span>
              </div>
              <div className="flex justify-between">
                <span>UNIVER-E-2026-AI504</span>
                <span className="text-emerald-600 font-bold">VERIFIED [Pooja Sharma - AI Fundamentals with Python]</span>
              </div>
            </div>
          </div>
        )}
        {/* MongoDB Atlas Telemetry View */}
        {activeTab === 'atlas' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#28A745]">
                  Cluster Health & Metrics
                </span>
                <h3 className="text-xl font-black text-[#082B59]">MongoDB Atlas Cluster Integration</h3>
                <p className="text-xs text-slate-500">
                  Connected to: <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">https://one0l-server-point-234567.onrender.com</code>
                </p>
              </div>

              <button
                onClick={fetchAtlasStats}
                disabled={loadingAtlas}
                className="px-4 py-2 bg-[#082B59] hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 self-start"
              >
                {loadingAtlas ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Refresh Atlas Stats</span>
                )}
              </button>
            </div>

            {/* Endpoints Documentation Quick Reference */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-gray-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-700">GET</span>
                  <span className="text-xs font-mono font-bold text-slate-800">/api/external/stats-embed</span>
                </div>
                <p className="text-xs text-slate-600">
                  Reads real-time database stats from all 10 clusters without exposing Atlas passwords.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-gray-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-700">POST</span>
                  <span className="text-xs font-mono font-bold text-slate-800">/api/external/push-data</span>
                </div>
                <p className="text-xs text-slate-600">
                  Saves video metadata, student course progress, and tamper-evident certificate records.
                </p>
              </div>
            </div>

            {/* Live Data Display */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700">Live Server Response:</span>
              <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-80 border border-slate-800">
                {atlasStats ? JSON.stringify(atlasStats, null, 2) : '// Click "Refresh Atlas Stats" to query live MongoDB Atlas metrics...'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
