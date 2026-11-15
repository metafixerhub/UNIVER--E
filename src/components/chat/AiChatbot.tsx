'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Send,
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  BookOpen,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Search,
} from 'lucide-react';
import AiChatbotLogo from './AiChatbotLogo';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: string;
}

const DEFAULT_WELCOME: Message = {
  id: 'welcome-msg',
  role: 'assistant',
  content: `### Welcome to UNIVER-E AI Genius! 🎓
I am your intelligent academic assistant and **Search Anywhere** copilot, powered by **NVIDIA Nemotron 3 Ultra**.

I can help you:
- **Search & Explore Any Course:** Python, AI, Web Dev, Cybersecurity, Design, and Free Courses.
- **Academic Policies:** 30-Day Refund Guarantee (Terms §8), Exams & Passing Criteria.
- **Certificates:** How to earn and publicly verify your QR-coded credentials.
- **Admissions & Support:** Contact the secretariat at \`univer-e-services@protonmail.com\`.
- **Mobile Android App:** Download the standalone APK directly.

What would you like to search or ask today?`,
  sources: [
    '[Source: UNIVER-E Course Catalog](/courses)',
    '[Source: Master Terms & Conditions §8](/terms#sec-8)',
    '[Source: Learner Secretariat (univer-e-services@protonmail.com)](mailto:univer-e-services@protonmail.com)',
  ],
  timestamp: 'Just now',
};

const SUGGESTED_QUERIES = [
  'Search courses for Python & AI',
  'How does the 30-day refund policy work?',
  'How to earn and verify my certificate?',
  'Where can I download the Android APK?',
  'How do I contact admissions or support?',
];

export const AiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([DEFAULT_WELCOME]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen to custom window event from navbar or other buttons
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-univer-e-ai', handleOpen);
    return () => window.removeEventListener('open-univer-e-ai', handleOpen);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (data && data.reply) {
        const assistantMsg: Message = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          sources: data.sources || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error('No reply received');
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: Message = {
        id: `a-err-${Date.now()}`,
        role: 'assistant',
        content: `I am currently experiencing higher than usual traffic. You can explore our [Course Catalog](/courses), read our [Terms & 30-Day Refund Guarantee](/terms), or contact our official desk directly at [univer-e-services@protonmail.com](mailto:univer-e-services@protonmail.com).`,
        sources: [
          '[Source: UNIVER-E Course Catalog](/courses)',
          '[Source: Learner Secretariat (univer-e-services@protonmail.com)](mailto:univer-e-services@protonmail.com)',
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([DEFAULT_WELCOME]);
  };

  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Check for headings
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-[#082B59] text-sm mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-bold text-[#082B59] text-base mt-2 mb-1">
            {line.replace('## ', '')}
          </h3>
        );
      }
      // Check for bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.replace(/^[-*]\s+/, '');
        return (
          <li key={idx} className="text-xs text-slate-700 ml-4 list-disc my-0.5">
            {renderInlineMarkdown(itemText)}
          </li>
        );
      }
      // Check for numbered list
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="text-xs text-slate-700 ml-3 my-0.5 font-medium">
            {renderInlineMarkdown(line)}
          </div>
        );
      }
      // Horizontal separator
      if (line.startsWith('---')) {
        return <hr key={idx} className="my-2 border-gray-200" />;
      }
      // Sources header
      if (line.includes('Sources & References') || line.includes('Sources:')) {
        return (
          <div key={idx} className="font-bold text-[11px] text-[#082B59] uppercase tracking-wider mt-2 mb-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#13A8E8]" />
            <span>{line.replace(/\*+/g, '')}</span>
          </div>
        );
      }
      // Regular line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs text-slate-700 leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (text: string) => {
    // Handle Markdown links [text](url)
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(renderBoldCode(text.substring(lastIndex, match.index)));
      }
      const label = match[1];
      const href = match[2];

      if (href.startsWith('mailto:')) {
        parts.push(
          <a
            key={match.index}
            href={href}
            className="text-[#13A8E8] font-bold hover:underline font-mono"
          >
            {label}
          </a>
        );
      } else {
        parts.push(
          <Link
            key={match.index}
            href={href}
            onClick={() => {
              if (href.startsWith('/')) setIsOpen(false);
            }}
            className="text-[#13A8E8] font-bold hover:underline inline-flex items-center gap-0.5"
          >
            <span>{label}</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </Link>
        );
      }
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(renderBoldCode(text.substring(lastIndex)));
    }

    return parts.length > 0 ? parts : renderBoldCode(text);
  };

  const renderBoldCode = (str: string) => {
    // Handle **bold** and `code`
    const boldParts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return boldParts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1 py-0.5 bg-slate-100 rounded text-amber-700 font-mono text-[11px]">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open UNIVER-E AI Assistant"
            className="group flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-full text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
            style={{
              background: 'linear-gradient(135deg, #082B59 0%, #0D3B75 35%, #13A8E8 75%, #F5A900 100%)',
            }}
          >
            <AiChatbotLogo size="sm" showBadge={true} pulsing={true} />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-amber-300 font-bold tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                Search Anywhere
              </span>
              <span className="text-xs font-black tracking-tight text-white">
                UNIVER-E AI Copilot
              </span>
            </div>
            <span className="ml-1 w-2 h-2 rounded-full bg-[#28A745] animate-pulse" />
          </button>
        )}
      </div>

      {/* Interactive Chat Window Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isExpanded
              ? 'inset-4 sm:inset-10'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[460px] h-[640px] max-h-[90vh]'
          }`}
        >
          <div className="w-full h-full bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden relative">
            
            {/* Header with UNIVER-E Color Gradation */}
            <div
              className="p-4 sm:p-5 text-white flex items-center justify-between relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #082B59 0%, #0D3B75 40%, #13A8E8 85%, #F5A900 100%)',
              }}
            >
              <div className="flex items-center gap-3 relative z-10">
                <AiChatbotLogo size="md" showBadge={false} />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base tracking-tight font-brand text-white">
                      UNIVER-E AI Genius
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold text-amber-300">
                      Nemotron 3 Ultra
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#28A745] animate-pulse"></span>
                    <span>Search Anywhere • Academic Copilot</span>
                  </div>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1.5 relative z-10">
                <button
                  onClick={handleClear}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Collapse' : 'Expand full screen'}
                  aria-label="Toggle Expand"
                  className="hidden sm:inline-flex p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close AI Assistant"
                  aria-label="Close AI Assistant"
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Suggestions Banner (Shown initially or on top) */}
            <div className="bg-[#F5F8FC] border-b border-gray-200/80 px-4 py-2.5 flex items-center gap-1.5 overflow-x-auto custom-scrollbar flex-shrink-0">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
                <Search className="w-3 h-3 text-[#13A8E8]" />
                Try:
              </span>
              {SUGGESTED_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-[11px] font-medium text-slate-700 hover:text-[#13A8E8] border border-gray-200 hover:border-[#13A8E8] whitespace-nowrap transition flex-shrink-0 shadow-2xs"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50 custom-scrollbar">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 flex-shrink-0 mt-1">
                      <AiChatbotLogo size="sm" showBadge={false} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-sm space-y-2 ${
                      msg.role === 'user'
                        ? 'bg-[#082B59] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-gray-200 rounded-tl-none'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-xs sm:text-sm font-medium leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="space-y-1">{renderFormattedContent(msg.content)}</div>
                    )}

                    <div
                      className={`text-[10px] flex items-center justify-between pt-1 border-t ${
                        msg.role === 'user'
                          ? 'border-white/10 text-slate-300'
                          : 'border-gray-100 text-slate-400'
                      }`}
                    >
                      <span>{msg.role === 'assistant' ? 'UNIVER-E AI • Nemotron' : 'You'}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-7 h-7 flex-shrink-0">
                    <AiChatbotLogo size="sm" showBadge={false} pulsing={true} />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#13A8E8] animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-[#F5A900] animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-[#28A745] animate-bounce [animation-delay:0.4s]" />
                    <span className="text-xs text-slate-500 font-medium ml-1">
                      Nemotron thinking &amp; searching...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 sm:p-4 bg-white border-t border-gray-200 space-y-2">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  placeholder="Ask anything or search courses, syllabus, certificates..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={loading}
                  className="w-full pl-4 pr-12 py-3 rounded-2xl bg-slate-50 border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#13A8E8] text-slate-900 placeholder-slate-400"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="absolute right-1.5 w-9 h-9 rounded-xl bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed shadow"
                >
                  <Send className="w-4 h-4 font-bold" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span>⚡ Powered by NVIDIA Nemotron 3 Ultra</span>
                <span>Grounded with UNIVER-E Knowledge Base</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AiChatbot;
