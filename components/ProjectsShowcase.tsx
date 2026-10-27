'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  CheckCircle2,
  BarChart3,
  Globe,
  Terminal,
  Cpu,
  ArrowUpRight,
  Code,
  ExternalLink,
  X,
  RotateCcw,
  Sparkles,
  Layers,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { Project } from '@/lib/types';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolioData } from '@/components/PortfolioDataContext';
import { triggerNavAnimation } from '@/components/PageTransition';
import { PARENT_CATEGORIES, getSubcategoriesForParent, detectParentCategory } from '@/lib/categories';

interface ProjectsShowcaseProps {
  limit?: number;
  showHeader?: boolean;
}

export function ProjectsShowcase({ limit, showHeader = true }: ProjectsShowcaseProps) {
  const { data } = usePortfolioData();
  const initialProjects = data.projects;
  const [selectedParent, setSelectedParent] = useState<string>('All');
  const [selectedSub, setSelectedSub] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Parent Category options
  const parentCategories = useMemo(() => {
    return ['All', ...PARENT_CATEGORIES.map((p) => p.name)];
  }, []);

  // Subcategories for active parent
  const subCategories = useMemo(() => {
    if (selectedParent === 'All') return [];
    return ['All', ...getSubcategoriesForParent(selectedParent)];
  }, [selectedParent]);

  // Compute item count per parent category
  const parentCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialProjects.length };
    initialProjects.forEach((p) => {
      const parent = p.parentCategory || detectParentCategory(p.category);
      counts[parent] = (counts[parent] || 0) + 1;
    });
    return counts;
  }, [initialProjects]);

  // Filter projects by Parent Category + Subcategory + Search Query
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const projParent = project.parentCategory || detectParentCategory(project.category);
      const projSub = (project.subCategory || '').toLowerCase();
      const projTags = project.tags.map((t) => t.toLowerCase());

      // 1. Parent Match
      const matchesParent =
        selectedParent === 'All' ||
        projParent.toLowerCase() === selectedParent.toLowerCase();

      // 2. Subcategory Match
      const matchesSub =
        selectedSub === 'All' ||
        projSub === selectedSub.toLowerCase() ||
        projTags.includes(selectedSub.toLowerCase());

      // 3. Search Query Match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        (project.id && project.id.toLowerCase().includes(q)) ||
        projParent.toLowerCase().includes(q) ||
        projSub.includes(q) ||
        projTags.some((t) => t.includes(q));

      return matchesParent && matchesSub && matchesSearch;
    });
  }, [selectedParent, selectedSub, searchQuery, initialProjects]);

  const displayedProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects;

  const handleParentChange = (cat: string) => {
    if (cat === selectedParent) return;
    setSelectedParent(cat);
    setSelectedSub('All');
  };

  const handleSubChange = (sub: string) => {
    if (sub === selectedSub) return;
    setSelectedSub(sub);
  };

  const clearAllFilters = () => {
    setSelectedParent('All');
    setSelectedSub('All');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedParent !== 'All' || selectedSub !== 'All' || searchQuery.trim().length > 0;

  const renderProjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'shopping-cart':
        return <ShoppingCart className="w-14 h-14 text-sky-500/70 group-hover:scale-110 transition-transform duration-500" />;
      case 'task-alt':
        return <CheckCircle2 className="w-14 h-14 text-sky-500/70 group-hover:scale-110 transition-transform duration-500" />;
      case 'monitoring':
        return <BarChart3 className="w-14 h-14 text-sky-500/70 group-hover:scale-110 transition-transform duration-500" />;
      case 'public':
        return <Globe className="w-14 h-14 text-sky-500/70 group-hover:scale-110 transition-transform duration-500" />;
      case 'cpu':
        return <Cpu className="w-14 h-14 text-sky-500/70 group-hover:scale-110 transition-transform duration-500" />;
      case 'terminal':
      default:
        return <Terminal className="w-14 h-14 text-sky-500/70 group-hover:scale-110 transition-transform duration-500" />;
    }
  };

  return (
    <section className="w-full">
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-3 text-center md:text-left mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-semibold w-fit mx-auto md:mx-0">
            <span className="size-1.5 rounded-full bg-sky-500 animate-pulse"></span>
            <span>Engineering Showcase</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-50 font-display">
            Production <span className="text-sky-600 dark:text-sky-400">Projects</span>
          </h1>

          <p className="text-base md:text-lg font-normal leading-relaxed text-slate-600 dark:text-slate-300 font-body max-w-[720px]">
            Battle-tested systems, fullstack ERP architectures, and high-throughput tooling. Classified by primary domain and technology framework.
          </p>
        </motion.div>
      )}

      {/* Filter Toolbar: Search & 2-Tier Category Tabs */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID (pro-001), framework, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Reset button if active */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 transition-all cursor-pointer whitespace-nowrap self-start md:self-auto click-bounce"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Level 1: Parent Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-sky-500" />
            Domain:
          </span>
          <div className="flex items-center gap-1.5">
            {parentCategories.map((cat) => {
              const isSelected = selectedParent === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleParentChange(cat)}
                  className={`group px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-all duration-200 ease-out select-none click-bounce hover:-translate-y-0.5 ${
                    isSelected
                      ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/30 border border-transparent'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-500/40 hover:bg-sky-50/80 dark:hover:bg-slate-800/90 hover:text-sky-600 shadow-2xs'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] min-w-[18px] px-1.5 py-0.5 rounded-full font-mono font-semibold flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {parentCounts[cat] || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Level 2: Subcategory Pills (Appears when specific parent is chosen) */}
        {subCategories.length > 0 && (
          <div className="p-3 rounded-2xl bg-sky-50/60 dark:bg-slate-900/60 border border-sky-200/70 dark:border-sky-500/20 flex items-center gap-2 overflow-x-auto scrollbar-none animate-in fade-in duration-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              <span>{selectedParent} Frameworks:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {subCategories.map((sub) => {
                const isSelected = selectedSub === sub;
                return (
                  <button
                    key={sub}
                    onClick={() => handleSubChange(sub)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer click-bounce ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-600 hover:bg-sky-100/70 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid of Projects with Pure Fade-In Animation */}
      {displayedProjects.length === 0 ? (
        <motion.div
          key="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center py-16 bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-sky-100 dark:border-slate-800 p-8 shadow-sm"
        >
          <div className="size-12 rounded-2xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display mb-1">
            No projects found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-4">
            No projects match the current filter selection ({selectedParent} / {selectedSub}).
          </p>
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-600 text-white font-semibold text-xs shadow-md shadow-sky-600/25 hover:bg-sky-500 transition-all cursor-pointer click-bounce"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project) => {
            const projectParent = project.parentCategory || detectParentCategory(project.category);
            const projectSub = project.subCategory || project.category;
            const projectUrl = `/projects/${project.id}`;

            return (
              <motion.div
                key={`${selectedParent}-${selectedSub}-${project.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.8, // 800ms pure fade in as requested
                  ease: 'easeOut',
                }}
                className="flex flex-col justify-between h-full rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 dark:hover:shadow-sky-950/30 hover:border-sky-300 dark:hover:border-sky-500/40 transition-all group hover:-translate-y-1 duration-500 ease-out relative overflow-hidden"
              >
                {/* Subtle top scanline pulse on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex flex-col gap-3.5">
                  {/* Card visual banner (display only) */}
                  <div
                    className="w-full aspect-video rounded-xl bg-gradient-to-br from-sky-50 via-sky-100/60 to-blue-50 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-950/40 flex items-center justify-center border border-sky-100 dark:border-slate-800 overflow-hidden relative group-hover:border-sky-200 dark:group-hover:border-slate-700 transition-colors duration-500 select-none"
                  >
                    {renderProjectIcon(project.iconName)}
                    <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    
                    {/* ID Pill Badge */}
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/95 dark:bg-slate-900/95 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-slate-700 shadow-2xs">
                      {project.id}
                    </span>

                    {/* Category & Subcategory Pill Tag */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-slate-700 backdrop-blur-xs">
                        {projectParent}
                      </span>
                    </div>
                  </div>

                  {/* Title & Code Link */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-base sm:text-lg font-bold leading-snug text-slate-900 dark:text-slate-100 font-display group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-500 line-clamp-2">
                        {project.title}
                      </h3>
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors p-1 click-bounce shrink-0"
                          title="View Code Repository"
                        >
                          <Code className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {/* Subcategory Framework Badge */}
                    {projectSub && (
                      <div className="flex items-center gap-1.5 text-xs text-sky-700 dark:text-sky-300 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                        <span>{projectSub}</span>
                      </div>
                    )}

                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-normal leading-relaxed font-body line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Tags & Action Link */}
                <div className="flex flex-col gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium border bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] text-slate-400 font-mono">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    {/* ONLY 'View Project Details' is clickable to view project details */}
                    <Link
                      href={projectUrl}
                      onClick={() => triggerNavAnimation(projectUrl)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-500 text-xs font-semibold border border-sky-200/60 dark:border-sky-500/20 transition-all duration-300 group/btn cursor-pointer click-bounce"
                    >
                      <span>View Project Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
                    </Link>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-medium click-bounce shrink-0"
                      >
                        <span>Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
          )}
      </section>
  );
}
