'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Compass,
  Zap,
  Palette,
  ShieldCheck,
  Cpu,
  Sparkles,
  FileText,
  Download,
  MapPin,
  Briefcase,
  Terminal,
  Code2,
  Layers,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Database,
  Award,
  Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolioData } from '@/components/PortfolioDataContext';
import { ResumeModal } from '@/components/ResumeModal';

export function AboutStorySection() {
  const { data } = usePortfolioData();
  const profile = data.profile;
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [activePhilosophyTab, setActivePhilosophyTab] = useState<number>(0);

  const philosophies = [
    {
      id: 1,
      title: 'Performance & Fast Data Flow',
      icon: Zap,
      metric: 'Fast & Lean',
      badge: 'Performance First',
      description:
        'Every millisecond of latency impacts user trust. I engineer applications with streamlined backend queries, optimized relational data access, and responsive client-side interactions.',
      principles: ['Sub-second query execution', 'Efficient database indexing', 'Fluid, responsive UI flow']
    },
    {
      id: 2,
      title: 'Data Integrity & Architectural Rigor',
      icon: ShieldCheck,
      metric: 'ACID & Relational',
      badge: 'Schema Precision',
      description:
        'Data is the backbone of business operations. I prioritize reliable relational schemas, atomic database transactions, clean migrations, and dependable role-based permissions over brittle shortcuts.',
      principles: ['Strict schema validation', 'Atomic database transactions', 'Predictable role-based permissions']
    },
    {
      id: 3,
      title: 'Pragmatic Systems over Hype',
      icon: Server,
      metric: 'Production Ready',
      badge: 'Enterprise Logic',
      description:
        'The best software solves tangible business needs. I specialize in enterprise-grade frameworks like Frappe, robust Python backends, and Next.js interfaces built for day-to-day operations.',
      principles: ['Maintainable Python & TypeScript', 'Decoupled API endpoints', 'Enterprise ERP & HRMS integration']
    },
    {
      id: 4,
      title: 'Continuous Craft & AI Evolution',
      icon: Cpu,
      metric: 'R&D Native',
      badge: 'AI Workflows',
      description:
        'Software engineering is a craft of perpetual evolution. I actively integrate AI vector databases (Qdrant), automated CV processing, and modern full-stack workflows that create real impact.',
      principles: ['Vector search & semantic retrieval', 'Real-time FCM push notifications', 'Automated business workflows']
    }
  ];

  // Dynamically derive milestones from user's real education and experience records
  const nortonEdu =
    data.education.find((e) =>
      e.institution.toLowerCase().includes('norton') || e.degree.toLowerCase().includes('computer science')
    ) || data.education[0];

  const currentExp =
    data.experiences.find(
      (e) =>
        e.status?.toLowerCase().includes('current') ||
        e.period.toLowerCase().includes('present')
    ) || data.experiences[0];

  const earlyExp =
    data.experiences.find(
      (e) =>
        e.company.toLowerCase().includes('norton') ||
        e.role.toLowerCase().includes('database') ||
        e.role.toLowerCase().includes('technician')
    ) || data.experiences[data.experiences.length - 2] || data.experiences[1];

  const milestones = [
    {
      icon: GraduationCap,
      year: nortonEdu?.period || '2020 - 2024',
      badge: nortonEdu?.honors || 'Honors Graduate',
      title: nortonEdu?.degree || 'Bachelor Degree of Computer Science',
      subtitle: `${nortonEdu?.institution || 'Norton University'} • ${nortonEdu?.location || 'Phnom Penh, Cambodia'}`,
      body:
        nortonEdu?.description ||
        'Specialized in Computer Science, software development, database systems, and web architectures. Graduated with Honors (GPA 3.85 / 4.0) with strong fundamentals in data structures, algorithms, and systems engineering.',
      tags:
        nortonEdu?.coursework && nortonEdu.coursework.length > 0
          ? nortonEdu.coursework.slice(0, 4)
          : ['Data Structures & Algorithms', 'Database Systems', 'Distributed Architecture', 'HCI']
    },
    {
      icon: Database,
      year: earlyExp?.period || '2021 - 2022',
      badge: 'Database & Systems',
      title: earlyExp ? `${earlyExp.role} & Systems Operations` : 'Database Developer & IT Operations',
      subtitle: `${earlyExp?.company || 'Norton University'} • Academic Infrastructure`,
      body:
        earlyExp?.description ||
        'Engineered database queries, data operations, and technical functionality using Microsoft SQL Server and T-SQL. Handled hardware diagnostics and reliable IT operational support.',
      tags:
        earlyExp?.technologies && earlyExp.technologies.length > 0
          ? earlyExp.technologies.slice(0, 4)
          : ['Microsoft SQL Server', 'T-SQL', 'System Maintenance', 'Hardware Diagnostics']
    },
    {
      icon: Terminal,
      year: currentExp?.period || '2022 - PRESENT',
      badge: currentExp?.status || 'Current Role',
      title: currentExp ? `${currentExp.role} — Enterprise RMS & AI Systems` : 'Web Developer — Enterprise RMS & AI Systems',
      subtitle: `${currentExp?.company || 'HRINC (Cambodia) Co., Ltd'} • Enterprise Products`,
      body:
        currentExp?.description ||
        'Developing and maintaining core business applications using the Frappe Framework, Python, and modern web architectures. Engineered AI-assisted recruitment workflows with Qdrant vector databases and Firebase Cloud Messaging.',
      tags:
        currentExp?.technologies && currentExp.technologies.length > 0
          ? currentExp.technologies.slice(0, 5)
          : ['Frappe Framework', 'Python & MariaDB', 'Qdrant Vector AI', 'Firebase Push', 'HRMS']
    }
  ];

  return (
    <>
      <section className="w-full space-y-12">
        {/* Storytelling Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-3 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/90 dark:bg-sky-500/10 border border-sky-200/80 dark:border-sky-500/25 text-sky-700 dark:text-sky-300 text-xs font-semibold w-fit mx-auto md:mx-0">
            <Compass className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Interactive Engineer Dossier & Story</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 font-display">
            Behind the <span className="text-sky-600 dark:text-sky-400">Terminal</span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-body">
            Crafting digital worlds with intention, mathematical precision, and an obsession with user delight. Here is my story, core engineering philosophy, and journey so far.
          </p>
        </motion.div>

        {/* Narrative Showcase Card: Portrait + Bio Chapters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Portrait, Telemetry Stats & Action Buttons */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-sky-100 dark:border-slate-800 shadow-sm space-y-6 relative overflow-hidden">
            {/* Ambient background bloom */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-300/15 dark:bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Developer Portrait */}
            <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden ring-4 ring-sky-100 dark:ring-slate-800 shadow-lg">
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                fill
                sizes="(max-width: 640px) 144px, 176px"
                className="object-cover"
                priority
                referrerPolicy="no-referrer"
                unoptimized={profile.avatarUrl?.startsWith('data:')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
            </div>

            {/* Identity & Status */}
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-50">
                {profile.name}
              </h2>
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 font-mono">
                {profile.role}
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile.location}</span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="block text-base font-extrabold text-sky-600 dark:text-sky-400 font-display">
                  {profile.stats.yearsExperience}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                  Experience
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="block text-base font-extrabold text-sky-600 dark:text-sky-400 font-display">
                  {profile.stats.completedProjects}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                  Projects
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="block text-base font-extrabold text-sky-600 dark:text-sky-400 font-display">
                  {profile.stats.clientSatisfaction}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                  Satisfaction
                </span>
              </div>
            </div>

            {/* Interactive CV Triggers */}
            <div className="space-y-2 pt-2">
              <Link
                href="/resume"
                className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md shadow-sky-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 click-bounce"
              >
                <FileText className="w-4 h-4" />
                <span>Open Executive CV (A4)</span>
              </Link>

              <Link
                href="/contact"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Briefcase className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Initiate Interview Request</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Three Chapters of Evolution */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-sky-100 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
                <Terminal className="w-4 h-4" />
                <span>The Storyline & Evolution</span>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-sky-100 dark:before:bg-slate-800">
                {milestones.map((m, idx) => {
                  const MilestoneIcon = m.icon;
                  return (
                    <div key={idx} className="relative flex items-start gap-4 pl-1">
                      <div className="size-7 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 z-10 ring-4 ring-white dark:ring-slate-900 shadow-xs">
                        <MilestoneIcon className="w-3.5 h-3.5" />
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200/60 dark:border-sky-500/20">
                            {m.year}
                          </span>
                          {m.badge && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-500/20">
                              {m.badge}
                            </span>
                          )}
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {m.subtitle}
                          </span>
                        </div>

                        <h3 className="text-base font-bold font-display text-slate-900 dark:text-slate-100">
                          {m.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                          {m.body}
                        </p>

                        {m.tags && m.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {m.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 font-mono"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Core Engineering Philosophy (4 Interactive Pillars) */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-50 tracking-tight">
                Engineering <span className="text-sky-600 dark:text-sky-400">Philosophy</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                The core convictions that govern every pull request, system design, and interface I build.
              </p>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-sky-200 dark:from-slate-700 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {philosophies.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = activePhilosophyTab === idx;

              return (
                <div
                  key={item.id}
                  onClick={() => setActivePhilosophyTab(idx)}
                  className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer relative overflow-hidden group select-none ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-sky-400 dark:border-sky-500 shadow-md shadow-sky-500/10 -translate-y-1'
                      : 'bg-white/80 dark:bg-slate-900/60 border-sky-100 dark:border-slate-800 hover:border-sky-300 dark:hover:border-slate-700 hover:-translate-y-0.5'
                  }`}
                >
                  {/* Top Bar with Icon & Metric Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-11 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.metric}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-body mb-4">
                    {item.description}
                  </p>

                  {/* Principle Highlights */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    {item.principles.map((p, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resume Modal Integration */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
}
