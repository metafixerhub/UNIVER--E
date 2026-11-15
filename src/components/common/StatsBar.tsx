import React from 'react';
import { GraduationCap, Users, UserCheck, Award, TrendingUp } from 'lucide-react';

export const StatsBar: React.FC = () => {
  const stats = [
    {
      label: 'Courses',
      value: '500+',
      icon: GraduationCap,
      color: 'text-[#082B59]',
      bg: 'bg-blue-50',
    },
    {
      label: 'Learners',
      value: '50K+',
      icon: Users,
      color: 'text-[#F5A900]',
      bg: 'bg-amber-50',
    },
    {
      label: 'Instructors',
      value: '200+',
      icon: UserCheck,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    },
    {
      label: 'Certificates',
      value: '25K+',
      icon: Award,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      label: 'Learner Satisfaction',
      value: '98%',
      icon: TrendingUp,
      color: 'text-[#13A8E8]',
      bg: 'bg-sky-50',
    },
  ];

  return (
    <div className="bg-white border-y border-gray-100 shadow-sm py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5 pt-4 md:pt-0 md:px-4 justify-center md:justify-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#082B59] tracking-tight">{item.value}</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
