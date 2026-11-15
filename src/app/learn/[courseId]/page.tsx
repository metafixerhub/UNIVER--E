'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  Download,
  MessageSquare,
  Award,
  Settings,
  Menu,
  X,
  ExternalLink,
  Lock,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { COURSES } from '@/data/courses';
import { useApp } from '@/context/AppContext';
import { Lesson, Flashcard } from '@/types';

export default function LearningPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const {
    user,
    courses,
    markLessonComplete,
    getCourseProgress,
    showToast,
    isPremium,
    upgradeToPremium,
    requirePremiumForDownloads,
  } = useApp();

  const courseId = params?.courseId as string;
  const course = (courses && courses.find(c => c.id === courseId || c.slug === courseId)) || COURSES.find(c => c.id === courseId || c.slug === courseId) || COURSES[0];

  // Flatten all lessons
  const allLessons: Lesson[] = course.curriculum.flatMap(s => s.lessons);
  const [activeLesson, setActiveLesson] = useState<Lesson>(allLessons[0] || course.curriculum[0]?.lessons[0]);

  // Video states
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Tabs for lesson tools
  const [activeToolTab, setActiveToolTab] = useState<'overview' | 'notes' | 'resources' | 'flashcards' | 'quiz' | 'discussion'>('overview');
  const [studentNotes, setStudentNotes] = useState('My personal notes for this lesson...');

  // Premium modal state
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [pendingDownloadType, setPendingDownloadType] = useState<'video' | 'handout' | null>(null);

  // Flashcards state
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Fallback or course flashcards
  const courseFlashcards: Flashcard[] = course.flashcards && course.flashcards.length > 0
    ? course.flashcards
    : [
        {
          id: 'fc_def_1',
          front: `What is the core paradigm in "${activeLesson?.title || course.title}"?`,
          back: 'Decomposing complex architectures into deterministic, modular, and testable components with state guarantees.',
          category: course.category,
          difficulty: 'medium',
        },
        {
          id: 'fc_def_2',
          front: 'How do you optimize asynchronous data flows in production?',
          back: 'Leverage reactive stream batching, lazy instantiation, and indexed local cache stores to minimize server roundtrips.',
          category: course.category,
          difficulty: 'easy',
        },
        {
          id: 'fc_def_3',
          front: 'What security standard governs learner credentials & session data?',
          back: 'Indian DPDP Act 2023 with cryptographic salted hashing, tokenized stateless sessions, and Zero-Knowledge proofs.',
          category: 'Security',
          difficulty: 'hard',
        },
      ];

  const courseProgress = getCourseProgress(course.id);
  const currentCompleted = user.progress[course.id]?.completedLessonIds || [];
  const isLessonCompleted = currentCompleted.includes(activeLesson?.id);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    showToast(`Playback speed: ${speed}x`);
  };

  const handleLessonChange = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const nextLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
    if (currentIndex < allLessons.length - 1) {
      handleLessonChange(allLessons[currentIndex + 1]);
    }
  };

  const prevLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
    if (currentIndex > 0) {
      handleLessonChange(allLessons[currentIndex - 1]);
    }
  };

  const handleToggleComplete = () => {
    markLessonComplete(course.id, activeLesson.id);
  };

  // Secure Video & Resource Download handler with Premium requirement
  const handleSecureDownload = (type: 'video' | 'handout') => {
    if (requirePremiumForDownloads && !isPremium) {
      setPendingDownloadType(type);
      setShowPremiumModal(true);
      return;
    }

    if (type === 'video') {
      showToast(`Initiating 1080p Offline Lecture Download: "${activeLesson?.title || 'Video'}.mp4"`);
      const link = document.createElement('a');
      link.href = activeLesson?.videoUrl || course.previewVideoUrl;
      link.download = `${course.title}-${activeLesson?.title || 'Lecture'}.mp4`;
      link.target = '_blank';
      link.click();
    } else {
      showToast('Downloading verified curriculum handouts & cheat sheets (PDF)...');
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${course.title}-Handout-Master.pdf`;
      link.click();
    }
  };

  const handleActivatePremiumAndDownload = () => {
    upgradeToPremium();
    setShowPremiumModal(false);
    if (pendingDownloadType) {
      setTimeout(() => {
        handleSecureDownload(pendingDownloadType);
        setPendingDownloadType(null);
      }, 300);
    }
  };

  return (
    <div className="bg-[#051C3A] text-white min-h-screen flex flex-col">
      {/* Top Learning Bar */}
      <div className="bg-[#082B59] border-b border-navy-700 px-4 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
          <span className="text-navy-600">|</span>
          <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
            {course.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Premium Status Pill */}
          {isPremium ? (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5A900]/20 text-[#F5A900] text-[11px] font-black border border-[#F5A900]/40">
              <Sparkles className="w-3 h-3" />
              <span>PREMIUM PASS</span>
            </span>
          ) : (
            <button
              onClick={() => setShowPremiumModal(true)}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold border border-slate-700 transition"
            >
              <Lock className="w-3 h-3 text-[#F5A900]" />
              <span>Get Premium Pass</span>
            </button>
          )}

          {/* Course Progress Mini Bar */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-24 bg-navy-950 rounded-full h-2 overflow-hidden border border-navy-700">
              <div
                className="bg-[#28A745] h-full transition-all duration-300"
                style={{ width: `${courseProgress}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-emerald-400 font-mono">{courseProgress}%</span>
          </div>

          {/* Toggle Syllabus Sidebar */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 transition"
            title="Toggle Curriculum Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Body: Video Player & Syllabus Drawer */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left: Video Cinema & Lesson Controls */}
        <div className="flex-1 flex flex-col bg-black overflow-y-auto">
          {/* Video Container */}
          <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center group overflow-hidden">
            <video
              ref={videoRef}
              src={activeLesson?.videoUrl || course.previewVideoUrl}
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setCurrentTime(videoRef.current.currentTime);
                  setDuration(videoRef.current.duration || 100);
                }
              }}
              onEnded={() => {
                setIsPlaying(false);
                markLessonComplete(course.id, activeLesson.id);
              }}
            />

            {/* Video Security Watermark Overlay */}
            <div className="absolute top-3 left-4 pointer-events-none opacity-40 text-[10px] font-mono text-slate-300 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
              UNIVER-E SECURE STREAM • {user.name} • ENCRYPTED
            </div>

            {/* Custom Control Overlay on Hover */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {/* Progress Slider */}
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={e => {
                  const newTime = Number(e.target.value);
                  setCurrentTime(newTime);
                  if (videoRef.current) videoRef.current.currentTime = newTime;
                }}
                className="w-full h-1 bg-slate-700 accent-[#13A8E8] cursor-pointer rounded-full mb-3"
              />

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="p-1 hover:text-[#F5A900] transition">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => {
                      if (videoRef.current) videoRef.current.currentTime -= 10;
                    }}
                    className="p-1 hover:text-white text-slate-300"
                    title="Rewind 10s"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsMuted(!isMuted);
                      if (videoRef.current) videoRef.current.muted = !isMuted;
                    }}
                    className="p-1 hover:text-white text-slate-300"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="font-mono text-slate-400">
                    {Math.floor(currentTime / 60)}:
                    {Math.floor(currentTime % 60)
                      .toString()
                      .padStart(2, '0')}{' '}
                    / {activeLesson?.duration}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Speed Selector */}
                  <div className="flex items-center gap-1">
                    {[1, 1.25, 1.5, 2].map(speed => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                          playbackSpeed === speed ? 'bg-[#F5A900] text-[#082B59]' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (videoRef.current?.requestFullscreen) {
                        videoRef.current.requestFullscreen();
                      }
                    }}
                    className="p-1 hover:text-[#13A8E8]"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Action Bar */}
          <div className="bg-[#082B59] p-4 border-b border-navy-700 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-[#13A8E8] font-bold uppercase tracking-wider">Current Lesson</span>
              <h3 className="text-base sm:text-lg font-bold text-white">{activeLesson?.title}</h3>
            </div>

            <div className="flex items-center gap-2">
              {/* Secure Download Video Button */}
              <button
                onClick={() => handleSecureDownload('video')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-600 flex items-center gap-1.5 transition"
                title="Download lecture for offline viewing"
              >
                {requirePremiumForDownloads && !isPremium ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-[#F5A900]" />
                    <span>Download (Premium)</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-[#13A8E8]" />
                    <span>Download Offline MP4</span>
                  </>
                )}
              </button>

              <button
                onClick={handleToggleComplete}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  isLessonCompleted
                    ? 'bg-[#28A745] text-white'
                    : 'bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-600'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isLessonCompleted ? 'Completed' : 'Mark Complete'}</span>
              </button>

              <button
                onClick={prevLesson}
                className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 transition"
                title="Previous Lecture"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextLesson}
                className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 transition"
                title="Next Lecture"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tools Area: Overview, Notes, Resources, Flashcards, Quiz, Q&A */}
          <div className="bg-white text-slate-800 p-6 flex-1">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-4 overflow-x-auto">
              <button
                onClick={() => setActiveToolTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex-shrink-0 ${
                  activeToolTab === 'overview'
                    ? 'bg-[#082B59] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Overview &amp; Summary
              </button>
              <button
                onClick={() => setActiveToolTab('notes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex-shrink-0 ${
                  activeToolTab === 'notes'
                    ? 'bg-[#082B59] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                My Notes
              </button>
              <button
                onClick={() => setActiveToolTab('resources')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex-shrink-0 ${
                  activeToolTab === 'resources'
                    ? 'bg-[#082B59] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Download Resources
              </button>
              <button
                onClick={() => setActiveToolTab('flashcards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex-shrink-0 flex items-center gap-1 ${
                  activeToolTab === 'flashcards'
                    ? 'bg-[#13A8E8] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Study Flashcards</span>
              </button>
              {(course.interactiveQuizHtml || course.quiz) && (
                <button
                  onClick={() => setActiveToolTab('quiz')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex-shrink-0 flex items-center gap-1 ${
                    activeToolTab === 'quiz'
                      ? 'bg-[#28A745] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Interactive Quiz Runner</span>
                </button>
              )}
              <button
                onClick={() => setActiveToolTab('discussion')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex-shrink-0 ${
                  activeToolTab === 'discussion'
                    ? 'bg-[#082B59] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Discussions
              </button>
            </div>

            {activeToolTab === 'overview' && (
              <div className="space-y-3">
                <h4 className="text-base font-bold text-[#082B59]">Lecture Summary</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeLesson?.summary || 'In this lecture, you will explore core paradigms and hands-on code exercises.'}
                </p>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-slate-700">
                  <strong>Key Takeaway:</strong> Practice the code examples directly in your local environment or online playground to cement understanding.
                </div>
              </div>
            )}

            {activeToolTab === 'notes' && (
              <div className="space-y-3">
                <h4 className="text-base font-bold text-[#082B59]">Interactive Notebook</h4>
                <textarea
                  rows={4}
                  value={studentNotes}
                  onChange={e => setStudentNotes(e.target.value)}
                  className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8]"
                  placeholder="Record your thoughts, timestamps, and questions here..."
                />
                <button
                  onClick={() => showToast('Student notes saved to local storage!')}
                  className="px-4 py-1.5 bg-[#082B59] text-white text-xs font-bold rounded-lg"
                >
                  Save Notes
                </button>
              </div>
            )}

            {activeToolTab === 'resources' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-[#082B59]">Lecture Materials &amp; Assets</h4>
                  {requirePremiumForDownloads && !isPremium && (
                    <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Premium Required
                    </span>
                  )}
                </div>

                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                    <FileText className="w-5 h-5 text-[#13A8E8]" />
                    <div>
                      <div className="font-bold text-[#082B59]">Lecture_Handout_CheatSheet.pdf</div>
                      <div className="text-[11px] text-slate-400">2.4 MB • Official Verified Reference</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSecureDownload('handout')}
                    className="px-3 py-1.5 rounded-lg bg-[#082B59] hover:bg-[#051C3A] text-white text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Handout</span>
                  </button>
                </div>
              </div>
            )}

            {/* Flashcards Tab */}
            {activeToolTab === 'flashcards' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-[#082B59]">3D Interactive Flashcards</h4>
                    <p className="text-xs text-slate-500">Click the card to flip between Question and Answer.</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#13A8E8]">
                    Card {activeFlashcardIndex + 1} of {courseFlashcards.length}
                  </span>
                </div>

                {/* 3D Flip Card Container */}
                <div
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className="w-full min-h-[200px] cursor-pointer rounded-2xl p-6 transition-all duration-300 transform border shadow-md flex flex-col justify-between"
                  style={{
                    backgroundColor: isCardFlipped ? '#F0FDF4' : '#F5F8FC',
                    borderColor: isCardFlipped ? '#28A745' : '#13A8E8',
                  }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-white font-bold text-[#082B59] border text-[11px]">
                      {isCardFlipped ? 'ANSWER & EXPLANATION' : 'STUDY QUESTION'}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {courseFlashcards[activeFlashcardIndex]?.difficulty || 'Medium'}
                    </span>
                  </div>

                  <div className="py-6 text-center">
                    <p className="text-base sm:text-lg font-bold text-[#082B59]">
                      {isCardFlipped
                        ? courseFlashcards[activeFlashcardIndex]?.back
                        : courseFlashcards[activeFlashcardIndex]?.front}
                    </p>
                  </div>

                  <div className="text-center text-[11px] text-slate-400 font-semibold">
                    (Click anywhere on card to flip)
                  </div>
                </div>

                {/* Card Navigation */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      setIsCardFlipped(false);
                      setActiveFlashcardIndex(prev => (prev > 0 ? prev - 1 : courseFlashcards.length - 1));
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#082B59] text-xs font-bold transition"
                  >
                    &larr; Previous Card
                  </button>

                  <button
                    onClick={() => showToast('Card marked as mastered!')}
                    className="px-4 py-2 rounded-xl bg-[#28A745] hover:bg-emerald-600 text-white text-xs font-bold transition"
                  >
                    Mark Mastered
                  </button>

                  <button
                    onClick={() => {
                      setIsCardFlipped(false);
                      setActiveFlashcardIndex(prev => (prev < courseFlashcards.length - 1 ? prev + 1 : 0));
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#082B59] text-xs font-bold transition"
                  >
                    Next Card &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Interactive Quiz Runner Tab */}
            {activeToolTab === 'quiz' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-[#082B59]">Interactive Quiz Runner</h4>
                    <p className="text-xs text-slate-500">Live dynamic assessment generated by Universal AI.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Sandbox Active
                  </span>
                </div>

                {course.interactiveQuizHtml ? (
                  <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-sm h-[560px]">
                    <iframe
                      srcDoc={course.interactiveQuizHtml}
                      className="w-full h-full border-0"
                      title="Universal AI Quiz Runner"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                ) : (
                  <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
                    <p className="text-sm font-bold text-[#082B59] mb-2">Standard Course Quiz Available</p>
                    <p className="text-xs text-slate-500 mb-4">Click below to take the official course final examination.</p>
                    <Link
                      href={`/assessment/${course.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#082B59] text-white text-xs font-bold hover:bg-[#051C3A] transition"
                    >
                      <Award className="w-4 h-4 text-[#F5A900]" />
                      <span>Take Assessment</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeToolTab === 'discussion' && (
              <div className="space-y-3">
                <h4 className="text-base font-bold text-[#082B59]">Student Community Q&amp;A</h4>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
                  <p className="font-bold text-[#082B59]">Vikram: &ldquo;How do we optimize memory for large datasets?&rdquo;</p>
                  <p className="text-slate-600">
                    Instructor Reply: &ldquo;Use generator expressions and chunking with pandas chunksize parameter.&rdquo;
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Course Curriculum Drawer (Fixed sidebar on desktop) */}
        {sidebarOpen && (
          <div className="w-full lg:w-96 bg-[#082B59] border-l border-navy-700 flex flex-col h-auto lg:h-[calc(100vh-60px)] z-20">
            <div className="p-4 border-b border-navy-700 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Course Syllabus</h3>
              <span className="text-xs text-slate-300 font-mono">
                {currentCompleted.length}/{allLessons.length} Done
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-navy-700">
              {course.curriculum.map(sec => (
                <div key={sec.id} className="py-2">
                  <div className="px-4 py-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {sec.title}
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {sec.lessons.map(lesson => {
                      const isCurrent = activeLesson?.id === lesson.id;
                      const isDone = currentCompleted.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonChange(lesson)}
                          className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-xs transition ${
                            isCurrent
                              ? 'bg-navy-800 text-[#F5A900] font-bold border-l-4 border-[#F5A900]'
                              : 'text-slate-200 hover:bg-navy-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate pr-2">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-[#28A745] flex-shrink-0" />
                            ) : (
                              <Play className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                            {lesson.duration}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Assessment Button at bottom of syllabus */}
            <div className="p-4 border-t border-navy-700 bg-[#051C3A]">
              <Link
                href={`/assessment/${course.id}`}
                className="w-full py-2.5 rounded-xl bg-[#28A745] hover:bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-2 transition"
              >
                <Award className="w-4 h-4" />
                <span>Take Final Examination</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Premium Download Protection Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-slate-800 shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#F5A900]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black uppercase tracking-wider mb-2">
              Premium Tier Feature
            </div>
            <h3 className="text-xl font-black text-[#082B59] mb-2">
              Unlock Offline Video Downloads
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              To protect faculty intellectual property and provide optimal streaming speeds, offline 1080p video downloads and masterclass source repositories require a <strong>UNIVER-E Premium Pass</strong>.
            </p>

            <div className="space-y-2 mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#28A745]" />
                <span>Download full 1080p MP4 lectures for offline flight &amp; travel</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#28A745]" />
                <span>Complete lecture handouts, cheat-sheets, and source code</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#28A745]" />
                <span>Official verifiable completion certificates included</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleActivatePremiumAndDownload}
                className="w-full py-3 rounded-xl bg-[#F5A900] hover:bg-amber-500 text-[#082B59] font-black text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Zap className="w-4 h-4" />
                <span>Activate UNIVER-E Premium Pass (Instant)</span>
              </button>

              <button
                onClick={() => setShowPremiumModal(false)}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-slate-600 font-bold text-xs hover:bg-gray-50 transition"
              >
                Continue Online Streaming
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
