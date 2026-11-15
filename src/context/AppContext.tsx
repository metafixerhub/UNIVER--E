'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Certificate, User } from '@/types';
import { COURSES } from '@/data/courses';

interface AppContextType {
  user: User;
  setUserRole: (role: 'student' | 'instructor' | 'admin') => void;
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
}

const DEFAULT_USER: User = {
  id: 'usr_arham',
  name: 'Arham Khan',
  email: 'arham.khan@univer-e.in',
  role: 'student',
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['full-stack-web-dev']);
  const [cart, setCart] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const setUserRole = (role: 'student' | 'instructor' | 'admin') => {
    let name = 'Arham Khan';
    let email = 'arham.khan@univer-e.in';
    let avatar = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80';

    if (role === 'instructor') {
      name = 'Nur Mohammad';
      email = 'nur.mohammad@univer-e.in';
      avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    } else if (role === 'admin') {
      name = 'Dr. Sufiyan Ali (Dean & Admin)';
      email = 'admin@univer-e.in';
      avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
    }

    setUser(prev => ({
      ...prev,
      role,
      name,
      email,
      avatar,
    }));
    showToast(`Switched active view to ${role.toUpperCase()}`);
  };

  const enrolledCourses = COURSES.filter(c => user.enrolledCourseIds.includes(c.id));

  const enrollCourse = (courseId: string): boolean => {
    if (user.enrolledCourseIds.includes(courseId)) {
      showToast('You are already enrolled in this course!');
      return false;
    }
    const course = COURSES.find(c => c.id === courseId);
    setUser(prev => ({
      ...prev,
      enrolledCourseIds: [...prev.enrolledCourseIds, courseId],
      progress: {
        ...prev.progress,
        [courseId]: {
          completedLessonIds: [],
          lastWatchedLessonId: course?.curriculum[0]?.lessons[0]?.id || '',
          percent: 0,
        },
      },
    }));
    // Remove from cart if present
    setCart(prev => prev.filter(c => c.id !== courseId));
    showToast(`Successfully enrolled in ${course?.title || 'course'}!`);
    return true;
  };

  const toggleWishlist = (courseId: string) => {
    setWishlistIds(prev => {
      const exists = prev.includes(courseId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter(id => id !== courseId);
      } else {
        showToast('Added to wishlist');
        return [...prev, courseId];
      }
    });
  };

  const addToCart = (course: Course) => {
    if (user.enrolledCourseIds.includes(course.id)) {
      showToast('You already own this course!');
      return;
    }
    if (cart.some(c => c.id === course.id)) {
      showToast('Course already in your cart!');
      return;
    }
    setCart(prev => [...prev, course]);
    showToast(`Added "${course.title}" to cart`);
  };

  const removeFromCart = (courseId: string) => {
    setCart(prev => prev.filter(c => c.id !== courseId));
    showToast('Removed course from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return;

    const totalLessons = course.curriculum.reduce((acc, sec) => acc + sec.lessons.length, 0);
    const currentProgress = user.progress[courseId] || { completedLessonIds: [], percent: 0, lastWatchedLessonId: lessonId };
    const alreadyCompleted = currentProgress.completedLessonIds.includes(lessonId);

    const updatedCompleted = alreadyCompleted
      ? currentProgress.completedLessonIds.filter(id => id !== lessonId)
      : [...currentProgress.completedLessonIds, lessonId];

    const newPercent = Math.min(100, Math.round((updatedCompleted.length / (totalLessons || 1)) * 100));

    setUser(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [courseId]: {
          completedLessonIds: updatedCompleted,
          lastWatchedLessonId: lessonId,
          percent: newPercent,
        },
      },
      completedCourseIds:
        newPercent === 100 && !prev.completedCourseIds.includes(courseId)
          ? [...prev.completedCourseIds, courseId]
          : prev.completedCourseIds,
    }));

    if (newPercent === 100) {
      showToast(`Congratulations! You completed 100% of ${course.title}!`);
    } else if (!alreadyCompleted) {
      showToast('Lesson marked as complete');
    }
  };

  const getCourseProgress = (courseId: string): number => {
    return user.progress[courseId]?.percent || 0;
  };

  const issueCertificate = (courseId: string, scorePercent: number): Certificate => {
    const course = COURSES.find(c => c.id === courseId);
    const certNum = `UNIVER-E-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert: Certificate = {
      id: `cert_${Date.now()}`,
      certificateNumber: certNum,
      studentName: user.name,
      studentEmail: user.email,
      courseId,
      courseTitle: course?.title || 'Certified Course',
      instructorName: course?.instructor.name || 'UNIVER-E Academic Board',
      issueDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      grade: scorePercent >= 90 ? `Distinction (${scorePercent}%)` : `First Class (${scorePercent}%)`,
      verificationUrl: `/certificates/${certNum}`,
    };

    setUser(prev => ({
      ...prev,
      completedCourseIds: prev.completedCourseIds.includes(courseId) ? prev.completedCourseIds : [...prev.completedCourseIds, courseId],
      certificates: [newCert, ...prev.certificates],
    }));

    showToast(`Official Certificate Issued: ${certNum}`);
    return newCert;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUserRole,
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
