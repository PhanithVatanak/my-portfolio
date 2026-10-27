'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function triggerNavAnimation(targetHref?: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('spv-nav-start', { detail: { targetHref } }));
  }
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [navStatus, setNavStatus] = useState<'idle' | 'loading' | 'completing'>('idle');
  const [progress, setProgress] = useState(0);
  const prevPathRef = useRef(pathname);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startNavigation = (targetHref?: string) => {
    // If user clicked link to current page, smooth scroll to top instead of loading
    if (targetHref && typeof window !== 'undefined') {
      const current = window.location.pathname;
      if (current === targetHref || (targetHref === '/' && current === '')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    stopInterval();
    setNavStatus('loading');
    setProgress(32);

    // Continuous progressive trickling so progress bar never vanishes while waiting for Next.js
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 55) return prev + 12;
        if (prev < 72) return prev + 5;
        if (prev < 88) return prev + 2;
        return 88; // Stays active at 88% with scanning pulse until Next.js completes navigation
      });
    }, 180);

    // Failsafe timeout after 8 seconds
    timeoutRef.current = setTimeout(() => {
      stopInterval();
      setNavStatus('idle');
      setProgress(0);
    }, 8000);
  };

  // Global click listener for internal route navigation
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        !href.startsWith('/#') &&
        !target.getAttribute('download') &&
        target.getAttribute('target') !== '_blank'
      ) {
        startNavigation(href);
      }
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => document.removeEventListener('click', handleDocumentClick, true);
  }, []);

  // Listen for instant click navigation events from navbar and links
  useEffect(() => {
    const handleStartNav = (e: Event) => {
      const customEvent = e as CustomEvent<{ targetHref?: string }>;
      startNavigation(customEvent.detail?.targetHref);
    };
    window.addEventListener('spv-nav-start', handleStartNav);
    return () => window.removeEventListener('spv-nav-start', handleStartNav);
  }, []);

  // Detect when route pathname actually changes
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;

      // Route change completed!
      stopInterval();
      setNavStatus('completing');
      setProgress(100);

      window.scrollTo({ top: 0, behavior: 'instant' });

      // After completing to 100%, smoothly fade out
      const timer = setTimeout(() => {
        setNavStatus('idle');
        setProgress(0);
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const isVisible = navStatus !== 'idle';

  return (
    <>
      {/* Global Top Route Navigation Progress & Continuous Laser Bar */}
      <AnimatePresence>
        {isVisible && (
          <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-1 bg-transparent">
            {/* Luminous laser line advancing with real progress */}
            <motion.div
              initial={{ width: '0%', opacity: 1 }}
              animate={{
                width: `${progress}%`,
                opacity: navStatus === 'completing' ? [1, 1, 0] : 1,
              }}
              exit={{ opacity: 0 }}
              transition={{
                width: { duration: navStatus === 'completing' ? 0.2 : 0.28, ease: 'easeOut' },
                opacity: { duration: 0.25, delay: navStatus === 'completing' ? 0.15 : 0 },
              }}
              className="h-full bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-500 shadow-[0_0_18px_rgba(56,189,248,1)] relative"
            >
              {/* Pulsing leading laser particle */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 size-3.5 rounded-full bg-cyan-200 blur-[1px] shadow-[0_0_12px_#38bdf8] animate-pulse" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Status Pill while loading (persists across 2-3s route latency) */}
      <AnimatePresence>
        {navStatus === 'loading' && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.92 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed top-4 right-4 sm:right-6 z-[9999] pointer-events-none flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/95 dark:bg-slate-900/95 border border-sky-400/50 text-white text-xs font-mono shadow-2xl shadow-sky-500/25 backdrop-blur-md"
          >
            <div className="w-3.5 h-3.5 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin shrink-0" />
            <span className="font-semibold tracking-wider text-sky-300">LOADING...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Animated Page Content */}
      <motion.div
        key={pathname}
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 10, filter: 'blur(3px)' }
        }
        animate={{
          opacity: 1,
          y: 0,
          filter: 'none',
          transition: {
            duration: 0.32,
            ease: [0.16, 1, 0.3, 1],
          },
        }}
        exit={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: -8, filter: 'blur(2px)' }
        }
        className="flex-1 flex flex-col w-full relative"
      >
        {children}
      </motion.div>
    </>
  );
}
