'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { usePortfolioData } from '@/components/PortfolioDataContext';
import { initialProjects } from '@/lib/data';
import { ProjectDetailsView } from '@/components/ProjectDetailsView';
import { ArrowLeft, FolderGit2 } from 'lucide-react';

export default function ProjectPostPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const { data } = usePortfolioData();
  const projects = data.projects && data.projects.length > 0 ? data.projects : initialProjects;

  // Match project by id or slug (e.g. pro-001)
  const project = projects.find(
    (p) =>
      p.id.toLowerCase() === slug.toLowerCase() ||
      p.slug?.toLowerCase() === slug.toLowerCase()
  );

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-sky-100 dark:bg-slate-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
          <FolderGit2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
          Project Not Found
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
          The requested project engineering specification could not be found in the active project inventory.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Projects</span>
        </Link>
      </div>
    );
  }

  return <ProjectDetailsView project={project} mode="view" />;
}
