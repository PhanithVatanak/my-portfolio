'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Loader2
} from 'lucide-react';
import { Project } from '@/lib/types';
import { ProjectModal } from './ProjectModal';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolioData } from '@/components/PortfolioDataContext';

interface ProjectsShowcaseProps {
  limit?: number;
  showHeader?: boolean;
}

export function ProjectsShowcase({ limit, showHeader = true }: ProjectsShowcaseProps) {
  const { data } = usePortfolioData();
  const initialProjects = data.projects;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  const categories = ['All', 'Web Apps', 'Open Source', 'AI & Tools', 'Full Stack'];

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialProjects.length };
    initialProjects.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [initialProjects]);

  // Filter projects by Category + Search Query
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        project.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, initialProjects]);

  const displayedProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects;

  // Trigger brief futuristic scan loading state on filter change
  const handleCategoryChange = (cat: string) => {
    if (cat === selectedCategory) return;
    setIsFiltering(true);
    setSelectedCategory(cat);
    setTimeout(() => {
      setIsFiltering(false);
    }, 280);
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'All' || searchQuery.trim().length > 0;

  const renderProjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'shopping-cart':
        return <ShoppingCart className="w-16 h-16 text-sky-500/70 group-hover:scale-110 transition-transform duration-500" />;
      case 'task-alt':
        return <CheckCircle2 className="w-16 h-16 text-sky-500/70 group-hover:scale-110 transition-transform duration-500" />;
      case 'monitoring':
        return <BarChart3 className="w-16 h-16 text-sky-500/70 group-hover:scale-110 transition-transform duration-500" />;
      case 'public':
        return <Globe className="w-16 h-16 text-sky-500/70 group-hover:scale-110 transition-transform duration-500" />;
      case 'cpu':
        return <Cpu className="w-16 h-16 text-sky-500/70 group-hover:scale-110 transition-transform duration-500" />;
      case 'terminal':
      default:
        return <Terminal className="w-16 h-16 text-sky-500/70 group-hover:scale-110 transition-transform duration-500" />;
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
            <span>Portfolio Showcase</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-50 font-display">
            Featured <span className="text-sky-600 dark:text-sky-400">Projects</span>
          </h1>

          <p className="text-base md:text-lg font-normal leading-relaxed text-slate-600 dark:text-slate-300 font-body max-w-[720px]">
            A selection of projects I&apos;ve worked on, ranging from web applications to open-source tools. Each project represents a unique challenge and a solution crafted with modern technologies.
          </p>
        </motion.div>
      )}

      {/* Filter Toolbar: Search & Category Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by title, stack, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Pills & Reset */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`group px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-2 cursor-pointer transition-all duration-200 ease-out select-none hover:-translate-y-0.5 active:translate-y-0 ${
                    isSelected
                      ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/30 border border-transparent'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-500/40 hover:bg-sky-50/80 dark:hover:bg-slate-800/90 hover:text-sky-600 dark:hover:text-sky-300 shadow-2xs hover:shadow-sm hover:shadow-sky-500/10'
                  }`}
                >
                  <span className="transition-colors duration-200">{cat}</span>
                  <span
                    className={`text-[10px] min-w-[18px] px-1.5 py-0.5 rounded-full font-mono font-semibold flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-sky-200/80 dark:group-hover:bg-sky-900/50 group-hover:text-sky-700 dark:group-hover:text-sky-300'
                    }`}
                  >
                    {categoryCounts[cat] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-700 dark:hover:text-rose-300 transition-all duration-200 border border-rose-200 dark:border-rose-500/20 hover:border-rose-300 whitespace-nowrap cursor-pointer ml-1 hover:-translate-y-0.5 active:translate-y-0 shadow-2xs hover:shadow-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading state indicator during filtering transition */}
      {isFiltering && (
        <div className="w-full py-12 flex flex-col items-center justify-center gap-3">
          <div className="relative size-10">
            <div className="absolute inset-0 rounded-full border-2 border-sky-200 dark:border-slate-800 border-t-sky-600 dark:border-t-sky-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-2 border-sky-100 dark:border-slate-900 border-b-sky-400 animate-spin [animation-direction:reverse]"></div>
          </div>
          <span className="text-xs font-mono font-medium text-sky-600 dark:text-sky-400 animate-pulse tracking-wider uppercase">
            Filtering project vault...
          </span>
        </div>
      )}

      {/* Grid of Projects */}
      {!isFiltering && displayedProjects.length === 0 ? (
        <div className="text-center py-16 bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-sky-100 dark:border-slate-800 p-8 shadow-sm">
          <div className="size-12 rounded-2xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display mb-1">
            No projects found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-4">
            No projects match the current combination of category &quot;{selectedCategory}&quot; and search query &quot;{searchQuery}&quot;.
          </p>
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-600 text-white font-semibold text-xs shadow-md shadow-sky-600/25 hover:bg-sky-500 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        !isFiltering && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {displayedProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                onClick={() => setActiveProject(project)}
                className="flex flex-col h-full rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 dark:hover:shadow-sky-950/30 hover:border-sky-300 dark:hover:border-sky-500/40 transition-all group hover:-translate-y-1 duration-300 cursor-pointer relative overflow-hidden"
              >
                {/* Subtle top scanline pulse on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Card visual banner */}
                <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-sky-50 via-sky-100/60 to-blue-50 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-950/40 flex items-center justify-center border border-sky-100 dark:border-slate-800 mb-6 overflow-hidden relative group-hover:border-sky-200 dark:group-hover:border-slate-700 transition-colors">
                  {renderProjectIcon(project.iconName)}
                  <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {/* Category Pill Tag */}
                  <span className="absolute top-3 left-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-slate-700 backdrop-blur-xs">
                    {project.category}
                  </span>
                </div>

                {/* Title & Code Link */}
                <div className="flex flex-col gap-3 flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold leading-tight text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors font-display">
                      {project.title}
                    </h3>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors p-1"
                      title="View Code Repository"
                    >
                      <Code className="w-5 h-5" />
                    </a>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-sm font-normal leading-relaxed font-body">
                    {project.description}
                  </p>
                </div>

                {/* Tags & Action Link */}
                <div className="flex flex-col gap-4 mt-6">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-3 py-1 rounded-full text-xs font-medium border bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-slate-700 group-hover:border-sky-300 dark:group-hover:border-slate-600 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="inline-flex items-center gap-1.5 text-slate-900 dark:text-slate-200 font-semibold text-sm group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      <span>View Project Details</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* Modal View */}
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  );
}
