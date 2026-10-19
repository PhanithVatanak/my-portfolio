'use client';

import React, { useState, useMemo } from 'react';
import {
  Code,
  Layers,
  Wrench,
  Users,
  Search,
  CheckCircle,
  Sparkles,
  Cpu,
  Terminal,
  Activity,
  Zap,
  Filter
} from 'lucide-react';
import { usePortfolioData } from '@/components/PortfolioDataContext';

interface TechItem {
  name: string;
  category: string;
  proficiency: 'Production Battle-Tested' | 'Core Daily Stack' | 'Advanced Specialization';
  experienceYears: string;
  tags: string[];
}

export function TechRadarSection() {
  const { data } = usePortfolioData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const detailedSkills: TechItem[] = useMemo(
    () => [
      // Languages
      { name: 'TypeScript', category: 'Languages & Core', proficiency: 'Core Daily Stack', experienceYears: '5+ yrs', tags: ['Strict Mode', 'Generics', 'Type-Level Systems'] },
      { name: 'JavaScript (ES6+)', category: 'Languages & Core', proficiency: 'Production Battle-Tested', experienceYears: '6+ yrs', tags: ['Async/Await', 'Event Loop', 'V8 Optimization'] },
      { name: 'HTML5 Semantic', category: 'Languages & Core', proficiency: 'Production Battle-Tested', experienceYears: '6+ yrs', tags: ['Accessibility', 'ARIA', 'SEO Rich Snippets'] },
      { name: 'Modern CSS3 & PostCSS', category: 'Languages & Core', proficiency: 'Production Battle-Tested', experienceYears: '6+ yrs', tags: ['Grid', 'Flexbox', 'Custom Properties', 'Animations'] },
      { name: 'SQL & Relational DBs', category: 'Languages & Core', proficiency: 'Production Battle-Tested', experienceYears: '4+ yrs', tags: ['PostgreSQL', 'Query Indexing', 'Joins'] },

      // Frameworks & Runtimes
      { name: 'Next.js 14 / 15', category: 'Frameworks & Runtimes', proficiency: 'Core Daily Stack', experienceYears: '4+ yrs', tags: ['App Router', 'RSC Streaming', 'Server Actions', 'Turbopack'] },
      { name: 'React 18 / 19', category: 'Frameworks & Runtimes', proficiency: 'Core Daily Stack', experienceYears: '5+ yrs', tags: ['Concurrent Mode', 'Hooks', 'Fiber Reconciliation'] },
      { name: 'Tailwind CSS v3 / v4', category: 'Frameworks & Runtimes', proficiency: 'Core Daily Stack', experienceYears: '4+ yrs', tags: ['Tailwind v4 Oxide', 'Design Systems', 'Responsive Utility'] },
      { name: 'Node.js & Edge Runtime', category: 'Frameworks & Runtimes', proficiency: 'Production Battle-Tested', experienceYears: '4+ yrs', tags: ['HTTP/2', 'Streams', 'Edge Middleware'] },
      { name: 'Redux Toolkit & Zustand', category: 'Frameworks & Runtimes', proficiency: 'Production Battle-Tested', experienceYears: '4+ yrs', tags: ['Global State', 'Selectors', 'Immer'] },

      // Cloud & Tooling
      { name: 'Git & GitHub Workflows', category: 'Cloud & Tooling', proficiency: 'Core Daily Stack', experienceYears: '6+ yrs', tags: ['Actions CI/CD', 'Branching Strategies', 'PR Reviews'] },
      { name: 'Docker & Containerization', category: 'Cloud & Tooling', proficiency: 'Production Battle-Tested', experienceYears: '3+ yrs', tags: ['Multi-Stage Builds', 'Compose', 'Dev Environments'] },
      { name: 'Vercel & Cloudflare Edge', category: 'Cloud & Tooling', proficiency: 'Core Daily Stack', experienceYears: '4+ yrs', tags: ['Edge Functions', 'Analytics', 'DNS & Caching'] },
      { name: 'Figma to Code', category: 'Cloud & Tooling', proficiency: 'Production Battle-Tested', experienceYears: '5+ yrs', tags: ['Component Tokens', 'Auto Layout', 'Design Specs'] },
      { name: 'Vite & Webpack 5', category: 'Cloud & Tooling', proficiency: 'Production Battle-Tested', experienceYears: '4+ yrs', tags: ['HMR', 'Bundle Splitting', 'Tree-Shaking'] },

      // Architecture & Methodologies
      { name: 'Web Performance & Core Web Vitals', category: 'Architecture & Craft', proficiency: 'Advanced Specialization', experienceYears: '5+ yrs', tags: ['LCP / FID / CLS', 'Lighthouse 98+', 'Critical Path'] },
      { name: 'Micro-Interactions & Motion', category: 'Architecture & Craft', proficiency: 'Advanced Specialization', experienceYears: '4+ yrs', tags: ['Framer Motion', 'FLIP Animation', 'Subpixel Polish'] },
      { name: 'RESTful & GraphQL API Design', category: 'Architecture & Craft', proficiency: 'Production Battle-Tested', experienceYears: '5+ yrs', tags: ['Schema Stitching', 'Type-Safe Contracts', 'Payload Slicing'] },
      { name: 'Agile & Technical Mentorship', category: 'Architecture & Craft', proficiency: 'Production Battle-Tested', experienceYears: '4+ yrs', tags: ['Sprint Planning', 'Code Reviews', 'Engineering Standards'] }
    ],
    []
  );

  const categories = ['All', 'Languages & Core', 'Frameworks & Runtimes', 'Cloud & Tooling', 'Architecture & Craft'];

  const filteredSkills = useMemo(() => {
    return detailedSkills.filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [detailedSkills, selectedCategory, searchQuery]);

  return (
    <section className="w-full space-y-6">
      {/* Title & Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive Tech Radar</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-50 tracking-tight">
            Technical Stack & <span className="text-sky-600 dark:text-sky-400">Battle-Tested Tooling</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mt-1">
            Technologies I leverage daily in production, classified by hands-on proficiency, tenure, and sub-specialization.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search technologies..."
            className="w-full pl-9 pr-3.5 py-2 rounded-full bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 ease-out select-none hover:-translate-y-0.5 active:translate-y-0 ${
                isSelected
                  ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/25 border border-transparent'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-500/40 hover:bg-sky-50/80 dark:hover:bg-slate-800/90 hover:text-sky-600 dark:hover:text-sky-300 shadow-2xs'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Skills Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-sky-100 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-sky-300 dark:hover:border-sky-500/40 transition-all duration-200 group flex flex-col justify-between hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  {item.category}
                </span>
                <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                  {item.experienceYears}
                </span>
              </div>

              <h3 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {item.name}
              </h3>

              <div className="flex items-center gap-1.5 mt-1.5 mb-3">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {item.proficiency}
                </span>
              </div>
            </div>

            {/* Tag Pills */}
            <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
              {item.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2 py-0.5 rounded-md bg-sky-50/70 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 text-[10px] font-medium border border-sky-200/40 dark:border-sky-500/15"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
