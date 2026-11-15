import React from 'react';
import Link from 'next/link';
import {
  Cpu,
  Code2,
  ShieldCheck,
  Palette,
  Megaphone,
  TrendingUp,
  FlaskConical,
  MessageSquareText,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';
import { Category } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Code2,
  ShieldCheck,
  Palette,
  Megaphone,
  TrendingUp,
  FlaskConical,
  MessageSquareText,
  Sparkles,
  LayoutGrid,
};

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const IconComponent = iconMap[category.icon] || LayoutGrid;

  return (
    <Link
      href={
        category.id === 'more'
          ? '/categories'
          : `/courses?category=${encodeURIComponent(category.name)}`
      }
      className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-[#13A8E8]/40 transition group"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition duration-300"
        style={{ backgroundColor: `${category.color}15`, color: category.color }}
      >
        <IconComponent className="w-7 h-7" />
      </div>

      <h4 className="text-xs sm:text-sm font-bold text-[#082B59] group-hover:text-[#13A8E8] transition leading-snug line-clamp-2">
        {category.name}
      </h4>

      <span className="text-[11px] text-slate-400 font-medium mt-1">
        {category.coursesCount} Courses
      </span>
    </Link>
  );
};
