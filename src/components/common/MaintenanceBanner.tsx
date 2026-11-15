'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { AlertTriangle, Wrench, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export const MaintenanceBanner: React.FC = () => {
  const { isMaintenanceMode, isAdminAuthenticated } = useApp();

  if (!isMaintenanceMode) return null;

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-bold border-b border-amber-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <Wrench className="w-4 h-4 text-slate-950 flex-shrink-0 animate-bounce" />
          <span>
            <strong className="uppercase tracking-wider">Scheduled Maintenance Active:</strong> UNIVER-E cloud nodes are undergoing synchronization. Public registrations and course activations are temporarily queued.
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isAdminAuthenticated ? (
            <Link
              href="/admin"
              className="px-2.5 py-1 bg-slate-950 text-white rounded-lg text-[11px] font-black hover:bg-slate-900 transition flex items-center gap-1"
            >
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              <span>Root Console</span>
            </Link>
          ) : (
            <span className="px-2 py-0.5 bg-black/10 rounded text-[11px]">Admins: Authenticate at /admin/login</span>
          )}
        </div>
      </div>
    </div>
  );
};
