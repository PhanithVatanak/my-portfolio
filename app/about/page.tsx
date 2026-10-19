'use client';

import React from 'react';
import Link from 'next/link';
import { AboutStorySection } from '@/components/AboutStorySection';
import { TechRadarSection } from '@/components/TechRadarSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { EducationSection } from '@/components/EducationSection';
import { LanguagesSection } from '@/components/LanguagesSection';
import { InterestsSection } from '@/components/InterestsSection';
import { motion } from 'motion/react';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full flex justify-center py-8 md:py-14 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[1020px] flex flex-col gap-14 md:gap-18"
      >
        {/* Interactive Biography & Engineering Philosophy */}
        <AboutStorySection />

        {/* Dynamic Interactive Tech Radar */}
        <TechRadarSection />

        {/* Career Experience Timeline */}
        <ExperienceSection />

        {/* Education & Credentials */}
        <EducationSection />

        {/* Spoken Languages & Communication */}
        <LanguagesSection />

        {/* Personal Interests & Beyond the Terminal */}
        <InterestsSection />

        {/* Inspiring Personal Closing CTA Banner */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full bg-gradient-to-b from-sky-50 via-sky-100/60 to-sky-100 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-950 border border-sky-200/80 dark:border-slate-800 rounded-3xl py-14 px-6 md:px-12 text-center shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-300/20 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="max-w-[700px] mx-auto relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-semibold border border-sky-200/80 dark:border-sky-500/20 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Let&apos;s Create Together</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
              Looking for a Senior Frontend Architect?
            </h2>

            <p className="text-slate-600 dark:text-slate-300 mb-8 text-base md:text-lg leading-relaxed font-body">
              Whether you are scaling a modern Next.js 15 application, modernizing a legacy frontend, or building high-frequency user interfaces from scratch, I&apos;d love to connect.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-sky-600 text-white font-semibold text-sm rounded-full hover:bg-sky-500 shadow-md shadow-sky-600/25 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Mail className="w-4 h-4" />
                <span>Start a Conversation</span>
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 text-sky-800 dark:text-slate-200 font-semibold text-sm rounded-full hover:bg-sky-50/80 dark:hover:bg-slate-800 shadow-sm transition-all"
              >
                <span>Inspect Projects Vault</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
