'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { usePortfolioData } from '@/components/PortfolioDataContext';
import { initialArticles } from '@/lib/data';
import { BlogDetailsView } from '@/components/BlogDetailsView';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function BlogPostPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const { data } = usePortfolioData();
  const articles = data.articles && data.articles.length > 0 ? data.articles : initialArticles;

  // Match article by id, slug, or legacy slug
  const article = articles.find(
    (a) =>
      a.id.toLowerCase() === slug.toLowerCase() ||
      a.slug?.toLowerCase() === slug.toLowerCase() ||
      (slug.includes('frappe') && a.id === 'blog-001')
  );

  if (!article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-sky-100 dark:bg-slate-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
          Article Not Found
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
          The requested engineering guideline or field note could not be located in the current publication registry.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Field Notes</span>
        </Link>
      </div>
    );
  }

  return <BlogDetailsView article={article} mode="view" />;
}
