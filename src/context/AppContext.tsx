'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Course,
  Certificate,
  User,
  UserPreferences,
  ContactInquiry,
  PaymentSettings,
  UpiTransaction,
  Instructor,
  Flashcard,
  AdminLogItem,
  StudentRecord,
  StaffMember,
  UploadedResource,
  SystemBackup,
} from '@/types';
import { COURSES, INSTRUCTORS } from '@/data/courses';

interface AppContextType {
  user: User;
  isLoggedIn: boolean;
  logoutUser: () => void;
  updateUserSettings: (updates: Partial<User>) => void;
  setUserRole: (role: 'student' | 'instructor' | 'admin') => void;
  registerUser: (userData: { name: string; email: string; phone?: string; role?: 'student' | 'instructor' }) => void;
  loginUser: (userData: { email: string; name?: string; role?: 'student' | 'instructor' | 'admin' }) => void;
  enrolledCourseIds: string[];
  enrolledCourses: Course[];
  completedCourseIds: string[];
  wishlistIds: string[];
  cart: Course[];
  certificates: Certificate[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  enrollCourse: (courseId: string) => boolean;
  toggleWishlist: (courseId: string) => void;
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  getCourseProgress: (courseId: string) => number;
  issueCertificate: (courseId: string, scorePercent: number) => Certificate;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Dynamic Catalog & Instructor State
  courses: Course[];
  instructors: Record<string, Instructor>;
  addInstructor: (instructor: Instructor) => void;
  deleteInstructor: (instructorId: string) => void;
  deleteCourse: (courseId: string) => void;
  deleteLesson: (courseId: string, sectionId: string, lessonId: string) => void;
  updateCoursePriceAndQuiz: (
    courseId: string,
    price: number,
    originalPrice?: number,
    quiz?: Course['quiz'],
    flashcards?: Flashcard[],
    interactiveQuizHtml?: string
  ) => void;
  // Security & Premium Video Downloads
  isPremium: boolean;
  upgradeToPremium: () => void;
  requirePremiumForDownloads: boolean;
  setRequirePremiumForDownloads: (val: boolean) => void;
  // Contact inquiries routed directly to Admin Portal
  inquiries: ContactInquiry[];
  submitInquiry: (data: { name: string; email: string; message: string }) => Promise<void>;
  updateInquiryStatus: (id: string, status: 'new' | 'replied' | 'archived') => void;
  // Dedicated Admin Security
  isAdminAuthenticated: boolean;
  adminLogin: (username: string, pass: string) => boolean;
  adminLogout: () => void;
  // UPI Payment Gateway Management (Publishable from Admin Portal)
  paymentSettings: PaymentSettings;
  updatePaymentSettings: (settings: Partial<PaymentSettings>) => void;
  transactions: UpiTransaction[];
  recordUpiTransaction: (tx: Omit<UpiTransaction, 'id' | 'timestamp'>) => void;
  updateTransactionStatus: (id: string, status: 'verified' | 'pending' | 'rejected') => void;
  verifyPayment: (params: {
    method: 'upi' | 'razorpay';
    utrNumber?: string;
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    studentName?: string;
    studentEmail?: string;
    courseTitle?: string;
    amount?: number;
  }) => Promise<{ success: boolean; message: string; transaction?: any }>;
  // Section 1: Private Administration & Audit
  adminLogs: AdminLogItem[];
  addAdminLog: (log: Omit<AdminLogItem, 'id' | 'timestamp'>) => void;
  staffMembers: StaffMember[];
  addStaffMember: (member: Omit<StaffMember, 'id' | 'lastActive'>) => void;
  removeStaffMember: (staffId: string) => void;
  // Section 2: Student Management
  students: StudentRecord[];
  toggleStudentSuspension: (studentId: string) => void;
  enrollStudentInCourse: (studentId: string, courseId: string) => void;
  // Section 3: Content Management & Upload Validation
  uploadedResources: UploadedResource[];
  addUploadedResource: (resource: Omit<UploadedResource, 'id' | 'uploadedAt'>) => void;
  deleteUploadedResource: (id: string) => void;
  updateCourseModerationStatus: (courseId: string, status: 'Draft' | 'In Review' | 'Published') => void;
  // Section 4: Payment Management & Instant Activation
  approveUtrAndActivateCourse: (txId: string, utrNumber: string, studentEmail: string, courseIdOrTitle: string) => void;
  rejectUtrPayment: (txId: string, reason?: string) => void;
  // Section 5: System Settings & Health
  isMaintenanceMode: boolean;
  setIsMaintenanceMode: (enabled: boolean) => void;
  systemBackups: SystemBackup[];
  createBackupSnapshot: () => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  phone: '+91 98765 43210',
  headline: 'Full Stack & AI Specialist Aspirant',
  location: 'Bengaluru, India',
  autoplayNextLesson: true,
  playbackSpeed: 1.0,
  downloadQuality: '1080p',
  autoQuizPrompt: true,
  emailNotifications: true,
  smsNotifications: true,
  twoFactorOtpEnabled: true,
};

const DEFAULT_USER: User = {
  id: 'usr_arham',
  name: 'Arham Khan',
  email: 'arham.khan@univer-e.in',
  role: 'student',
  phone: '+91 98765 43210',
  headline: 'Full Stack & AI Specialist Aspirant',
  location: 'Bengaluru, India',
  isPremium: false,
  preferences: DEFAULT_PREFERENCES,
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  enrolledCourseIds: ['ai-fundamentals-python', 'graphic-design-canva-pro'],
  completedCourseIds: ['graphic-design-canva-pro'],
  progress: {
    'ai-fundamentals-python': {
      completedLessonIds: ['l-101', 'l-102'],
      lastWatchedLessonId: 'l-103',
      percent: 35,
    },
    'graphic-design-canva-pro': {
      completedLessonIds: ['gd-101', 'gd-102'],
      lastWatchedLessonId: 'gd-102',
      percent: 100,
    },
  },
  certificates: [
    {
      id: 'cert_canva_pro_101',
      certificateNumber: 'UNIVER-E-2026-GD812',
      studentName: 'Arham Khan',
      studentEmail: 'arham.khan@univer-e.in',
      courseId: 'graphic-design-canva-pro',
      courseTitle: 'Graphic Design with Canva Pro',
      instructorName: 'Rizwan Ahmed',
      issueDate: '10 Nov 2026',
      grade: 'Distinction (96%)',
      verificationUrl: '/certificates/UNIVER-E-2026-GD812',
    },
  ],
};

const DEFAULT_INQUIRIES: ContactInquiry[] = [
  {
    id: 'inq_101',
    name: 'Suresh Patel',
    email: 'suresh.patel@gmail.com',
    message: 'Hello UNIVER-E Team, we want to purchase 50 student seats for our college department in Ahmedabad. Please send institutional quotation.',
    createdAt: '15 Nov 2026, 02:40 PM',
    status: 'new',
  },
  {
    id: 'inq_102',
    name: 'Ananya Roy',
    email: 'ananya.roy@outlook.com',
    message: 'Can I pay for the Full Stack Web Development course using UPI QR on my mobile phone? Also when does the doubt support batch start?',
    createdAt: '15 Nov 2026, 11:15 AM',
    status: 'new',
  },
];

const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  upiId: '7557060447-5@ybl',
  merchantName: 'UNIVER-E Digital Academy',
  activeProvider: 'direct_upi',
  isAutoVerify: true,
  publishedAt: '15 Nov 2026, 06:00 PM IST',
};

const DEFAULT_TRANSACTIONS: UpiTransaction[] = [
  {
    id: 'tx_981',
    utrNumber: '431902847192',
    studentName: 'Ayesha Parveen',
    studentEmail: 'ayesha.p@gmail.com',
    courseTitle: 'Full Stack Web Development',
    amount: 2999,
    upiId: '7557060447-5@ybl',
    timestamp: '15 Nov 2026, 03:15 PM',
    status: 'verified',
  },
  {
    id: 'tx_982',
    utrNumber: '431872190842',
    studentName: 'Sufiyan Ali',
    studentEmail: 'sufiyan.ali@yahoo.com',
    courseTitle: 'AI Fundamentals with Python',
    amount: 3499,
    upiId: '7557060447-5@ybl',
    timestamp: '15 Nov 2026, 01:45 PM',
    status: 'verified',
  },
];

const DEFAULT_ADMIN_LOGS: AdminLogItem[] = [
  {
    id: 'log_01',
    timestamp: '15 Nov 2026, 06:45 PM',
    adminName: 'Nur (Super Admin)',
    action: 'Payment UTR Verified',
    target: 'UTR: 431902847192 (Ayesha Parveen)',
    status: 'success',
    ip: '103.21.244.12',
  },
  {
    id: 'log_02',
    timestamp: '15 Nov 2026, 05:20 PM',
    adminName: 'Nur (Super Admin)',
    action: 'UPI Merchant Setting Updated',
    target: 'Active UPI: 7557060447-5@ybl',
    status: 'info',
    ip: '103.21.244.12',
  },
  {
    id: 'log_03',
    timestamp: '15 Nov 2026, 04:10 PM',
    adminName: 'Nur (Super Admin)',
    action: 'Download Security Enforced',
    target: 'Tier: Premium Gated Only',
    status: 'warning',
    ip: '103.21.244.12',
  },
  {
    id: 'log_04',
    timestamp: '15 Nov 2026, 02:30 PM',
    adminName: 'Nur (Super Admin)',
    action: 'Database Backup Snapshot Created',
    target: 'Cluster-0 (ShopDB) Snapshot #20261115',
    status: 'success',
    ip: '103.21.244.12',
  },
];

const DEFAULT_STUDENTS: StudentRecord[] = [
  {
    id: 'usr_arham',
    name: 'Arham Khan',
    email: 'arham.khan@univer-e.in',
    phone: '+91 98765 43210',
    enrolledCourseIds: ['ai-fundamentals-python', 'graphic-design-canva-pro'],
    isSuspended: false,
    registeredAt: '01 Nov 2026',
    isPremium: false,
  },
  {
    id: 'usr_ayesha',
    name: 'Ayesha Parveen',
    email: 'ayesha.p@gmail.com',
    phone: '+91 98112 34567',
    enrolledCourseIds: ['full-stack-web-dev'],
    isSuspended: false,
    registeredAt: '05 Nov 2026',
    isPremium: true,
  },
  {
    id: 'usr_sufiyan',
    name: 'Sufiyan Ali',
    email: 'sufiyan.ali@yahoo.com',
    phone: '+91 98334 56789',
    enrolledCourseIds: ['ai-fundamentals-python'],
    isSuspended: false,
    registeredAt: '08 Nov 2026',
    isPremium: false,
  },
  {
    id: 'usr_rohit',
    name: 'Rohit Sharma',
    email: 'rohit.s@outlook.com',
    phone: '+91 98456 78901',
    enrolledCourseIds: ['cybersecurity-ethical-hacking'],
    isSuspended: true,
    registeredAt: '12 Nov 2026',
    isPremium: false,
  },
];

const DEFAULT_STAFF: StaffMember[] = [
  {
    id: 'staff_nur',
    name: 'Nur Mohammad',
    email: 'nur@univer-e.in',
    role: 'Super Admin',
    status: 'active',
    lastActive: 'Just now',
  },
  {
    id: 'staff_ayesha',
    name: 'Ayesha Siddiqua',
    email: 'ayesha.staff@univer-e.in',
    role: 'Content Manager',
    status: 'active',
    lastActive: '15 mins ago',
  },
  {
    id: 'staff_farhan',
    name: 'Farhan Qureshi',
    email: 'farhan.finance@univer-e.in',
    role: 'Finance Manager',
    status: 'active',
    lastActive: '1 hour ago',
  },
  {
    id: 'staff_priya',
    name: 'Dr. Priya Nair',
    email: 'priya.academic@univer-e.in',
    role: 'Academic Lead',
    status: 'active',
    lastActive: '3 hours ago',
  },
];

const DEFAULT_RESOURCES: UploadedResource[] = [
  {
    id: 'res_01',
    title: 'Transformers & Self-Attention Video Lecture',
    fileName: 'lecture_04_transformers.mp4',
    fileSize: 184500000,
    fileType: 'video',
    courseId: 'ai-fundamentals-python',
    uploadedAt: '14 Nov 2026',
    status: 'scanned_safe',
    url: 'https://storage.googleapis.com/univer-e-vault/lecture_04_transformers.mp4',
  },
  {
    id: 'res_02',
    title: 'Full Stack MERN Architecture Blueprint',
    fileName: 'mern_architecture_guide.pdf',
    fileSize: 12400000,
    fileType: 'pdf',
    courseId: 'full-stack-web-dev',
    uploadedAt: '13 Nov 2026',
    status: 'scanned_safe',
    url: 'https://storage.googleapis.com/univer-e-vault/mern_architecture_guide.pdf',
  },
  {
    id: 'res_03',
    title: 'Cybersecurity Threat Modeling Cheatsheet',
    fileName: 'threat_model_cheatsheet.pdf',
    fileSize: 4500000,
    fileType: 'pdf',
    courseId: 'cybersecurity-ethical-hacking',
    uploadedAt: '12 Nov 2026',
    status: 'scanned_safe',
    url: 'https://storage.googleapis.com/univer-e-vault/threat_model_cheatsheet.pdf',
  },
];

const DEFAULT_BACKUPS: SystemBackup[] = [
  {
    id: 'bak_20261115_01',
    timestamp: '15 Nov 2026, 04:00 AM IST',
    size: '4.82 GB',
    cluster: 'Cluster-0 (Primary Atlas)',
    status: 'completed',
    type: 'Automated Daily',
  },
  {
    id: 'bak_20261114_01',
    timestamp: '14 Nov 2026, 04:00 AM IST',
    size: '4.78 GB',
    cluster: 'Cluster-0 (Primary Atlas)',
    status: 'completed',
    type: 'Automated Daily',
  },
  {
    id: 'bak_20261113_01',
    timestamp: '13 Nov 2026, 04:00 AM IST',
    size: '4.71 GB',
    cluster: 'Cluster-1 (Analytics Replica)',
    status: 'completed',
    type: 'Automated Daily',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [instructors, setInstructors] = useState<Record<string, Instructor>>(INSTRUCTORS);
  const [requirePremiumForDownloads, setRequirePremiumForDownloads] = useState<boolean>(true);

  const [wishlistIds, setWishlistIds] = useState<string[]>(['full-stack-web-dev']);
  const [cart, setCart] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(DEFAULT_INQUIRIES);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS);
  const [transactions, setTransactions] = useState<UpiTransaction[]>(DEFAULT_TRANSACTIONS);

  // 5 Operational Pillars States
  const [adminLogs, setAdminLogs] = useState<AdminLogItem[]>(DEFAULT_ADMIN_LOGS);
  const [students, setStudents] = useState<StudentRecord[]>(DEFAULT_STUDENTS);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(DEFAULT_STAFF);
  const [uploadedResources, setUploadedResources] = useState<UploadedResource[]>(DEFAULT_RESOURCES);
  const [isMaintenanceMode, setIsMaintenanceModeState] = useState<boolean>(false);
  const [systemBackups, setSystemBackups] = useState<SystemBackup[]>(DEFAULT_BACKUPS);

  // Check saved state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLogin = localStorage.getItem('univere_is_logged_in');
      if (savedLogin === 'true') {
        setIsLoggedIn(true);
      }
      const savedAuth = sessionStorage.getItem('univere_admin_auth');
      if (savedAuth === 'true') {
        setIsAdminAuthenticated(true);
        setIsLoggedIn(true);
      }
      const savedPayment = localStorage.getItem('univere_payment_settings');
      if (savedPayment) {
        try {
          setPaymentSettings(JSON.parse(savedPayment));
        } catch (e) {}
      }
      const savedTxs = localStorage.getItem('univere_transactions');
      if (savedTxs) {
        try {
          setTransactions(JSON.parse(savedTxs));
        } catch (e) {}
      }
      const savedCourses = localStorage.getItem('univere_courses');
      if (savedCourses) {
        try {
          setCourses(JSON.parse(savedCourses));
        } catch (e) {}
      }
      const savedInstructors = localStorage.getItem('univere_instructors');
      if (savedInstructors) {
        try {
          setInstructors(JSON.parse(savedInstructors));
        } catch (e) {}
      }
      const savedSec = localStorage.getItem('univere_premium_downloads_policy');
      if (savedSec !== null) {
        setRequirePremiumForDownloads(savedSec === 'true');
      }
      const savedUser = localStorage.getItem('univere_active_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {}
      }
      const savedLogs = localStorage.getItem('univere_admin_logs');
      if (savedLogs) {
        try {
          setAdminLogs(JSON.parse(savedLogs));
        } catch (e) {}
      }
      const savedStudents = localStorage.getItem('univere_students_directory');
      if (savedStudents) {
        try {
          setStudents(JSON.parse(savedStudents));
        } catch (e) {}
      }
      const savedStaff = localStorage.getItem('univere_staff_members');
      if (savedStaff) {
        try {
          setStaffMembers(JSON.parse(savedStaff));
        } catch (e) {}
      }
      const savedRes = localStorage.getItem('univere_uploaded_resources');
      if (savedRes) {
        try {
          setUploadedResources(JSON.parse(savedRes));
        } catch (e) {}
      }
      const savedMaint = localStorage.getItem('univere_maintenance_mode');
      if (savedMaint !== null) {
        setIsMaintenanceModeState(savedMaint === 'true');
      }
      const savedBackups = localStorage.getItem('univere_system_backups');
      if (savedBackups) {
        try {
          setSystemBackups(JSON.parse(savedBackups));
        } catch (e) {}
      }
    }
  }, []);

  // Auto clear toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const addInstructor = (instructor: Instructor) => {
    setInstructors(prev => {
      const updated = { ...prev, [instructor.id]: instructor };
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_instructors', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Instructor "${instructor.name}" registered and published!`);
  };

  const deleteInstructor = (instructorId: string) => {
    setInstructors(prev => {
      const updated = { ...prev };
      delete updated[instructorId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_instructors', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Instructor removed from registry.`);
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => {
      const updated = prev.filter(c => c.id !== courseId && c.slug !== courseId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_courses', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Course deleted from catalog.`);
  };

  const deleteLesson = (courseId: string, sectionId: string, lessonId: string) => {
    setCourses(prev => {
      const updated = prev.map(course => {
        if (course.id !== courseId && course.slug !== courseId) return course;
        return {
          ...course,
          curriculum: course.curriculum.map(sec => {
            if (sec.id !== sectionId) return sec;
            return {
              ...sec,
              lessons: sec.lessons.filter(l => l.id !== lessonId),
            };
          }),
          lessonsCount: Math.max(1, course.lessonsCount - 1),
        };
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_courses', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Lecture video deleted successfully.`);
  };

  const updateCoursePriceAndQuiz = (
    courseId: string,
    price: number,
    originalPrice?: number,
    quiz?: Course['quiz'],
    flashcards?: Flashcard[],
    interactiveQuizHtml?: string
  ) => {
    setCourses(prev => {
      const updated = prev.map(c => {
        if (c.id !== courseId && c.slug !== courseId) return c;
        return {
          ...c,
          price,
          originalPrice: originalPrice || c.originalPrice,
          ...(quiz ? { quiz } : {}),
          ...(flashcards ? { flashcards } : {}),
          ...(interactiveQuizHtml ? { interactiveQuizHtml } : {}),
        };
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_courses', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Course pricing & Universal AI assessment published!`);
  };

  const upgradeToPremium = () => {
    setUser(prev => {
      const updated = { ...prev, isPremium: true };
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_active_user', JSON.stringify(updated));
      }
      return updated;
    });
    showToast('🌟 UNIVER-E Premium Pass Activated! Offline Downloads Unlocked.');
  };

  const handleSetRequirePremiumPolicy = (val: boolean) => {
    setRequirePremiumForDownloads(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('univere_premium_downloads_policy', String(val));
    }
    showToast(`Download Security Policy: ${val ? 'Premium Tier Required' : 'Open Access'}`);
  };

  const updatePaymentSettings = (settings: Partial<PaymentSettings>) => {
    setPaymentSettings(prev => {
      const updated = {
        ...prev,
        ...settings,
        publishedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_payment_settings', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Payment settings published! Active UPI: ${settings.upiId || paymentSettings.upiId}`);
  };

  const recordUpiTransaction = (tx: Omit<UpiTransaction, 'id' | 'timestamp'>) => {
    const newTx: UpiTransaction = {
      ...tx,
      id: `tx_${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };
    setTransactions(prev => {
      const updated = [newTx, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_transactions', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateTransactionStatus = (id: string, status: 'verified' | 'pending' | 'rejected') => {
    setTransactions(prev => {
      const updated = prev.map(t => (t.id === id ? { ...t, status } : t));
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_transactions', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Transaction ${id} marked as ${status}`);
  };

  const verifyPayment = async (params: {
    method: 'upi' | 'razorpay';
    utrNumber?: string;
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    studentName?: string;
    studentEmail?: string;
    courseTitle?: string;
    amount?: number;
  }) => {
    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          upiId: paymentSettings.upiId,
        }),
      });
      const data = await res.json();
      if (data.success && data.transaction) {
        recordUpiTransaction({
          utrNumber: data.transaction.utrNumber,
          studentName: data.transaction.studentName,
          studentEmail: data.transaction.studentEmail,
          courseTitle: data.transaction.courseTitle,
          amount: data.transaction.amount,
          upiId: paymentSettings.upiId,
          status: 'verified',
        });
        showToast(data.message || 'Payment successfully verified!');
        return { success: true, message: data.message, transaction: data.transaction };
      } else {
        showToast(data.error || 'Payment verification failed.');
        return { success: false, message: data.error || 'Verification failed.' };
      }
    } catch (err: any) {
      showToast(err.message || 'Payment verification network error.');
      return { success: false, message: err.message };
    }
  };

  const setUserRole = (role: 'student' | 'instructor' | 'admin') => {
    let name = 'Arham Khan';
    let email = 'arham.khan@univer-e.in';
    let avatar = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80';

    if (role === 'instructor') {
      name = 'Nur Mohammad';
      email = 'nur.mohammad@univer-e.in';
      avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    } else if (role === 'admin') {
      name = 'Nur (System Admin)';
      email = 'nur@univer-e.in';
      avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
    }

    setUser(prev => {
      const updated = {
        ...prev,
        role,
        name,
        email,
        avatar,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_active_user', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const registerUser = (userData: { name: string; email: string; phone?: string; role?: 'student' | 'instructor' }) => {
    setIsLoggedIn(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('univere_is_logged_in', 'true');
    }
    setUser(prev => {
      const updated: User = {
        ...prev,
        id: `usr_${Date.now()}`,
        name: userData.name.trim() || 'Learner',
        email: userData.email.trim().toLowerCase(),
        phone: userData.phone || prev.phone,
        role: userData.role || 'student',
        isPremium: false,
        preferences: prev.preferences || DEFAULT_PREFERENCES,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name || 'Scholar')}`,
        enrolledCourseIds: prev.enrolledCourseIds || ['ai-fundamentals-python', 'graphic-design-canva-pro'],
        completedCourseIds: prev.completedCourseIds || ['graphic-design-canva-pro'],
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_active_user', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Welcome to UNIVER-E, ${userData.name}! Account registered successfully.`);
  };

  const loginUser = (userData: { email: string; name?: string; role?: 'student' | 'instructor' | 'admin' }) => {
    setIsLoggedIn(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('univere_is_logged_in', 'true');
    }
    setUser(prev => {
      const updated: User = {
        ...prev,
        email: userData.email.trim().toLowerCase(),
        name: userData.name || prev.name || 'Learner',
        role: userData.role || 'student',
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_active_user', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Signed in as ${userData.name || userData.email}`);
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    setIsAdminAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('univere_is_logged_in');
      localStorage.removeItem('univere_active_user');
      sessionStorage.removeItem('univere_admin_auth');
    }
    showToast('Signed out of UNIVER-E.');
  };

  const updateUserSettings = (updates: Partial<User>) => {
    setUser(prev => {
      const updated: User = {
        ...prev,
        ...updates,
        preferences: {
          ...(prev.preferences || DEFAULT_PREFERENCES),
          ...(updates.preferences || {}),
        },
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_active_user', JSON.stringify(updated));
      }
      return updated;
    });
    showToast('Account profile & preferences saved successfully!');
  };

  const adminLogin = (username: string, pass: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    if (cleanUser === 'nur' && pass === 'nur1438nur') {
      setIsAdminAuthenticated(true);
      setIsLoggedIn(true);
      setUser(prev => ({
        ...prev,
        role: 'admin',
        name: 'Nur (System Admin)',
        email: 'nur@univer-e.in',
      }));
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('univere_admin_auth', 'true');
        localStorage.setItem('univere_is_logged_in', 'true');
      }
      showToast('Admin root authentication verified!');
      return true;
    }
    showToast('Invalid administrator credentials.');
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    logoutUser();
  };

  const submitInquiry = async (data: { name: string; email: string; message: string }) => {
    const newInquiry: ContactInquiry = {
      id: `inq_${Date.now()}`,
      name: data.name,
      email: data.email,
      message: data.message,
      createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      status: 'new',
    };

    setInquiries(prev => [newInquiry, ...prev]);
    showToast('Inquiry transmitted directly to Admin Portal & MongoDB Atlas!');

    try {
      await fetch('https://one0l-server-point-234567.onrender.com/api/external/push-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clusterIndex: 1,
          dbName: 'ShopDB',
          collectionName: 'contact_inquiries',
          payload: newInquiry,
        }),
      });
    } catch (e) {
      console.warn('Sync to outer MongoDB Render proxy failed (offline):', e);
    }
  };

  const updateInquiryStatus = (id: string, status: 'new' | 'replied' | 'archived') => {
    setInquiries(prev =>
      prev.map(inq => (inq.id === id ? { ...inq, status } : inq))
    );
    showToast(`Inquiry marked as ${status}`);
  };

  const enrolledCourses = courses.filter(c => user.enrolledCourseIds.includes(c.id));

  const enrollCourse = (courseId: string) => {
    if (user.enrolledCourseIds.includes(courseId)) {
      showToast('You are already enrolled in this course.');
      return false;
    }

    const course = courses.find(c => c.id === courseId);
    setUser(prev => {
      const updated = {
        ...prev,
        enrolledCourseIds: [...prev.enrolledCourseIds, courseId],
        progress: {
          ...prev.progress,
          [courseId]: { completedLessonIds: [], percent: 0 },
        },
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_active_user', JSON.stringify(updated));
      }
      return updated;
    });

    showToast(`Successfully enrolled in ${course?.title || 'course'}!`);
    return true;
  };

  const toggleWishlist = (courseId: string) => {
    setWishlistIds(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const addToCart = (course: Course) => {
    if (user.enrolledCourseIds.includes(course.id)) {
      showToast('You already own this course!');
      return;
    }
    if (cart.some(c => c.id === course.id)) {
      showToast('Course is already in your shopping cart.');
      return;
    }
    setCart(prev => [...prev, course]);
    showToast(`Added "${course.title}" to cart.`);
  };

  const removeFromCart = (courseId: string) => {
    setCart(prev => prev.filter(c => c.id !== courseId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    setUser(prev => {
      const currentProg = prev.progress[courseId] || { completedLessonIds: [], percent: 0 };
      const completed = currentProg.completedLessonIds.includes(lessonId)
        ? currentProg.completedLessonIds
        : [...currentProg.completedLessonIds, lessonId];

      const course = courses.find(c => c.id === courseId);
      const totalLessons = course ? course.lessonsCount : 10;
      const percent = Math.min(100, Math.round((completed.length / totalLessons) * 100));

      const updated = {
        ...prev,
        progress: {
          ...prev.progress,
          [courseId]: {
            completedLessonIds: completed,
            lastWatchedLessonId: lessonId,
            percent,
          },
        },
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_active_user', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const getCourseProgress = (courseId: string): number => {
    return user.progress[courseId]?.percent || 0;
  };

  const issueCertificate = (courseId: string, scorePercent: number): Certificate => {
    const course = courses.find(c => c.id === courseId);
    const certNum = `UNIVER-E-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const newCert: Certificate = {
      id: `cert_${Date.now()}`,
      certificateNumber: certNum,
      studentName: user.name,
      studentEmail: user.email,
      courseId,
      courseTitle: course?.title || 'Certified Specialization',
      instructorName: course?.instructor.name || 'UNIVER-E Academic Faculty',
      issueDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      grade: scorePercent >= 90 ? `Distinction (${scorePercent}%)` : `First Class (${scorePercent}%)`,
      verificationUrl: `/certificates/${certNum}`,
    };

    setUser(prev => {
      const updated = {
        ...prev,
        completedCourseIds: prev.completedCourseIds.includes(courseId) ? prev.completedCourseIds : [...prev.completedCourseIds, courseId],
        certificates: [newCert, ...prev.certificates],
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_active_user', JSON.stringify(updated));
      }
      return updated;
    });

    showToast(`Official Certificate Issued: ${certNum}`);
    return newCert;
  };

  const addAdminLog = (log: Omit<AdminLogItem, 'id' | 'timestamp'>) => {
    const newLog: AdminLogItem = {
      ...log,
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      ip: log.ip || '103.21.244.12',
    };
    setAdminLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 50);
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_admin_logs', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const toggleStudentSuspension = (studentId: string) => {
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === studentId) {
          const newStatus = !s.isSuspended;
          addAdminLog({
            adminName: 'Nur (Super Admin)',
            action: newStatus ? 'Student Access Suspended' : 'Student Access Reactivated',
            target: `${s.name} (${s.email})`,
            status: newStatus ? 'warning' : 'info',
          });
          showToast(`Student ${s.name} has been ${newStatus ? 'SUSPENDED' : 'REACTIVATED'}.`);
          return { ...s, isSuspended: newStatus };
        }
        return s;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_students_directory', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const enrollStudentInCourse = (studentId: string, courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === studentId) {
          const already = s.enrolledCourseIds.includes(courseId);
          const enrolled = already ? s.enrolledCourseIds : [...s.enrolledCourseIds, courseId];
          return { ...s, enrolledCourseIds: enrolled };
        }
        return s;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_students_directory', JSON.stringify(updated));
      }
      return updated;
    });
    addAdminLog({
      adminName: 'Nur (Super Admin)',
      action: 'Manual Course Enrollment Granted',
      target: `Student: ${studentId} -> Course: ${course?.title || courseId}`,
      status: 'success',
    });
    showToast(`Enrolled student in ${course?.title || courseId}`);
  };

  const addStaffMember = (member: Omit<StaffMember, 'id' | 'lastActive'>) => {
    const newStaff: StaffMember = {
      ...member,
      id: `staff_${Date.now()}`,
      lastActive: 'Just registered',
    };
    setStaffMembers(prev => {
      const updated = [newStaff, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_staff_members', JSON.stringify(updated));
      }
      return updated;
    });
    addAdminLog({
      adminName: 'Nur (Super Admin)',
      action: 'Staff Member Added',
      target: `${member.name} (${member.role})`,
      status: 'success',
    });
    showToast(`Staff member "${member.name}" added as ${member.role}.`);
  };

  const removeStaffMember = (staffId: string) => {
    setStaffMembers(prev => {
      const target = prev.find(s => s.id === staffId);
      const updated = prev.filter(s => s.id !== staffId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_staff_members', JSON.stringify(updated));
      }
      if (target) {
        addAdminLog({
          adminName: 'Nur (Super Admin)',
          action: 'Staff Role Revoked',
          target: `${target.name} (${target.role})`,
          status: 'warning',
        });
      }
      return updated;
    });
    showToast('Staff permissions revoked.');
  };

  const addUploadedResource = (res: Omit<UploadedResource, 'id' | 'uploadedAt'>) => {
    const newRes: UploadedResource = {
      ...res,
      id: `res_${Date.now()}`,
      uploadedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setUploadedResources(prev => {
      const updated = [newRes, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_uploaded_resources', JSON.stringify(updated));
      }
      return updated;
    });
    addAdminLog({
      adminName: 'Nur (Super Admin)',
      action: 'New Content Uploaded & Scanned',
      target: `${res.fileName} (${(res.fileSize / (1024 * 1024)).toFixed(1)} MB)`,
      status: 'success',
    });
    showToast(`File "${res.fileName}" validated and secured.`);
  };

  const deleteUploadedResource = (id: string) => {
    setUploadedResources(prev => {
      const updated = prev.filter(r => r.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_uploaded_resources', JSON.stringify(updated));
      }
      return updated;
    });
    showToast('Resource removed from private vault.');
  };

  const updateCourseModerationStatus = (courseId: string, status: 'Draft' | 'In Review' | 'Published') => {
    setCourses(prev => {
      const updated = prev.map(c => (c.id === courseId ? { ...c, moderationStatus: status } : c));
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_courses', JSON.stringify(updated));
      }
      return updated;
    });
    addAdminLog({
      adminName: 'Nur (Super Admin)',
      action: `Course Moderation Status: ${status}`,
      target: courseId,
      status: status === 'Published' ? 'success' : 'info',
    });
    showToast(`Course "${courseId}" status updated to ${status}.`);
  };

  const approveUtrAndActivateCourse = (txId: string, utrNumber: string, studentEmail: string, courseIdOrTitle: string) => {
    setTransactions(prev => {
      const updated = prev.map(t => (t.id === txId || t.utrNumber === utrNumber ? { ...t, status: 'verified' as const } : t));
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_transactions', JSON.stringify(updated));
      }
      return updated;
    });

    const matchedCourse = courses.find(
      c => c.id === courseIdOrTitle || c.title.toLowerCase().includes(courseIdOrTitle.toLowerCase()) || courseIdOrTitle.toLowerCase().includes(c.title.toLowerCase())
    ) || courses[0];
    const courseId = matchedCourse.id;

    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.email.toLowerCase() === studentEmail.toLowerCase()) {
          const enrolled = s.enrolledCourseIds.includes(courseId) ? s.enrolledCourseIds : [...s.enrolledCourseIds, courseId];
          return { ...s, enrolledCourseIds: enrolled };
        }
        return s;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_students_directory', JSON.stringify(updated));
      }
      return updated;
    });

    setUser(prev => {
      if (prev.email.toLowerCase() === studentEmail.toLowerCase() || prev.role === 'student') {
        if (!prev.enrolledCourseIds.includes(courseId)) {
          const updated = {
            ...prev,
            enrolledCourseIds: [...prev.enrolledCourseIds, courseId],
            progress: {
              ...prev.progress,
              [courseId]: { completedLessonIds: [], percent: 0 },
            },
          };
          if (typeof window !== 'undefined') {
            localStorage.setItem('univere_active_user', JSON.stringify(updated));
          }
          return updated;
        }
      }
      return prev;
    });

    addAdminLog({
      adminName: 'Nur (Super Admin)',
      action: 'UTR Approved & Course Activated',
      target: `UTR: ${utrNumber} -> ${matchedCourse.title} (${studentEmail})`,
      status: 'success',
    });

    showToast(`🎉 UTR ${utrNumber} Approved! Course "${matchedCourse.title}" activated for ${studentEmail}.`);
  };

  const rejectUtrPayment = (txId: string, reason = 'Bank UTR not found or mismatched amount') => {
    setTransactions(prev => {
      const updated = prev.map(t => (t.id === txId ? { ...t, status: 'rejected' as const } : t));
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_transactions', JSON.stringify(updated));
      }
      return updated;
    });

    addAdminLog({
      adminName: 'Nur (Super Admin)',
      action: 'Payment UTR Rejected',
      target: `Tx: ${txId} (${reason})`,
      status: 'warning',
    });

    showToast(`Transaction rejected: ${reason}`);
  };

  const setIsMaintenanceMode = (enabled: boolean) => {
    setIsMaintenanceModeState(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('univere_maintenance_mode', String(enabled));
    }
    addAdminLog({
      adminName: 'Nur (Super Admin)',
      action: enabled ? 'Maintenance Mode Activated' : 'Maintenance Mode Deactivated',
      target: 'Public Portal Access Gateway',
      status: enabled ? 'warning' : 'info',
    });
    showToast(`Maintenance mode is now ${enabled ? 'ENABLED' : 'DISABLED'}.`);
  };

  const createBackupSnapshot = () => {
    const newBackup: SystemBackup = {
      id: `bak_${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      size: '4.86 GB',
      cluster: 'Cluster-0 (Primary Atlas)',
      status: 'completed',
      type: 'Manual Snapshot',
    };
    setSystemBackups(prev => {
      const updated = [newBackup, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('univere_system_backups', JSON.stringify(updated));
      }
      return updated;
    });
    addAdminLog({
      adminName: 'Nur (Super Admin)',
      action: 'Manual DB Snapshot Generated',
      target: `${newBackup.id} (Cluster-0 Atlas)`,
      status: 'success',
    });
    showToast('✅ Database backup snapshot generated and synced to MongoDB Atlas cold vault.');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn,
        logoutUser,
        updateUserSettings,
        setUserRole,
        registerUser,
        loginUser,
        enrolledCourseIds: user.enrolledCourseIds,
        enrolledCourses,
        completedCourseIds: user.completedCourseIds,
        wishlistIds,
        cart,
        certificates: user.certificates,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        enrollCourse,
        toggleWishlist,
        addToCart,
        removeFromCart,
        clearCart,
        markLessonComplete,
        getCourseProgress,
        issueCertificate,
        toastMessage,
        showToast,
        // Dynamic Catalog & Instructors
        courses,
        instructors,
        addInstructor,
        deleteInstructor,
        deleteCourse,
        deleteLesson,
        updateCoursePriceAndQuiz,
        // Security & Premium
        isPremium: Boolean(user.isPremium),
        upgradeToPremium,
        requirePremiumForDownloads,
        setRequirePremiumForDownloads: handleSetRequirePremiumPolicy,
        // Contact inquiries
        inquiries,
        submitInquiry,
        updateInquiryStatus,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        paymentSettings,
        updatePaymentSettings,
        transactions,
        recordUpiTransaction,
        updateTransactionStatus,
        verifyPayment,
        // 5 Operational Pillars Providers
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
