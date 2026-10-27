'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUp,
  Download,
  Printer,
  FileCheck2,
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  Camera,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeContent } from '@/components/ResumeContent';
import { usePortfolioData } from '@/components/PortfolioDataContext';
import { useToast } from '@/components/ToastContext';
import { useTheme } from '@/components/ThemeProvider';
import { downloadResumeAsPdf } from '@/lib/pdfDownload';

export default function StandaloneResumePage() {
  const { data } = usePortfolioData();
  const developerProfile = data.profile;
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [isDownloading, setIsDownloading] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [includePhoto, setIncludePhoto] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const docHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        document.body.scrollHeight - window.innerHeight,
        1
      );
      const progress = Math.min(100, Math.max(0, Math.round((scrollY / docHeight) * 100)));
      setScrollProgress(progress);
      // Appears immediately when scrolling down just a tiny little bit (> 20px), hides when at the very top
      setShowScrollTop(scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('spv_resume_include_photo');
      if (saved !== null) {
        setIncludePhoto(saved === 'true');
      }
    } catch {
      // ignore
    }
  }, []);

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `${developerProfile.name.replace(/\s+/g, '_')}_Resume`;

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);
    }, 100);
  };

  const handleDownloadPdf = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    showToast('Rendering high-resolution A4 PDF dossier...', 'info');

    try {
      const fileName = `${developerProfile.name.replace(/\s+/g, '_')}_Resume.pdf`;
      const success = await downloadResumeAsPdf('resume-printable-area', fileName);

      if (success) {
        showToast('Resume PDF downloaded successfully!', 'success');
      } else {
        showToast("Opening print dialog — select 'Save as PDF' to save your file.", 'info');
        handlePrint();
      }
    } catch (err) {
      console.error('PDF export error:', err);
      showToast("Opening print dialog — select 'Save as PDF' to save your file.", 'info');
      handlePrint();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${developerProfile.name} - Executive Resume (A4)`,
          text: `Curriculum Vitae of ${developerProfile.name} (${developerProfile.role})`,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Resume link copied to clipboard!', 'success');
    }
  };

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.1, 1.3));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.1, 0.7));
  const handleZoomReset = () => setZoomScale(1);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-200/80 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Full-Width Sleek Sticky Navigation Bar */}
      <header className="print:hidden w-full sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 border-b border-slate-300/80 dark:border-slate-800 shadow-xs backdrop-blur-md">
        <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 overflow-x-auto">
          {/* Left Controls: Portfolio Link + Photo Checkbox + A4 Badge */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300/80 dark:border-slate-700 transition-colors shrink-0 whitespace-nowrap click-bounce"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Portfolio</span>
            </Link>

            <div className="hidden sm:block h-4 w-px bg-slate-300/80 dark:bg-slate-700 shrink-0" />

            {/* Include Profile Photo Checkbox Option */}
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300/80 dark:border-slate-700 transition-colors cursor-pointer select-none shrink-0 whitespace-nowrap click-bounce">
              <input
                type="checkbox"
                checked={includePhoto}
                onChange={(e) => {
                  const val = e.target.checked;
                  setIncludePhoto(val);
                  try {
                    localStorage.setItem('spv_resume_include_photo', val ? 'true' : 'false');
                  } catch {
                    // ignore
                  }
                }}
                className="size-3.5 rounded text-sky-600 focus:ring-sky-500 cursor-pointer accent-sky-600"
              />
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span className="whitespace-nowrap">Include Photo</span>
              </span>
            </label>

            <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 pl-1 shrink-0 whitespace-nowrap">
              <FileCheck2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span className="font-semibold whitespace-nowrap">ISO 216 A4 Preview</span>
            </div>
          </div>

          {/* Center: Zoom Controls */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-300/80 dark:border-slate-700 shrink-0">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5 font-bold text-slate-700 dark:text-slate-300 min-w-[42px] text-center whitespace-nowrap">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomScale !== 1 && (
              <button
                type="button"
                onClick={handleZoomReset}
                className="p-1 rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors ml-0.5 cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Right: Action CTAs (Share, Theme, Print, Download) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300/80 dark:border-slate-700 transition-colors cursor-pointer shrink-0 click-bounce"
              title="Toggle Desk Lighting (Dark / Light)"
              aria-label="Toggle Desk Theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300/80 dark:border-slate-700 transition-colors cursor-pointer shrink-0 whitespace-nowrap click-bounce"
              title="Share Resume Link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline whitespace-nowrap">Share</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300/80 dark:border-slate-700 transition-colors cursor-pointer shrink-0 whitespace-nowrap click-bounce"
              title="Print or Save as PDF via native browser dialog"
            >
              <Printer className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span className="whitespace-nowrap">Print / Save as PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-white text-xs font-semibold transition-all shadow-sm shadow-sky-600/30 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shrink-0 whitespace-nowrap click-bounce"
              title="Download direct high-resolution A4 PDF file"
            >
              {isDownloading ? (
                <div className="size-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span className="whitespace-nowrap">{isDownloading ? 'Generating...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main A4 Canvas Desk Container */}
      <main className="w-full flex-1 flex justify-center items-start py-6 sm:py-10 px-2 sm:px-6 print:p-0 print:m-0 print:w-full overflow-x-auto">
        <div
          className="w-full max-w-[860px] print:shadow-none print:border-none print:m-0 print:p-0 print:w-full shadow-[0_20px_50px_rgba(0,0,0,0.22)] border border-slate-300/80 rounded-sm bg-white overflow-hidden transition-transform duration-200 origin-top"
          style={{
            transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined,
          }}
        >
          <ResumeContent zoomLevel="normal" includePhoto={includePhoto} />
        </div>
      </main>

      {/* Subtle A4 document indicator footer */}
      <aside className="print:hidden pb-8 text-center text-xs text-slate-500 font-mono">
        <p className="flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Rendered in standardized ISO 216 A4 format (210mm × 297mm) • 100% WYSIWYG Print Parity</span>
        </p>
      </aside>

      {/* Floating Animated Scroll to Top Button (Portaled directly to document.body for true screen-fixed positioning) */}
      {mounted &&
        createPortal(
          <div
            className={`print:hidden fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[9999] flex items-center gap-2 select-none transition-all duration-300 ${
              showScrollTop
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
            }`}
          >
            {/* Scroll depth percentage pill badge */}
            <div className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold border border-slate-300/80 dark:border-slate-700 shadow-lg backdrop-blur-md">
              <span>{scrollProgress}%</span>
            </div>

            {/* Circular Progress Ring + Animated Arrow Button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="relative size-12 sm:size-13 rounded-full bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-2xl shadow-sky-900/25 dark:shadow-sky-500/25 border-2 border-slate-200 dark:border-slate-700/80 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer group click-bounce"
              title={`Scroll to top (${scrollProgress}% scrolled)`}
              aria-label={`Scroll to top (${scrollProgress}% scrolled)`}
            >
              {/* SVG circular progress track & indicator */}
              <svg className="absolute inset-0 size-full -rotate-90 pointer-events-none p-1" viewBox="0 0 48 48">
                {/* Background track */}
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="3.5"
                />
                {/* Dynamic progress stroke */}
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  className="stroke-sky-600 dark:stroke-sky-400 transition-all duration-150"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={125.66}
                  strokeDashoffset={125.66 - (scrollProgress / 100) * 125.66}
                />
              </svg>

              {/* Animated bouncing arrow (1.6s duration loop) */}
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10 flex items-center justify-center"
              >
                <ArrowUp className="w-5 h-5 text-sky-600 dark:text-sky-400 group-hover:-translate-y-0.5 transition-transform" />
              </motion.div>
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}
