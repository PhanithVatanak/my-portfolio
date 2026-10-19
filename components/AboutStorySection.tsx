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
  ArrowRight
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
      title: 'Speed is a Non-Negotiable Feature',
      icon: Zap,
      metric: 'TTFB < 50ms',
      badge: 'Performance First',
      description:
        'Every 100ms of latency erodes user trust and engagement. I architect web applications with streaming server components, zero unneeded client hydration, and strict sub-50ms Time-to-First-Byte targets.',
      principles: ['Zero client-side JS bloat', 'Edge caching & streaming SSR', 'Rock-solid 60 FPS animations']
    },
    {
      id: 2,
      title: 'Design-Engineering Cohesion',
      icon: Palette,
      metric: 'Pixel-Perfect',
      badge: 'Aesthetic Precision',
      description:
        'The best software feels effortless. I bridge the divide between design systems in Figma and production TypeScript, ensuring every micro-interaction, spacing token, and contrast ratio feels polished and deliberate.',
      principles: ['Strict design token adherence', 'Accessible semantic HTML5', 'Harmonious dark/light modes']
    },
    {
      id: 3,
      title: 'Resilient Pragmatism over Hype',
      icon: ShieldCheck,
      metric: '99.9% Uptime',
      badge: 'Architectural Rigor',
      description:
        'The most resilient code is the code you didn’t have to write. I favor battle-tested primitives, strict type-safety, and decoupled modular boundaries over brittle, over-engineered architectures.',
      principles: ['Strict TypeScript type invariants', 'Isolated failure domains', 'Predictable state management']
    },
    {
      id: 4,
      title: 'Continuous Craft & Curiosity',
      icon: Cpu,
      metric: 'R&D Native',
      badge: 'Engineering Evolution',
      description:
        'Software engineering is a craft of perpetual evolution. I actively research, benchmark, and deploy cutting-edge paradigms—from React Server Components to WebGL compute shaders and local AI tooling.',
      principles: ['Benchmarked framework audits', 'Continuous open-source telemetry', 'Mentoring engineering cohorts']
    }
  ];

  const milestones = [
    {
      year: '2016 - 2020',
      period: 'The Academic Foundation',
      title: 'Curiosity & Systems Fundamentals',
      subtitle: 'Royal University of Phnom Penh (RUPP)',
      body: 'Discovered a passion for algorithms, distributed systems, and web architecture. Graduated with honors (GPA 3.85/4.0) while serving as President of the University Web Engineering Circle.'
    },
    {
      year: '2020 - 2022',
      period: 'The Agency Crucible',
      title: 'High-Velocity Product Shipping',
      subtitle: 'Digital Creative Agency',
      body: 'Collaborated directly with designers and international stakeholders to deliver over 18 client production deployments. Mastered responsive component systems, state handling, and client deadlines.'
    },
    {
      year: '2022 - PRESENT',
      period: 'The Architecture Era',
      title: 'Leading Frontend Systems & Scale',
      subtitle: 'Tech Solutions Cambodia',
      body: 'Leading the frontend engineering team rebuilding core enterprise applications in Next.js 15. Slashed TTFB by 40%, unified cross-app component libraries, and achieved Lighthouse scores of 98+.'
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
              <button
                type="button"
                onClick={() => setIsResumeOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md shadow-sky-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                <FileText className="w-4 h-4" />
                <span>Open Interactive Resume</span>
              </button>

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
                {milestones.map((m, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-1">
                    <div className="size-6 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 z-10 ring-4 ring-white dark:ring-slate-900 shadow-xs">
                      <span className="text-[10px] font-bold font-mono">{idx + 1}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200/60 dark:border-sky-500/20">
                          {m.year}
                        </span>
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
                    </div>
                  </div>
                ))}
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
