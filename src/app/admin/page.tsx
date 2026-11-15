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
  UserX,
  FileText,
  DownloadCloud,
  Database,
  Server,
  HardDrive,
  Bell,
  Wrench,
  ShieldAlert,
  Cpu,
  ArrowUpRight,
  CheckSquare,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Instructor, Course, Flashcard, StaffMember, UploadedResource } from '@/types';
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
    // 5 Operational Pillars
    adminLogs,
    addAdminLog,
    staffMembers,
    addStaffMember,
    removeStaffMember,
    students,
    toggleStudentSuspension,
    enrollStudentInCourse,
    uploadedResources,
    addUploadedResource,
    deleteUploadedResource,
    updateCourseModerationStatus,
    approveUtrAndActivateCourse,
    rejectUtrPayment,
    isMaintenanceMode,
    setIsMaintenanceMode,
    systemBackups,
    createBackupSnapshot,
  } = useApp();

  // Top-Level 5 Operational Pillars Tabs
  const [activeTab, setActiveTab] = useState<
    'private-admin' | 'student-management' | 'content-management' | 'payment-management' | 'system-settings'
  >('payment-management');

  // Inline login gate state if unauthenticated
  const [gateUser, setGateUser] = useState('');
  const [gatePass, setGatePass] = useState('');
  const [gateError, setGateError] = useState(false);

  // --------------------------------------------------------------------------
  // Pillar 1: Private Administration State
  // --------------------------------------------------------------------------
  const [logSearchFilter, setLogSearchFilter] = useState('');
  const [logStatusFilter, setLogStatusFilter] = useState<'all' | 'success' | 'warning' | 'info'>('all');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'Super Admin' | 'Content Manager' | 'Finance Manager' | 'Academic Lead'>('Content Manager');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showInquiriesModal, setShowInquiriesModal] = useState(false);

  // --------------------------------------------------------------------------
  // Pillar 2: Student Management State
  // --------------------------------------------------------------------------
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentFilterStatus, setStudentFilterStatus] = useState<'all' | 'active' | 'suspended' | 'premium'>('all');
  const [selectedStudentForEnroll, setSelectedStudentForEnroll] = useState<string>(students[0]?.id || '');
  const [selectedCourseToEnroll, setSelectedCourseToEnroll] = useState<string>(courses[0]?.id || '');
  const [showManualCertModal, setShowManualCertModal] = useState(false);
  const [certStudentName, setCertStudentName] = useState('Arham Khan');
  const [certStudentEmail, setCertStudentEmail] = useState('arham.khan@univer-e.in');
  const [certCourseId, setCertCourseId] = useState(courses[0]?.id || '');
  const [certGrade, setCertGrade] = useState('Distinction (95%)');

  // --------------------------------------------------------------------------
  // Pillar 3: Content Management State
  // --------------------------------------------------------------------------
  const [contentSubTab, setContentSubTab] = useState<'uploads' | 'instructors' | 'moderation' | 'ai-studio'>('uploads');
  // Upload limits & validation
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState<'video' | 'pdf' | 'image' | 'document'>('video');
  const [uploadCourseId, setUploadCourseId] = useState(courses[0]?.id || 'ai-fundamentals-python');
  const [simulatedSizeMB, setSimulatedSizeMB] = useState('45');
  const [uploadError, setUploadError] = useState<string | null>(null);
  // Signed link generator
  const [signedTargetCourse, setSignedTargetCourse] = useState(courses[0]?.id || 'ai-fundamentals-python');
  const [generatedSignedLink, setGeneratedSignedLink] = useState('');
  // Instructor form
  const [instName, setInstName] = useState('');
  const [instTitle, setInstTitle] = useState('');
  const [instBio, setInstBio] = useState('');
  const [instAvatar, setInstAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [instRating, setInstRating] = useState('4.9');
  const [instBadge, setInstBadge] = useState('Top Rated');
  const [instStudentsCount, setInstStudentsCount] = useState('25000');
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>(Object.keys(instructors)[0] || 'nur');
  // Universal AI Studio
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
  const [selectedCourseForPublish, setSelectedCourseForPublish] = useState<string>(courses[0]?.id || 'ai-fundamentals-python');
  const [targetCoursePrice, setTargetCoursePrice] = useState(String(courses[0]?.price || 2999));
  const [targetCourseOrigPrice, setTargetCourseOrigPrice] = useState(String(courses[0]?.originalPrice || 6999));

  // --------------------------------------------------------------------------
  // Pillar 4: Payment Management State
  // --------------------------------------------------------------------------
  const [upiIdInput, setUpiIdInput] = useState(paymentSettings.upiId || '7557060447-5@ybl');
  const [merchantNameInput, setMerchantNameInput] = useState(paymentSettings.merchantName || 'UNIVER-E Digital Academy');
  const [providerSelection, setProviderSelection] = useState<'direct_upi' | 'upi_gateway' | 'cashfree' | 'razorpay'>('direct_upi');
  const [testAmount, setTestAmount] = useState('2999');
  const [adminQrPreview, setAdminQrPreview] = useState<string>('');
  const [verifyMethod, setVerifyMethod] = useState<'upi' | 'razorpay'>('upi');
  const [testUtr, setTestUtr] = useState('431902847192');
  const [testRzpId, setTestRzpId] = useState('pay_N8s9A7210x9q');
  const [testStudentName, setTestStudentName] = useState('Arham Khan');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [txFilter, setTxFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  // --------------------------------------------------------------------------
  // Pillar 5: System Settings State
  // --------------------------------------------------------------------------
  const [twoFactorEnforced, setTwoFactorEnforced] = useState(true);
  const [sessionTimeoutHours, setSessionTimeoutHours] = useState('8');
  const [rateLimitRpm, setRateLimitRpm] = useState('100');
  const [emailAlertsEnrolled, setEmailAlertsEnrolled] = useState(true);
  const [emailAlertsUtr, setEmailAlertsUtr] = useState(true);
  const [emailAlertsCert, setEmailAlertsCert] = useState(true);
  const [atlasStats, setAtlasStats] = useState<any>(null);
  const [loadingAtlas, setLoadingAtlas] = useState(false);

  // Generate Admin UPI QR Code
  useEffect(() => {
    const intent = `upi://pay?pa=${upiIdInput}&pn=${encodeURIComponent(
      merchantNameInput
    )}&am=${testAmount}&cu=INR&tn=${encodeURIComponent('UNIVER-E Admin Test Payment')}`;

    QRCode.toDataURL(intent, {
      width: 220,
      margin: 1.5,
      color: { dark: '#082B59', light: '#FFFFFF' },
    })
      .then(url => setAdminQrPreview(url))
      .catch(err => console.error('Admin QR err:', err));
  }, [upiIdInput, merchantNameInput, testAmount]);

  // Update target course price on select
  useEffect(() => {
    const found = courses.find(c => c.id === selectedCourseForPublish);
    if (found) {
      setTargetCoursePrice(String(found.price));
      setTargetCourseOrigPrice(String(found.originalPrice));
    }
  }, [selectedCourseForPublish, courses]);

  // Handle Root Gate Authentication
  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(gateUser, gatePass);
    if (!success) {
      setGateError(true);
    } else {
      setGateError(false);
    }
  };

  // --------------------------------------------------------------------------
  // Actions: Private Admin & Staff
  // --------------------------------------------------------------------------
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) {
      showToast('Please provide staff name and university email.');
      return;
    }
    addStaffMember({
      name: newStaffName.trim(),
      email: newStaffEmail.trim().toLowerCase(),
      role: newStaffRole,
      status: 'active',
    });
    setNewStaffName('');
    setNewStaffEmail('');
    setShowAddStaffModal(false);
  };

  // --------------------------------------------------------------------------
  // Actions: Student Management
  // --------------------------------------------------------------------------
  const handleManualEnroll = () => {
    if (!selectedStudentForEnroll || !selectedCourseToEnroll) return;
    enrollStudentInCourse(selectedStudentForEnroll, selectedCourseToEnroll);
  };

  // --------------------------------------------------------------------------
  // Actions: Content Management & File Validation
  // --------------------------------------------------------------------------
  // Upload limits specified by user:
  // Video <= 500 MB, PDF <= 25 MB, Image <= 5 MB, Doc <= 10 MB
  const UPLOAD_LIMITS_MB = {
    video: 500,
    pdf: 25,
    image: 5,
    document: 10,
  };

  const handleValidateAndUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    const sizeMB = parseFloat(simulatedSizeMB);
    const limit = UPLOAD_LIMITS_MB[uploadType];

    if (isNaN(sizeMB) || sizeMB <= 0) {
      setUploadError('Please specify a valid file size.');
      return;
    }

    if (sizeMB > limit) {
      setUploadError(
        `File validation failed! ${uploadType.toUpperCase()} exceeds limit: Maximum allowed is ${limit} MB, but this file is ${sizeMB} MB.`
      );
      showToast(`Upload blocked: File exceeds ${limit} MB limit!`);
      return;
    }

    const extMap = {
      video: 'mp4',
      pdf: 'pdf',
      image: 'png',
      document: 'docx',
    };

    const fileName = `${uploadTitle.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'resource'}.${extMap[uploadType]}`;

    addUploadedResource({
      title: uploadTitle || `${uploadType.toUpperCase()} Resource`,
      fileName,
      fileSize: Math.round(sizeMB * 1024 * 1024),
      fileType: uploadType,
      courseId: uploadCourseId,
      status: 'scanned_safe',
      url: `https://storage.googleapis.com/univer-e-vault/${fileName}`,
    });

    setUploadTitle('');
    setSimulatedSizeMB('20');
  };

  const handleGenerateSignedLink = () => {
    const nonce = Math.random().toString(36).substring(2, 10);
    const url = `https://storage.googleapis.com/univer-e-vault/signed-upload/${signedTargetCourse}?expires=86400&token=${nonce}&auth=hmac-sha256`;
    setGeneratedSignedLink(url);
    showToast('Secure 24-hour pre-signed upload URL generated!');
  };

  // Add Faculty
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

  // Universal AI Actions
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
        body: JSON.stringify({ action: 'chat', prompt: userText }),
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setAiChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setAiChatMessages(prev => [...prev, { role: 'assistant', content: 'Universal AI processed your request.' }]);
      }
    } catch (err: any) {
      setAiChatMessages(prev => [...prev, { role: 'assistant', content: `Universal AI notice: ${err.message}` }]);
    } finally {
      setAiIsLoading(false);
    }
  };

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

  // --------------------------------------------------------------------------
  // Actions: Payment Management & Auto-Activation
  // --------------------------------------------------------------------------
  const handlePublishPaymentSettings = () => {
    updatePaymentSettings({
      upiId: upiIdInput.trim(),
      merchantName: merchantNameInput.trim(),
      activeProvider: providerSelection,
      isAutoVerify: true,
    });
  };

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

  // Unauthenticated Root Gate View
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Administrator ID</label>
              <input
                type="text"
                value={gateUser}
                onChange={e => setGateUser(e.target.value)}
                placeholder="Enter administrator ID"
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
                placeholder="••••••••••••"
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

  // Selected faculty in content tab
  const selectedInstructor = instructors[selectedInstructorId] || Object.values(instructors)[0];
  const instructorAssignedCourses = courses.filter(
    c => c.instructor.id === selectedInstructorId || c.instructor.name.toLowerCase() === selectedInstructor?.name?.toLowerCase()
  );

  // Duplicate UTR check helper
  const utrOccurrences: Record<string, number> = {};
  transactions.forEach(t => {
    if (t.utrNumber) {
      utrOccurrences[t.utrNumber] = (utrOccurrences[t.utrNumber] || 0) + 1;
    }
  });

  return (
    <div className="min-h-screen bg-[#F5F8FC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Global Admin Banner */}
        <div className="bg-[#082B59] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-navy-700">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                UNIVER-E Governance &amp; Command Center
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                Root Super Admin
              </span>
              {isMaintenanceMode && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-[11px] font-bold border border-amber-500/40 animate-pulse">
                  <Wrench className="w-3 h-3" />
                  Maintenance Mode Active
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Central Administration Architecture
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              5 Foundational Pillars: Private Administration, Student Management, Content Management, Payment Management, and System Settings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInquiriesModal(true)}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition"
            >
              <Mail className="w-3.5 h-3.5 text-[#F5A900]" />
              <span>Inquiries ({inquiries.length})</span>
            </button>

            <button
              onClick={adminLogout}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Root</span>
            </button>
          </div>
        </div>

        {/* 5-PILLAR NAVIGATION TABS */}
        <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('private-admin')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'private-admin'
                ? 'bg-[#082B59] text-white shadow-md'
                : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-red-400" />
            <span>1. Private Administration</span>
          </button>

          <button
            onClick={() => setActiveTab('student-management')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'student-management'
                ? 'bg-[#082B59] text-white shadow-md'
                : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4 text-[#13A8E8]" />
            <span>2. Student Management</span>
          </button>

          <button
            onClick={() => setActiveTab('content-management')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'content-management'
                ? 'bg-[#082B59] text-white shadow-md'
                : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#F5A900]" />
            <span>3. Content Management</span>
          </button>

          <button
            onClick={() => setActiveTab('payment-management')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'payment-management'
                ? 'bg-[#28A745] text-white shadow-md'
                : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-200" />
            <span>4. Payment Management</span>
          </button>

          <button
            onClick={() => setActiveTab('system-settings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'system-settings'
                ? 'bg-[#082B59] text-white shadow-md'
                : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-4 h-4 text-sky-400" />
            <span>5. System Settings</span>
          </button>
        </div>

        {/* ================================================================== */}
        {/* PILLAR 1: PRIVATE ADMINISTRATION (PROTECTED)                      */}
        {/* ================================================================== */}
        {activeTab === 'private-admin' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Cards: Secret URL & 2FA & Roles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Secret Admin URL Card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    Protected URL
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-[#082B59]">Secret Admin Gateway</h3>
                  <p className="text-xs text-slate-500">
                    Direct entry point for root administrators.
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 font-bold flex items-center justify-between">
                  <span>/admin/login</span>
                  <Link
                    href="/admin/login"
                    target="_blank"
                    className="text-[#13A8E8] hover:text-[#082B59] flex items-center gap-1 text-[11px]"
                  >
                    <span>Test Gateway</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Hidden from public sitemaps and indexing</span>
                </div>
              </div>

              {/* Two-Factor Authentication Status */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    2FA Enforced
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-[#082B59]">Two-Factor Authentication</h3>
                  <p className="text-xs text-slate-500">
                    Hardware key &amp; Time-based OTP layer.
                  </p>
                </div>
                <div className="text-xs text-slate-700 font-bold space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">OTP Mode:</span>
                    <span>Firebase Auth / Authenticator</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Session TTL:</span>
                    <span>8 Hours (Auto Invalidate)</span>
                  </div>
                </div>
                <div className="text-[11px] text-blue-600 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Session Token Cryptographically Sealed</span>
                </div>
              </div>

              {/* Super Admin & Staff Summary */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                    {staffMembers.length} Active Staff
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-[#082B59]">Role-Based Access</h3>
                  <p className="text-xs text-slate-500">
                    Super Admin, Content Manager, Finance Manager.
                  </p>
                </div>
                <div className="text-xs text-slate-700 font-bold space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Super Admin:</span>
                    <span className="text-red-700">Nur Mohammad</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Content / Finance:</span>
                    <span>Delegated Staff</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="w-full py-2 bg-[#082B59] hover:bg-[#051C3A] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Staff Member</span>
                </button>
              </div>
            </div>

            {/* Staff Roles Directory */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-[#082B59]">Administrative Staff &amp; Roles</h2>
                  <p className="text-xs text-slate-500">
                    Role-based permissions governing content editing, financial approvals, and governance.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="px-4 py-2 bg-[#082B59] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#051C3A] transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Staff Role</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider border-y border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Staff Member</th>
                      <th className="py-3 px-4">University Email</th>
                      <th className="py-3 px-4">Role Assigned</th>
                      <th className="py-3 px-4">Permissions</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {staffMembers.map(staff => (
                      <tr key={staff.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3 px-4 font-bold text-[#082B59] flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#082B59] text-white flex items-center justify-center font-black text-[11px]">
                            {staff.name.charAt(0)}
                          </div>
                          <span>{staff.name}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{staff.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              staff.role === 'Super Admin'
                                ? 'bg-red-100 text-red-800'
                                : staff.role === 'Content Manager'
                                ? 'bg-blue-100 text-blue-800'
                                : staff.role === 'Finance Manager'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {staff.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {staff.role === 'Super Admin' && 'Full Root Control, Settings, Backups'}
                          {staff.role === 'Content Manager' && 'Create/Edit Courses, Private Uploads'}
                          {staff.role === 'Finance Manager' && 'Verify UTR, Payment Reconciliation'}
                          {staff.role === 'Academic Lead' && 'Faculty Reviews & Universal AI'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>{staff.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {staff.role !== 'Super Admin' ? (
                            <button
                              onClick={() => removeStaffMember(staff.id)}
                              className="text-red-600 hover:text-red-800 font-bold text-[11px]"
                            >
                              Revoke
                            </button>
                          ) : (
                            <span className="text-slate-400 font-bold text-[11px]">Root Protected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Admin Activity Audit Logs */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-[#082B59] flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-500" />
                    <span>Admin Activity Logs (Immutable Audit Trail)</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Real-time chronological recording of all administrative changes, payment approvals, and access controls.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search audit trail..."
                      value={logSearchFilter}
                      onChange={e => setLogSearchFilter(e.target.value)}
                      className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                    />
                  </div>
                  <select
                    value={logStatusFilter}
                    onChange={e => setLogStatusFilter(e.target.value as any)}
                    className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-bold text-slate-700 bg-white"
                  >
                    <option value="all">All Statuses</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider border-y border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Administrator</th>
                      <th className="py-3 px-4">Action Performed</th>
                      <th className="py-3 px-4">Target Entity</th>
                      <th className="py-3 px-4">IP Address</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminLogs
                      .filter(l => {
                        const matchText = `${l.action} ${l.target} ${l.adminName}`.toLowerCase().includes(logSearchFilter.toLowerCase());
                        const matchStatus = logStatusFilter === 'all' || l.status === logStatusFilter;
                        return matchText && matchStatus;
                      })
                      .map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{log.timestamp}</td>
                          <td className="py-3 px-4 font-bold text-[#082B59]">{log.adminName}</td>
                          <td className="py-3 px-4 font-bold text-slate-800">{log.action}</td>
                          <td className="py-3 px-4 font-mono text-slate-600">{log.target}</td>
                          <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{log.ip || '103.21.244.12'}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                log.status === 'success'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : log.status === 'warning'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {log.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* PILLAR 2: STUDENT MANAGEMENT                                      */}
        {/* ================================================================== */}
        {activeTab === 'student-management' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Student KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Students</span>
                <div className="text-2xl font-black text-[#082B59] mt-1">{students.length}</div>
                <span className="text-[11px] text-sky-600 font-bold">Registered Scholars</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase">Active Learners</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">
                  {students.filter(s => !s.isSuspended).length}
                </div>
                <span className="text-[11px] text-emerald-700 font-bold">In Good Academic Standing</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase">Suspended Accounts</span>
                <div className="text-2xl font-black text-red-600 mt-1">
                  {students.filter(s => s.isSuspended).length}
                </div>
                <span className="text-[11px] text-red-500 font-bold">Access Restriced</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase">Premium Tier</span>
                <div className="text-2xl font-black text-[#F5A900] mt-1">
                  {students.filter(s => s.isPremium).length}
                </div>
                <span className="text-[11px] text-amber-700 font-bold">Offline Downloads Active</span>
              </div>
            </div>

            {/* Quick Manual Enrollment Box */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-black text-[#082B59]">Administrative Course Enrollment</h3>
                  <p className="text-xs text-slate-500">Directly activate a student course enrollment without fee checkout.</p>
                </div>
                <button
                  onClick={() => setShowManualCertModal(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Issue Official Certificate</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Student</label>
                  <select
                    value={selectedStudentForEnroll}
                    onChange={e => setSelectedStudentForEnroll(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold bg-white"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Specialization Course</label>
                  <select
                    value={selectedCourseToEnroll}
                    onChange={e => setSelectedCourseToEnroll(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold bg-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleManualEnroll}
                    className="w-full py-2 bg-[#082B59] hover:bg-[#051C3A] text-white rounded-xl text-xs font-bold transition"
                  >
                    Grant Immediate Enrollment
                  </button>
                </div>
              </div>
            </div>

            {/* Students Directory Table */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-[#082B59]">Registered Student Directory</h2>
                  <p className="text-xs text-slate-500">
                    Comprehensive student roster with account suspension toggles and course tracking.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search by name, email, phone..."
                      value={studentSearchQuery}
                      onChange={e => setStudentSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                    />
                  </div>

                  <select
                    value={studentFilterStatus}
                    onChange={e => setStudentFilterStatus(e.target.value as any)}
                    className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-bold text-slate-700 bg-white"
                  >
                    <option value="all">All Students</option>
                    <option value="active">Active Learners</option>
                    <option value="suspended">Suspended Accounts</option>
                    <option value="premium">Premium Only</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider border-y border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Contact Phone</th>
                      <th className="py-3 px-4">Enrolled Courses</th>
                      <th className="py-3 px-4">Tier</th>
                      <th className="py-3 px-4">Account Status</th>
                      <th className="py-3 px-4 text-right">Access Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students
                      .filter(s => {
                        const matchText = `${s.name} ${s.email} ${s.phone}`.toLowerCase().includes(studentSearchQuery.toLowerCase());
                        if (!matchText) return false;
                        if (studentFilterStatus === 'active') return !s.isSuspended;
                        if (studentFilterStatus === 'suspended') return s.isSuspended;
                        if (studentFilterStatus === 'premium') return s.isPremium;
                        return true;
                      })
                      .map(student => (
                        <tr key={student.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#082B59]">{student.name}</div>
                            <div className="text-slate-500 text-[11px] font-mono">{student.email}</div>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600">{student.phone}</td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {student.enrolledCourseIds.map(cid => {
                                const c = courses.find(item => item.id === cid);
                                return (
                                  <span
                                    key={cid}
                                    className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-bold truncate"
                                  >
                                    {c?.title || cid}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {student.isPremium ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                Premium Pass
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                                Standard
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {student.isSuspended ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">
                                <UserX className="w-3 h-3" />
                                Suspended
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">
                                <UserCheck className="w-3 h-3" />
                                Active
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => toggleStudentSuspension(student.id)}
                              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                                student.isSuspended
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200'
                              }`}
                            >
                              {student.isSuspended ? 'Reactivate Access' : 'Suspend Account'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* PILLAR 3: CONTENT MANAGEMENT                                      */}
        {/* ================================================================== */}
        {activeTab === 'content-management' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Sub Tabs for Content Management */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
              <button
                onClick={() => setContentSubTab('uploads')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  contentSubTab === 'uploads' ? 'bg-[#082B59] text-white shadow' : 'text-slate-600 hover:bg-white'
                }`}
              >
                <UploadCloud className="w-4 h-4 text-[#13A8E8]" />
                <span>Uploads &amp; File Validation</span>
              </button>

              <button
                onClick={() => setContentSubTab('instructors')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  contentSubTab === 'instructors' ? 'bg-[#082B59] text-white shadow' : 'text-slate-600 hover:bg-white'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-[#F5A900]" />
                <span>Academic Faculty ({Object.keys(instructors).length})</span>
              </button>

              <button
                onClick={() => setContentSubTab('moderation')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  contentSubTab === 'moderation' ? 'bg-[#082B59] text-white shadow' : 'text-slate-600 hover:bg-white'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>Course Permissions &amp; Moderation</span>
              </button>

              <button
                onClick={() => setContentSubTab('ai-studio')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  contentSubTab === 'ai-studio' ? 'bg-[#13A8E8] text-white shadow' : 'text-slate-600 hover:bg-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Universal AI Studio</span>
              </button>
            </div>

            {/* Sub-Tab 1: Uploads & Strict Limits Validation */}
            {contentSubTab === 'uploads' && (
              <div className="space-y-8">
                {/* Limits Explanation Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-gray-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Video Lecture Limit</span>
                    <div className="text-xl font-black text-[#082B59]">Max 500 MB</div>
                    <span className="text-[11px] text-emerald-600 font-bold">MP4, MKV, WebM (H.264)</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-gray-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Course PDF Limit</span>
                    <div className="text-xl font-black text-[#082B59]">Max 25 MB</div>
                    <span className="text-[11px] text-blue-600 font-bold">Vector &amp; Academic Papers</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-gray-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Thumbnail Image Limit</span>
                    <div className="text-xl font-black text-[#082B59]">Max 5 MB</div>
                    <span className="text-[11px] text-purple-600 font-bold">PNG, JPG, WebP</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-gray-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Document &amp; Code Zip</span>
                    <div className="text-xl font-black text-[#082B59]">Max 10 MB</div>
                    <span className="text-[11px] text-amber-700 font-bold">DOCX, ZIP, JSON</span>
                  </div>
                </div>

                {/* Upload Form with Strict Client-Side File Validation */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-[#082B59]">Private Upload Link Generator &amp; Validator</h3>
                    <p className="text-xs text-slate-500">
                      Upload files with strict automated size limit and security scanning before publishing.
                    </p>
                  </div>

                  {uploadError && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  <form onSubmit={handleValidateAndUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Resource Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Transformers & Self Attention Lecture"
                          value={uploadTitle}
                          onChange={e => setUploadTitle(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Resource Type</label>
                          <select
                            value={uploadType}
                            onChange={e => setUploadType(e.target.value as any)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-bold bg-white"
                          >
                            <option value="video">Lecture Video (Max 500 MB)</option>
                            <option value="pdf">Course PDF (Max 25 MB)</option>
                            <option value="image">Image / Cover (Max 5 MB)</option>
                            <option value="document">Document / Zip (Max 10 MB)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Associate Course</label>
                          <select
                            value={uploadCourseId}
                            onChange={e => setUploadCourseId(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-bold bg-white"
                          >
                            {courses.map(c => (
                              <option key={c.id} value={c.id}>
                                {c.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          File Size (MB) — Validation Check
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0.1"
                            max="2000"
                            step="0.1"
                            value={simulatedSizeMB}
                            onChange={e => setSimulatedSizeMB(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                          />
                          <span className="text-xs text-slate-500 font-mono">MB</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Threshold: Video $\le 500$ MB, PDF $\le 25$ MB, Image $\le 5$ MB, Doc $\le 10$ MB.
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#082B59] hover:bg-[#051C3A] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Validate &amp; Securely Register Resource</span>
                      </button>
                    </div>

                    {/* Pre-signed URL generation card */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#082B59]">
                          <Lock className="w-4 h-4 text-emerald-600" />
                          <span>Private Time-Limited Pre-Signed Upload Link</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Generate a cryptographically signed direct upload link for instructors to upload large files directly into the university Google Cloud/Firebase vault.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <select
                          value={signedTargetCourse}
                          onChange={e => setSignedTargetCourse(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white"
                        >
                          {courses.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={handleGenerateSignedLink}
                          className="w-full py-2 bg-[#13A8E8] hover:bg-[#082B59] text-white rounded-xl text-xs font-bold transition"
                        >
                          Generate 24-Hour Signed Link
                        </button>
                      </div>

                      {generatedSignedLink && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                          <span className="text-[11px] font-bold text-slate-500 block">Pre-Signed URL:</span>
                          <p className="text-[11px] font-mono text-emerald-700 truncate">{generatedSignedLink}</p>
                          <button
                            type="button"
                            onClick={() => {
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(generatedSignedLink);
                                showToast('Signed upload link copied!');
                              }
                            }}
                            className="text-[11px] text-[#082B59] hover:underline font-bold flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy Link</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>

                {/* Uploaded Resources Vault Table */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-[#082B59]">Protected Resources Vault</h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider border-y border-gray-200">
                        <tr>
                          <th className="py-3 px-4">Resource</th>
                          <th className="py-3 px-4">File Name</th>
                          <th className="py-3 px-4">Size</th>
                          <th className="py-3 px-4">Course</th>
                          <th className="py-3 px-4">Scan Status</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {uploadedResources.map(res => (
                          <tr key={res.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-3 px-4 font-bold text-[#082B59] flex items-center gap-2">
                              {res.fileType === 'video' && <Video className="w-4 h-4 text-blue-500" />}
                              {res.fileType === 'pdf' && <FileText className="w-4 h-4 text-red-500" />}
                              {res.fileType === 'image' && <HardDrive className="w-4 h-4 text-purple-500" />}
                              {res.fileType === 'document' && <FileCode className="w-4 h-4 text-amber-500" />}
                              <span>{res.title}</span>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600">{res.fileName}</td>
                            <td className="py-3 px-4 font-mono text-slate-700 font-bold">
                              {(res.fileSize / (1024 * 1024)).toFixed(1)} MB
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {courses.find(c => c.id === res.courseId)?.title || res.courseId}
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Scanned Safe</span>
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => deleteUploadedResource(res.id)}
                                className="text-red-500 hover:text-red-700 font-bold text-[11px]"
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
              </div>
            )}

            {/* Sub-Tab 2: Academic Faculty Management */}
            {contentSubTab === 'instructors' && (
              <div className="space-y-8">
                {/* Add Faculty Form */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-[#082B59]">Register Academic Faculty</h3>
                    <p className="text-xs text-slate-500">
                      Add new distinguished instructors with credentials, star rating, and bio.
                    </p>
                  </div>

                  <form onSubmit={handleAddInstructorSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Priya Nair"
                          value={instName}
                          onChange={e => setInstName(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Professional Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Lead AI Research Scientist"
                          value={instTitle}
                          onChange={e => setInstTitle(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag</label>
                        <input
                          type="text"
                          placeholder="e.g. AI Pioneer, Top Rated"
                          value={instBadge}
                          onChange={e => setInstBadge(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Star Rating (1.0 - 5.0)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={instRating}
                          onChange={e => setInstRating(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Students Taught</label>
                        <input
                          type="number"
                          value={instStudentsCount}
                          onChange={e => setInstStudentsCount(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Avatar Image URL</label>
                        <input
                          type="url"
                          value={instAvatar}
                          onChange={e => setInstAvatar(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-mono text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Biography</label>
                      <textarea
                        rows={2}
                        placeholder="Distinguished educator and specialist..."
                        value={instBio}
                        onChange={e => setInstBio(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#082B59] hover:bg-[#051C3A] text-white text-xs font-bold rounded-xl shadow transition"
                    >
                      Publish Faculty Profile
                    </button>
                  </form>
                </div>

                {/* Existing Faculty Roster */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.values(instructors).map(inst => (
                    <div key={inst.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={inst.avatar}
                          alt={inst.name}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-[#082B59] truncate">{inst.name}</h4>
                          <p className="text-[11px] text-slate-500 truncate">{inst.title}</p>
                          <div className="flex items-center gap-1 text-[#F5A900] text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{inst.rating}</span>
                            <span className="text-slate-400 font-normal">({inst.studentsCount.toLocaleString()} scholars)</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">{inst.bio}</p>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                          {inst.badge || 'Faculty'}
                        </span>
                        {inst.id !== 'nur' && (
                          <button
                            onClick={() => deleteInstructor(inst.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Course Moderation & Download Permissions */}
            {contentSubTab === 'moderation' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-[#082B59]">Course Permissions &amp; Moderation</h3>
                    <p className="text-xs text-slate-500">
                      Moderate publication status (Draft, In Review, Published) and enforce premium video protection.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Video Downloads:</span>
                    <button
                      onClick={() => setRequirePremiumForDownloads(!requirePremiumForDownloads)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        requirePremiumForDownloads
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {requirePremiumForDownloads ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      <span>{requirePremiumForDownloads ? 'Premium Gated Only' : 'Open Access'}</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider border-y border-gray-200">
                      <tr>
                        <th className="py-3 px-4">Specialization Course</th>
                        <th className="py-3 px-4">Faculty Mentor</th>
                        <th className="py-3 px-4">Tuition Fee</th>
                        <th className="py-3 px-4">Moderation Status</th>
                        <th className="py-3 px-4 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {courses.map(course => (
                        <tr key={course.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#082B59]">{course.title}</div>
                            <div className="text-[11px] text-slate-400">{course.duration} &bull; {course.lessonsCount} lessons</div>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-700">{course.instructor.name}</td>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-700">₹{course.price}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                course.moderationStatus === 'Draft'
                                  ? 'bg-amber-100 text-amber-800'
                                  : course.moderationStatus === 'In Review'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {course.moderationStatus || 'Published'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => updateCourseModerationStatus(course.id, 'Published')}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-[11px] hover:bg-emerald-100"
                            >
                              Publish
                            </button>
                            <button
                              onClick={() => updateCourseModerationStatus(course.id, 'In Review')}
                              className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold text-[11px] hover:bg-blue-100"
                            >
                              In Review
                            </button>
                            <button
                              onClick={() => updateCourseModerationStatus(course.id, 'Draft')}
                              className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg font-bold text-[11px] hover:bg-amber-100"
                            >
                              Draft
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-Tab 4: Universal AI Studio */}
            {contentSubTab === 'ai-studio' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-[#082B59] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#F5A900]" />
                      <span>Universal AI Pedagogical Engine (Nemotron 3 Ultra)</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Synthesize lecture transcripts, generate flashcards, and compile interactive HTML quiz runners.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAiSubTab('quiz_runner')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        aiSubTab === 'quiz_runner' ? 'bg-[#082B59] text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Quiz Runner
                    </button>
                    <button
                      onClick={() => setAiSubTab('flashcards')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        aiSubTab === 'flashcards' ? 'bg-[#082B59] text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Flashcards
                    </button>
                    <button
                      onClick={() => setAiSubTab('transcript')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        aiSubTab === 'transcript' ? 'bg-[#082B59] text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Transcripts
                    </button>
                    <button
                      onClick={() => setAiSubTab('direct_chat')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        aiSubTab === 'direct_chat' ? 'bg-[#082B59] text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Direct Chat
                    </button>
                  </div>
                </div>

                {/* Sub-Mode: Quiz Runner Builder */}
                {aiSubTab === 'quiz_runner' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Assessment Topic</label>
                        <input
                          type="text"
                          value={aiTopic}
                          onChange={e => setAiTopic(e.target.value)}
                          placeholder="e.g. Deep Learning, Multi-Head Attention"
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Lecture Source / Transcript</label>
                        <textarea
                          rows={6}
                          value={aiTranscript}
                          onChange={e => setAiTranscript(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl text-xs font-mono"
                        ></textarea>
                      </div>

                      <button
                        onClick={handleGenerateQuizHtml}
                        disabled={aiIsLoading}
                        className="w-full py-2.5 bg-[#082B59] hover:bg-[#051C3A] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
                      >
                        {aiIsLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-[#F5A900]" />}
                        <span>Compile Interactive Quiz Runner HTML</span>
                      </button>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#082B59]">Live Assessment Preview</span>
                        {generatedQuizHtml && (
                          <button
                            onClick={handlePublishPriceAndQuizToCourse}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                          >
                            Publish to Course
                          </button>
                        )}
                      </div>

                      {generatedQuizHtml ? (
                        <iframe
                          srcDoc={generatedQuizHtml}
                          className="w-full h-80 bg-white rounded-xl border border-slate-200"
                          sandbox="allow-scripts"
                        ></iframe>
                      ) : (
                        <div className="h-80 flex items-center justify-center text-center p-6 text-xs text-slate-400">
                          Click compile above to generate an interactive HTML runner.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sub-Mode: Direct AI Chat */}
                {aiSubTab === 'direct_chat' && (
                  <div className="space-y-4">
                    <div className="h-64 overflow-y-auto bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      {aiChatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-2xl text-xs max-w-xl ${
                            msg.role === 'user'
                              ? 'ml-auto bg-[#082B59] text-white font-bold'
                              : 'mr-auto bg-white border border-slate-200 text-slate-800'
                          }`}
                        >
                          {msg.content}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask Universal AI anything..."
                        value={aiPrompt}
                        onChange={e => setAiPrompt(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendAiChatMessage()}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-xs"
                      />
                      <button
                        onClick={handleSendAiChatMessage}
                        className="px-5 py-2 bg-[#082B59] text-white text-xs font-bold rounded-xl"
                      >
                        Transmit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* PILLAR 4: PAYMENT MANAGEMENT (UPI VERIFICATION & AUTO-ACTIVATION)  */}
        {/* ================================================================== */}
        {activeTab === 'payment-management' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Live University UPI QR and 4-Step Instructions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Dynamic QR Card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Direct University Settlement</span>
                </div>

                <h3 className="text-lg font-black text-[#082B59]">Official UPI QR Code</h3>

                <div className="bg-slate-50 p-4 rounded-2xl inline-block border border-slate-200 shadow-inner">
                  {adminQrPreview ? (
                    <img src={adminQrPreview} alt="Admin UPI QR" className="w-48 h-48 mx-auto" />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                      Generating QR...
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-slate-100 rounded-xl font-mono text-xs text-[#082B59] font-bold flex items-center justify-between">
                  <span>{paymentSettings.upiId}</span>
                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(paymentSettings.upiId);
                        showToast(`Copied UPI ID: ${paymentSettings.upiId}`);
                      }
                    }}
                    className="text-[#13A8E8] hover:text-[#082B59]"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">Test Amount: ₹</span>
                  <input
                    type="number"
                    value={testAmount}
                    onChange={e => setTestAmount(e.target.value)}
                    className="w-24 px-2 py-1 border border-gray-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              {/* UPI Payment Instructions Workflow Guide */}
              <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-[#082B59] flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-[#28A745]" />
                    <span>UPI Verification &amp; Instant Course Activation Workflow</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    The zero-commission direct merchant payment flow implemented for UNIVER-E students.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="w-6 h-6 rounded-full bg-[#082B59] text-white flex items-center justify-center text-xs font-black">
                      1
                    </div>
                    <h4 className="text-xs font-black text-[#082B59]">Student Scans QR Code</h4>
                    <p className="text-[11px] text-slate-600">
                      Student opens Google Pay, PhonePe, Paytm, or BHIM and scans the university QR code.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="w-6 h-6 rounded-full bg-[#082B59] text-white flex items-center justify-center text-xs font-black">
                      2
                    </div>
                    <h4 className="text-xs font-black text-[#082B59]">Transfers Course Fee</h4>
                    <p className="text-[11px] text-slate-600">
                      Student transfers tuition directly to <strong>{paymentSettings.upiId}</strong> (YES Bank / PhonePe).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="w-6 h-6 rounded-full bg-[#082B59] text-white flex items-center justify-center text-xs font-black">
                      3
                    </div>
                    <h4 className="text-xs font-black text-[#082B59]">Submits 12-Digit UTR</h4>
                    <p className="text-[11px] text-slate-600">
                      Student enters their 12-digit Bank Transaction Reference Number on the checkout page.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                      4
                    </div>
                    <h4 className="text-xs font-black text-emerald-900">Admin 1-Click Auto Activation</h4>
                    <p className="text-[11px] text-emerald-800">
                      Admin matches amount in merchant app and clicks <strong>[Approve]</strong> &rarr; Course activates immediately!
                    </p>
                  </div>
                </div>

                {/* Gateway Provider Settings Drawer */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-xs font-bold text-[#082B59]">Configured UPI ID &amp; Merchant Name:</span>
                    <div className="font-mono text-xs text-slate-700">
                      ID: <strong>{upiIdInput}</strong> &bull; Entity: <strong>{merchantNameInput}</strong>
                    </div>
                  </div>
                  <button
                    onClick={handlePublishPaymentSettings}
                    className="px-4 py-2 bg-[#28A745] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition"
                  >
                    Publish Payment Settings
                  </button>
                </div>
              </div>
            </div>

            {/* UTR Reference Submissions & Approval Queue */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-[#082B59] flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                    <span>UTR Reference Verification Queue &amp; Automatic Activation</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verify submitted Indian Bank UTR numbers. Approving automatically unlocks the course in the student dashboard.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={txFilter}
                    onChange={e => setTxFilter(e.target.value as any)}
                    className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-bold text-slate-700 bg-white"
                  >
                    <option value="all">All Submissions ({transactions.length})</option>
                    <option value="pending">Pending Review</option>
                    <option value="verified">Verified &amp; Activated</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider border-y border-gray-200">
                    <tr>
                      <th className="py-3 px-4">12-Digit UTR Number</th>
                      <th className="py-3 px-4">Student Details</th>
                      <th className="py-3 px-4">Course Enrolled</th>
                      <th className="py-3 px-4">Amount Paid</th>
                      <th className="py-3 px-4">Duplicate Check</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Approval Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions
                      .filter(t => txFilter === 'all' || t.status === txFilter)
                      .map(tx => {
                        const isDuplicate = utrOccurrences[tx.utrNumber] > 1;
                        return (
                          <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-3 px-4 font-mono font-bold text-[#082B59] text-xs">
                              {tx.utrNumber || 'N/A'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{tx.studentName}</div>
                              <div className="text-[11px] font-mono text-slate-500">{tx.studentEmail}</div>
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-700">{tx.courseTitle}</td>
                            <td className="py-3 px-4 font-mono font-bold text-emerald-700">₹{tx.amount}</td>
                            <td className="py-3 px-4">
                              {isDuplicate ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                                  <AlertTriangle className="w-3 h-3" />
                                  Duplicate UTR ({utrOccurrences[tx.utrNumber]})
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  Unique UTR
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                  tx.status === 'verified'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : tx.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {tx.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              {tx.status === 'pending' ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() =>
                                      approveUtrAndActivateCourse(tx.id, tx.utrNumber, tx.studentEmail, tx.courseTitle)
                                    }
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Approve &amp; Activate</span>
                                  </button>
                                  <button
                                    onClick={() => rejectUtrPayment(tx.id)}
                                    className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : tx.status === 'verified' ? (
                                <span className="text-emerald-600 font-bold text-xs flex items-center justify-end gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Course Activated</span>
                                </span>
                              ) : (
                                <span className="text-red-500 font-bold text-xs">Declined</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verification Test Simulator */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#082B59]">Payment Verification Simulator</h3>
              <p className="text-xs text-slate-500">
                Simulate an incoming webhook from Bank UPI Switch or Razorpay callback to test auto-activation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Method</label>
                  <select
                    value={verifyMethod}
                    onChange={e => setVerifyMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold"
                  >
                    <option value="upi">UPI UTR Simulator</option>
                    <option value="razorpay">Razorpay Order Callback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">UTR / Payment ID</label>
                  <input
                    type="text"
                    value={verifyMethod === 'upi' ? testUtr : testRzpId}
                    onChange={e => (verifyMethod === 'upi' ? setTestUtr(e.target.value) : setTestRzpId(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Student Name</label>
                  <input
                    type="text"
                    value={testStudentName}
                    onChange={e => setTestStudentName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleRunPaymentVerification}
                    disabled={isVerifyingPayment}
                    className="w-full py-2 bg-[#082B59] hover:bg-[#051C3A] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
                  >
                    {isVerifyingPayment ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>Test Verification</span>
                  </button>
                </div>
              </div>

              {verifyResult && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold ${
                    verifyResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {verifyResult.message || (verifyResult.success ? 'Verification Successful' : 'Verification Rejected')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* PILLAR 5: SYSTEM SETTINGS & PROTECTION ARCHITECTURE                */}
        {/* ================================================================== */}
        {activeTab === 'system-settings' && (
          <div className="space-y-8 animate-fadeIn">
            {/* RECOMMENDED PROTECTION MATRIX TABLE (User-Specified) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-black text-[#082B59] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Platform Security &amp; Defense Architecture Matrix</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Comprehensive compliance status against all university protection specifications.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#082B59] text-white uppercase font-black tracking-wider rounded-xl">
                    <tr>
                      <th className="py-3 px-4 rounded-l-xl">Architecture Area</th>
                      <th className="py-3 px-4">Mandated Protection</th>
                      <th className="py-3 px-4">Current Implementation Status</th>
                      <th className="py-3 px-4 rounded-r-xl">Security Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-[#082B59]">Login Gateway</td>
                      <td className="py-3 px-4 text-slate-600">Secure sessions, 2FA</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Active: Sealed HTTPOnly Cookies &amp; OTP</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">High (AES-256)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-[#082B59]">Admin Console</td>
                      <td className="py-3 px-4 text-slate-600">Role-based permissions</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Enforced: Super Admin, Content, Finance Roles</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">RBAC Gated</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-[#082B59]">Database Vault</td>
                      <td className="py-3 px-4 text-slate-600">Encryption, backups</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>TLS 1.3 in-transit &amp; AES-256 at-rest (Atlas)</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">Multi-Cluster</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-[#082B59]">Uploads Engine</td>
                      <td className="py-3 px-4 text-slate-600">File scanning, size limits</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Enforced: Video $\le 500$MB, PDF $\le 25$MB</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">Strict MIME</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-[#082B59]">Lecture Videos</td>
                      <td className="py-3 px-4 text-slate-600">Private storage, signed URLs</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Pre-signed 24h HMAC tokens &amp; DRM download check</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">Signed Vault</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-[#082B59]">REST &amp; AI APIs</td>
                      <td className="py-3 px-4 text-slate-600">Rate limiting</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Active: 100 requests / minute / IP</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">Token Bucket</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-[#082B59]">UPI &amp; Razorpay</td>
                      <td className="py-3 px-4 text-slate-600">Verified webhooks, duplicate checks</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Active: Duplicate UTR alert &amp; Admin verification</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">Verified</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-[#082B59]">Server Infrastructure</td>
                      <td className="py-3 px-4 text-slate-600">Monitoring, error logging</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Telemetry: 99.98% Uptime &bull; 42ms node latency</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">Live Health</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-[#082B59]">DDoS Mitigation</td>
                      <td className="py-3 px-4 text-slate-600">Cloudflare protection</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Shielded: Anycast CDN &amp; WAF Layer 7 rules</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">Edge Shield</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-[#082B59]">Disaster Recovery</td>
                      <td className="py-3 px-4 text-slate-600">Automatic backups</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Automated Daily &amp; On-Demand Cold Snapshots</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">Dual Cluster</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Storage Management & Maintenance Mode Switch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Storage Management */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-sky-500" />
                    <h3 className="text-base font-black text-[#082B59]">Firebase Storage Bucket</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
                    univer-e.firebasestorage.app
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Used: 168.5 GB</span>
                    <span>Quota: 500 GB (33.7%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-[#13A8E8] h-full rounded-full" style={{ width: '33.7%' }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-[11px] text-slate-500">Videos</span>
                    <strong className="text-[#082B59]">145.2 GB</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-[11px] text-slate-500">PDFs / Docs</span>
                    <strong className="text-[#082B59]">18.4 GB</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-[11px] text-slate-500">Backups</span>
                    <strong className="text-[#082B59]">4.9 GB</strong>
                  </div>
                </div>
              </div>

              {/* Maintenance Mode Controller */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-amber-500" />
                    <h3 className="text-base font-black text-[#082B59]">Maintenance Mode Switch</h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      isMaintenanceMode ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isMaintenanceMode ? 'ENABLED (Banner Active)' : 'DISABLED (Public Live)'}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  When enabled, displays an urgent global maintenance strip across all public pages while root admins retain full console access.
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Toggle Site Maintenance:</span>
                  <button
                    onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow ${
                      isMaintenanceMode
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black'
                        : 'bg-[#082B59] hover:bg-[#051C3A] text-white'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{isMaintenanceMode ? 'Turn OFF Maintenance' : 'Turn ON Maintenance'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Database Backups & Snapshots */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-[#082B59] flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-600" />
                    <span>MongoDB Atlas Multi-Cluster Backups</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cold storage replication between Cluster-0 (Primary) and Cluster-1 (Analytical Vault).
                  </p>
                </div>

                <button
                  onClick={createBackupSnapshot}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow"
                >
                  <DownloadCloud className="w-4 h-4" />
                  <span>Create Database Backup Snapshot</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider border-y border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Backup Snapshot ID</th>
                      <th className="py-3 px-4">Creation Timestamp</th>
                      <th className="py-3 px-4">Archive Size</th>
                      <th className="py-3 px-4">Target Cluster</th>
                      <th className="py-3 px-4">Backup Type</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {systemBackups.map(bak => (
                      <tr key={bak.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3 px-4 font-mono font-bold text-[#082B59]">{bak.id}</td>
                        <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{bak.timestamp}</td>
                        <td className="py-3 px-4 font-bold text-slate-700">{bak.size}</td>
                        <td className="py-3 px-4 text-slate-600">{bak.cluster}</td>
                        <td className="py-3 px-4 text-slate-500">{bak.type}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>COMPLETED</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================================================================== */}
      {/* MODAL: ADD STAFF MEMBER                                           */}
      {/* ================================================================== */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#082B59]">Add Academic Staff Member</h3>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Farhan Qureshi"
                  value={newStaffName}
                  onChange={e => setNewStaffName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">University Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. farhan.finance@univer-e.in"
                  value={newStaffEmail}
                  onChange={e => setNewStaffEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Staff Role &amp; Permissions</label>
                <select
                  value={newStaffRole}
                  onChange={e => setNewStaffRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold bg-white"
                >
                  <option value="Content Manager">Content Manager (Curriculum &amp; Media)</option>
                  <option value="Finance Manager">Finance Manager (Payment UTR &amp; Accounts)</option>
                  <option value="Academic Lead">Academic Lead (Faculty &amp; Universal AI)</option>
                  <option value="Super Admin">Super Admin (Full Root System Control)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#082B59] hover:bg-[#051C3A] text-white rounded-xl text-xs font-bold"
                >
                  Confirm Staff Creation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL: CONTACT INQUIRIES DRAWER                                    */}
      {/* ================================================================== */}
      {showInquiriesModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-shrink-0">
              <h3 className="text-base font-black text-[#082B59] flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#F5A900]" />
                <span>Contact Inquiries &amp; Department Quotations ({inquiries.length})</span>
              </h3>
              <button
                onClick={() => setShowInquiriesModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {inquiries.map(inq => (
                <div key={inq.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#082B59]">{inq.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{inq.createdAt}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">{inq.email}</div>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-100">
                    {inq.message}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inq.status === 'replied'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inq.status === 'archived'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inq.status.toUpperCase()}
                    </span>
                    <div className="space-x-2 text-[11px] font-bold">
                      <button
                        onClick={() => updateInquiryStatus(inq.id, 'replied')}
                        className="text-emerald-600 hover:underline"
                      >
                        Mark Replied
                      </button>
                      <button
                        onClick={() => updateInquiryStatus(inq.id, 'archived')}
                        className="text-slate-400 hover:underline"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
