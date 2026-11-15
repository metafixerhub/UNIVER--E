'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Timer,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { COURSES } from '@/data/courses';
import { useApp } from '@/context/AppContext';
import { CertificateModal } from '@/components/common/CertificateModal';
import { Certificate } from '@/types';

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const { user, issueCertificate, showToast } = useApp();

  const courseId = params?.courseId as string;
  const course = COURSES.find(c => c.id === courseId || c.slug === courseId) || COURSES[0];
  const quiz = course.quiz || {
    title: `${course.title} Final Examination`,
    passingScore: 70,
    timeLimitMinutes: 10,
    questions: [
      {
        id: 'dq1',
        question: `What is the principal best practice emphasized throughout the ${course.title} curriculum?`,
        options: [
          'Writing modular, readable and maintainable code adhering to industry standards',
          'Deploying untested code directly into production databases without backups',
          'Memorizing syntax without understanding fundamental computational logic',
          'Ignoring security, encryption and role-based access control guidelines',
        ],
        correctAnswer: 0,
        explanation: 'Professional engineering prioritizes maintainability, modular architecture, and testing.',
      },
      {
        id: 'dq2',
        question: 'Which of the following describes the key milestone required to earn a UNIVER-E verifiable certificate?',
        options: [
          'Fulfilling all curriculum modules and scoring 70% or higher on the examination',
          'Only watching the introductory video trailer',
          'Posting in the social forum at least 100 times',
          'None of the above',
        ],
        correctAnswer: 0,
        explanation: 'Candidates must complete practical curriculum lectures and pass the final exam.',
      },
    ],
  };

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scorePercent, setScorePercent] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(quiz.timeLimitMinutes * 60);
  const [newCertificate, setNewCertificate] = useState<Certificate | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / quiz.questions.length) * 100);
    setScorePercent(percent);
    setIsSubmitted(true);

    if (percent >= quiz.passingScore) {
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Fallback gracefully
      }
      const cert = issueCertificate(course.id, percent);
      setNewCertificate(cert);
    } else {
      showToast('You scored below 70%. Review the answers and retry!');
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQIndex(0);
    setSecondsRemaining(quiz.timeLimitMinutes * 60);
    setNewCertificate(null);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const currentQ = quiz.questions[currentQIndex];

  return (
    <div className="bg-[#F5F8FC]/60 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Exam Header */}
        <div className="bg-[#082B59] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Proctored Certification Assessment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{quiz.title}</h1>
            <p className="text-xs text-slate-300 mt-1">Course: {course.title}</p>
          </div>

          {!isSubmitted && (
            <div className="bg-navy-950/80 border border-navy-700 px-4 py-2.5 rounded-2xl flex items-center gap-3">
              <Timer className="w-5 h-5 text-[#F5A900] animate-pulse" />
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Time Left</span>
                <span className="font-mono text-lg font-bold text-white">
                  {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Assessment Card */}
        {!isSubmitted ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm space-y-6">
            {/* Progress indicators */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold border-b border-gray-100 pb-4">
              <span>
                Question {currentQIndex + 1} of {quiz.questions.length}
              </span>
              <span>
                Answered: {Object.keys(selectedAnswers).length} / {quiz.questions.length}
              </span>
            </div>

            {/* Current Question */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-[#082B59] leading-snug">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition flex items-center gap-3.5 ${
                        isSelected
                          ? 'border-[#13A8E8] bg-sky-50/70 text-[#082B59] font-bold shadow-sm'
                          : 'border-gray-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-[#13A8E8] bg-[#13A8E8]' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <button
                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-40 flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentQIndex < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  className="px-5 py-2.5 rounded-xl bg-[#082B59] hover:bg-navy-800 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2.5 rounded-xl bg-[#28A745] hover:bg-emerald-600 text-white text-xs font-black transition flex items-center gap-2 shadow"
                >
                  <span>Submit Examination</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results Card */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-8">
            <div className="text-center space-y-3 pb-6 border-b border-gray-100">
              <div
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
                  scorePercent >= quiz.passingScore
                    ? 'bg-emerald-100 text-[#28A745]'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {scorePercent >= quiz.passingScore ? (
                  <Award className="w-10 h-10" />
                ) : (
                  <AlertCircle className="w-10 h-10" />
                )}
              </div>

              <h2 className="text-3xl font-black text-[#082B59]">
                {scorePercent >= quiz.passingScore ? 'Congratulations! You Passed!' : 'Assessment Not Cleared'}
              </h2>

              <p className="text-sm text-slate-600">
                You scored <strong className="text-xl text-[#082B59]">{scorePercent}%</strong> (Required:{' '}
                {quiz.passingScore}%)
              </p>

              {scorePercent >= quiz.passingScore && newCertificate && (
                <div className="pt-2">
                  <button
                    onClick={() => setNewCertificate(newCertificate)}
                    className="px-6 py-3 rounded-2xl bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-black text-sm tracking-wide shadow-md transition"
                  >
                    View Official Certificate →
                  </button>
                </div>
              )}
            </div>

            {/* Answer Explanations Review */}
            <div className="space-y-4">
              <h4 className="text-lg font-black text-[#082B59]">Review & Explanations</h4>
              {quiz.questions.map((q, idx) => {
                const userChoice = selectedAnswers[q.id];
                const isCorrect = userChoice === q.correctAnswer;

                return (
                  <div key={q.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-[#28A745]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-slate-800">
                        {idx + 1}. {q.question}
                      </span>
                    </div>

                    <div className="pl-6 space-y-1">
                      <p className="text-slate-600">
                        Your answer:{' '}
                        <span className={isCorrect ? 'text-[#28A745] font-bold' : 'text-red-500 font-bold'}>
                          {userChoice !== undefined ? q.options[userChoice] : 'Not Answered'}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-slate-600">
                          Correct answer:{' '}
                          <span className="text-[#28A745] font-bold">{q.options[q.correctAnswer]}</span>
                        </p>
                      )}
                      <p className="text-slate-500 italic pt-1">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={handleRetry}
                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-bold text-slate-700 flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Exam</span>
              </button>

              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-[#082B59] hover:bg-navy-800 text-white text-xs font-bold"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {newCertificate && (
        <CertificateModal
          certificate={newCertificate}
          isOpen={!!newCertificate}
          onClose={() => setNewCertificate(null)}
        />
      )}
    </div>
  );
}
