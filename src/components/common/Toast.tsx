'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, Bell } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-8 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#082B59] text-white px-4 py-3 rounded-2xl shadow-2xl border border-navy-700 flex items-center gap-3 max-w-md">
        <div className="w-8 h-8 rounded-xl bg-[#F5A900] text-[#082B59] flex items-center justify-center flex-shrink-0 font-bold">
          <Bell className="w-4 h-4" />
        </div>
        <p className="text-xs sm:text-sm font-semibold pr-2">{toastMessage}</p>
      </div>
    </div>
  );
};
