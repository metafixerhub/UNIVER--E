'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Mail,
  Clock,
  LogOut,
  KeyRound,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { COURSES } from '@/data/courses';

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    showToast,
    inquiries,
    updateInquiryStatus,
    isAdminAuthenticated,
    adminLogout,
    adminLogin,
  } = useApp();

  const [courses, setCourses] = useState(COURSES);
  const [activeTab, setActiveTab] = useState<'inquiries' | 'courses' | 'users' | 'certificates' | 'atlas'>('inquiries');
  const [atlasStats, setAtlasStats] = useState<any>(null);
  const [loadingAtlas, setLoadingAtlas] = useState(false);

  // Quick inline login state if unauthenticated
  const [gateUser, setGateUser] = useState('nur');
  const [gatePass, setGatePass] = useState('');
  const [gateError, setGateError] = useState(false);

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(gateUser, gatePass);
    if (!success) {
      setGateError(true);
    } else {
      setGateError(false);
    }
  };

  const handleApprove = (id: string) => {
    showToast('Course approved and published to the live public catalog!');
  };

  const handleFlag = (id: string) => {
    showToast('Course flagged for academic quality review.');
  };

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

  // If NOT authenticated as admin, show secure gate
  if (!isAdminAuthenticated) {
    return (
      <div className="bg-[#051C3A] min-h-screen py-16 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-gray-100 shadow-2xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center">
            <KeyRound className="w-8 h-8" />
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-[#082B59]">Admin Authentication Required</h2>
            <p className="text-xs text-slate-500">
              Please enter your root administrator password to access the governance console.
            </p>
          </div>

          {gateError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              Access Denied: Incorrect administrator password.
            </div>
          )}

          <form onSubmit={handleGateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Admin Username</label>
              <input
                type="text"
                required
                value={gateUser}
                onChange={e => setGateUser(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Admin Password</label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter password (nur1438nur)"
                value={gatePass}
                onChange={e => setGatePass(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500">
              <strong>Admin:</strong> user: <code className="font-bold text-[#082B59]">nur</code> &bull; password: <code className="font-bold text-[#082B59]">nur1438nur</code>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl shadow-md transition"
            >
              Authenticate Admin Session →
            </button>
          </form>

          <div className="text-center">
            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-[#082B59]">
              ← Return to UNIVER-E Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F8FC]/60 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-[#082B59] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
                Admin & Governance Console
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                Logged in as: nur
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              UNIVER-E Central Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Platform administration, live contact inquiries, course moderation, and MongoDB Atlas telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-navy-950/70 px-3 py-1.5 rounded-xl border border-navy-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono text-emerald-300 font-bold">Status: Online</span>
            </div>

            <button
              onClick={adminLogout}
              className="px-4 py-2 bg-white/10 hover:bg-red-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Admin</span>
            </button>
          </div>
        </div>

        {/* 4 Core Admin KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Contact Inquiries</span>
              <Mail className="w-5 h-5 text-[#F5A900]" />
            </div>
            <div className="text-2xl font-black text-[#082B59]">{inquiries.length}</div>
            <span className="text-[11px] text-emerald-600 font-bold">Direct from /contact page</span>
          </div>

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
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'inquiries' ? 'bg-[#082B59] text-white shadow' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Mail className="w-4 h-4 text-[#F5A900]" />
            <span>Contact Inquiries ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex-shrink-0 ${
              activeTab === 'courses' ? 'bg-[#082B59] text-white shadow' : 'text-slate-600 hover:bg-white'
            }`}
          >
            Course Moderation
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex-shrink-0 ${
              activeTab === 'users' ? 'bg-[#082B59] text-white shadow' : 'text-slate-600 hover:bg-white'
            }`}
          >
            Users & Roles
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex-shrink-0 ${
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
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === 'atlas' ? 'bg-[#28A745] text-white shadow' : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <span>MongoDB Atlas Telemetry</span>
          </button>
        </div>

        {/* Tab 1: Contact Inquiries (Direct from Contact Page) */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-[#082B59]">Inquiries Transmitted from Contact Page</h3>
                <p className="text-xs text-slate-500">
                  Every user inquiry submitted via <code>/contact</code> arrives exclusively here for admin review.
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full font-bold text-xs">
                {inquiries.filter(i => i.status === 'new').length} New Pending
              </span>
            </div>

            {inquiries.length > 0 ? (
              <div className="space-y-4">
                {inquiries.map(inq => (
                  <div
                    key={inq.id}
                    className={`p-5 rounded-2xl border transition space-y-3 ${
                      inq.status === 'new'
                        ? 'border-amber-200 bg-amber-50/30'
                        : inq.status === 'replied'
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-gray-200 bg-gray-50/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#082B59] text-white flex items-center justify-center font-bold text-sm">
                          {inq.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#082B59]">{inq.name}</h4>
                          <a href={`mailto:${inq.email}`} className="text-xs text-[#13A8E8] hover:underline">
                            {inq.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{inq.createdAt}</span>
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            inq.status === 'new'
                              ? 'bg-[#F5A900] text-[#082B59]'
                              : inq.status === 'replied'
                              ? 'bg-[#28A745] text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-gray-100 shadow-inner">
                      &ldquo;{inq.message}&rdquo;
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-1 text-xs">
                      <a
                        href={`mailto:${inq.email}?subject=Reply from UNIVER-E Administration&body=Dear ${encodeURIComponent(
                          inq.name
                        )},%0D%0A%0D%0A`}
                        onClick={() => updateInquiryStatus(inq.id, 'replied')}
                        className="px-3 py-1.5 bg-[#082B59] hover:bg-navy-800 text-white rounded-lg font-bold flex items-center gap-1.5 transition"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply via Email</span>
                      </a>

                      {inq.status !== 'replied' && (
                        <button
                          onClick={() => updateInquiryStatus(inq.id, 'replied')}
                          className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-bold transition"
                        >
                          Mark Replied
                        </button>
                      )}

                      {inq.status !== 'archived' && (
                        <button
                          onClick={() => updateInquiryStatus(inq.id, 'archived')}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-slate-600 rounded-lg font-bold transition"
                        >
                          Archive
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <Mail className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No inquiries logged yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Course Moderation */}
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

        {/* Tab 3: Users Table */}
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
                    <td className="p-3 font-bold text-[#082B59]">Nur (Root Admin)</td>
                    <td className="p-3 text-slate-600">nur@univer-e.in</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-red-50 text-red-600 font-bold rounded">Root Administrator</span></td>
                    <td className="p-3 text-emerald-600 font-bold">Authenticated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Certificates Audit */}
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

        {/* Tab 5: MongoDB Atlas Telemetry View */}
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
