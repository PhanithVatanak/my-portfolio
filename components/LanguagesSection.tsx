'use client';

import React from 'react';
import { Languages, Globe2, CheckCircle2 } from 'lucide-react';
import { usePortfolioData } from '@/components/PortfolioDataContext';
import { motion } from 'motion/react';

export function LanguagesSection() {
  const { data } = usePortfolioData();
  const spokenLanguages = data.languages;
  return (
    <section className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2.5">
          <Languages className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          <span>Languages & Communication</span>
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-sky-200 dark:from-slate-700 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {spokenLanguages.map((lang, idx) => (
          <motion.div
            key={lang.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-sky-100 dark:border-slate-800 shadow-sm hover:border-sky-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold font-display text-slate-900 dark:text-slate-50">
                  {lang.language}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200/70 dark:border-sky-500/20">
                  {lang.level}
                </span>
              </div>

              {lang.nativeScript && (
                <p className="text-xs text-sky-700 dark:text-sky-400 font-medium mb-4">
                  {lang.nativeScript}
                </p>
              )}
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span>Proficiency Level</span>
                <span className="text-sky-600 dark:text-sky-400 font-mono">{lang.proficiency}%</span>
              </div>
              <div className="w-full bg-sky-100/60 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${lang.proficiency}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-gradient-to-r from-sky-500 to-sky-600 dark:from-sky-400 dark:to-sky-500 h-full rounded-full"
                ></motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
