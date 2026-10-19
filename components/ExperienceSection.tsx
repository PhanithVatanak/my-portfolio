'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { usePortfolioData } from '@/components/PortfolioDataContext';

export function ExperienceSection() {
  const { data } = usePortfolioData();
  const experiences = data.experiences;
  const [expandedId, setExpandedId] = useState<string | null>(experiences[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 tracking-tight">
          Experience
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-sky-200 dark:from-slate-700 to-transparent"></div>
      </div>

      <div className="relative border-l-2 border-sky-200/70 dark:border-slate-800 ml-3 md:ml-4 space-y-10 py-2">
        {experiences.map((exp, index) => {
          const isFirst = index === 0;
          const isExpanded = expandedId === exp.id;

          return (
            <div key={exp.id} className="relative pl-8 md:pl-10">
              {/* Timeline Node */}
              <div
                className={`absolute -left-[9px] top-1.5 size-4 rounded-full border-4 shadow-sm transition-all ${
                  isFirst
                    ? 'bg-sky-600 dark:bg-sky-400 border-white dark:border-slate-950 ring-2 ring-sky-200 dark:ring-sky-400/50'
                    : 'bg-sky-300 dark:bg-sky-500/70 border-white dark:border-slate-950'
                }`}
              ></div>

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1.5 gap-1">
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-50">
                  {exp.role}
                </h3>
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border self-start sm:self-auto ${
                    isFirst
                      ? 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/10 border-sky-200/70 dark:border-sky-400/25'
                      : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 font-semibold'
                  }`}
                >
                  {exp.period}
                </span>
              </div>

              <p className="text-sky-700 dark:text-sky-400 font-semibold text-sm mb-2.5 font-sans">
                {exp.company}
              </p>

              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-3xl font-body">
                {exp.description}
              </p>

              {/* Technologies used */}
              <div className="flex flex-wrap items-center gap-2 mt-3.5">
                {exp.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                  >
                    {tech}
                  </span>
                ))}
                {exp.highlights && (
                  <button
                    onClick={() => toggleExpand(exp.id)}
                    className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-0.5 ml-1"
                  >
                    <span>{isExpanded ? 'Hide Highlights' : 'View Highlights'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* Expandable Key Highlights */}
              {isExpanded && exp.highlights && (
                <div className="mt-3 p-3.5 rounded-xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700/60 text-xs space-y-1.5 animate-in fade-in duration-150">
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                    Key Engineering Impact
                  </span>
                  {exp.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
