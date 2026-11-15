'use client';

import React from 'react';

interface AiChatbotLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
  pulsing?: boolean;
}

export const AiChatbotLogo: React.FC<AiChatbotLogoProps> = ({
  size = 'md',
  showBadge = true,
  className = '',
  pulsing = true,
}) => {
  const dimensions = {
    sm: { box: 32, icon: 20 },
    md: { box: 44, icon: 28 },
    lg: { box: 56, icon: 36 },
    xl: { box: 72, icon: 48 },
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      {/* Outer Gradient Ring with UNIVER-E Color Gradation */}
      <div
        className="rounded-2xl p-[2px] transition-transform duration-300 shadow-md group-hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #082B59 0%, #13A8E8 40%, #F5A900 80%, #28A745 100%)',
        }}
      >
        <div
          className="rounded-2xl bg-[#082B59] flex items-center justify-center relative overflow-hidden"
          style={{ width: dimensions.box, height: dimensions.box }}
        >
          {/* Subtle Cyber Grid Overlay */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#13A8E8_1px,transparent_1px)] [background-size:6px_6px]" />

          {/* Custom SVG Chatbot Face & Academic Mortarboard fusion */}
          <svg
            width={dimensions.icon}
            height={dimensions.icon}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            <defs>
              <linearGradient id="univerAiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#13A8E8" />
                <stop offset="50%" stopColor="#F5A900" />
                <stop offset="100%" stopColor="#28A745" />
              </linearGradient>
              <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#082B59" />
                <stop offset="100%" stopColor="#13A8E8" />
              </linearGradient>
              <filter id="aiGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Academic Mortarboard Cap */}
            <path
              d="M24 6L6 14L24 22L42 14L24 6Z"
              fill="url(#capGrad)"
              stroke="#13A8E8"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Tassel */}
            <path d="M38 15V23C38 24.5 39 26 40 26" stroke="#F5A900" strokeWidth="2" strokeLinecap="round" />
            <circle cx="40" cy="27" r="1.5" fill="#F5A900" />

            {/* Robot Head Body */}
            <rect
              x="10"
              y="20"
              width="28"
              height="22"
              rx="6"
              fill="#082B59"
              stroke="url(#univerAiGrad)"
              strokeWidth="2"
            />

            {/* Neural Circuit Antenna Nodes */}
            <line x1="14" y1="20" x2="14" y2="18" stroke="#13A8E8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="14" cy="17" r="1.5" fill="#13A8E8" />
            <line x1="34" y1="20" x2="34" y2="18" stroke="#F5A900" strokeWidth="2" strokeLinecap="round" />
            <circle cx="34" cy="17" r="1.5" fill="#F5A900" />

            {/* Robot Eyes (Glowing Optics) */}
            <circle cx="18" cy="29" r="3.5" fill="#13A8E8" filter="url(#aiGlow)" />
            <circle cx="18" cy="29" r="1.5" fill="#FFFFFF" />
            <circle cx="30" cy="29" r="3.5" fill="#F5A900" filter="url(#aiGlow)" />
            <circle cx="30" cy="29" r="1.5" fill="#FFFFFF" />

            {/* Intelligent Waveform Mouth */}
            <path
              d="M17 36C19 38 21 39 24 39C27 39 29 38 31 36"
              stroke="#28A745"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Online Status Indicator (Leaf Green) */}
      {showBadge && (
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          {pulsing && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#28A745] opacity-75"></span>
          )}
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#28A745] border-2 border-white"></span>
        </span>
      )}
    </div>
  );
};

export default AiChatbotLogo;
