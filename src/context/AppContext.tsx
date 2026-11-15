'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Course,
  Certificate,
  User,
  ContactInquiry,
  PaymentSettings,
  UpiTransaction,
  Instructor,
  Flashcard,
} from '@/types';
import { COURSES, INSTRUCTORS } from '@/data/courses';

interface AppContextType {
  user: User;
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
}

const DEFAULT_USER: User = {
  id: 'usr_arham',
  name: 'Arham Khan',
  email: 'arham.khan@univer-e.in',
  role: 'student',
  isPremium: false,
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(DEFAULT_USER);
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

  // Check saved state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = sessionStorage.getItem('univere_admin_auth');
      if (savedAuth === 'true') {
        setIsAdminAuthenticated(true);
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
    setUser(prev => {
      const updated: User = {
        ...prev,
        id: `usr_${Date.now()}`,
        name: userData.name.trim() || 'Learner',
        email: userData.email.trim().toLowerCase(),
        role: userData.role || 'student',
        isPremium: false,
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

  const adminLogin = (username: string, pass: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    if (cleanUser === 'nur' && pass === 'nur1438nur') {
      setIsAdminAuthenticated(true);
      setUser(prev => ({
        ...prev,
        role: 'admin',
        name: 'Nur (System Admin)',
        email: 'nur@univer-e.in',
      }));
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('univere_admin_auth', 'true');
      }
      showToast('Admin root authentication verified!');
      return true;
    }
    showToast('Invalid administrator credentials.');
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setUserRole('student');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('univere_admin_auth');
    }
    showToast('Logged out of Admin Portal.');
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

  return (
    <AppContext.Provider
      value={{
        user,
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
