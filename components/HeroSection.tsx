'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Briefcase, Sparkles, ArrowRight } from 'lucide-react';
import { usePortfolioData } from '@/components/PortfolioDataContext';
import { motion } from 'motion/react';

export function HeroSection({ showCta = true }: { showCta?: boolean }) {
  const { data } = usePortfolioData();
  const developerProfile = data.profile;
  return (
    <section className="relative w-full pt-4 pb-12">
      {/* Ambient background glow and animated floating light blooms */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-96 md:h-96 bg-sky-200/50 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-blue-200/30 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
        {/* Avatar with holographic ring & status indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative group shrink-0"
        >
          {/* Animated radar sonar pulse around the avatar */}
          <div className="absolute -inset-2 rounded-full border-2 border-sky-400/40 dark:border-sky-400/30 animate-ping pointer-events-none"></div>
          <div className="absolute -inset-1 rounded-full border border-sky-500/50 dark:border-sky-400/50 animate-pulse pointer-events-none"></div>

          <div className="relative h-40 w-40 md:h-48 md:w-48 rounded-full ring-4 ring-sky-300/80 dark:ring-sky-500/80 shadow-2xl shadow-sky-900/10 dark:shadow-sky-500/25 overflow-hidden bg-sky-100 dark:bg-slate-800">
            <Image
              src={developerProfile.avatarUrl}
              alt={developerProfile.name}
              fill
              sizes="(max-width: 768px) 160px, 192px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Badge Icon */}
          <div className="absolute -bottom-1 -right-1 bg-sky-600 text-white p-2.5 rounded-full border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </motion.div>

        {/* Text information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="flex flex-col justify-center text-center md:text-left pt-1 flex-1"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/90 dark:bg-sky-500/10 border border-sky-200/80 dark:border-sky-500/25 text-sky-700 dark:text-sky-300 text-xs font-semibold w-fit mx-auto md:mx-0 mb-3">
            <span className="size-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>Senior Systems Architect & Frontend Engineer</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-slate-50 mb-3">
            Hi, I&apos;m <span className="text-sky-600 dark:text-sky-400">{developerProfile.name}</span>
          </h1>

          <p className="text-xl md:text-2xl text-sky-800/90 dark:text-slate-300 font-semibold mb-4 font-display">
            {developerProfile.heroSubtitle}
          </p>

          <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-body">
            {developerProfile.heroDescription}
          </p>

          {/* Location & Availability Chips */}
          <div className="flex flex-wrap gap-2.5 mt-6 justify-center md:justify-start">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-sm text-xs font-medium text-slate-700 dark:text-sky-300">
              <MapPin className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>{developerProfile.location}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-200/80 dark:border-sky-400/25 shadow-sm text-xs font-semibold text-sky-700 dark:text-sky-300">
              <span className="relative flex h-2 w-2 mr-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600 dark:bg-sky-400"></span>
              </span>
              <Briefcase className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Available for Hire</span>
            </div>
          </div>

          {/* Quick CTA buttons if enabled */}
          {showCta && (
            <div className="flex flex-wrap gap-3 mt-8 justify-center md:justify-start">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-md shadow-sky-600/20 hover:shadow-lg hover:shadow-sky-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Get In Touch</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 font-semibold text-sm shadow-sm transition-all hover:bg-sky-50/50 dark:hover:bg-slate-800/80"
              >
                <span>View Projects</span>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
