'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  Heart,
  LogOut,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES, DEPARTMENTS } from '@/data/categories';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUserRole, cart, searchQuery, setSearchQuery, wishlistIds } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const catRef = useRef<HTMLDivElement>(null);
  const deptRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) {
        setDepartmentsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch);
      router.push(`/courses?search=${encodeURIComponent(localSearch)}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Top Banner / Role Switcher Strip */}
      <div className="bg-[#082B59] text-white text-xs border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              India&apos;s Next-Gen Digital Education Platform
            </span>
            <span className="hidden md:inline text-navy-300">|</span>
            <span className="hidden md:inline text-gray-300">Over 500+ Industry-Certified Programs</span>
          </div>

          {/* Quick Interactive Persona Switcher for pair-programming and client demo */}
          <div className="flex items-center gap-1.5 bg-[#051C3A] px-2.5 py-0.5 rounded-full border border-navy-700">
            <span className="text-[11px] text-gray-300">Switch Persona:</span>
            <button
              onClick={() => setUserRole('student')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                user.role === 'student' ? 'bg-[#F5A900] text-[#082B59]' : 'text-gray-300 hover:text-white'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setUserRole('instructor')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                user.role === 'instructor' ? 'bg-[#F5A900] text-[#082B59]' : 'text-gray-300 hover:text-white'
              }`}
            >
              Instructor
            </button>
            <button
              onClick={() => setUserRole('admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                user.role === 'admin' ? 'bg-[#F5A900] text-[#082B59]' : 'text-gray-300 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200/80 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative w-11 h-11 flex-shrink-0">
                  <Image
                    src="/images/logo.jpg"
                    alt="UNIVER-E Logo"
                    width={44}
                    height={44}
                    className="w-full h-full object-contain rounded-lg shadow-sm"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline font-black tracking-tight text-2xl font-brand">
                    <span className="text-[#082B59]">UNIVER</span>
                    <span className="text-[#F5A900]">-E</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-semibold text-slate-500 -mt-1">
                    Digital University
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-2 ml-4">
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/') ? 'text-[#13A8E8] font-bold' : 'text-slate-700 hover:text-[#082B59]'
                  }`}
                >
                  Home
                </Link>

                <Link
                  href="/courses"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/courses') ? 'text-[#13A8E8] font-bold' : 'text-slate-700 hover:text-[#082B59]'
                  }`}
                >
                  Explore Courses
                </Link>

                {/* Categories Dropdown */}
                <div className="relative" ref={catRef}>
                  <button
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-[#082B59]"
                  >
                    <span>Categories</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {categoriesOpen && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Popular Disciplines
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {CATEGORIES.slice(0, 7).map(cat => (
                          <Link
                            key={cat.id}
                            href={`/courses?category=${encodeURIComponent(cat.name)}`}
                            onClick={() => setCategoriesOpen(false)}
                            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-[#F5F8FC] hover:text-[#082B59] transition"
                          >
                            <span>{cat.name}</span>
                            <span className="text-xs text-slate-400">{cat.coursesCount} courses</span>
                          </Link>
                        ))}
                        <Link
                          href="/categories"
                          onClick={() => setCategoriesOpen(false)}
                          className="mt-2 text-center text-xs font-semibold text-[#13A8E8] hover:underline pt-2 border-t border-gray-100"
                        >
                          View All 10+ Categories →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Departments Dropdown */}
                <div className="relative" ref={deptRef}>
                  <button
                    onClick={() => setDepartmentsOpen(!departmentsOpen)}
                    className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-[#082B59]"
                  >
                    <span>Departments</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {departmentsOpen && (
                    <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-100 py-3 px-3 z-50">
                      <div className="px-3 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Academic Faculties
                      </div>
                      {DEPARTMENTS.map(dept => (
                        <Link
                          key={dept.id}
                          href={`/departments#${dept.id}`}
                          onClick={() => setDepartmentsOpen(false)}
                          className="block px-3 py-2 rounded-lg hover:bg-[#F5F8FC] transition group"
                        >
                          <div className="text-sm font-semibold text-[#082B59] group-hover:text-[#13A8E8]">
                            {dept.name}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1">{dept.description}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/about"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/about') ? 'text-[#13A8E8] font-bold' : 'text-slate-700 hover:text-[#082B59]'
                  }`}
                >
                  About Us
                </Link>

                <Link
                  href="/contact"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/contact') ? 'text-[#13A8E8] font-bold' : 'text-slate-700 hover:text-[#082B59]'
                  }`}
                >
                  Contact
                </Link>
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Quick Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search courses"
                className="p-2 text-slate-600 hover:text-[#082B59] hover:bg-slate-100 rounded-full transition"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Button */}
              <Link
                href="/checkout"
                aria-label="Shopping Cart"
                className="relative p-2 text-slate-600 hover:text-[#082B59] hover:bg-slate-100 rounded-full transition"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F5A900] text-[#082B59] font-black text-xs rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {cart.length}
                  </span>
                )}
              </Link>

              {/* Role-specific Quick Links */}
              {user.role === 'admin' ? (
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-red-600 text-white shadow-sm hover:bg-red-700"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Panel
                </Link>
              ) : user.role === 'instructor' ? (
                <Link
                  href="/instructor/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#082B59] text-white shadow-sm hover:bg-navy-800"
                >
                  <Briefcase className="w-4 h-4" />
                  Instructor Portal
                </Link>
              ) : null}

              {/* Auth / Profile Area */}
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="hidden md:inline text-xs font-bold text-slate-800 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <span className="inline-block px-2 py-0.5 mt-1 text-[10px] font-bold uppercase rounded bg-blue-50 text-[#13A8E8]">
                        Role: {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-[#F5F8FC] hover:text-[#082B59]"
                      >
                        <GraduationCap className="w-4 h-4 text-[#13A8E8]" />
                        <span>Student Dashboard</span>
                      </Link>

                      <Link
                        href="/instructor/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-[#F5F8FC] hover:text-[#082B59]"
                      >
                        <Briefcase className="w-4 h-4 text-[#F5A900]" />
                        <span>Instructor Portal</span>
                      </Link>

                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-[#F5F8FC] hover:text-[#082B59]"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Admin Console</span>
                      </Link>

                      <Link
                        href="/certificates"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-[#F5F8FC] hover:text-[#082B59]"
                      >
                        <Award className="w-4 h-4 text-[#28A745]" />
                        <span>My Certificates</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <Link
                        href="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out / Switch</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Login / Register CTAs */}
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-bold text-[#082B59] hover:text-[#13A8E8] transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-bold bg-[#F5A900] text-[#082B59] hover:bg-[#D99500] rounded-lg transition shadow-sm hover:shadow"
                >
                  Register
                </Link>
              </div>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Global Expandable Search Drawer */}
        {searchOpen && (
          <div className="bg-[#F5F8FC] border-t border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="What do you want to learn today? (e.g. Python, AI, Web Development...)"
                  value={localSearch}
                  onChange={e => setLocalSearch(e.target.value)}
                  autoFocus
                  className="w-full pl-12 pr-28 py-3.5 text-sm sm:text-base bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A8E8] shadow-sm"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4" />
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-2 bg-[#F5A900] hover:bg-[#D99500] text-[#082B59] font-bold text-xs sm:text-sm rounded-lg transition"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <input
                type="text"
                placeholder="Search courses..."
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </form>

            <div className="space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-medium text-slate-800 hover:bg-slate-50"
              >
                Home
              </Link>
              <Link
                href="/courses"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-medium text-slate-800 hover:bg-slate-50"
              >
                Explore Courses
              </Link>
              <Link
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-medium text-slate-800 hover:bg-slate-50"
              >
                Course Categories
              </Link>
              <Link
                href="/departments"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-medium text-slate-800 hover:bg-slate-50"
              >
                University Departments
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-medium text-slate-800 hover:bg-slate-50"
              >
                Student Dashboard
              </Link>
              <Link
                href="/instructor/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-medium text-slate-800 hover:bg-slate-50"
              >
                Instructor Dashboard
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-medium text-slate-800 hover:bg-slate-50"
              >
                Admin Panel
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-medium text-slate-800 hover:bg-slate-50"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-medium text-slate-800 hover:bg-slate-50"
              >
                Contact
              </Link>
            </div>

            <div className="pt-3 border-t border-gray-100 flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-sm font-bold border border-gray-300 rounded-lg text-[#082B59]"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-sm font-bold bg-[#F5A900] text-[#082B59] rounded-lg"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar for quick student access */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg px-4 py-2 flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center text-[10px] ${
            isActive('/') ? 'text-[#13A8E8] font-bold' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>
        <Link
          href="/courses"
          className={`flex flex-col items-center text-[10px] ${
            isActive('/courses') ? 'text-[#13A8E8] font-bold' : 'text-slate-500'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span>Explore</span>
        </Link>
        <Link
          href="/dashboard"
          className={`flex flex-col items-center text-[10px] ${
            isActive('/dashboard') ? 'text-[#13A8E8] font-bold' : 'text-slate-500'
          }`}
        >
          <GraduationCap className="w-5 h-5 mb-0.5" />
          <span>My Learnings</span>
        </Link>
        <Link
          href="/checkout"
          className={`relative flex flex-col items-center text-[10px] ${
            isActive('/checkout') ? 'text-[#13A8E8] font-bold' : 'text-slate-500'
          }`}
        >
          <ShoppingCart className="w-5 h-5 mb-0.5" />
          <span>Cart</span>
          {cart.length > 0 && (
            <span className="absolute -top-1 right-2 w-4 h-4 bg-[#F5A900] text-[#082B59] font-bold text-[9px] rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Link>
      </div>
    </>
  );
};
