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
  CreditCard,
  QrCode,
  Copy,
  Smartphone,
  CheckCircle2,
  UploadCloud,
  RefreshCw,
  Sparkles,
  Trash2,
  PlusCircle,
  Star,
  Video,
  FileCode,
  Play,
  Lock,
  Unlock,
  GraduationCap,
  UserCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { COURSES, INSTRUCTORS } from '@/data/courses';
import { Instructor, Course, Flashcard } from '@/types';
import QRCode from 'qrcode';

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    showToast,
    courses,
    instructors,
    addInstructor,
    deleteInstructor,
    deleteCourse,
    deleteLesson,
    updateCoursePriceAndQuiz,
    inquiries,
    updateInquiryStatus,
    isAdminAuthenticated,
    adminLogout,
    adminLogin,
    paymentSettings,
    updatePaymentSettings,
    transactions,
    updateTransactionStatus,
    verifyPayment,
    requirePremiumForDownloads,
    setRequirePremiumForDownloads,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'payments' | 'instructors' | 'ai-playground' | 'inquiries' | 'courses' | 'users' | 'certificates' | 'atlas'
  >('payments');

  const [atlasStats, setAtlasStats] = useState<any>(null);
  const [loadingAtlas, setLoadingAtlas] = useState(false);

  // Payments / UPI Provider Editor State
  const [upiIdInput, setUpiIdInput] = useState(paymentSettings.upiId || '7557060447-5@ybl');
  const [merchantNameInput, setMerchantNameInput] = useState(paymentSettings.merchantName || 'UNIVER-E Digital Academy');
  const [providerSelection, setProviderSelection] = useState<'direct_upi' | 'upi_gateway' | 'cashfree' | 'razorpay'>('direct_upi');
  const [testAmount, setTestAmount] = useState('2999');
  const [adminQrPreview, setAdminQrPreview] = useState<string>('');

  // Payment Verification Simulator State
  const [verifyMethod, setVerifyMethod] = useState<'upi' | 'razorpay'>('upi');
  const [testUtr, setTestUtr] = useState('431902847192');
  const [testRzpId, setTestRzpId] = useState('pay_N8s9A7210x9q');
  const [testStudentName, setTestStudentName] = useState('Arham Khan');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  // Quick inline login state if unauthenticated
  const [gateUser, setGateUser] = useState('nur');
  const [gatePass, setGatePass] = useState('');
  const [gateError, setGateError] = useState(false);

  // -------------------------------------------------------------
  // Instructor Management State
  // -------------------------------------------------------------
  const [instName, setInstName] = useState('');
  const [instTitle, setInstTitle] = useState('');
  const [instBio, setInstBio] = useState('');
  const [instAvatar, setInstAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );
  const [instRating, setInstRating] = useState('4.9');
  const [instBadge, setInstBadge] = useState('Top Rated');
  const [instStudentsCount, setInstStudentsCount] = useState('25000');
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>(
    Object.keys(instructors)[0] || 'nur'
  );

  // -------------------------------------------------------------
  // Universal AI Playground State
  // -------------------------------------------------------------
  const [aiSubTab, setAiSubTab] = useState<'transcript' | 'flashcards' | 'quiz_runner' | 'publisher' | 'direct_chat'>('quiz_runner');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTranscript, setAiTranscript] = useState(
    `Welcome to the Masterclass on Neural Networks and Transformers. Today we explore self-attention mechanisms where queries, keys, and values are calculated using dot-product scoring. Remember, scaled dot-product attention divides by the square root of the dimension of the keys to avoid small gradients in softmax. We then project with multi-head attention weights to capture diverse linguistic representations. Make sure to complete the exercise on implementing multi-head self-attention in PyTorch.`
  );
  const [aiTopic, setAiTopic] = useState('Machine Learning & Attention Mechanisms');
  const [aiQuestionCount, setAiQuestionCount] = useState(5);
  const [aiIsLoading, setAiIsLoading] = useState(false);
  const [aiTranscriptSummary, setAiTranscriptSummary] = useState('');
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Flashcard[]>([]);
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [generatedQuizHtml, setGeneratedQuizHtml] = useState<string>('');
  const [generatedQuizQuestions, setGeneratedQuizQuestions] = useState<any[]>([]);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content:
        'Greetings! I am Universal AI, the pedagogical intelligence engine for UNIVER-E. Ask me to synthesize transcripts, generate high-yield flashcards, build interactive HTML quizzes, or design university curriculum.',
    },
  ]);

  // Course Pricing & Publisher State
  const [selectedCourseForPublish, setSelectedCourseForPublish] = useState<string>(courses[0]?.id || 'ai-fundamentals-python');
  const [targetCoursePrice, setTargetCoursePrice] = useState(String(courses[0]?.price || 2999));
  const [targetCourseOrigPrice, setTargetCourseOrigPrice] = useState(String(courses[0]?.originalPrice || 6999));

  // Generate test QR code inside Admin Portal
  useEffect(() => {
    const intent = `upi://pay?pa=${upiIdInput}&pn=${encodeURIComponent(
      merchantNameInput
    )}&am=${testAmount}&cu=INR&tn=${encodeURIComponent('UNIVER-E Admin Test Payment')}`;

    QRCode.toDataURL(intent, {
      width: 220,
      margin: 1.5,
      color: {
        dark: '#082B59',
        light: '#FFFFFF',
      },
    })
      .then(url => setAdminQrPreview(url))
      .catch(err => console.error('Admin QR err:', err));
  }, [upiIdInput, merchantNameInput, testAmount]);

  // Update publish target course pricing when selected
  useEffect(() => {
    const found = courses.find(c => c.id === selectedCourseForPublish);
    if (found) {
      setTargetCoursePrice(String(found.price));
      setTargetCourseOrigPrice(String(found.originalPrice));
    }
  }, [selectedCourseForPublish, courses]);

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(gateUser, gatePass);
    if (!success) {
      setGateError(true);
    } else {
      setGateError(false);
    }
  };

  const handlePublishPaymentSettings = () => {
    updatePaymentSettings({
      upiId: upiIdInput.trim(),
      merchantName: merchantNameInput.trim(),
      activeProvider: providerSelection,
      isAutoVerify: true,
    });
  };

  // Payment Verification Simulator Action
  const handleRunPaymentVerification = async () => {
    setIsVerifyingPayment(true);
    setVerifyResult(null);
    try {
      const res = await verifyPayment({
        method: verifyMethod,
        utrNumber: verifyMethod === 'upi' ? testUtr.trim() : undefined,
        razorpayPaymentId: verifyMethod === 'razorpay' ? testRzpId.trim() : undefined,
        studentName: testStudentName,
        studentEmail: `${testStudentName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        courseTitle: 'Full Stack Web Development',
        amount: Number(testAmount) || 2999,
      });
      setVerifyResult(res);
    } catch (err: any) {
      setVerifyResult({ success: false, message: err.message });
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  // Add new Instructor
  const handleAddInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instName.trim()) {
      showToast('Please enter the instructor name.');
      return;
    }
    const id = instName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString().slice(-4);
    const newInstructor: Instructor = {
      id,
      name: instName.trim(),
      title: instTitle.trim() || 'Distinguished Academic Faculty',
      bio: instBio.trim() || 'Experienced mentor and technology leader specialized in university-grade education.',
      avatar: instAvatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: parseFloat(instRating) || 4.9,
      studentsCount: parseInt(instStudentsCount) || 10000,
      coursesCount: 0,
      badge: instBadge,
    };
    addInstructor(newInstructor);
    setSelectedInstructorId(id);
    setInstName('');
    setInstTitle('');
    setInstBio('');
  };

  // Universal AI: Run Transcriptional Learning
  const handleRunTranscriptAnalysis = async () => {
    if (!aiTranscript.trim()) {
      showToast('Please provide a lecture transcript or notes.');
      return;
    }
    setAiIsLoading(true);
    try {
      const res = await fetch('/api/universal-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'transcript',
          transcript: aiTranscript,
          courseTitle: courses.find(c => c.id === selectedCourseForPublish)?.title || 'Specialization',
        }),
      });
      const data = await res.json();
      if (data.success && data.markdown) {
        setAiTranscriptSummary(data.markdown);
        showToast('Transcript synthesized successfully!');
      } else {
        showToast(data.error || 'Failed to synthesize transcript.');
      }
    } catch (err: any) {
      showToast(err.message || 'Universal AI connection error.');
    } finally {
      setAiIsLoading(false);
    }
  };

  // Universal AI: Generate Flashcards
  const handleGenerateFlashcards = async () => {
    setAiIsLoading(true);
    try {
      const res = await fetch('/api/universal-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'flashcards',
          topic: aiTopic || 'Artificial Intelligence & Modern Web',
          transcript: aiTranscript,
          count: aiQuestionCount,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.flashcards)) {
        setGeneratedFlashcards(data.flashcards);
        setActiveFlashcardIndex(0);
        setIsFlipped(false);
        showToast(`Generated ${data.flashcards.length} interactive flashcards!`);
      } else {
        showToast(data.error || 'Failed to generate flashcards.');
      }
    } catch (err: any) {
      showToast(err.message || 'Flashcards generation error.');
    } finally {
      setAiIsLoading(false);
    }
  };

  // Universal AI: Generate Quiz & Direct HTML Runner
  const handleGenerateQuizHtml = async () => {
    setAiIsLoading(true);
    try {
      const targetCourse = courses.find(c => c.id === selectedCourseForPublish);
      const res = await fetch('/api/universal-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'quiz_html',
          topic: aiTopic || 'Modern Web & AI Specialization',
          courseTitle: targetCourse?.title || aiTopic,
          transcript: aiTranscript,
          count: aiQuestionCount,
        }),
      });
      const data = await res.json();
      if (data.success && data.htmlRunner) {
        setGeneratedQuizHtml(data.htmlRunner);
        setGeneratedQuizQuestions(data.questions || []);
        showToast('Interactive Quiz HTML runner generated successfully!');
      } else {
        showToast(data.error || 'Failed to build quiz HTML.');
      }
    } catch (err: any) {
      showToast(err.message || 'Quiz generation error.');
    } finally {
      setAiIsLoading(false);
    }
  };

  // Universal AI: Direct Chat Mode
  const handleSendAiChatMessage = async () => {
    if (!aiPrompt.trim()) return;
    const userText = aiPrompt.trim();
    setAiPrompt('');
    setAiChatMessages(prev => [...prev, { role: 'user', content: userText }]);
    setAiIsLoading(true);
    try {
      const res = await fetch('/api/universal-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          prompt: userText,
        }),
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setAiChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setAiChatMessages(prev => [
          ...prev,
          { role: 'assistant', content: 'Universal AI processed your inquiry.' },
        ]);
      }
    } catch (err: any) {
      setAiChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Universal AI notice: ${err.message}` },
      ]);
    } finally {
      setAiIsLoading(false);
    }
  };

  // Publish Price & Quiz to Course
  const handlePublishPriceAndQuizToCourse = () => {
    const p = Number(targetCoursePrice) || 2999;
    const op = Number(targetCourseOrigPrice) || 6999;
    const targetCourse = courses.find(c => c.id === selectedCourseForPublish);

    const quizObj = generatedQuizQuestions.length > 0 ? {
      title: `${targetCourse?.title || 'Specialization'} Assessment`,
      passingScore: 70,
      timeLimitMinutes: 10,
      questions: generatedQuizQuestions,
    } : targetCourse?.quiz;

    updateCoursePriceAndQuiz(
      selectedCourseForPublish,
      p,
      op,
      quizObj,
      generatedFlashcards.length > 0 ? generatedFlashcards : undefined,
      generatedQuizHtml || undefined
    );
  };

  const fetchAtlasStats = async () => {
    setLoadingAtlas(true);
    try {
      const res = await fetch('/api/atlas/stats');
      const data = await res.json();
      setAtlasStats(data);
    } catch (e) {
      console.error(e);
      showToast('MongoDB Atlas connection check complete.');
    } finally {
      setLoadingAtlas(false);
    }
  };

  // Quick preset avatars for adding instructors
  const PRESET_AVATARS = [
    { label: 'Dr. Priya (AI)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
    { label: 'Prof. Vikram (Cloud)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { label: 'Sara (Design Lead)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { label: 'Farhan (Security)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  ];

  // Render Gate Lock screen if admin is not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#051C3A] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200">
          <div className="text-center space-y-2 mb-6">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-200">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-[#082B59]">Admin Security Gate</h1>
            <p className="text-xs text-slate-500">
              Administrative Root Portal for UNIVER-E Governance.
            </p>
          </div>

          <form onSubmit={handleGateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Administrator Username</label>
              <input
                type="text"
                value={gateUser}
                onChange={e => setGateUser(e.target.value)}
                placeholder="nur"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Root Access Password</label>
              <input
                type="password"
                value={gatePass}
                onChange={e => setGatePass(e.target.value)}
                placeholder="Enter root password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                required
              />
            </div>

            {gateError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Invalid credentials. Access restricted to authorized root admins.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#082B59] hover:bg-[#051C3A] text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Unlock Central Admin Console
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-[#082B59] font-bold">
              &larr; Return to Public Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedInstructor = instructors[selectedInstructorId] || Object.values(instructors)[0];
  const instructorAssignedCourses = courses.filter(
    c => c.instructor.id === selectedInstructorId || c.instructor.name.toLowerCase() === selectedInstructor?.name?.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#F5F8FC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Admin Header */}
        <div className="bg-[#082B59] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-navy-700">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                Admin &amp; Governance Console
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                Root Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              UNIVER-E Central Operations &amp; Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Universal AI Engine, Instructor &amp; Content Management, UPI &amp; Razorpay Payments, and Security Policy.
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
              <span className="text-xs font-bold uppercase">Active UPI Merchant</span>
              <QrCode className="w-5 h-5 text-[#28A745]" />
            </div>
            <div className="text-sm sm:text-base font-mono font-black text-[#082B59] truncate">
              {paymentSettings.upiId}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold">Direct Settlement</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Instructors Registered</span>
              <GraduationCap className="w-5 h-5 text-[#13A8E8]" />
            </div>
            <div className="text-2xl font-black text-[#082B59]">{Object.keys(instructors).length}</div>
            <span className="text-[11px] text-sky-600 font-bold">Active Academic Faculty</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Universal AI</span>
              <Sparkles className="w-5 h-5 text-[#F5A900]" />
            </div>
            <div className="text-2xl font-black text-[#082B59]">Active</div>
            <span className="text-[11px] text-amber-700 font-bold">Nemotron 3 Ultra Engine</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase">Video Security</span>
              <Lock className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-xl font-black text-[#082B59]">
              {requirePremiumForDownloads ? 'Premium Gated' : 'Open Access'}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold">Download Protection</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'payments' ? 'bg-[#F5A900] text-[#082B59] shadow' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#082B59]" />
            <span>Payments &amp; UPI Provider</span>
          </button>

          <button
            onClick={() => setActiveTab('instructors')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'instructors' ? 'bg-[#082B59] text-white shadow' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-[#13A8E8]" />
            <span>Instructors &amp; Content Management</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-playground')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'ai-playground' ? 'bg-[#13A8E8] text-white shadow' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#F5A900]" />
            <span>Universal AI Playground</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'inquiries' ? 'bg-[#082B59] text-white shadow' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Mail className="w-4 h-4 text-[#F5A900]" />
            <span>Inquiries ({inquiries.length})</span>
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
            Users &amp; Roles
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

        {/* ============================================================== */}
        {/* TAB 1: Payments & UPI Provider & Verification Simulator       */}
        {/* ============================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: UPI Configuration & Provider Switcher */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-xl font-black text-[#082B59]">Payment Provider &amp; UPI Configuration</h3>
                    <p className="text-xs text-slate-500">
                      Configure and publish any free UPI payment provider to the live checkout page.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-[#28A745] font-bold text-xs rounded-full border border-emerald-200">
                    Live Active
                  </span>
                </div>

                {/* UPI ID Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Merchant UPI ID (All student payments route here):
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={upiIdInput}
                        onChange={e => setUpiIdInput(e.target.value)}
                        placeholder="e.g. 7557060447-5@ybl"
                        className="w-full px-4 py-3 border-2 border-emerald-300 rounded-xl font-mono text-sm font-bold text-[#082B59] focus:outline-none focus:ring-2 focus:ring-[#28A745] bg-emerald-50/20"
                      />
                      <QrCode className="w-5 h-5 text-[#28A745] absolute right-3 top-3.5" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Current official UPI ID: <code className="font-bold text-[#082B59]">7557060447-5@ybl</code> (PhonePe / YES Bank).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Merchant Display Name (Shown in GPay / PhonePe / Paytm):
                    </label>
                    <input
                      type="text"
                      value={merchantNameInput}
                      onChange={e => setMerchantNameInput(e.target.value)}
                      placeholder="UNIVER-E Digital Academy"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                    />
                  </div>
                </div>

                {/* Free Payment Providers Directory */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Select &amp; Publish Payment Provider Engine:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setProviderSelection('direct_upi')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition space-y-1.5 ${
                        providerSelection === 'direct_upi'
                          ? 'border-[#28A745] bg-emerald-50/40'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#082B59]">Direct Dynamic UPI (Free)</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#28A745] text-white">
                          0% Fee
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Generates dynamic UPI QR codes and deep-link intent for all Indian UPI apps with direct bank credit.
                      </p>
                    </div>

                    <div
                      onClick={() => setProviderSelection('upi_gateway')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition space-y-1.5 ${
                        providerSelection === 'upi_gateway'
                          ? 'border-[#13A8E8] bg-sky-50/40'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#082B59]">UPI Webhook Engine</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Free API
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Automatic webhook listener for instantaneous 12-digit UTR confirmation without third-party commission.
                      </p>
                    </div>

                    <div
                      onClick={() => setProviderSelection('cashfree')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition space-y-1.5 ${
                        providerSelection === 'cashfree'
                          ? 'border-[#F5A900] bg-amber-50/40'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#082B59]">Cashfree Free UPI Tier</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Auto Collect
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Virtual UPI addresses for auto-matching student payments and refunds.
                      </p>
                    </div>

                    <div
                      onClick={() => setProviderSelection('razorpay')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition space-y-1.5 ${
                        providerSelection === 'razorpay'
                          ? 'border-[#082B59] bg-slate-100'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#082B59]">Razorpay Standard</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          Cards &amp; UPI
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Indian payment gateway for domestic credit/debit cards and Net Banking.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Last published: <strong>{paymentSettings.publishedAt}</strong>
                  </div>

                  <button
                    onClick={handlePublishPaymentSettings}
                    className="px-6 py-3 rounded-xl bg-[#28A745] hover:bg-[#218838] text-white font-black text-xs flex items-center gap-2 shadow-md transition"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Publish &amp; Deploy Payment Gateway</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Dynamic QR Test Terminal & Verification Simulator */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* QR Terminal */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4 text-center">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase text-[#13A8E8]">
                      Live Simulator
                    </span>
                    <h3 className="text-lg font-black text-[#082B59]">Admin QR Code Verification</h3>
                    <p className="text-xs text-slate-500">
                      Scan with PhonePe or GPay to verify live UPI parameters.
                    </p>
                  </div>

                  {/* Amount Slider / Input */}
                  <div className="bg-[#F5F8FC] p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Test Order Amount:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-900">₹</span>
                      <input
                        type="number"
                        value={testAmount}
                        onChange={e => setTestAmount(e.target.value)}
                        className="w-20 px-2 py-1 text-sm font-black font-mono border rounded-lg bg-white text-right"
                      />
                    </div>
                  </div>

                  {/* Dynamic QR Display */}
                  <div className="inline-block p-4 bg-white rounded-2xl border-2 border-[#082B59]/20 shadow-md">
                    {adminQrPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={adminQrPreview} alt="Live UPI QR Code" className="w-44 h-44 mx-auto object-contain" />
                    ) : (
                      <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-400">
                        Generating Preview...
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold text-[#082B59] bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200 break-all">
                      {upiIdInput}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Zero transaction fee direct settlement active.
                    </p>
                  </div>
                </div>

                {/* Instant Verification Tester (like Razorpay) */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-[#082B59] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#28A745]" />
                      <span>Instant Verification Engine</span>
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Razorpay &amp; UPI
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setVerifyMethod('upi')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${
                        verifyMethod === 'upi' ? 'bg-[#082B59] text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      UPI UTR (12 Digits)
                    </button>
                    <button
                      onClick={() => setVerifyMethod('razorpay')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${
                        verifyMethod === 'razorpay' ? 'bg-[#082B59] text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Razorpay Gateway
                    </button>
                  </div>

                  {verifyMethod === 'upi' ? (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Bank 12-Digit UTR Reference:
                      </label>
                      <input
                        type="text"
                        value={testUtr}
                        onChange={e => setTestUtr(e.target.value)}
                        placeholder="e.g. 431902847192"
                        className="w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Razorpay Payment ID:
                      </label>
                      <input
                        type="text"
                        value={testRzpId}
                        onChange={e => setTestRzpId(e.target.value)}
                        placeholder="e.g. pay_N8s9A7210x9q"
                        className="w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleRunPaymentVerification}
                    disabled={isVerifyingPayment}
                    className="w-full py-2.5 bg-[#28A745] hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2"
                  >
                    {isVerifyingPayment ? (
                      <span>Verifying against banking network...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Run Instant Verification Test</span>
                      </>
                    )}
                  </button>

                  {verifyResult && (
                    <div
                      className={`p-3 rounded-xl text-xs font-medium border ${
                        verifyResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                      }`}
                    >
                      <p className="font-bold">{verifyResult.message || (verifyResult.success ? 'Verified Successfully!' : 'Verification Failed')}</p>
                      {verifyResult.receiptNumber && (
                        <p className="text-[11px] font-mono mt-1">Receipt: {verifyResult.receiptNumber}</p>
                      )}
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* UPI Transaction Audit & UTR Verification Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-black text-[#082B59]">Student Transaction Ledger</h3>
                  <p className="text-xs text-slate-500">
                    Real-time transaction reference (UTR) verification log for all course enrollments.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  Total Recorded: {transactions.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-gray-200">
                      <th className="p-3">Transaction ID</th>
                      <th className="p-3">Bank UTR Reference</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Course Enrolled</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-slate-600">
                    {transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-slate-900">{tx.id}</td>
                        <td className="p-3 font-mono font-bold text-[#13A8E8]">{tx.utrNumber}</td>
                        <td className="p-3 font-semibold text-slate-900">
                          {tx.studentName}
                          <span className="block text-[10px] text-slate-400 font-normal">{tx.studentEmail}</span>
                        </td>
                        <td className="p-3 font-medium text-[#082B59]">{tx.courseTitle}</td>
                        <td className="p-3 font-black text-slate-900">₹{tx.amount.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-slate-500 whitespace-nowrap">{tx.timestamp}</td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              tx.status === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : tx.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                          {tx.status !== 'verified' && (
                            <button
                              onClick={() => updateTransactionStatus(tx.id, 'verified')}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                            >
                              Verify
                            </button>
                          )}
                          {tx.status !== 'rejected' && (
                            <button
                              onClick={() => updateTransactionStatus(tx.id, 'rejected')}
                              className="px-2.5 py-1 rounded bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 font-bold text-[10px]"
                            >
                              Reject
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: Instructors & Content Management (Upload, Stars, Delete)*/}
        {/* ============================================================== */}
        {activeTab === 'instructors' && (
          <div className="space-y-8">
            
            {/* Top Bar: Security Policy Toggle */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#F5A900]" />
                  <h3 className="text-base font-black text-[#082B59]">Course &amp; Video Download Security Policy</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Protect intellectual property: require students to have a UNIVER-E Premium Pass before downloading offline lecture videos.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">
                  {requirePremiumForDownloads ? 'Enforced (Premium Only)' : 'Open (Any Learner)'}
                </span>
                <button
                  onClick={() => setRequirePremiumForDownloads(!requirePremiumForDownloads)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                    requirePremiumForDownloads ? 'bg-[#28A745]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition duration-200 ease-in-out ${
                      requirePremiumForDownloads ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Upload / Add Instructor Form */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                <div className="pb-3 border-b border-gray-100">
                  <h3 className="text-lg font-black text-[#082B59]">Upload / Register New Faculty</h3>
                  <p className="text-xs text-slate-500">
                    Add instructor profile, avatar photograph, title, star rating, and credentials.
                  </p>
                </div>

                <form onSubmit={handleAddInstructorSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Instructor Full Name:
                    </label>
                    <input
                      type="text"
                      value={instName}
                      onChange={e => setInstName(e.target.value)}
                      placeholder="e.g. Dr. Priya Sharma"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Professional Title / Designation:
                    </label>
                    <input
                      type="text"
                      value={instTitle}
                      onChange={e => setInstTitle(e.target.value)}
                      placeholder="e.g. Principal AI Architect &amp; Research Fellow"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#F5A900] fill-[#F5A900]" />
                        <span>Star Rating (1.0 - 5.0):</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={instRating}
                        onChange={e => setInstRating(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Faculty Badge:
                      </label>
                      <select
                        value={instBadge}
                        onChange={e => setInstBadge(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold bg-white"
                      >
                        <option value="Top Rated">Top Rated</option>
                        <option value="Senior Fellow">Senior Fellow</option>
                        <option value="Master Mentor">Master Mentor</option>
                        <option value="Industry Expert">Industry Expert</option>
                        <option value="Student Favorite">Student Favorite</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Instructor Image / Avatar URL:
                    </label>
                    <input
                      type="url"
                      value={instAvatar}
                      onChange={e => setInstAvatar(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs font-mono"
                    />

                    {/* Preset Avatars Picker */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold">Presets:</span>
                      {PRESET_AVATARS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setInstAvatar(p.url)}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Faculty Bio / Academic Specialization:
                    </label>
                    <textarea
                      rows={3}
                      value={instBio}
                      onChange={e => setInstBio(e.target.value)}
                      placeholder="Outline research focus, years of industry leadership, and mentorship background..."
                      className="w-full p-3 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#082B59] hover:bg-[#051C3A] text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <PlusCircle className="w-4 h-4 text-[#F5A900]" />
                    <span>Upload &amp; Publish Instructor</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Instructor Selection, Assigned Courses & Video Deletion */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-black text-[#082B59]">Faculty Selector &amp; Curriculum Control</h3>
                    <p className="text-xs text-slate-500">
                      Select an existing instructor to inspect, manage assigned courses, or delete videos.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    {Object.keys(instructors).length} Active Faculty
                  </span>
                </div>

                {/* Dropdown Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Instructor to Inspect &amp; Manage:
                  </label>
                  <select
                    value={selectedInstructorId}
                    onChange={e => setSelectedInstructorId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#13A8E8] rounded-2xl text-xs font-bold text-[#082B59] bg-white focus:outline-none"
                  >
                    {Object.values(instructors).map(inst => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} — ⭐ {inst.rating} ({inst.title})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Instructor Card */}
                {selectedInstructor && (
                  <div className="p-5 rounded-2xl bg-[#F5F8FC] border border-gray-200 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedInstructor.avatar}
                          alt={selectedInstructor.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-black text-[#082B59]">{selectedInstructor.name}</h4>
                            {selectedInstructor.badge && (
                              <span className="px-2 py-0.5 rounded-full bg-[#F5A900]/20 text-[#082B59] text-[10px] font-black border border-[#F5A900]/40">
                                {selectedInstructor.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 font-medium">{selectedInstructor.title}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1 font-bold text-amber-600">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              {selectedInstructor.rating} Star Rating
                            </span>
                            <span>•</span>
                            <span>{selectedInstructor.studentsCount.toLocaleString()} Students</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete instructor ${selectedInstructor.name}?`)) {
                            deleteInstructor(selectedInstructor.id);
                          }
                        }}
                        className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition border border-red-200"
                        title="Delete this instructor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-gray-100">
                      {selectedInstructor.bio}
                    </p>

                    {/* Assigned Courses Section */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-black uppercase text-[#082B59] tracking-wider">
                          Assigned Courses ({instructorAssignedCourses.length})
                        </h5>
                        <span className="text-[11px] text-slate-500">Live in catalog</span>
                      </div>

                      {instructorAssignedCourses.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400 bg-white rounded-xl border">
                          No courses currently mapped to this instructor.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {instructorAssignedCourses.map(course => (
                            <div
                              key={course.id}
                              className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-xs font-bold text-[#082B59]">{course.title}</div>
                                  <div className="text-[11px] text-slate-500">
                                    {course.category} • ₹{course.price.toLocaleString('en-IN')} • {course.lessonsCount} Lectures
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    if (confirm(`Delete entire course "${course.title}" from UNIVER-E?`)) {
                                      deleteCourse(course.id);
                                    }
                                  }}
                                  className="px-2.5 py-1 rounded-lg text-red-600 hover:bg-red-50 text-[11px] font-bold border border-red-200 transition"
                                >
                                  Delete Course
                                </button>
                              </div>

                              {/* Curriculum Lessons / Video Deletion */}
                              <div className="border-t border-gray-100 pt-2 space-y-2">
                                <span className="text-[10px] font-bold uppercase text-slate-400">
                                  Course Video Lessons (Click Trash to remove video):
                                </span>
                                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                  {course.curriculum.flatMap(sec =>
                                    sec.lessons.map(lesson => (
                                      <div
                                        key={lesson.id}
                                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-[11px] text-slate-700"
                                      >
                                        <div className="flex items-center gap-2 truncate">
                                          <Video className="w-3.5 h-3.5 text-[#13A8E8] flex-shrink-0" />
                                          <span className="truncate font-medium">{lesson.title}</span>
                                          <span className="text-slate-400 font-mono text-[10px]">
                                            ({lesson.duration})
                                          </span>
                                        </div>

                                        <button
                                          onClick={() => {
                                            if (confirm(`Delete video "${lesson.title}" from this course?`)) {
                                              deleteLesson(course.id, sec.id, lesson.id);
                                            }
                                          }}
                                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition"
                                          title="Delete this lecture video"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: Universal AI Playground & Course Publisher             */}
        {/* ============================================================== */}
        {activeTab === 'ai-playground' && (
          <div className="space-y-8">
            
            {/* Header banner */}
            <div className="bg-gradient-to-r from-[#082B59] to-[#0D3B73] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-navy-700">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#F5A900] text-[#082B59] text-xs font-black uppercase tracking-wider">
                    Universal AI Engine
                  </span>
                  <span className="text-xs font-mono text-cyan-300">NVIDIA Nemotron 3 Ultra (Free API)</span>
                </div>
                <h2 className="text-2xl font-black">
                  Universal AI Pedagogical &amp; Assessment Playground
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Generate lecture transcript summaries, interactive study flashcards, and complete standalone HTML quiz runners with live sandboxed previews.
                </p>
              </div>

              {/* Sub-tab pills */}
              <div className="flex flex-wrap items-center gap-2 bg-navy-950/70 p-2 rounded-2xl border border-navy-700">
                <button
                  onClick={() => setAiSubTab('quiz_runner')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    aiSubTab === 'quiz_runner' ? 'bg-[#F5A900] text-[#082B59]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Quiz &amp; HTML Runner
                </button>
                <button
                  onClick={() => setAiSubTab('flashcards')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    aiSubTab === 'flashcards' ? 'bg-[#13A8E8] text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  3D Flashcards
                </button>
                <button
                  onClick={() => setAiSubTab('transcript')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    aiSubTab === 'transcript' ? 'bg-[#28A745] text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Transcriptional Learning
                </button>
                <button
                  onClick={() => setAiSubTab('publisher')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    aiSubTab === 'publisher' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Course Publisher
                </button>
                <button
                  onClick={() => setAiSubTab('direct_chat')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    aiSubTab === 'direct_chat' ? 'bg-white text-[#082B59]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Ask Universal AI
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Quiz & Direct HTML Runner */}
            {aiSubTab === 'quiz_runner' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Input & Generator */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
                  <div>
                    <h3 className="text-lg font-black text-[#082B59]">Automatic Quiz HTML Generator</h3>
                    <p className="text-xs text-slate-500">
                      Creates a self-contained interactive assessment with timer, radio questions, explanations, scoring, and confetti.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Course / Subject Topic:
                      </label>
                      <input
                        type="text"
                        value={aiTopic}
                        onChange={e => setAiTopic(e.target.value)}
                        placeholder="e.g. Full Stack Web Development or Neural Networks"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Lecture Transcript / Audio Notes:
                      </label>
                      <textarea
                        rows={4}
                        value={aiTranscript}
                        onChange={e => setAiTranscript(e.target.value)}
                        placeholder="Paste lecture transcript to base questions on..."
                        className="w-full p-3 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Question Count (3 to 10):
                      </label>
                      <input
                        type="number"
                        min="3"
                        max="10"
                        value={aiQuestionCount}
                        onChange={e => setAiQuestionCount(Number(e.target.value))}
                        className="w-24 px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <button
                      onClick={handleGenerateQuizHtml}
                      disabled={aiIsLoading}
                      className="w-full py-3 bg-[#F5A900] hover:bg-amber-500 text-[#082B59] font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow transition"
                    >
                      {aiIsLoading ? (
                        <span>Generating Assessment with Universal AI...</span>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-[#082B59]" />
                          <span>Generate Interactive Quiz &amp; HTML Runner</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right: Direct HTML Runner (Live Sandbox) */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#28A745]">
                        Live Interactive Sandbox
                      </span>
                      <h3 className="text-lg font-black text-[#082B59]">Direct HTML Runner</h3>
                    </div>
                    {generatedQuizHtml && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedQuizHtml);
                          showToast('Quiz HTML copied to clipboard!');
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#082B59] rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy HTML</span>
                      </button>
                    )}
                  </div>

                  {generatedQuizHtml ? (
                    <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-inner h-[580px]">
                      <iframe
                        srcDoc={generatedQuizHtml}
                        className="w-full h-full border-0"
                        title="Universal AI Quiz Runner Sandbox"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-gray-300 space-y-3">
                      <Sparkles className="w-10 h-10 text-[#F5A900] mx-auto" />
                      <h4 className="text-sm font-bold text-[#082B59]">Direct HTML Runner Awaiting Input</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Click &ldquo;Generate Interactive Quiz &amp; HTML Runner&rdquo; on the left to immediately test and play the generated assessment inside this sandbox.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Sub-tab 2: 3D Flashcards */}
            {aiSubTab === 'flashcards' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Input */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
                  <div>
                    <h3 className="text-lg font-black text-[#082B59]">Universal AI Flashcard Studio</h3>
                    <p className="text-xs text-slate-500">
                      Synthesizes high-yield study flashcards from lecture transcripts or syllabus topics.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Flashcard Topic:</label>
                      <input
                        type="text"
                        value={aiTopic}
                        onChange={e => setAiTopic(e.target.value)}
                        placeholder="e.g. React Server Components or Attention Softmax"
                        className="w-full px-4 py-2.5 border rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Source Notes:</label>
                      <textarea
                        rows={4}
                        value={aiTranscript}
                        onChange={e => setAiTranscript(e.target.value)}
                        className="w-full p-3 border rounded-xl text-xs"
                      />
                    </div>

                    <button
                      onClick={handleGenerateFlashcards}
                      disabled={aiIsLoading}
                      className="w-full py-3 bg-[#13A8E8] hover:bg-sky-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow transition"
                    >
                      {aiIsLoading ? (
                        <span>Synthesizing Flashcards...</span>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Flashcard Deck</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right: Interactive 3D Flashcard Viewer */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h3 className="text-lg font-black text-[#082B59]">Interactive Flashcard Deck</h3>
                    {generatedFlashcards.length > 0 && (
                      <span className="text-xs font-mono font-bold text-[#13A8E8]">
                        Card {activeFlashcardIndex + 1} of {generatedFlashcards.length}
                      </span>
                    )}
                  </div>

                  {generatedFlashcards.length > 0 ? (
                    <div className="space-y-4">
                      {/* Flip card */}
                      <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="w-full min-h-[220px] cursor-pointer rounded-2xl p-6 transition-all duration-300 border shadow-md flex flex-col justify-between"
                        style={{
                          backgroundColor: isFlipped ? '#F0FDF4' : '#F5F8FC',
                          borderColor: isFlipped ? '#28A745' : '#13A8E8',
                        }}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2.5 py-0.5 rounded-full bg-white font-bold text-[#082B59] border text-[11px]">
                            {isFlipped ? 'ANSWER / CODE' : 'STUDY QUESTION'}
                          </span>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            {generatedFlashcards[activeFlashcardIndex]?.difficulty || 'Medium'}
                          </span>
                        </div>

                        <div className="py-6 text-center">
                          <p className="text-base sm:text-lg font-bold text-[#082B59]">
                            {isFlipped
                              ? generatedFlashcards[activeFlashcardIndex]?.back
                              : generatedFlashcards[activeFlashcardIndex]?.front}
                          </p>
                        </div>

                        <div className="text-center text-[11px] text-slate-400 font-semibold">
                          (Click card to flip)
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => {
                            setIsFlipped(false);
                            setActiveFlashcardIndex(prev => (prev > 0 ? prev - 1 : generatedFlashcards.length - 1));
                          }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#082B59] rounded-xl text-xs font-bold transition"
                        >
                          &larr; Prev
                        </button>

                        <button
                          onClick={() => showToast('Flashcard deck saved to context!')}
                          className="px-4 py-2 bg-[#28A745] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition"
                        >
                          Save Deck to Course
                        </button>

                        <button
                          onClick={() => {
                            setIsFlipped(false);
                            setActiveFlashcardIndex(prev => (prev < generatedFlashcards.length - 1 ? prev + 1 : 0));
                          }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#082B59] rounded-xl text-xs font-bold transition"
                        >
                          Next &rarr;
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-gray-300">
                      <p className="text-xs text-slate-500">
                        Generate flashcards using Universal AI to test 3D card flips.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Sub-tab 3: Transcriptional Learning */}
            {aiSubTab === 'transcript' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-[#082B59]">Transcriptional Learning Engine</h3>
                    <p className="text-xs text-slate-500">
                      Paste lecture audio transcripts or notes to automatically extract study summaries, formulas, and reflection questions.
                    </p>
                  </div>

                  <textarea
                    rows={8}
                    value={aiTranscript}
                    onChange={e => setAiTranscript(e.target.value)}
                    placeholder="Paste lecture transcript..."
                    className="w-full p-3 border rounded-xl text-xs"
                  />

                  <button
                    onClick={handleRunTranscriptAnalysis}
                    disabled={aiIsLoading}
                    className="w-full py-3 bg-[#28A745] hover:bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow transition"
                  >
                    {aiIsLoading ? (
                      <span>Synthesizing Transcript...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Analyze &amp; Synthesize Transcript</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                  <h3 className="text-lg font-black text-[#082B59]">Pedagogical Synthesis Output</h3>
                  {aiTranscriptSummary ? (
                    <div className="prose prose-sm max-w-none p-4 rounded-2xl bg-slate-50 border border-gray-200 max-h-[500px] overflow-y-auto whitespace-pre-wrap text-xs text-slate-700 leading-relaxed">
                      {aiTranscriptSummary}
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-gray-300 text-xs text-slate-500">
                      Click &ldquo;Analyze &amp; Synthesize Transcript&rdquo; to view the structured synthesis.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Sub-tab 4: Course Pricing & Publisher */}
            {aiSubTab === 'publisher' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 max-w-3xl mx-auto">
                <div className="pb-3 border-b border-gray-100">
                  <h3 className="text-xl font-black text-[#082B59]">Course Pricing &amp; Assessment Publisher</h3>
                  <p className="text-xs text-slate-500">
                    Publish custom selling prices and attach Universal AI quizzes or flashcards directly to the course catalog.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Target Course:</label>
                    <select
                      value={selectedCourseForPublish}
                      onChange={e => setSelectedCourseForPublish(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#13A8E8] rounded-xl text-xs font-bold text-[#082B59] bg-white"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.title} (Current Price: ₹{c.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        New Selling Price (₹):
                      </label>
                      <input
                        type="number"
                        value={targetCoursePrice}
                        onChange={e => setTargetCoursePrice(e.target.value)}
                        className="w-full px-4 py-2.5 border rounded-xl text-xs font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Original Price (₹):
                      </label>
                      <input
                        type="number"
                        value={targetCourseOrigPrice}
                        onChange={e => setTargetCourseOrigPrice(e.target.value)}
                        className="w-full px-4 py-2.5 border rounded-xl text-xs font-bold font-mono"
                      />
                    </div>
                  </div>

                  {/* Summary of attachments */}
                  <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-gray-200 space-y-2 text-xs">
                    <span className="font-bold text-[#082B59]">Universal AI Assets Ready to Attach:</span>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#28A745]" />
                      <span>
                        Interactive HTML Quiz Runner: {generatedQuizHtml ? 'Generated & Ready' : 'Standard Course Assessment'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#28A745]" />
                      <span>
                        3D Study Flashcards: {generatedFlashcards.length} cards in deck
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handlePublishPriceAndQuizToCourse}
                    className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Publish Price, Quiz &amp; Flashcards to Live Catalog</span>
                  </button>
                </div>
              </div>
            )}

            {/* Sub-tab 5: Direct Chat */}
            {aiSubTab === 'direct_chat' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4 max-w-4xl mx-auto">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-lg font-black text-[#082B59]">Direct Universal AI Terminal</h3>
                  <span className="text-xs font-mono text-cyan-600 font-bold">NVIDIA Nemotron 3 Ultra</span>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-gray-200">
                  {aiChatMessages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-[#082B59] text-white ml-12'
                          : 'bg-white text-slate-800 border mr-12 shadow-sm'
                      }`}
                    >
                      <span className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">
                        {m.role === 'user' ? 'Admin' : 'Universal AI'}
                      </span>
                      {m.content}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendAiChatMessage()}
                    placeholder="Ask Universal AI anything about curriculum, grading, or syllabus..."
                    className="flex-1 px-4 py-2.5 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                  />
                  <button
                    onClick={handleSendAiChatMessage}
                    disabled={aiIsLoading}
                    className="px-5 py-2.5 bg-[#082B59] hover:bg-[#051C3A] text-white rounded-xl text-xs font-black transition"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: Contact Inquiries                                       */}
        {/* ============================================================== */}
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
                    className={`p-5 rounded-2xl border transition ${
                      inq.status === 'new' ? 'bg-amber-50/40 border-amber-200' : 'bg-slate-50 border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#082B59] text-sm">{inq.name}</span>
                        <span className="text-xs text-slate-500">&lt;{inq.email}&gt;</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{inq.createdAt}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed mb-4">{inq.message}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          inq.status === 'new'
                            ? 'bg-amber-200 text-amber-900'
                            : inq.status === 'replied'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {inq.status}
                      </span>

                      <div className="flex gap-2">
                        {inq.status !== 'replied' && (
                          <button
                            onClick={() => updateInquiryStatus(inq.id, 'replied')}
                            className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                          >
                            Mark Replied
                          </button>
                        )}
                        {inq.status !== 'archived' && (
                          <button
                            onClick={() => updateInquiryStatus(inq.id, 'archived')}
                            className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition"
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">No inquiries logged yet.</div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: Course Moderation                                       */}
        {/* ============================================================== */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-[#082B59]">Course Catalog Moderation</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b">
                    <th className="p-3">Course Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Instructor</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Enrolled</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {courses.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-[#082B59]">{c.title}</td>
                      <td className="p-3">{c.category}</td>
                      <td className="p-3">{c.instructor.name}</td>
                      <td className="p-3 font-bold">₹{c.price}</td>
                      <td className="p-3">{c.studentsCount.toLocaleString()}</td>
                      <td className="p-3 space-x-2">
                        <Link
                          href={`/courses/${c.slug}`}
                          target="_blank"
                          className="text-[#13A8E8] font-bold hover:underline"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`Delete course ${c.title}?`)) {
                              deleteCourse(c.id);
                            }
                          }}
                          className="text-red-500 font-bold hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: Users & Roles                                          */}
        {/* ============================================================== */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-[#082B59]">User Account Registry</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Arham Khan</td>
                    <td className="p-3">arham.khan@univer-e.in</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">Student</span></td>
                    <td className="p-3"><span className="text-[#28A745] font-bold">● Active</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Nur Mohammad</td>
                    <td className="p-3">nur@univer-e.in</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">Root Admin</span></td>
                    <td className="p-3"><span className="text-[#28A745] font-bold">● Root Verified</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: Certificates Audit                                     */}
        {/* ============================================================== */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-[#082B59]">Digital Certificate Registry</h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#082B59]">UNIVER-E-2026-GD812</span>
                <p className="text-xs text-slate-600">Recipient: Arham Khan • Course: Graphic Design with Canva Pro</p>
              </div>
              <Link
                href="/certificates/UNIVER-E-2026-GD812"
                className="px-3 py-1.5 bg-[#13A8E8] text-white rounded-lg text-xs font-bold hover:bg-sky-600 transition"
              >
                Inspect Record
              </Link>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 8: MongoDB Atlas Telemetry View                           */}
        {/* ============================================================== */}
        {activeTab === 'atlas' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#28A745]">
                  Cluster Health &amp; Metrics
                </span>
                <h3 className="text-xl font-black text-[#082B59]">MongoDB Atlas Cluster Integration</h3>
                <p className="text-xs text-slate-500">
                  Connected to: <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">https://one0l-server-point-234567.onrender.com</code>
                </p>
              </div>

              <button
                onClick={fetchAtlasStats}
                disabled={loadingAtlas}
                className="px-4 py-2 bg-[#082B59] hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 self-start cursor-pointer"
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
