'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  Terminal,
  Github,
  Linkedin,
  Twitter,
  ArrowUp,
  Globe,
  Send,
  Mail,
  MessageSquare,
  Youtube,
  Code2,
  Link2
} from 'lucide-react';
import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { usePortfolioData } from '@/components/PortfolioDataContext';
import { triggerNavAnimation } from './PageTransition';

function DynamicSocialIcon({ icon, className }: { icon?: string; className?: string }) {
  const norm = (icon || '').toLowerCase();
  if (norm.includes('github')) return <Github className={className} />;
  if (norm.includes('linkedin')) return <Linkedin className={className} />;
  if (norm.includes('twitter') || norm === 'x') return <Twitter className={className} />;
  if (norm.includes('telegram') || norm.includes('send')) return <Send className={className} />;
  if (norm.includes('discord') || norm.includes('message')) return <MessageSquare className={className} />;
  if (norm.includes('mail') || norm.includes('email')) return <Mail className={className} />;
  if (norm.includes('youtube')) return <Youtube className={className} />;
  if (norm.includes('gitlab') || norm.includes('code')) return <Code2 className={className} />;
  return <Globe className={className} />;
}

export function Footer() {
  const pathname = usePathname();
  const [showFloatingScroll, setShowFloatingScroll] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      setShowFloatingScroll(scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname === '/resume' || pathname.startsWith('/admin')) return null;

  const { data } = usePortfolioData();
  const developerProfile = data.profile;
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinksToRender = developerProfile.socialLinks && developerProfile.socialLinks.length > 0
    ? developerProfile.socialLinks
    : [
        { id: '1', platform: 'GitHub', url: developerProfile.socials.github, icon: 'github' },
        { id: '2', platform: 'LinkedIn', url: developerProfile.socials.linkedin, icon: 'linkedin' },
        { id: '3', platform: 'Twitter', url: developerProfile.socials.twitter, icon: 'twitter' },
      ];

  return (
    <footer className="w-full border-t border-sky-100 dark:border-slate-800 bg-white/70 dark:bg-slate-950/80 backdrop-blur-md py-12 transition-colors mt-auto print:hidden">
      <div className="max-w-[1240px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-sky-100/80 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-sky-50 dark:bg-slate-900 border border-sky-200/70 dark:border-slate-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                {developerProfile.name}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Building digital products & experiences with modern web standards.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {socialLinksToRender.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label={link.platform}
                title={link.platform}
                className="size-10 rounded-full border border-sky-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600 hover:border-sky-600 transition-all click-bounce hover:-translate-y-0.5 shadow-sm"
              >
                <DynamicSocialIcon icon={link.icon} className="w-4 h-4" />
              </a>
            ))}
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="size-10 rounded-full border border-sky-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors shadow-sm ml-2 click-bounce cursor-pointer"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} {developerProfile.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Operational Telemetry Online
            </span>
            <Link
              href="/about"
              onClick={() => triggerNavAnimation()}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors click-bounce"
            >
              About
            </Link>
            <Link
              href="/projects"
              onClick={() => triggerNavAnimation()}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors click-bounce"
            >
              Projects
            </Link>
            <Link
              href="/contact"
              onClick={() => triggerNavAnimation()}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors click-bounce"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Animated Scroll to Top Button for Main Portfolio Pages (Portaled directly to document.body) */}
      {mounted &&
        createPortal(
          <div
            className={`print:hidden fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex items-center select-none transition-all duration-300 ${
              showFloatingScroll
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
            }`}
          >
            <button
              type="button"
              onClick={scrollToTop}
              className="size-12 rounded-full bg-white/95 dark:bg-slate-900/95 text-sky-600 dark:text-sky-400 shadow-2xl shadow-sky-900/20 dark:shadow-sky-500/20 border-2 border-slate-200 dark:border-slate-700/80 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer group click-bounce backdrop-blur-md"
              title="Scroll back to top"
              aria-label="Scroll back to top"
            >
              <motion.div
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="flex items-center justify-center"
              >
                <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.div>
            </button>
          </div>,
          document.body
        )}
    </footer>
  );
}
