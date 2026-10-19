'use client';

import React from 'react';
import { Coffee, Headphones, Gamepad2, Compass, Camera } from 'lucide-react';
import { usePortfolioData } from '@/components/PortfolioDataContext';

export function InterestsSection() {
  const { data } = usePortfolioData();
  const personalInterests = data.interests;
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'coffee':
        return <Coffee className="w-7 h-7 text-sky-600 dark:text-sky-400" />;
      case 'music':
        return <Headphones className="w-7 h-7 text-sky-600 dark:text-sky-400" />;
      case 'gamepad':
        return <Gamepad2 className="w-7 h-7 text-sky-600 dark:text-sky-400" />;
      case 'compass':
        return <Compass className="w-7 h-7 text-sky-600 dark:text-sky-400" />;
      case 'camera':
      default:
        return <Camera className="w-7 h-7 text-sky-600 dark:text-sky-400" />;
    }
  };

  return (
    <section className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 tracking-tight">
          Personal Interests
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-sky-200 dark:from-slate-700 to-transparent"></div>
      </div>

      <div className="flex flex-wrap justify-center sm:justify-start gap-6">
        {personalInterests.map((interest) => (
          <div key={interest.id} className="flex flex-col items-center gap-2.5 w-24 group">
            <div className="size-16 rounded-2xl bg-white dark:bg-slate-900/80 border border-sky-100 dark:border-slate-800 shadow-sm flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:border-sky-300 dark:group-hover:border-sky-400/50 group-hover:scale-105 group-hover:shadow-md transition-all duration-200">
              {getIcon(interest.icon)}
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              {interest.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
