'use client';

import React from 'react';
import { Code, Layers, Wrench, Users } from 'lucide-react';
import { usePortfolioData } from '@/components/PortfolioDataContext';

export function SkillsSection() {
  const { data } = usePortfolioData();
  const skillCategories = data.skills;
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'code':
        return <Code className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
      case 'layers':
        return <Layers className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
      case 'wrench':
        return <Wrench className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
      case 'users':
      default:
        return <Users className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
    }
  };

  return (
    <section className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 tracking-tight">
          Technical Skills
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-sky-200 dark:from-slate-700 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {skillCategories.map((category, index) => (
          <div
            key={index}
            className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-100 dark:border-slate-800 shadow-sm hover:border-sky-200 dark:hover:border-slate-700/80 transition-all duration-200"
          >
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2.5">
              {getIcon(category.icon)}
              <span>{category.title}</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-3 py-1 bg-sky-50 dark:bg-sky-500/10 text-sky-800 dark:text-sky-300 rounded-lg text-sm font-medium border border-sky-200/60 dark:border-sky-400/25 hover:border-sky-300 dark:hover:border-sky-400 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
