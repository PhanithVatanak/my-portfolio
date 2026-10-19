'use client';

import React from 'react';
import { Terminal, Palette, Rocket } from 'lucide-react';
import { usePortfolioData } from '@/components/PortfolioDataContext';

export function WhatIDoSection() {
  const { data } = usePortfolioData();
  const whatIDoItems = data.whatIDo;
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'terminal':
        return <Terminal className="w-5 h-5" />;
      case 'palette':
        return <Palette className="w-5 h-5" />;
      case 'rocket':
      default:
        return <Rocket className="w-5 h-5" />;
    }
  };

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {whatIDoItems.map((item) => (
          <div
            key={item.id}
            className="p-6 md:p-7 rounded-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-sky-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-sky-300/80 dark:hover:border-slate-700/80 transition-all duration-200 group"
          >
            <div className="size-11 rounded-xl bg-sky-50 dark:bg-slate-800/80 border border-sky-200/60 dark:border-slate-700/60 flex items-center justify-center mb-4 text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-200 shadow-xs">
              {getIcon(item.icon)}
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-50 mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-body">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
