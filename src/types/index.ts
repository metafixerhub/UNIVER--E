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

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
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
  flashcards?: Flashcard[];
  interactiveQuizHtml?: string;
  isPremiumDownloadOnly?: boolean;
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
  description: string;
  studentsEnrolled?: number;
  icon?: string;
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
  verificationUrl: string;
}

export interface UserPreferences {
  phone?: string;
  headline?: string;
  location?: string;
  autoplayNextLesson: boolean;
  playbackSpeed: number;
  downloadQuality: '1080p' | '720p' | '480p';
  autoQuizPrompt: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  twoFactorOtpEnabled: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar: string;
  phone?: string;
  headline?: string;
  location?: string;
  isPremium?: boolean;
  preferences?: UserPreferences;
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

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: 'new' | 'replied' | 'archived';
}

export interface PaymentSettings {
  upiId: string;
  merchantName: string;
  activeProvider: 'direct_upi' | 'upi_gateway' | 'cashfree' | 'razorpay';
  isAutoVerify: boolean;
  publishedAt: string;
}

export interface UpiTransaction {
  id: string;
  utrNumber: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  amount: number;
  upiId: string;
  timestamp: string;
  status: 'verified' | 'pending' | 'rejected';
}
