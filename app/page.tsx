'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Eye,
  Clock,
  Briefcase,
  Compass,
  CheckCircle2,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { HeroSection } from '@/components/HeroSection';
import { WhatIDoSection } from '@/components/WhatIDoSection';
import { ProjectsShowcase } from '@/components/ProjectsShowcase';
import { usePortfolioData } from '@/components/PortfolioDataContext';
import { motion } from 'motion/react';

export default function HomePage() {
  const { data } = usePortfolioData();
  const recentArticles = data.articles.slice(0, 3);
  const currentExp = data.experiences[0];

  return (
    <div className="w-full flex justify-center py-8 md:py-14 px-4 md:px-8">
      <div className="w-full max-w-[1200px] flex flex-col gap-16 md:gap-20">
        {/* 1. Hero Section */}
        <HeroSection showCta={true} />

        {/* 2. Core Engineering Pillars / What I Do */}
        <WhatIDoSection />

        {/* 3. Featured Flagship Projects */}
        <section className="w-full space-y-6">
          <ProjectsShowcase limit={6} showHeader={true} />
          <div className="flex justify-center pt-2">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-800 text-sky-800 dark:text-sky-300 font-semibold text-sm shadow-sm hover:bg-sky-50 dark:hover:bg-slate-800 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore All Projects Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 4. Latest Engineering Dispatches & Technical Research (From Blog) */}
        <section className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Field Notes & Research</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-50 tracking-tight">
                Latest <span className="text-sky-600 dark:text-sky-400">Engineering Dispatches</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Technical research papers, performance benchmarks, and architectural notes published from active production work.
              </p>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors w-fit group"
            >
              <span>Browse All Articles</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentArticles.map((art) => (
              <Link
                key={art.id}
                href="/blog"
                className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 dark:hover:shadow-sky-950/30 hover:border-sky-300 dark:hover:border-sky-500/40 transition-all duration-500 ease-out group hover:-translate-y-1 relative overflow-hidden cursor-pointer"
              >
                {/* Subtle top scanline pulse on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200/50 dark:border-sky-500/20">
                      {art.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{art.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold font-display text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 mb-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono text-[11px]">{art.publishedDate}</span>
                  <span className="text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                    Read Note <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. Career Snapshot Spotlight & About Story Teaser */}
        {currentExp && (
          <section className="w-full bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 md:p-10 border border-sky-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-sky-400/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-500/20">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Currently Practicing • {currentExp.period}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-50 tracking-tight">
                  {currentExp.role} at <span className="text-sky-600 dark:text-sky-400">{currentExp.company}</span>
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                  {currentExp.description}
                </p>

                {/* Highlights Pill checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {currentExp.highlights?.slice(0, 2).map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button linking to About Dossier */}
              <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-sky-600/25 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Full Story & Philosophy</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 font-mono">
                  Read personal biography, credentials & tech radar
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 6. Let's Build Something Amazing CTA Banner */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full bg-gradient-to-b from-sky-50 via-sky-100/60 to-sky-100 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-950 border border-sky-200/80 dark:border-slate-800 rounded-3xl py-14 px-6 md:px-12 text-center shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-300/20 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="max-w-[700px] mx-auto relative z-10 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
              Let&apos;s build something amazing together
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8 text-base md:text-lg leading-relaxed font-body">
              I&apos;m currently looking for new opportunities. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
            </p>
            <div className="flex flex-col sm:flex-row gap-3.5">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-sky-600 text-white font-semibold text-sm rounded-full hover:bg-sky-500 shadow-md shadow-sky-600/25 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Contact Me
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 text-sky-800 dark:text-slate-200 font-semibold text-sm rounded-full hover:bg-sky-50/80 dark:hover:bg-slate-800 shadow-sm transition-all"
              >
                View Projects
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
