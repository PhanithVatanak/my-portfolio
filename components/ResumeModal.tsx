'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  X,
  Download,
  Printer,
  ExternalLink,
  FileCheck2,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Camera,
  ArrowUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolioData } from '@/components/PortfolioDataContext';
import { useToast } from './ToastContext';
import { ResumeContent } from './ResumeContent';
import { downloadResumeAsPdf } from '@/lib/pdfDownload';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const { data } = usePortfolioData();
  const developerProfile = data.profile;
  const { showToast } = useToast();

  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<'normal' | 'large'>('normal');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [includePhoto, setIncludePhoto] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleModalScroll = () => {
    if (scrollContainerRef.current) {
      setShowScrollTop(scrollContainerRef.current.scrollTop > 40);
    }
  };

  const scrollToModalTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('spv_resume_include_photo');
      if (saved !== null) {
        setIncludePhoto(saved === 'true');
      }
    } catch {
      // ignore
    }
  }, []);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, onClose]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handlePrint = () => {
    const originalTitle = document.title;
    const cleanFileName = `${developerProfile.name.replace(/\s+/g, '_')}_Resume`;
    document.title = cleanFileName;

    // Temporarily unlock body overflow so browser can paginate entire document
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'visible';

    const restore = () => {
      document.title = originalTitle;
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = prevOverflow || 'unset';
      }
      window.removeEventListener('afterprint', restore);
    };

    window.addEventListener('afterprint', restore);

    setTimeout(() => {
      window.print();
      setTimeout(restore, 1500);
    }, 120);
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    showToast('Generating high-resolution PDF file...', 'info');

    const cleanFileName = `${developerProfile.name.replace(/\s+/g, '_')}_Resume.pdf`;
    const success = await downloadResumeAsPdf('resume-printable-area', cleanFileName);

    setIsDownloadingPdf(false);

    if (success) {
      showToast('Resume PDF downloaded successfully!', 'success');
    } else {
      showToast("Direct download fallback: opening print dialog — choose 'Save as PDF'.", 'info');
      handlePrint();
    }
  };

  return createPortal(
    <div id="resume-modal-portal">
      <AnimatePresence>
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
          className={`fixed inset-0 z-[9999] flex items-center justify-center ${
            isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'
          } bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 print:p-0 print:bg-white`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`resume-modal-container bg-white dark:bg-[#0f172a] border border-sky-100 dark:border-slate-800 shadow-2xl relative flex flex-col overflow-hidden transition-all duration-300 print:border-none print:shadow-none print:w-full print:h-auto ${
              isFullscreen
                ? 'w-screen h-screen max-w-none max-h-none rounded-none'
                : 'w-[98vw] max-w-7xl h-[95vh] max-h-[96vh] rounded-3xl'
            }`}
          >
            {/* Top Command Toolbar */}
            <div className="print-hide sticky top-0 z-20 flex items-center justify-between px-5 sm:px-8 py-3.5 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-sky-100 dark:border-slate-800 print:hidden shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
                    Executive Curriculum Vitae
                    <span className="hidden sm:inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-500/20 font-mono">
                      Widescreen & Print Ready
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden md:block">
                    Verified Candidate Dossier • {developerProfile.name} • {developerProfile.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2.5">
                {/* Standalone Full PDF Page link */}
                <Link
                  href="/resume"
                  target="_blank"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
                  title="Open Dedicated Full-Screen PDF View in New Tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>PDF Page</span>
                </Link>

                {/* Zoom Scale Toggle */}
                <button
                  type="button"
                  onClick={() => setZoomLevel(zoomLevel === 'normal' ? 'large' : 'normal')}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  title={zoomLevel === 'normal' ? 'Switch to Larger Text' : 'Switch to Compact Text'}
                >
                  {zoomLevel === 'normal' ? <ZoomIn className="w-3.5 h-3.5" /> : <ZoomOut className="w-3.5 h-3.5" />}
                  <span>{zoomLevel === 'normal' ? 'Zoom +' : 'Zoom -'}</span>
                </button>

                {/* Fullscreen Expand / Restore */}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Maximize Fullscreen'}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Exit Full</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Fullscreen</span>
                    </>
                  )}
                </button>

                {/* Print Action */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer click-bounce"
                  title="Print Document or Save as PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>

                {/* Download / Export PDF Action */}
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-white text-xs font-semibold transition-all shadow-md shadow-sky-600/25 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 click-bounce"
                  title="Download Resume as PDF file"
                >
                  {isDownloadingPdf ? (
                    <div className="size-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
                </button>

                {/* Include Profile Photo Checkbox Option */}
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer select-none">
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
                  <Camera className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span className="hidden sm:inline">Photo</span>
                </label>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-full cursor-pointer ml-1 click-bounce"
                  aria-label="Close dialog"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Executive Resume Body */}
            <div
              ref={scrollContainerRef}
              onScroll={handleModalScroll}
              className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-200/90 dark:bg-slate-950 scrollbar-thin print:overflow-visible print:p-0 relative"
            >
              <div className="w-full max-w-[860px] shadow-2xl ring-1 ring-slate-900/10 rounded-sm overflow-hidden bg-white print:shadow-none print:border-none">
                <ResumeContent zoomLevel="normal" includePhoto={includePhoto} />
              </div>

              {/* Floating Animated Scroll to Top Button for Modal (Screen / Container fixed) */}
              <div
                className={`print:hidden fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 transition-all duration-300 select-none ${
                  showScrollTop
                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                    : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
                }`}
              >
                <button
                  type="button"
                  onClick={scrollToModalTop}
                  className="size-11 sm:size-12 rounded-full bg-white/95 dark:bg-slate-900/95 text-sky-600 dark:text-sky-400 shadow-2xl shadow-sky-900/25 border-2 border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer group click-bounce backdrop-blur-md"
                  title="Scroll to top"
                  aria-label="Scroll to top"
                >
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                  </motion.div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </div>,
    document.body
  );
}
