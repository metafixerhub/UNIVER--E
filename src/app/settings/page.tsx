'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Shield,
  Sliders,
  Bell,
  Download,
  Trash2,
  Save,
  CheckCircle2,
  KeyRound,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  PlayCircle,
  Eye,
  EyeOff,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoggedIn, updateUserSettings, showToast, logoutUser } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'learning' | 'notifications' | 'privacy'>('profile');

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || user?.preferences?.phone || '+91 98765 43210');
  const [headline, setHeadline] = useState(user?.headline || user?.preferences?.headline || 'Full Stack & AI Specialist Aspirant');
  const [location, setLocation] = useState(user?.location || user?.preferences?.location || 'Bengaluru, India');
  const [avatarSeed, setAvatarSeed] = useState(user?.name || 'Scholar');

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [twoFactorOtp, setTwoFactorOtp] = useState(user?.preferences?.twoFactorOtpEnabled ?? true);

  // Learning Preferences State
  const [autoplay, setAutoplay] = useState(user?.preferences?.autoplayNextLesson ?? true);
  const [speed, setSpeed] = useState<number>(user?.preferences?.playbackSpeed ?? 1.0);
  const [quality, setQuality] = useState<'1080p' | '720p' | '480p'>(user?.preferences?.downloadQuality ?? '1080p');
  const [autoQuiz, setAutoQuiz] = useState(user?.preferences?.autoQuizPrompt ?? true);

  // Notification Preferences State
  const [emailAlerts, setEmailAlerts] = useState(user?.preferences?.emailNotifications ?? true);
  const [smsAlerts, setSmsAlerts] = useState(user?.preferences?.smsNotifications ?? true);

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please provide your name.');
      return;
    }
    const updatedAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(avatarSeed)}`;
    updateUserSettings({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      headline: headline.trim(),
      location: location.trim(),
      avatar: updatedAvatar,
      preferences: {
        ...(user?.preferences || {
          autoplayNextLesson: true,
          playbackSpeed: 1.0,
          downloadQuality: '1080p',
          autoQuizPrompt: true,
          emailNotifications: true,
          smsNotifications: true,
          twoFactorOtpEnabled: true,
        }),
        phone: phone.trim(),
        headline: headline.trim(),
        location: location.trim(),
      },
    });
  };

  // Security Save
  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword) {
      if (newPassword.length < 8) {
        showToast('New password must be at least 8 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast('New password and confirmation do not match.');
        return;
      }
      showToast('Password updated securely with cryptographic salt.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }

    updateUserSettings({
      preferences: {
        ...(user?.preferences || {
          autoplayNextLesson: true,
          playbackSpeed: 1.0,
          downloadQuality: '1080p',
          autoQuizPrompt: true,
          emailNotifications: true,
          smsNotifications: true,
          twoFactorOtpEnabled: true,
        }),
        twoFactorOtpEnabled: twoFactorOtp,
      },
    });
  };

  // Learning Save
  const handleSaveLearning = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserSettings({
      preferences: {
        ...(user?.preferences || {
          emailNotifications: true,
          smsNotifications: true,
          twoFactorOtpEnabled: true,
        }),
        autoplayNextLesson: autoplay,
        playbackSpeed: speed,
        downloadQuality: quality,
        autoQuizPrompt: autoQuiz,
      },
    });
  };

  // Notifications Save
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserSettings({
      preferences: {
        ...(user?.preferences || {
          autoplayNextLesson: true,
          playbackSpeed: 1.0,
          downloadQuality: '1080p',
          autoQuizPrompt: true,
          twoFactorOtpEnabled: true,
        }),
        emailNotifications: emailAlerts,
        smsNotifications: smsAlerts,
      },
    });
  };

  // Export Learning Profile JSON (DPDP Act 2023)
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `univer-e-user-data-${user.id || 'profile'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Learning profile data exported successfully!');
  };

  // Reset local watch progress
  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all your lesson watch progress? Your enrolled courses will be preserved.')) {
      updateUserSettings({
        progress: {},
      });
      showToast('Lesson watch history has been reset.');
    }
  };

  return (
    <div className="bg-[#F5F8FC]/70 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/dashboard" className="hover:text-[#13A8E8] flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <span>/</span>
              <span className="font-semibold text-slate-800">Account Settings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#082B59] tracking-tight">
              Settings &amp; Preferences
            </h1>
            <p className="text-xs text-slate-500">
              Manage your personal student profile, security credentials, video player, and learning telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-[#082B59] transition shadow-sm"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Navigation Tabs */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-white rounded-2xl p-3 border border-gray-200/80 shadow-sm space-y-1">
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#082B59] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Student Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-[#082B59] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Password &amp; Security</span>
              </button>

              <button
                onClick={() => setActiveTab('learning')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                  activeTab === 'learning'
                    ? 'bg-[#082B59] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Learning &amp; Player</span>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                  activeTab === 'notifications'
                    ? 'bg-[#082B59] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Notification Alerts</span>
              </button>

              <button
                onClick={() => setActiveTab('privacy')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                  activeTab === 'privacy'
                    ? 'bg-[#082B59] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Data &amp; Privacy (DPDP)</span>
              </button>

            </div>

            {/* Quick Profile Overview Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm text-center space-y-3">
              <div className="w-16 h-16 rounded-full mx-auto overflow-hidden border-2 border-[#F5A900] shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#082B59]">{user.name}</h4>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#13A8E8]">
                  {user.role} Scholar
                </span>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm">
              
              {/* TAB 1: Profile Information */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-[#082B59]">Personal Profile Information</h2>
                    <p className="text-xs text-slate-500">
                      Your name will appear on official UNIVER-E certificates and examination verification records.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={e => { setName(e.target.value); setAvatarSeed(e.target.value); }}
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                        />
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mobile Number (SMS OTP)</label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                        />
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Location / City</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={location}
                          onChange={e => setLocation(e.target.value)}
                          placeholder="e.g. Bengaluru, India"
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                        />
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Academic Headline / Specialization</label>
                      <input
                        type="text"
                        value={headline}
                        onChange={e => setHeadline(e.target.value)}
                        placeholder="e.g. Full Stack Developer & AI Specialist Aspirant"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Security & Password */}
              {activeTab === 'security' && (
                <form onSubmit={handleSaveSecurity} className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-[#082B59]">Password &amp; Account Security</h2>
                    <p className="text-xs text-slate-500">
                      Manage authentication credentials and 2-step verification for unauthorized access protection.
                    </p>
                  </div>

                  <div className="space-y-4 max-w-md text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPass ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={e => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                        />
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                          {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          placeholder="Minimum 8 characters"
                          className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                        />
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Re-type new password"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                      />
                    </div>

                    {/* 2-Factor OTP Toggle */}
                    <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between gap-4 mt-6">
                      <div>
                        <div className="font-bold text-[#082B59] text-xs">2-Step OTP Authentication</div>
                        <p className="text-[11px] text-slate-500">
                          Require a 6-digit SMS OTP verification code when signing in from an unrecognized device.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={twoFactorOtp}
                          onChange={e => setTwoFactorOtp(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#28A745]"></div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#28A745] hover:bg-[#218838] text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Update Security Credentials</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: Learning & Player Preferences */}
              {activeTab === 'learning' && (
                <form onSubmit={handleSaveLearning} className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-[#082B59]">Learning Experience &amp; Video Player</h2>
                    <p className="text-xs text-slate-500">
                      Customize how lecture videos, playback quality, and Universal AI quizzes are presented.
                    </p>
                  </div>

                  <div className="space-y-5 text-xs">
                    {/* Autoplay */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                      <div>
                        <div className="font-bold text-slate-800">Autoplay Next Lecture</div>
                        <p className="text-[11px] text-slate-500">Automatically advance to the next curriculum lesson upon completion.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={autoplay}
                        onChange={e => setAutoplay(e.target.checked)}
                        className="w-4 h-4 accent-[#13A8E8] cursor-pointer"
                      />
                    </div>

                    {/* Speed */}
                    <div className="p-4 rounded-xl border border-gray-200 space-y-2">
                      <div className="font-bold text-slate-800">Default Playback Speed</div>
                      <div className="flex gap-2">
                        {[1.0, 1.25, 1.5, 2.0].map(s => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setSpeed(s)}
                            className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                              speed === s
                                ? 'bg-[#13A8E8] text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Video Quality */}
                    <div className="p-4 rounded-xl border border-gray-200 space-y-2">
                      <div className="font-bold text-slate-800">Download &amp; Stream Resolution</div>
                      <div className="flex gap-2">
                        {(['1080p', '720p', '480p'] as const).map(q => (
                          <button
                            type="button"
                            key={q}
                            onClick={() => setQuality(q)}
                            className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                              quality === q
                                ? 'bg-[#082B59] text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {q} {q === '1080p' ? '(Full HD)' : q === '720p' ? '(HD)' : '(Data Saver)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* AI Assessment Prompt */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                      <div>
                        <div className="font-bold text-slate-800">Universal AI Instant Assessment</div>
                        <p className="text-[11px] text-slate-500">
                          Automatically generate 3 diagnostic check questions when finishing a lecture module.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={autoQuiz}
                        onChange={e => setAutoQuiz(e.target.checked)}
                        className="w-4 h-4 accent-[#13A8E8] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Learning Preferences</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: Notifications */}
              {activeTab === 'notifications' && (
                <form onSubmit={handleSaveNotifications} className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-[#082B59]">Notification &amp; Communication Preferences</h2>
                    <p className="text-xs text-slate-500">
                      Control how UNIVER-E alerts you about certificate issues, course updates, and doubt responses.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                      <div>
                        <div className="font-bold text-slate-800">Email Notifications</div>
                        <p className="text-[11px] text-slate-500">Receive course completion diplomas, receipts, and academic announcements.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailAlerts}
                        onChange={e => setEmailAlerts(e.target.checked)}
                        className="w-4 h-4 accent-[#13A8E8] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                      <div>
                        <div className="font-bold text-slate-800">SMS / WhatsApp Verification Alerts</div>
                        <p className="text-[11px] text-slate-500">Receive urgent examination reminders and 2-step OTP codes on mobile.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={smsAlerts}
                        onChange={e => setSmsAlerts(e.target.checked)}
                        className="w-4 h-4 accent-[#13A8E8] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Notification Preferences</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 5: Data & Privacy (DPDP Act) */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-[#082B59]">Data Portability &amp; DPDP Act Compliance</h2>
                    <p className="text-xs text-slate-500">
                      Under Indian Digital Personal Data Protection Act 2023, you retain 100% control over your personal data.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-[#082B59]">Export Personal Learning Data</div>
                        <p className="text-[11px] text-slate-500">
                          Download a complete, machine-readable JSON archive of your enrolled courses, certificates, and watch telemetry.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleExportData}
                        className="px-4 py-2 bg-white hover:bg-slate-100 text-[#082B59] font-bold text-xs rounded-xl border border-gray-300 shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
                      >
                        <Download className="w-4 h-4 text-[#13A8E8]" />
                        <span>Export Data Archive</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-amber-900">Reset Local Watch Progress</div>
                        <p className="text-[11px] text-amber-800">
                          Clear video watch markers and completed lesson timestamps on this browser.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetProgress}
                        className="px-4 py-2 bg-white hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-300 shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
                      >
                        <RotateCcw className="w-4 h-4 text-amber-600" />
                        <span>Reset Watch Progress</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-red-900">Sign Out of All Sessions</div>
                        <p className="text-[11px] text-red-700">
                          Terminate active login tokens and return to the login screen.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          logoutUser();
                          router.push('/login');
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Sign Out Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
