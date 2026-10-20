'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Star,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Terminal,
  Share2,
  Check,
  Copy,
  Globe,
  Sliders,
  Sparkles,
  Save,
  Tag
} from 'lucide-react';
import { Project } from '@/lib/types';
import { useToast } from './ToastContext';
import { usePortfolioData } from './PortfolioDataContext';
import { PARENT_CATEGORIES, getSubcategoriesForParent } from '@/lib/categories';
import { copyToClipboard } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';

interface ProjectDetailsViewProps {
  project: Project;
  mode?: 'view' | 'edit';
  onSave?: (updated: Project) => Promise<boolean | void> | void;
  onCancel?: () => void;
}

export function ProjectDetailsView({
  project,
  mode = 'view',
  onSave,
  onCancel
}: ProjectDetailsViewProps) {
  const { data } = usePortfolioData();
  const developerProfile = data.profile;
  const { showToast } = useToast();

  const isEdit = mode === 'edit';

  const [formData, setFormData] = useState<Project>({ ...project });
  const [rawTags, setRawTags] = useState(project.tags?.join(', ') || '');
  const [rawHighlights, setRawHighlights] = useState(project.architectureHighlights?.join('\n') || '');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({ ...project });
    setRawTags(project.tags?.join(', ') || '');
    setRawHighlights(project.architectureHighlights?.join('\n') || '');
  }, [project]);

  const handleCopyCode = async (codeText?: string) => {
    const text = codeText || formData.codeSnippet?.code || '';
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedSnippet(true);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopiedSnippet(false), 2000);
    } else {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleShareLink = async () => {
    if (typeof window !== 'undefined') {
      const ok = await copyToClipboard(window.location.href);
      if (ok) {
        setCopiedLink(true);
        showToast('Project link copied to clipboard!', 'success');
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        showToast('Failed to copy link', 'error');
      }
    }
  };

  const handleSaveProject = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Project title cannot be empty', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const updatedProject: Project = {
        ...formData,
        tags: rawTags.split(',').map((t) => t.trim()).filter(Boolean),
        architectureHighlights: rawHighlights.split('\n').map((h) => h.trim()).filter(Boolean),
      };

      if (onSave) {
        await onSave(updatedProject);
      }
      showToast('Project details saved successfully!', 'success');
    } catch {
      showToast('Failed to save project.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const availableSubcategories = getSubcategoriesForParent(formData.parentCategory || 'Fullstack');

  return (
    <div className="w-full relative min-h-screen bg-slate-50/50 dark:bg-[#0b1120]">
      {/* Admin Editor Top Banner */}
      {isEdit && (
        <div className="sticky top-16 z-30 w-full bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-sky-500/30 text-white px-4 sm:px-8 py-3 shadow-xl transition-all">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block">
                  Project Editor & Specification
                </span>
                <span className="text-xs text-slate-300 font-medium truncate max-w-sm block">
                  Editing: {formData.title || 'Untitled Project'} ({formData.id})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}

              {formData.id && (
                <Link
                  href={`/projects/${formData.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-sky-300 bg-sky-950/60 hover:bg-sky-900/80 border border-sky-700/50 transition-colors"
                  title="View live public project page"
                >
                  <span>View Public Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}

              <button
                type="button"
                onClick={() => handleSaveProject()}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/30 transition-all disabled:opacity-70 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Project</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Navigation Breadcrumb (Public View) */}
        {!isEdit && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Back to Projects Vault</span>
            </Link>

            <div className="flex items-center gap-2">
              {formData.liveUrl && (
                <a
                  href={formData.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-sm transition-all"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Launch Live Demo</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              )}

              {formData.githubUrl && (
                <a
                  href={formData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-2xs transition-all"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repository</span>
                </a>
              )}

              <button
                onClick={handleShareLink}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
                title="Copy project link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column */}
          <article className="lg:col-span-8 space-y-6">
            {/* Header Meta */}
            <header className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {isEdit ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                        Parent Category
                      </label>
                      <select
                        value={formData.parentCategory || 'Fullstack'}
                        onChange={(e) => {
                          const newParent = e.target.value;
                          const subs = getSubcategoriesForParent(newParent);
                          setFormData({
                            ...formData,
                            parentCategory: newParent,
                            subCategory: subs[0] || '',
                            category: newParent as any
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                      >
                        {PARENT_CATEGORIES.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                        Subcategory
                      </label>
                      <select
                        value={formData.subCategory || availableSubcategories[0] || ''}
                        onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                      >
                        {availableSubcategories.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                        Deployment Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                      >
                        <option value="Live">Live</option>
                        <option value="In Development">In Development</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="font-mono text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-500/20">
                      {formData.id}
                    </span>
                    <span className="px-3 py-0.5 rounded-full font-semibold bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/20">
                      {formData.parentCategory || 'Fullstack'}
                    </span>
                    {formData.subCategory && (
                      <span className="px-2.5 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {formData.subCategory}
                      </span>
                    )}
                    <span className="text-slate-400">•</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {formData.status}
                    </span>
                    {formData.stars && (
                      <>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          {formData.stars} Stars
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Title */}
              {isEdit ? (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 font-display px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border-2 border-sky-500/40 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              ) : (
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 font-display tracking-tight leading-tight">
                  {formData.title}
                </h1>
              )}

              {/* Author & Vault Credentials */}
              <div className="flex items-center gap-3 pt-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                  {developerProfile.initials || 'PV'}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>{developerProfile.name}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/20">
                      Lead Architect
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Verified Production Solution • Engineering Vault
                  </div>
                </div>
              </div>
            </header>

            {/* Metrics & Performance Callout */}
            {formData.metrics && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-transparent border border-sky-200 dark:border-sky-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Production Telemetry Index
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                      {formData.metrics}
                    </span>
                  </div>
                </div>

                {formData.liveUrl && !isEdit && (
                  <a
                    href={formData.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-sm transition-all"
                  >
                    <span>Launch Live Demo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {/* Description & Long Overview */}
            {isEdit ? (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Short Description (Grid Card Summary)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Long Overview & Solution Architecture
                  </label>
                  <textarea
                    rows={4}
                    value={formData.longDescription}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <p className="text-sm sm:text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed font-body">
                  {formData.longDescription || formData.description}
                </p>
              </div>
            )}

            {/* Architectural Highlights */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-500" />
                <span>Key Architectural Highlights & Innovations</span>
              </h2>

              {isEdit ? (
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    One highlight per line:
                  </label>
                  <textarea
                    rows={4}
                    value={rawHighlights}
                    onChange={(e) => setRawHighlights(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
              ) : (
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {formData.architectureHighlights?.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{hl}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quickstart Code Snippet Box */}
            {formData.codeSnippet && formData.codeSnippet.code && (
              <CodeBlock
                code={formData.codeSnippet.code}
                filename={formData.codeSnippet.filename || 'solution_snippet.py'}
                language={formData.codeSnippet.language || 'Code'}
              />
            )}

            {/* Markdown Case Study / Content */}
            {formData.content && (
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 font-display flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Terminal className="w-4 h-4 text-sky-500" />
                  <span>Technical Case Study & Implementation Details</span>
                </h2>

                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-body whitespace-pre-wrap">
                  {formData.content}
                </div>
              </div>
            )}

            {/* Tags & Tech Domains */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Technical Stack & Keywords
              </span>
              {isEdit ? (
                <div>
                  <input
                    type="text"
                    value={rawTags}
                    onChange={(e) => setRawTags(e.target.value)}
                    placeholder="Frappe Framework, Python, MariaDB, Redis"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Separate with commas</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {formData.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Back Button */}
            {!isEdit && (
              <div className="pt-6 pb-12 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to All Projects</span>
                </Link>

                {formData.liveUrl && (
                  <a
                    href={formData.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Launch Live Solution</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-5 sticky top-20">
            {/* Project Specs Card */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Sliders className="w-3.5 h-3.5 text-sky-500" />
                <span>Project Specifications</span>
              </div>

              <div className="space-y-2 divide-y divide-slate-100 dark:divide-slate-800/80">
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Project ID</span>
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{formData.id}</span>
                </div>
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Parent Category</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.parentCategory || 'Fullstack'}</span>
                </div>
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Subcategory</span>
                  <span className="font-semibold text-sky-600 dark:text-sky-400">{formData.subCategory || 'Frappe Framework'}</span>
                </div>
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Status</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {formData.status}
                  </span>
                </div>
                {formData.stars && (
                  <div className="flex items-center justify-between pt-1.5">
                    <span className="text-slate-500 dark:text-slate-400">GitHub Community</span>
                    <span className="font-mono font-semibold text-amber-500">{formData.stars} Stars</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 shadow-lg border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Live Engineering Artifacts
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Explore the running production deployment or inspect the source repository on GitHub.
              </p>
              <div className="space-y-2 pt-1">
                {formData.liveUrl && (
                  <a
                    href={formData.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Live Application</span>
                  </a>
                )}
                {formData.githubUrl && (
                  <a
                    href={formData.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View GitHub Source</span>
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
