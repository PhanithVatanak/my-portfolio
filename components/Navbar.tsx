'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Sun, Moon, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from './ThemeProvider';
import { ResumeModal } from './ResumeModal';
import { usePortfolioData } from './PortfolioDataContext';
import { triggerNavAnimation } from './PageTransition';

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data } = usePortfolioData();
  const developerProfile = data.profile;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  if (pathname === '/resume' || pathname.startsWith('/admin')) return null;

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

  const handleNavClick = (targetHref?: string) => {
    triggerNavAnimation(targetHref);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-sky-100/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors print:hidden">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 group click-bounce cursor-pointer select-none"
          >
            <div className="size-9 rounded-xl bg-sky-50 dark:bg-slate-900 border border-sky-200/70 dark:border-slate-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm group-hover:scale-105 group-hover:border-sky-300 dark:group-hover:border-sky-500/50 transition-all">
              <Terminal className="w-5 h-5 group-hover:rotate-6 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-base md:text-lg font-bold font-display tracking-tight text-slate-900 dark:text-slate-50 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {developerProfile.initials} Portfolio
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center gap-2 font-medium text-sm relative">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`relative px-3.5 py-1.5 rounded-full transition-all duration-200 click-bounce cursor-pointer select-none ${
                      active
                        ? 'text-sky-600 dark:text-sky-400 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="navbar-active-pill"
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        className="absolute inset-0 rounded-full bg-sky-100/90 dark:bg-sky-500/15 border border-sky-200/80 dark:border-sky-500/30 -z-10 shadow-2xs"
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}

              {/* Admin Console Link */}
              <Link
                href="/admin"
                onClick={() => handleNavClick('/admin')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all click-bounce ${
                  pathname === '/admin'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-sky-50 dark:bg-slate-900 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-slate-700 hover:border-sky-400 hover:bg-sky-100/70'
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-sky-200 dark:border-slate-700 bg-sky-50/80 dark:bg-slate-800 text-slate-700 dark:text-sky-300 hover:border-sky-400 dark:hover:border-sky-500/50 transition-all shadow-xs cursor-pointer click-bounce"
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
              <Link
                href="/resume"
                className="flex items-center justify-center rounded-full h-10 px-5 bg-sky-600 text-white text-sm font-semibold hover:bg-sky-500 shadow-sm shadow-sky-600/25 hover:shadow-md hover:shadow-sky-600/20 transition-all click-bounce cursor-pointer hover:scale-[1.02]"
              >
                <span>Resume</span>
              </Link>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark/Light Mode"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-sky-200 dark:border-slate-700 bg-sky-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors click-bounce"
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

            {/* Custom Animated Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative size-10 rounded-xl bg-sky-50 dark:bg-slate-900 border border-sky-200/80 dark:border-slate-800 flex flex-col items-center justify-center gap-1.5 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition-all click-bounce cursor-pointer hover:border-sky-300 dark:hover:border-slate-700 shadow-xs"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="w-5 h-0.5 rounded-full bg-current block origin-center"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.15 }}
                className="w-5 h-0.5 rounded-full bg-current block origin-center"
              />
              <motion.span
                animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="w-5 h-0.5 rounded-full bg-current block origin-center"
              />
            </button>
          </div>
        </div>

        {/* Animated Mobile Dropdown Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden overflow-hidden border-t border-sky-100 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl"
            >
              <div className="px-5 py-4 flex flex-col gap-3">
                <nav className="flex flex-col gap-1 font-medium text-base">
                  {navLinks.map((link, idx) => {
                    const active = isActive(link.href);
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.2 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => {
                            handleNavClick();
                            setMobileMenuOpen(false);
                          }}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-xl font-medium text-sm sm:text-base transition-all click-bounce ${
                            active
                              ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold border border-sky-200/60 dark:border-sky-500/20'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-900'
                          }`}
                        >
                          <span>{link.name}</span>
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}

                  <motion.div
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.04, duration: 0.2 }}
                  >
                    <Link
                      href="/admin"
                      onClick={() => {
                        handleNavClick('/admin');
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl font-medium text-sm sm:text-base transition-all click-bounce ${
                        pathname === '/admin'
                          ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold border border-sky-200/60 dark:border-sky-500/20'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-900'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                        <span>Admin Console</span>
                      </span>
                    </Link>
                  </motion.div>
                </nav>

                <div className="pt-3 border-t border-sky-100 dark:border-slate-800 flex flex-col gap-2.5">
                  <Link
                    href="/resume"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-sky-600 text-white font-semibold text-sm shadow-md shadow-sky-600/20 hover:bg-sky-500 transition-all click-bounce cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Resume</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Interactive Resume Modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
