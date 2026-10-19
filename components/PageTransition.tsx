'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [isNavigating, setIsNavigating] = useState(false);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Detect route change
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setIsNavigating(true);

      // Smooth scroll to top of window on route change
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Reset loading progress bar after smooth enter duration
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 420);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <>
      {/* Global Top Route Navigation Progress & Loading Bar */}
      <AnimatePresence>
        {isNavigating && (
          <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[3px] bg-transparent">
            {/* Luminous laser line sweeping across the screen */}
            <motion.div
              initial={{ width: '0%', opacity: 1 }}
              animate={{ width: ['0%', '75%', '100%'], opacity: [1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{
                width: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.2, delay: 0.3 },
              }}
              className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500 shadow-[0_0_14px_rgba(56,189,248,0.9)]"
            />
            {/* Subtle glow particle trailing the progress head */}
            <motion.div
              initial={{ left: '0%', opacity: 1 }}
              animate={{ left: '100%', opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 size-3 -translate-y-1/3 rounded-full bg-cyan-300 blur-[2px] shadow-[0_0_8px_#38bdf8]"
            />
          </div>
        )}
      </AnimatePresence>

      {/* Main Animated Page Content */}
      <motion.div
        key={pathname}
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 12, filter: 'blur(3px)' }
        }
        animate={{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: {
            duration: 0.34,
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
