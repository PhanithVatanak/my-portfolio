'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Download,
  Printer,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  MapPin,
  Languages,
  BookOpen,
  CheckCircle2,
  Globe,
  Sparkles,
  Phone,
  Send,
  Calendar,
  Layers,
  Code,
  FileCheck2,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolioData } from '@/components/PortfolioDataContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const { data } = usePortfolioData();
  const developerProfile = data.profile;
  const experiences = data.experiences;
  const skillCategories = data.skills;
  const educationList = data.education;
  const spokenLanguages = data.languages;

  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<'normal' | 'large'>('large');

  useEffect(() => {
    setMounted(true);
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
    window.print();
  };

  return createPortal(
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
          className={`bg-white dark:bg-[#0f172a] border border-sky-100 dark:border-slate-800 shadow-2xl relative flex flex-col overflow-hidden transition-all duration-300 print:border-none print:shadow-none print:w-full print:h-auto ${
            isFullscreen
              ? 'w-screen h-screen max-w-none max-h-none rounded-none'
              : 'w-[98vw] max-w-7xl h-[95vh] max-h-[96vh] rounded-3xl'
          }`}
        >
          {/* Top Command Toolbar */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-5 sm:px-8 py-3.5 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-sky-100 dark:border-slate-800 print:hidden shrink-0">
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
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                title="Print Document"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              {/* Download / Export PDF Action */}
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-all shadow-md shadow-sky-600/25 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-full cursor-pointer ml-1"
                aria-label="Close dialog"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Executive Resume Body */}
          <div
            className={`overflow-y-auto p-6 sm:p-10 lg:p-12 space-y-10 font-sans scrollbar-thin print:overflow-visible print:p-0 ${
              zoomLevel === 'large' ? 'text-[15px]' : 'text-sm'
            }`}
          >
            {/* Header Identity Banner */}
            <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-r from-sky-50/90 via-white to-blue-50/60 dark:from-slate-900 dark:via-slate-900/90 dark:to-sky-950/20 border border-sky-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-xs">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-500/20">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Available for Full-Time Roles & Architecture Advisory</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-50 font-display tracking-tight">
                  {developerProfile.name}
                </h1>

                <p className="text-sky-600 dark:text-sky-400 font-bold text-lg sm:text-xl lg:text-2xl font-display">
                  {developerProfile.role}
                </p>

                <p className="text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                  Specializing in Next.js 15, TypeScript, distributed edge rendering, web performance, and scalable enterprise design systems. Proven history leading high-impact web products from concept to multi-tenant scale.
                </p>
              </div>

              {/* Contact metadata strip */}
              <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-800/90 p-5 rounded-2xl border border-sky-100 dark:border-slate-700/80 shrink-0 shadow-2xs">
                <span className="flex items-center gap-2.5 font-medium">
                  <MapPin className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>{developerProfile.location}</span>
                </span>
                <span className="flex items-center gap-2.5 font-medium">
                  <Mail className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <a href={`mailto:${developerProfile.email}`} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors underline decoration-sky-300 underline-offset-2">
                    {developerProfile.email}
                  </a>
                </span>
                <span className="flex items-center gap-2.5 font-medium">
                  <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <a href="https://github.com/vatanak-vault" target="_blank" rel="noreferrer" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    github.com/vatanak-vault
                  </a>
                </span>
                <span className="flex items-center gap-2.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Open to Relocation / Remote</span>
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xs text-center">
                <span className="block text-3xl sm:text-4xl font-extrabold text-sky-600 dark:text-sky-400 font-display">
                  {developerProfile.stats.yearsExperience}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 block">
                  Years of Experience
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xs text-center">
                <span className="block text-3xl sm:text-4xl font-extrabold text-sky-600 dark:text-sky-400 font-display">
                  {developerProfile.stats.completedProjects}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 block">
                  Shipped Projects
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xs text-center">
                <span className="block text-3xl sm:text-4xl font-extrabold text-sky-600 dark:text-sky-400 font-display">
                  {developerProfile.stats.clientSatisfaction}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 block">
                  Client Satisfaction
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xs text-center">
                <span className="block text-3xl sm:text-4xl font-extrabold text-sky-600 dark:text-sky-400 font-display">
                  98+
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 block">
                  Lighthouse Perf Score
                </span>
              </div>
            </div>

            {/* TWO-COLUMN EXECUTIVE CV CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* PRIMARY LEFT COLUMN: Experience & Summaries (7 cols) */}
              <div className="lg:col-span-7 space-y-8">
                {/* Executive Summary */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
                    <Sparkles className="w-4 h-4" />
                    <span>Executive Summary</span>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-sky-100 dark:border-slate-800 leading-relaxed text-slate-700 dark:text-slate-300">
                    <p>
                      Senior Systems Architect and Full-Stack Frontend Engineer with 6+ years of specialized experience designing, implementing, and optimizing high-throughput web applications. Expert in React 19, Next.js 15 Server Components, streaming SSR pipelines, and TypeScript type systems. Demonstrated track record reducing page latency by 40%, mentoring cross-functional engineering squads, and bridging Figma design systems with production-grade edge infrastructure.
                    </p>
                  </div>
                </div>

                {/* Work Experience Timeline */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
                      <Briefcase className="w-4 h-4" />
                      <span>Professional Experience Timeline</span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono font-semibold">6+ Years Tenure</span>
                  </div>

                  <div className="space-y-6">
                    {experiences.map((exp, idx) => (
                      <div
                        key={exp.id || idx}
                        className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xs space-y-4 relative group hover:border-sky-300 dark:hover:border-sky-500/40 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                          <div>
                            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                              {exp.role}
                            </h3>
                            <span className="text-sm font-bold text-sky-600 dark:text-sky-400">
                              {exp.company}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                              {exp.period}
                            </span>
                          </div>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                          {exp.description}
                        </p>

                        {/* Bulleted Achievements */}
                        {exp.highlights && exp.highlights.length > 0 && (
                          <div className="space-y-2 pt-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                              Key Highlights & Milestones:
                            </span>
                            {exp.highlights.map((h, i) => (
                              <div key={i} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Technology Badges */}
                        {exp.technologies && (
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            {exp.technologies.map((t, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-xs font-mono px-2.5 py-1 rounded-md bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200/50 dark:border-sky-500/20 font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECONDARY RIGHT COLUMN: Skills, Education & Languages (5 cols) */}
              <div className="lg:col-span-5 space-y-8">
                {/* Technical Skills & Competencies */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
                    <Award className="w-4 h-4" />
                    <span>Technical Competencies</span>
                  </div>

                  <div className="space-y-3.5">
                    {skillCategories.map((cat, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xs space-y-2.5"
                      >
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 block">
                          {cat.title}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {cat.skills.map((s, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 font-medium hover:border-sky-300 dark:hover:border-sky-500 transition-colors"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education & Academic Credentials */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
                    <GraduationCap className="w-4 h-4" />
                    <span>Education & Honors</span>
                  </div>

                  <div className="space-y-3.5">
                    {educationList.map((edu) => (
                      <div
                        key={edu.id}
                        className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xs space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                            {edu.degree}
                          </h4>
                          <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 shrink-0">
                            {edu.period}
                          </span>
                        </div>

                        <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 block font-medium">
                          {edu.institution} • {edu.location}
                        </span>

                        {edu.honors && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-500/20">
                            <span>★</span>
                            <span>{edu.honors}</span>
                          </div>
                        )}

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                          {edu.description}
                        </p>

                        {edu.coursework && (
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {edu.coursework.map((course, cIdx) => (
                              <span
                                key={cIdx}
                                className="px-2.5 py-0.5 rounded-md bg-sky-50/70 dark:bg-sky-500/10 text-sky-800 dark:text-sky-300 text-xs font-medium border border-sky-200/50 dark:border-sky-500/20"
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spoken Languages & Communication */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
                    <Languages className="w-4 h-4" />
                    <span>Languages & Fluency</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
                    {spokenLanguages.map((lang) => (
                      <div
                        key={lang.id}
                        className="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xs space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 block">
                              {lang.language}
                            </span>
                            <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
                              {lang.level} {lang.nativeScript ? `(${lang.nativeScript})` : ''}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                            {lang.proficiency}%
                          </span>
                        </div>

                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-sky-600 to-indigo-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${lang.proficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
