'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Bookmark, 
  Code, 
  Terminal, 
  Send, 
  BookOpen, 
  MessageSquare,
  Layers,
  SlidersHorizontal,
  RotateCcw,
  X
} from 'lucide-react';
import { Article } from '@/lib/types';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from './ToastContext';
import { usePortfolioData } from '@/components/PortfolioDataContext';
import { PARENT_CATEGORIES, getSubcategoriesForParent, detectParentCategory } from '@/lib/categories';
import { triggerNavAnimation } from '@/components/PageTransition';

export function BlogShowcase() {
  const { data } = usePortfolioData();
  const initialArticles = data.articles;
  const developerProfile = data.profile;
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParent, setSelectedParent] = useState('All');
  const [selectedSub, setSelectedSub] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);

  // Parent Category options
  const parentCategories = useMemo(() => {
    return ['All', ...PARENT_CATEGORIES.map((p) => p.name)];
  }, []);

  // Subcategories for active parent
  const subCategories = useMemo(() => {
    if (selectedParent === 'All') return [];
    return ['All', ...getSubcategoriesForParent(selectedParent)];
  }, [selectedParent]);

  // Compute counts per parent category
  const parentCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialArticles.length };
    initialArticles.forEach((a) => {
      const parent = a.parentCategory || detectParentCategory(a.category);
      counts[parent] = (counts[parent] || 0) + 1;
    });
    return counts;
  }, [initialArticles]);

  // ⌘K Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('article-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Bookmark removed', 'info');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Article saved to your personal reading list!', 'success');
        return [...prev, id];
      }
    });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterSubmitting(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to subscribe');

      showToast(resData.message || 'Subscribed successfully!', 'success');
      setNewsletterEmail('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Subscription failed';
      showToast(message, 'error');
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  const featuredArticle = initialArticles.find((a) => a.featured) || initialArticles[0];

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      const artParent = article.parentCategory || detectParentCategory(article.category);
      const artSub = (article.subCategory || '').toLowerCase();
      const artTags = article.tags.map((t) => t.toLowerCase());

      // 1. Parent Match
      const matchesParent =
        selectedParent === 'All' ||
        artParent.toLowerCase() === selectedParent.toLowerCase();

      // 2. Subcategory Match
      const matchesSub =
        selectedSub === 'All' ||
        artSub === selectedSub.toLowerCase() ||
        artTags.includes(selectedSub.toLowerCase());

      // 3. Search query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        (article.id && article.id.toLowerCase().includes(q)) ||
        artParent.toLowerCase().includes(q) ||
        artSub.includes(q) ||
        artTags.some((t) => t.includes(q));

      return matchesParent && matchesSub && matchesSearch;
    });
  }, [selectedParent, selectedSub, searchQuery, initialArticles]);

  const clearAllFilters = () => {
    setSelectedParent('All');
    setSelectedSub('All');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedParent !== 'All' || selectedSub !== 'All' || searchQuery.trim().length > 0;

  return (
    <div className="w-full space-y-12">
      {/* Blog Hero Header */}
      <section className="flex flex-col items-start gap-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600 dark:bg-sky-400"></span>
          </span>
          <span className="tracking-wider uppercase font-semibold">Engineering Insights & Research</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight font-display">
          Documenting the Journey & <span className="text-sky-600 dark:text-sky-400">Tech Research</span>
        </h1>

        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Deep dives into Next.js 15, React Server Components, Web Performance, and Frappe Framework by {developerProfile.name}.
        </p>

        {/* Search Bar & 2-Tier Filter Chips */}
        <div className="w-full mt-4 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 max-w-2xl">
            <div className="relative flex-1 group">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-600 dark:group-focus-within:text-sky-400 transition-colors" />
              <input
                id="article-search-input"
                type="text"
                placeholder="Search by ID (blog-001), framework, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-24 py-3 bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-full text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 pointer-events-none">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 border border-rose-200 dark:border-rose-500/20 transition-all cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
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
                    onClick={() => {
                      setSelectedParent(cat);
                      setSelectedSub('All');
                    }}
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

          {/* Level 2: Subcategories when parent selected */}
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
                      onClick={() => setSelectedSub(sub)}
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
      </section>

      {/* Featured Research Hero Card */}
      {featuredArticle && (
        <div
          className="relative rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-sky-100 dark:border-slate-800 p-6 md:p-10 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 dark:hover:shadow-sky-950/30 hover:border-sky-300 dark:hover:border-sky-500/40 transition-all group hover:-translate-y-1 duration-500 ease-out overflow-hidden"
        >
          {/* Subtle top scanline pulse on hover */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-200/40 dark:bg-sky-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/20">
                    {featuredArticle.id}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold uppercase tracking-wider border border-sky-200/70 dark:border-sky-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    Featured Deep Dive
                  </span>
                  {featuredArticle.subCategory && (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
                      {featuredArticle.subCategory}
                    </span>
                  )}
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredArticle.readTime}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-500 font-display">
                  {featuredArticle.title}
                </h2>

                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                  {featuredArticle.excerpt}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Link
                  href={`/blog/${featuredArticle.id}`}
                  onClick={() => triggerNavAnimation(`/blog/${featuredArticle.id}`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md shadow-sky-600/20 transition-all duration-300 click-bounce cursor-pointer group/btn"
                >
                  <span>Open Full Guideline</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>

                {featuredArticle.forumUrl && (
                  <a
                    href={featuredArticle.forumUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                    <span>discuss.frappe.io</span>
                  </a>
                )}
              </div>
            </div>

            {/* Code Snippet Box (Right) */}
            <div className="lg:col-span-5 w-full">
              {featuredArticle.codeSnippet && (
                <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 shadow-2xl relative overflow-hidden text-xs font-mono text-slate-200 group-hover:border-sky-500/40 transition-colors duration-500">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                      </div>
                      <span className="text-slate-300 font-semibold pl-1 font-mono">
                        {featuredArticle.codeSnippet.filename}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] uppercase font-bold">
                      {featuredArticle.codeSnippet.language}
                    </span>
                  </div>
                  <pre className="pt-3 text-[11px] leading-relaxed overflow-x-auto text-slate-300 font-mono">
                    <code>{featuredArticle.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid of Filtered Field Notes */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
              Peer-Reviewed Field Notes
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-semibold border border-sky-200 dark:border-sky-500/20">
              {filteredArticles.length} Publications
            </span>
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <motion.div
            key="empty-articles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-center py-16 bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-sky-100 dark:border-slate-800 p-8 shadow-sm"
          >
            <BookOpen className="w-8 h-8 text-sky-500 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">No articles found</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
              No field notes match your filter ({selectedParent} / {selectedSub}).
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-full bg-sky-600 text-white font-semibold text-xs shadow-md hover:bg-sky-500 cursor-pointer click-bounce"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => {
              const isBookmarked = bookmarkedIds.includes(article.id);
              const artParent = article.parentCategory || detectParentCategory(article.category);
              const artSub = article.subCategory || article.category;

              return (
                <motion.div
                  key={`${selectedParent}-${selectedSub}-${article.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.8, // 800ms pure fade in as requested
                    ease: 'easeOut',
                  }}
                  className="flex flex-col justify-between h-full rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 dark:hover:shadow-sky-950/30 hover:border-sky-300 dark:hover:border-sky-500/40 transition-all group hover:-translate-y-1 duration-500 ease-out relative overflow-hidden"
                >
                  {/* Subtle top scanline pulse on hover */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* ID Badge */}
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-500/20">
                          {article.id}
                        </span>

                        {/* Category Pill */}
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
                          {artParent}
                        </span>

                        {artSub && artSub !== artParent && (
                          <span className="px-2 py-0.5 rounded-full bg-sky-50/70 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-[10px] font-semibold border border-sky-200/60 dark:border-sky-800/40">
                            {artSub}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(article.id, e)}
                        aria-label="Bookmark article"
                        className={`p-1 transition-colors click-bounce cursor-pointer ${
                          isBookmarked ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 hover:text-sky-600'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span>{article.publishedDate}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>

                    <h4 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-500 line-clamp-2">
                      {article.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-body line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      {article.tags[0] && (
                        <span className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 font-mono text-[10px]">
                          #{article.tags[0]}
                        </span>
                      )}
                    </div>
                    {/* ONLY 'Read Guide' is clickable to view blog details */}
                    <Link
                      href={`/blog/${article.id}`}
                      onClick={() => triggerNavAnimation(`/blog/${article.id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-xs text-sky-600 dark:text-sky-400 hover:text-white hover:bg-sky-600 dark:hover:bg-sky-500 bg-sky-50 dark:bg-sky-500/10 border border-sky-200/80 dark:border-sky-500/20 transition-all duration-300 click-bounce cursor-pointer group/btn"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Newsletter Subscription Banner */}
      <section className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-sky-100 dark:border-slate-800 p-6 md:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-2">
            <div className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-bold tracking-wider uppercase">
              <BookOpen className="w-4 h-4" />
              <span>System Architecture Digest</span>
            </div>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-50">
              Get Technical Deconstructions Delivered Directly
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl font-body leading-relaxed">
              No fluff or marketing digests. Only raw benchmark results, code architectures, and distributed systems notes sent monthly.
            </p>
          </div>

          <div className="lg:col-span-5">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="developer@company.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
              <button
                type="submit"
                disabled={newsletterSubmitting}
                className="px-6 py-3 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-md shadow-sky-600/20 disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {newsletterSubmitting ? 'Joining...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
