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
} from 'lucide-react';
import { COURSES } from '@/data/courses';
import { useApp } from '@/context/AppContext';
import { Lesson } from '@/types';

export default function LearningPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { user, markLessonComplete, getCourseProgress, showToast } = useApp();

  const courseId = params?.courseId as string;
  const course = COURSES.find(c => c.id === courseId || c.slug === courseId) || COURSES[0];

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
  const [activeToolTab, setActiveToolTab] = useState<'overview' | 'notes' | 'resources' | 'discussion'>('overview');
  const [studentNotes, setStudentNotes] = useState('My personal notes for this lesson...');

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
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-slate-300">Progress:</span>
            <div className="w-32 bg-navy-900 h-2 rounded-full overflow-hidden border border-navy-700">
              <div
                className="bg-[#28A745] h-full transition-all duration-300"
                style={{ width: `${courseProgress}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-[#28A745]">{courseProgress}%</span>
          </div>

          <Link
            href={`/assessment/${course.id}`}
            className="px-3.5 py-1.5 rounded-lg bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-xs flex items-center gap-1.5 transition shadow"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Final Exam & Cert</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Syllabus"
            className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-white transition lg:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Body: Video Player & Syllabus Drawer */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left: Video Cinema & Lesson Controls */}
        <div className="flex-1 flex flex-col bg-black overflow-y-auto">
          {/* Video Container */}
          <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center group">
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

          {/* Tools Area: Overview, Notes, Resources, Q&A */}
          <div className="bg-white text-slate-800 p-6 flex-1">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-4">
              <button
                onClick={() => setActiveToolTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeToolTab === 'overview'
                    ? 'bg-[#082B59] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Overview & Summary
              </button>
              <button
                onClick={() => setActiveToolTab('notes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeToolTab === 'notes'
                    ? 'bg-[#082B59] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                My Notes
              </button>
              <button
                onClick={() => setActiveToolTab('resources')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeToolTab === 'resources'
                    ? 'bg-[#082B59] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Download Resources
              </button>
              <button
                onClick={() => setActiveToolTab('discussion')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
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
              <div className="space-y-2">
                <h4 className="text-base font-bold text-[#082B59]">Lecture Materials</h4>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <FileText className="w-4 h-4 text-[#13A8E8]" />
                    <span>Lecture_Handout_CheatSheet.pdf (2.4 MB)</span>
                  </div>
                  <button
                    onClick={() => showToast('Downloading handout PDF...')}
                    className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-slate-700 text-xs flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            )}

            {activeToolTab === 'discussion' && (
              <div className="space-y-3">
                <h4 className="text-base font-bold text-[#082B59]">Student Community Q&A</h4>
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
    </div>
  );
}
