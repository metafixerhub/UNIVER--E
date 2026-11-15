export interface Lesson {
  id: string;
  title: string;
  duration: string;
  durationSeconds: number;
  videoUrl: string;
  summary: string;
  resources?: { name: string; url: string; size: string }[];
  isCompleted?: boolean;
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  rating: number;
  studentsCount: number;
  coursesCount: number;
  badge?: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  headline: string;
  description: string;
  category: string;
  categoryIcon: string;
  department: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  duration: string;
  lessonsCount: number;
  language: string;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  isFree?: boolean;
  badge?: 'Bestseller' | 'Trending' | 'New' | 'Popular' | 'Free';
  thumbnail: string;
  previewVideoUrl: string;
  instructor: Instructor;
  learningObjectives: string[];
  prerequisites: string[];
  curriculum: Section[];
  reviews: Review[];
  quiz?: {
    title: string;
    passingScore: number;
    timeLimitMinutes: number;
    questions: QuizQuestion[];
  };
  lastUpdated: string;
  certificateOffered: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  coursesCount: number;
  color: string;
  description: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  head: string;
  programsCount: number;
  studentsEnrolled: number;
  description: string;
  icon: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  issueDate: string;
  grade: string;
  qrCodeUrl?: string;
  verificationUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar: string;
  enrolledCourseIds: string[];
  completedCourseIds: string[];
  progress: Record<string, { completedLessonIds: string[]; lastWatchedLessonId?: string; percent: number }>;
  certificates: Certificate[];
}

export interface CartItem {
  course: Course;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  rating: number;
  comment: string;
  courseTaken: string;
}
