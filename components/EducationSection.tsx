'use client';

import React from 'react';
import { GraduationCap, Award, BookOpen, CheckCircle2 } from 'lucide-react';
import { usePortfolioData } from '@/components/PortfolioDataContext';
import { motion } from 'motion/react';

export function EducationSection() {
  const { data } = usePortfolioData();
  const educationList = data.education;
  return (
    <section className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2.5">
          <GraduationCap className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          <span>Education & Credentials</span>
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-sky-200 dark:from-slate-700 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {educationList.map((edu, idx) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="p-6 md:p-7 rounded-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-sky-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="size-11 rounded-xl bg-sky-50 dark:bg-slate-800 border border-sky-200/70 dark:border-slate-700 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 shadow-xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/10 px-3 py-1 rounded-full border border-sky-200/70 dark:border-sky-500/20 font-mono">
                  {edu.period}
                </span>
              </div>

              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-50 mb-1">
                {edu.degree}
              </h3>

              <p className="text-sky-700 dark:text-sky-400 font-semibold text-sm mb-2">
                {edu.institution} • <span className="text-slate-500 dark:text-slate-400 font-normal">{edu.location}</span>
              </p>

              {edu.honors && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/20 text-xs font-semibold mb-3">
                  <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{edu.honors}</span>
                </div>
              )}

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                {edu.description}
              </p>
            </div>

            {edu.coursework && (
              <div className="mt-5 pt-4 border-t border-sky-100/70 dark:border-slate-800/80">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Specialized Coursework
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {edu.coursework.map((course, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2.5 py-1 rounded-lg bg-sky-50/70 dark:bg-slate-800 text-sky-800 dark:text-sky-300 text-xs font-medium border border-sky-200/60 dark:border-slate-700"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
