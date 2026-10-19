'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Code2, Sun, Moon, Menu, X, Download, Shield } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { ResumeModal } from './ResumeModal';
import { usePortfolioData } from './PortfolioDataContext';

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data } = usePortfolioData();
  const developerProfile = data.profile;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-sky-100/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="size-9 rounded-xl bg-sky-50 dark:bg-slate-900 border border-sky-200/70 dark:border-slate-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm group-hover:scale-105 transition-all">
              <Terminal className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base md:text-lg font-bold font-display tracking-tight text-slate-900 dark:text-slate-50 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {developerProfile.initials} Portfolio
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center gap-7 font-medium text-sm">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors relative py-1 ${
                      active
                        ? 'text-sky-600 dark:text-sky-400 font-semibold after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-sky-600 dark:after:bg-sky-400 after:rounded-full'
                        : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Admin Console Link */}
              <Link
                href="/admin"
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  pathname === '/admin'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-sky-50 dark:bg-slate-900 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-slate-700 hover:border-sky-400'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                <span>Admin Console</span>
              </Link>
            </nav>

            <div className="flex items-center gap-3 pl-2 border-l border-sky-100 dark:border-slate-800">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Dark/Light Mode"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-sky-200 dark:border-slate-700 bg-sky-50/80 dark:bg-slate-800 text-slate-700 dark:text-sky-300 hover:border-sky-400 dark:hover:border-sky-500/50 transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              {/* Resume CTA Button */}
              <button
                onClick={() => setResumeOpen(true)}
                className="flex items-center justify-center rounded-full h-10 px-5 bg-sky-600 text-white text-sm font-semibold hover:bg-sky-500 shadow-sm shadow-sky-600/25 hover:shadow-md hover:shadow-sky-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Download Resume</span>
              </button>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark/Light Mode"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-sky-200 dark:border-slate-700 bg-sky-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>Dark</span>
                </>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 hover:text-sky-600 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-sky-100 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg px-6 py-5 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col gap-3 font-medium text-base">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-1.5 transition-colors ${
                    isActive(link.href)
                      ? 'text-sky-600 dark:text-sky-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 flex items-center gap-2 text-sky-600 dark:text-sky-400 font-semibold"
              >
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                Admin Console
              </Link>
            </nav>
            <div className="pt-3 border-t border-sky-100 dark:border-slate-800 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setResumeOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-sky-600 text-white font-semibold text-sm shadow-md shadow-sky-600/20"
              >
                <Download className="w-4 h-4" />
                <span>Resume / CV</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Interactive Resume Modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
