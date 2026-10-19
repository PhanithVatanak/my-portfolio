'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Sparkles, Clock, ArrowRight, Bookmark, Code, Terminal, CheckCircle2, Send, Cpu, X, BookOpen, Layers } from 'lucide-react';
import { Article } from '@/lib/types';
import { useToast } from './ToastContext';
import { usePortfolioData } from '@/components/PortfolioDataContext';

export function BlogShowcase() {
  const { data } = usePortfolioData();
  const initialArticles = data.articles;
  const developerProfile = data.profile;
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);

  const filters = [
    { label: 'All Articles', value: 'all' },
    { label: 'Next.js & React', value: 'react' },
    { label: 'System Architecture', value: 'architecture' },
    { label: 'Performance', value: 'performance' },
    { label: 'AI & LLMs', value: 'ai' },
    { label: 'Developer Log', value: 'log' },
  ];

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
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to subscribe');

      showToast(data.message || 'Subscribed successfully!', 'success');
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
      if (article.id === featuredArticle.id) return false; // shown in hero card

      let matchesFilter = true;
      if (selectedFilter === 'react') {
        matchesFilter = article.tags.some((t) => ['Next.js', 'React', 'React 19', 'Frontend', 'Tailwind v4'].includes(t));
      } else if (selectedFilter === 'architecture') {
        matchesFilter = article.category === 'Architecture' || article.tags.includes('Architecture');
      } else if (selectedFilter === 'performance') {
        matchesFilter = article.category === 'Performance' || article.tags.includes('Performance') || article.tags.includes('WebGL2');
      } else if (selectedFilter === 'ai') {
        matchesFilter = article.category === 'AI & LLMs' || article.tags.includes('AI & LLMs');
      } else if (selectedFilter === 'log') {
        matchesFilter = article.category === 'Developer Log' || article.tags.includes('Scale');
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.tags.some((t) => t.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }, [selectedFilter, searchQuery, featuredArticle, initialArticles]);

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
          Deep dives into Next.js 15, React Server Components, Web Performance, and Architecture experiments by {developerProfile.name}.
        </p>

        {/* Search Bar & Filter Chips */}
        <div className="w-full mt-4 flex flex-col gap-4">
          <div className="relative w-full max-w-2xl group">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-600 dark:group-focus-within:text-sky-400 transition-colors" />
            <input
              id="article-search-input"
              type="text"
              placeholder="Search telemetry notes, research papers, framework benchmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-3.5 bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-full text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 pointer-events-none">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap pt-1">
            {filters.map((f) => {
              const isSelected = selectedFilter === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setSelectedFilter(f.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 ease-out select-none hover:-translate-y-0.5 active:translate-y-0 ${
                    isSelected
                      ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/30 border border-transparent'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-500/40 hover:bg-sky-50/80 dark:hover:bg-slate-800/90 hover:text-sky-600 dark:hover:text-sky-300 shadow-2xs hover:shadow-sm hover:shadow-sky-500/10'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Research Hero Card */}
      {featuredArticle && (
        <div
          onClick={() => setActiveArticle(featuredArticle)}
          className="relative rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-sky-100 dark:border-slate-800 p-6 md:p-10 shadow-xl overflow-hidden group hover:border-sky-300 dark:hover:border-slate-700 transition-all cursor-pointer"
        >
          {/* Subtle glow accent inside card */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-200/40 dark:bg-sky-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Content Column (Left) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold uppercase tracking-wider border border-sky-200/70 dark:border-sky-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    Featured Deep Dive
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredArticle.readTime}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 dark:text-slate-400">{featuredArticle.publishedDate}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors font-display">
                  {featuredArticle.title}
                </h2>

                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                  {featuredArticle.excerpt}
                </p>
              </div>

              {/* Author & CTA */}
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-sky-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sky-600 dark:text-sky-400 text-sm shadow-sm">
                    {developerProfile.initials}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
                      {developerProfile.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Senior Systems Architect
                    </span>
                  </div>
                </div>

                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all group-hover:scale-105">
                  <span>Read Full Research</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Code Simulation Frame (Right) */}
            <div className="lg:col-span-5 w-full">
              <div className="rounded-2xl bg-slate-950 p-4 shadow-inner border border-slate-800 text-xs text-slate-200 font-mono relative overflow-hidden">
                {/* Console header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Code className="w-3.5 h-3.5 text-sky-400" />
                    <span>streaming-rsc.tsx</span>
                  </div>
                  <span className="text-slate-500 font-bold">TSX</span>
                </div>

                {/* Preformatted code snippet */}
                <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-300 py-1 font-mono">
                  <code>{featuredArticle.codeSnippet?.code || `// High-frequency RSC edge dispatcher
export async function StreamFeed({ channelId }: { channelId: string }) {
  const stream = await fetchTelemetryStream(channelId);
  return (
    <Suspense fallback={<TelemetrySkeleton />}>
      <EdgeBoundary bufferSize={1024}>
        {stream.pipeThrough(createRenderStream())}
      </EdgeBoundary>
    </Suspense>
  );
}`}</code>
                </pre>

                {/* Metrics bar */}
                <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-sky-400 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                    TTFB: 42ms
                  </span>
                  <span>Zero Client Hydration Cost</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Field Notes Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xl md:text-2xl font-bold font-display text-slate-900 dark:text-slate-50">
              Peer-Reviewed Field Notes
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 text-xs font-semibold border border-sky-100 dark:border-slate-700">
              {filteredArticles.length} Publications
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline-block">
            Sorted by Recency & Impact
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const isBookmarked = bookmarkedIds.includes(article.id);

            return (
              <article
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 p-6 border border-sky-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 hover:border-sky-300 dark:hover:border-slate-700 transition-all duration-300 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 text-xs font-semibold border border-sky-100 dark:border-slate-700">
                        {article.category}
                      </span>
                    </div>
                    <button
                      onClick={(e) => toggleBookmark(article.id, e)}
                      aria-label="Bookmark article"
                      className={`p-1 transition-colors ${
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

                  <h4 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                    {article.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-body line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 font-mono text-[10px]">
                      {article.tags[0]}
                    </span>
                    {article.tags[1] && (
                      <span className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 font-mono text-[10px]">
                        {article.tags[1]}
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
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

          <div className="lg:col-span-5 w-full">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="engineer@domain.com"
                className="flex-1 px-4 py-3 rounded-full bg-white dark:bg-slate-950 border border-sky-100 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={newsletterSubmitting}
                className="px-6 py-3 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md shadow-sky-600/25 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-70"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-sky-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-500/20">
                  {activeArticle.category}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {activeArticle.readTime}
                </span>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-10 space-y-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50 font-display leading-tight">
                {activeArticle.title}
              </h1>

              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pb-4 border-b border-sky-100 dark:border-slate-800">
                <span>By {developerProfile.name}</span>
                <span>•</span>
                <span>Published {activeArticle.publishedDate}</span>
                <span>•</span>
                <span>{activeArticle.views}</span>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-4 text-slate-700 dark:text-slate-300">
                <p className="text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {activeArticle.excerpt}
                </p>
                <div className="whitespace-pre-line leading-relaxed">
                  {activeArticle.content}
                </div>
              </div>

              {activeArticle.codeSnippet && (
                <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs text-slate-200 font-mono space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
                    <span>{activeArticle.codeSnippet.filename}</span>
                    <span>{activeArticle.codeSnippet.language}</span>
                  </div>
                  <pre className="overflow-x-auto text-[11px] py-1 text-slate-300">
                    <code>{activeArticle.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-4">
                {activeArticle.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 text-xs font-medium border border-sky-200/70 dark:border-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
