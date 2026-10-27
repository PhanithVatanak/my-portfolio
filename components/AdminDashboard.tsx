'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  Home,
  User,
  FolderGit2,
  Mail,
  FileCode,
  Activity,
  Database,
  GraduationCap,
  Briefcase,
  Languages,
  Layers,
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  RotateCcw,
  Check,
  CheckCircle2,
  X,
  ExternalLink,
  Eye,
  Sun,
  Moon,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  Send,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Youtube,
  MessageSquare,
  Award,
  TrendingUp,
  Server,
  Zap,
  Sparkles,
  Code2,
  Terminal,
  Link2,
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  EyeOff,
  Sliders,
  AlertTriangle,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Clipboard,
  CheckCheck,
  Cpu,
  Camera
} from 'lucide-react';
import { usePortfolioData } from './PortfolioDataContext';
import { useToast } from './ToastContext';
import { useTheme } from './ThemeProvider';
import { copyToClipboard } from '@/lib/utils';
import {
  Project,
  Experience,
  EducationItem,
  SpokenLanguage,
  Article,
  ContactMessage,
  WhatIDoItem,
  DeveloperProfile,
  SocialLinkItem,
  TechRadarItem
} from '@/lib/types';
import { initialTechRadar } from '@/lib/data';
import { BlogDetailsView } from './BlogDetailsView';
import { ProjectDetailsView } from './ProjectDetailsView';
import { PARENT_CATEGORIES, getSubcategoriesForParent } from '@/lib/categories';

// Helper component to render icon badge for social platforms
function PlatformIconBadge({ icon, className = 'w-4 h-4' }: { icon?: string; className?: string }) {
  const norm = (icon || '').toLowerCase();
  if (norm.includes('github')) return <Github className={className} />;
  if (norm.includes('linkedin')) return <Linkedin className={className} />;
  if (norm.includes('twitter') || norm === 'x') return <Twitter className={className} />;
  if (norm.includes('telegram') || norm.includes('send')) return <Send className={className} />;
  if (norm.includes('discord') || norm.includes('message')) return <MessageSquare className={className} />;
  if (norm.includes('mail') || norm.includes('email')) return <Mail className={className} />;
  if (norm.includes('youtube')) return <Youtube className={className} />;
  if (norm.includes('gitlab') || norm.includes('code')) return <Code2 className={className} />;
  if (norm.includes('terminal')) return <Terminal className={className} />;
  if (norm.includes('sparkles')) return <Sparkles className={className} />;
  if (norm.includes('link')) return <Link2 className={className} />;
  return <Globe className={className} />;
}

// Available platform icons for selection
const AVAILABLE_PLATFORM_ICONS = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'send', label: 'Telegram / Send' },
  { value: 'message-square', label: 'Discord / Chat' },
  { value: 'mail', label: 'Email / Mail' },
  { value: 'globe', label: 'Website / Portfolio' },
  { value: 'youtube', label: 'YouTube / Video' },
  { value: 'code', label: 'GitLab / Dev' },
  { value: 'terminal', label: 'CLI / Terminal' },
  { value: 'sparkles', label: 'AI / Sparkles' },
  { value: 'link-2', label: 'Generic Link' },
];

interface AvatarImageManagerProps {
  avatarUrl: string;
  onChange: (newUrl: string) => void;
  defaultAvatarUrl: string;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  title?: string;
  subtitle?: string;
}

function AvatarImageManager({
  avatarUrl,
  onChange,
  defaultAvatarUrl,
  showToast,
  title = "Profile Image / Headshot Avatar",
  subtitle = "Choose either an ImageKit URL (fastest & recommended) or attach a JPG file directly from your computer."
}: AvatarImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (.jpg, .jpeg, .png, .webp)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      // Use window.Image constructor to avoid conflict with Next.js Image component
      const ImgConstructor = (typeof window !== 'undefined' ? (window as unknown as { Image: new () => HTMLImageElement }).Image : null);
      if (!ImgConstructor) return;
      const img = new ImgConstructor();
      img.onload = () => {
        // High quality scale down to 600x600 max to keep storage compact & ultra-fast
        const canvas = document.createElement('canvas');
        const maxDim = 600;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          onChange(compressedDataUrl);
          showToast('Image attached and optimized as profile picture!', 'success');
        } else {
          onChange(loadEvent.target?.result as string);
          showToast('Image attached as profile picture!', 'success');
        }
      };
      img.src = loadEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const isImageKit = avatarUrl?.includes('imagekit.io');
  const isDataUrl = avatarUrl?.startsWith('data:');
  const isLocal = avatarUrl?.startsWith('/') && !avatarUrl?.startsWith('//');

  return (
    <div className="md:col-span-3 p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {title}
          </label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {isImageKit ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30">
              <CheckCircle2 className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              ImageKit CDN Active
            </span>
          ) : isDataUrl ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Direct File Attached
            </span>
          ) : isLocal ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/30">
              Public Asset
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              External URL
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-5">
        {/* Avatar Live Preview */}
        <div className="relative group shrink-0">
          <div className="size-24 sm:size-28 rounded-2xl overflow-hidden ring-4 ring-sky-300/80 dark:ring-sky-500/60 shadow-md bg-slate-200 dark:bg-slate-800 relative flex items-center justify-center">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Avatar Preview"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://picsum.photos/seed/vatanak/400/400';
                }}
              />
            ) : (
              <User className="size-10 text-slate-400" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-md cursor-pointer transition-transform hover:scale-110"
            title="Upload / Change JPG"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Actions & URL Input */}
        <div className="flex-1 w-full space-y-3">
          {/* File attachment button + hidden input */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Attach Local JPG / PNG
            </button>

            <a
              href="https://imagekit.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-500" />
              Open ImageKit.io
            </a>

            {avatarUrl && avatarUrl !== defaultAvatarUrl && (
              <button
                type="button"
                onClick={() => onChange(defaultAvatarUrl)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-xs font-medium transition-all cursor-pointer"
                title="Reset to default avatar"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>

          {/* URL Input */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Or paste direct ImageKit URL / Cloud CDN Link:
            </label>
            <div className="relative">
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://ik.imagekit.io/your_id/profile.jpg or /avatar.jpg"
                className="w-full pl-3 pr-20 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              {avatarUrl?.startsWith('http') && (
                <a
                  href={avatarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  Test Link <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-sky-50/70 dark:bg-sky-950/20 p-2.5 rounded-xl border border-sky-100 dark:border-sky-900/30">
            <strong className="text-sky-800 dark:text-sky-300">💡 Image Option Guide:</strong>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-800 dark:text-slate-200">ImageKit URL (Recommended):</strong> Upload your JPG to ImageKit.io and paste the link. Blazing fast CDN, auto WebP compression, and zero database bloat.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Attach Local JPG:</strong> Click <em>&quot;Attach Local JPG / PNG&quot;</em> to upload directly from your computer without needing an account (auto-compressed).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const {
    data,
    saveData,
    updateProfile,
    updateWhatIDo,
    updateProjects,
    updateExperiences,
    updateEducation,
    updateLanguages,
    updateTechRadar,
    updateArticles,
    resetToDefaults,
    importJson,
    getFormattedJson,
    lastUpdated
  } = usePortfolioData();

  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  // Active Admin View Tab: Modular pages + Content & System
  type AdminTab =
    | 'home'
    | 'about'
    | 'projects'
    | 'contact'
    | 'articles'
    | 'overview'
    | 'json';

  const [activeTab, setActiveTab] = useState<AdminTab>('home');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('spv_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('spv_admin_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Strict Administrator Authentication System
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('spv_admin_role');
      if (stored === 'admin') {
        setIsAdminAuthenticated(true);
      } else {
        sessionStorage.removeItem('spv_admin_role');
        setIsAdminAuthenticated(false);
      }
    } catch {
      // fallback
    } finally {
      setIsAuthLoaded(true);
    }
  }, []);

  const handleUnlockAdmin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError('');
    if (!passcodeAttempt.trim()) {
      setAuthError('Please enter the administrator passcode.');
      return;
    }

    try {
      setAuthLoading(true);
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcodeAttempt.trim() }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setIsAdminAuthenticated(true);
        try {
          sessionStorage.setItem('spv_admin_role', 'admin');
        } catch {}
        showToast('Administrator privileges granted. Full read/write enabled!', 'success');
        setPasscodeAttempt('');
      } else {
        setAuthError(json.error || 'Invalid administrator passcode. Please try again.');
      }
    } catch {
      setAuthError('Failed to communicate with authentication endpoint.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLockConsole = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('spv_admin_role');
    } catch {}
    showToast('Admin Console locked.', 'info');
  };

  const requireAdmin = (actionName = 'This action'): boolean => {
    if (!isAdminAuthenticated) {
      showToast(`${actionName} is strictly restricted to administrators.`, 'error');
      return false;
    }
    return true;
  };

  // Contact Inquiries state (loaded from /api/contact)
  const [inquiries, setInquiries] = useState<ContactMessage[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [inquirySearch, setInquirySearch] = useState('');

  // Profile Overrides State
  const [profileOverrides, setProfileOverrides] = useState<Partial<DeveloperProfile>>({});
  const profileForm = useMemo(() => ({
    ...data.profile,
    ...profileOverrides,
  }), [data.profile, profileOverrides]);

  // Social Links List State (Frappe Child Table)
  const [socialLinksOverrides, setSocialLinksOverrides] = useState<SocialLinkItem[] | null>(null);
  const socialLinksList = useMemo(() => {
    if (socialLinksOverrides !== null) return socialLinksOverrides;
    if (profileForm.socialLinks && profileForm.socialLinks.length > 0) return profileForm.socialLinks;
    return [
      { id: 'soc-1', platform: 'GitHub', url: profileForm.socials.github || 'https://github.com', icon: 'github', label: 'Code Vault' },
      { id: 'soc-2', platform: 'LinkedIn', url: profileForm.socials.linkedin || 'https://linkedin.com', icon: 'linkedin', label: 'Professional Network' },
      { id: 'soc-3', platform: 'Twitter / X', url: profileForm.socials.twitter || 'https://twitter.com', icon: 'twitter', label: 'Dispatches & Tech' },
      { id: 'soc-4', platform: 'Telegram', url: profileForm.socials.telegram || 'https://t.me/example', icon: 'send', label: 'Direct Wire' },
    ];
  }, [socialLinksOverrides, profileForm.socialLinks, profileForm.socials]);

  // Handlers for Social Links Child Table
  const handleAddSocialLink = () => {
    const newLink: SocialLinkItem = {
      id: 'soc-' + Date.now(),
      platform: 'GitHub',
      url: 'https://github.com',
      icon: 'github',
      label: 'Repository',
    };
    const updated = [...socialLinksList, newLink];
    setSocialLinksOverrides(updated);
  };

  const handleUpdateSocialLink = (index: number, field: keyof SocialLinkItem, value: string) => {
    const updated = [...socialLinksList];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinksOverrides(updated);
  };

  const handleDeleteSocialLink = (id: string) => {
    const updated = socialLinksList.filter((s) => s.id !== id);
    setSocialLinksOverrides(updated);
  };

  const handleMoveSocialLink = (index: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= socialLinksList.length) return;
    const updated = [...socialLinksList];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setSocialLinksOverrides(updated);
  };

  // Sync socialLinks with socials map on save
  const handleSaveProfileAndLinks = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!requireAdmin('Saving profile & links')) return;
    const updatedSocials = { ...profileForm.socials };
    socialLinksList.forEach((item) => {
      const p = item.platform.toLowerCase();
      if (p.includes('github')) updatedSocials.github = item.url;
      else if (p.includes('linkedin')) updatedSocials.linkedin = item.url;
      else if (p.includes('twitter') || p.includes('x')) updatedSocials.twitter = item.url;
      else if (p.includes('telegram')) updatedSocials.telegram = item.url;
      else if (p.includes('email') || p.includes('mail')) updatedSocials.email = item.url;
    });

    const finalProfile: DeveloperProfile = {
      ...profileForm,
      socials: updatedSocials,
      socialLinks: socialLinksList,
    };

    const ok = await updateProfile(finalProfile);
    if (ok) {
      setProfileOverrides({});
      setSocialLinksOverrides(null);
      showToast('Page configuration saved & synced across whole site!', 'success');
    } else {
      showToast('Failed to save configuration.', 'error');
    }
  };

  // What I Do Services (Frappe Child Table)
  const [whatIDoOverrides, setWhatIDoOverrides] = useState<WhatIDoItem[] | null>(null);
  const whatIDoList = whatIDoOverrides ?? data.whatIDo;
  const [editingWhatIDo, setEditingWhatIDo] = useState<WhatIDoItem | null>(null);
  const [isNewWhatIDo, setIsNewWhatIDo] = useState(false);

  const handleOpenAddWhatIDo = () => {
    const newItem: WhatIDoItem = {
      id: 'srv-' + Date.now(),
      title: 'Full-Stack Edge Engineering',
      description: 'Architecting end-to-end distributed applications with low latency and real-time state synchronization.',
      icon: 'terminal',
    };
    setEditingWhatIDo(newItem);
    setIsNewWhatIDo(true);
  };

  const handleOpenEditWhatIDo = (item: WhatIDoItem) => {
    setEditingWhatIDo({ ...item });
    setIsNewWhatIDo(false);
  };

  const handleSaveWhatIDoModal = async () => {
    if (!requireAdmin('Saving service card')) return;
    if (!editingWhatIDo) return;
    let nextList: WhatIDoItem[];
    if (isNewWhatIDo) {
      nextList = [...whatIDoList, editingWhatIDo];
    } else {
      nextList = whatIDoList.map((item) => (item.id === editingWhatIDo.id ? editingWhatIDo : item));
    }
    setWhatIDoOverrides(nextList);
    const ok = await updateWhatIDo(nextList);
    if (ok) {
      showToast(`Service "${editingWhatIDo.title}" saved!`, 'success');
      setEditingWhatIDo(null);
    }
  };

  const handleDeleteWhatIDo = async (id: string) => {
    if (!requireAdmin('Deleting service card')) return;
    const nextList = whatIDoList.filter((item) => item.id !== id);
    setWhatIDoOverrides(nextList);
    await updateWhatIDo(nextList);
    showToast('Service card deleted.', 'info');
  };

  const handleMoveWhatIDo = async (index: number, dir: 'up' | 'down') => {
    if (!requireAdmin('Reordering services')) return;
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= whatIDoList.length) return;
    const nextList = [...whatIDoList];
    const temp = nextList[index];
    nextList[index] = nextList[target];
    nextList[target] = temp;
    setWhatIDoOverrides(nextList);
    await updateWhatIDo(nextList);
  };

  // Projects CMS & Details View State
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isEditingProject, setIsEditingProject] = useState<boolean>(false);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('All');
  const [projectParentFilter, setProjectParentFilter] = useState('All');
  const [projectSubFilter, setProjectSubFilter] = useState('All');

  // Helper ID generators: pro-001, blog-001 format
  const generateNextProjectId = (projects: Project[]) => {
    const nums = projects
      .map((p) => {
        const m = p.id.match(/^pro-(\d+)$/i);
        return m ? parseInt(m[1], 10) : 0;
      })
      .filter((n) => n > 0);
    const nextNum = (nums.length > 0 ? Math.max(...nums) : projects.length) + 1;
    return `pro-${String(nextNum).padStart(3, '0')}`;
  };

  const generateNextArticleId = (articles: Article[]) => {
    const nums = articles
      .map((a) => {
        const m = a.id.match(/^blog-(\d+)$/i);
        return m ? parseInt(m[1], 10) : 0;
      })
      .filter((n) => n > 0);
    const nextNum = (nums.length > 0 ? Math.max(...nums) : articles.length) + 1;
    return `blog-${String(nextNum).padStart(3, '0')}`;
  };

  const handleCreateNewProject = () => {
    if (!requireAdmin('Creating project')) return;
    const newId = generateNextProjectId(data.projects);
    const newProj: Project = {
      id: newId,
      title: 'New Innovation System',
      slug: newId,
      description: 'High-performance interactive web application built with modern standards.',
      longDescription: 'Comprehensive full-stack system incorporating distributed edge rendering and low-latency state synchronization.',
      category: 'Full Stack',
      parentCategory: 'Fullstack',
      subCategory: 'Frappe Framework',
      tags: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Frappe Framework'],
      architectureHighlights: [
        'Modular micro-service architecture',
        'Automated schema generation and real-time APIs',
        'Sub-second query response with optimized database indexing'
      ],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/PhanithVatanak',
      iconName: 'terminal',
      status: 'Live',
      stars: 42,
      codeSnippet: {
        filename: 'quickstart.sh',
        language: 'Bash',
        code: `# 1. Clone & install dependencies\ngit clone https://github.com/PhanithVatanak/project.git\ncd project\nnpm install\n\n# 2. Run dev server\nnpm run dev`
      }
    };
    const nextProjects = [newProj, ...data.projects];
    updateProjects(nextProjects);
    setSelectedProjectId(newProj.id);
    setIsEditingProject(true);
    showToast(`New project ${newId} initialized. Live editor opened!`, 'info');
  };

  const handleSaveProject = async (updated: Project) => {
    if (!requireAdmin('Saving project')) return;
    const existingIndex = data.projects.findIndex((p) => p.id === updated.id);
    let nextProjects: Project[];
    if (existingIndex >= 0) {
      nextProjects = [...data.projects];
      nextProjects[existingIndex] = updated;
    } else {
      nextProjects = [updated, ...data.projects];
    }
    const ok = await updateProjects(nextProjects);
    if (ok) {
      setIsEditingProject(false);
      showToast(`Project ${updated.id} saved & synced to Turso database!`, 'success');
    } else {
      showToast('Failed to save project.', 'error');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!requireAdmin('Deleting project')) return;
    if (window.confirm(`Delete project ${id} permanently?`)) {
      const nextProjects = data.projects.filter((p) => p.id !== id);
      const ok = await updateProjects(nextProjects);
      if (ok) {
        if (selectedProjectId === id) {
          setSelectedProjectId(null);
          setIsEditingProject(false);
        }
        showToast(`Project ${id} deleted from vault.`, 'info');
      }
    }
  };

  // Experience Modal / Edit State (kept intact as requested)
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isNewExp, setIsNewExp] = useState(false);

  const handleOpenAddExp = () => {
    const newExp: Experience = {
      id: 'exp-' + Date.now(),
      role: 'Frontend Architect',
      company: 'Global Software Lab',
      period: '2024 - PRESENT',
      description: 'Engineering responsive digital experiences, design systems, and resilient cloud architectures.',
      technologies: ['React 19', 'Next.js 15', 'TypeScript'],
      highlights: ['Designed high-throughput streaming systems', 'Mentored engineering cohorts'],
    };
    setEditingExp(newExp);
    setIsNewExp(true);
  };

  const handleSaveExpModal = async () => {
    if (!requireAdmin('Saving career experience')) return;
    if (!editingExp) return;
    let nextExp: Experience[];
    if (isNewExp) {
      nextExp = [editingExp, ...data.experiences];
    } else {
      nextExp = data.experiences.map((e) => (e.id === editingExp.id ? editingExp : e));
    }
    const ok = await updateExperiences(nextExp);
    if (ok) {
      showToast('Experience timeline updated!', 'success');
      setEditingExp(null);
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (!requireAdmin('Deleting career experience')) return;
    const nextExp = data.experiences.filter((e) => e.id !== id);
    await updateExperiences(nextExp);
    showToast('Career experience removed.', 'info');
  };

  // Education Modal & Child Table State (Frappe Child Table Pattern)
  const [educationOverrides, setEducationOverrides] = useState<EducationItem[] | null>(null);
  const educationListState = educationOverrides ?? data.education;
  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);
  const [isNewEdu, setIsNewEdu] = useState(false);

  const handleOpenAddEducation = () => {
    const newEdu: EducationItem = {
      id: 'edu-' + Date.now(),
      degree: 'Master of Science in Software Architecture',
      institution: 'Cambodia Academy of Digital Technology',
      location: 'Phnom Penh, Cambodia',
      period: '2023 - 2025',
      honors: 'Summa Cum Laude • GPA 3.90 / 4.0',
      description: 'Specialization in distributed cloud systems, real-time compute pipelines, and micro-frontend architectures.',
      coursework: ['Distributed Systems', 'Cloud Native Architecture', 'Compilers & Runtimes'],
    };
    setEditingEdu(newEdu);
    setIsNewEdu(true);
  };

  const handleOpenEditEducation = (edu: EducationItem) => {
    setEditingEdu({ ...edu });
    setIsNewEdu(false);
  };

  const handleSaveEduModal = async () => {
    if (!requireAdmin('Saving education credential')) return;
    if (!editingEdu) return;
    let nextEdu: EducationItem[];
    if (isNewEdu) {
      nextEdu = [...educationListState, editingEdu];
    } else {
      nextEdu = educationListState.map((e) => (e.id === editingEdu.id ? editingEdu : e));
    }
    setEducationOverrides(nextEdu);
    const ok = await updateEducation(nextEdu);
    if (ok) {
      showToast(`Education credential "${editingEdu.degree}" saved & synced!`, 'success');
      setEditingEdu(null);
    } else {
      showToast('Failed to save education credential.', 'error');
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!requireAdmin('Deleting education credential')) return;
    const nextEdu = educationListState.filter((e) => e.id !== id);
    setEducationOverrides(nextEdu);
    await updateEducation(nextEdu);
    showToast('Education credential removed from record.', 'info');
  };

  const handleMoveEducation = async (index: number, dir: 'up' | 'down') => {
    if (!requireAdmin('Reordering credentials')) return;
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= educationListState.length) return;
    const nextEdu = [...educationListState];
    const temp = nextEdu[index];
    nextEdu[index] = nextEdu[target];
    nextEdu[target] = temp;
    setEducationOverrides(nextEdu);
    await updateEducation(nextEdu);
  };

  // Spoken Languages Child Table State & Handlers
  const [languagesOverrides, setLanguagesOverrides] = useState<SpokenLanguage[] | null>(null);
  const languagesListState = languagesOverrides ?? data.languages;

  const handleAddLanguage = () => {
    const newLang: SpokenLanguage = {
      id: 'lang-' + Date.now(),
      language: 'Japanese',
      level: 'Conversational (JLPT N3)',
      proficiency: 65,
      nativeScript: '日本語 (日常会話)',
    };
    const updated = [...languagesListState, newLang];
    setLanguagesOverrides(updated);
  };

  const handleUpdateLanguage = (index: number, field: keyof SpokenLanguage, value: any) => {
    const updated = [...languagesListState];
    updated[index] = { ...updated[index], [field]: value };
    setLanguagesOverrides(updated);
  };

  const handleDeleteLanguage = (id: string) => {
    if (!requireAdmin('Deleting language')) return;
    const updated = languagesListState.filter((l) => l.id !== id);
    setLanguagesOverrides(updated);
  };

  const handleMoveLanguage = (index: number, dir: 'up' | 'down') => {
    if (!requireAdmin('Reordering languages')) return;
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= languagesListState.length) return;
    const updated = [...languagesListState];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setLanguagesOverrides(updated);
  };

  const handleSaveEducationAndLanguages = async () => {
    if (!requireAdmin('Saving education and languages')) return;
    await updateEducation(educationListState);
    await updateLanguages(languagesListState);
    setEducationOverrides(null);
    setLanguagesOverrides(null);
    showToast('Education & Languages synced to live JSON!', 'success');
  };

  // Tech Radar / Battle-Tested Tooling State (Editable & Synced to Turso Relational DB)
  const [techRadarOverrides, setTechRadarOverrides] = useState<TechRadarItem[] | null>(null);
  const techRadarListState = techRadarOverrides ?? (data.techRadar && data.techRadar.length > 0 ? data.techRadar : initialTechRadar);
  const [editingTech, setEditingTech] = useState<TechRadarItem | null>(null);
  const [isNewTech, setIsNewTech] = useState(false);

  const handleOpenAddTech = () => {
    const newTech: TechRadarItem = {
      id: 'tr-' + Date.now(),
      name: '',
      category: 'Backend & Enterprise Logic',
      proficiency: 'Production Battle-Tested',
      experienceYears: '3+ yrs',
      tags: [],
      showOnHome: true,
    };
    setEditingTech(newTech);
    setIsNewTech(true);
  };

  const handleOpenEditTech = (tech: TechRadarItem) => {
    setEditingTech({ ...tech, showOnHome: Boolean(tech.showOnHome), tags: [...(tech.tags || [])] });
    setIsNewTech(false);
  };

  const handleSaveTechModal = async () => {
    if (!requireAdmin('Saving technology')) return;
    if (!editingTech || !editingTech.name.trim()) {
      showToast('Technology name is required.', 'error');
      return;
    }
    let nextList: TechRadarItem[];
    if (isNewTech) {
      nextList = [...techRadarListState, editingTech];
    } else {
      nextList = techRadarListState.map((t) => (t.id === editingTech.id ? editingTech : t));
    }
    setTechRadarOverrides(nextList);
    if (updateTechRadar) {
      await updateTechRadar(nextList);
    }
    showToast(`Technology "${editingTech.name}" saved & synced!`, 'success');
    setEditingTech(null);
  };

  const handleDeleteTech = async (id: string) => {
    if (!requireAdmin('Deleting technology')) return;
    const nextList = techRadarListState.filter((t) => t.id !== id);
    setTechRadarOverrides(nextList);
    if (updateTechRadar) {
      await updateTechRadar(nextList);
    }
    showToast('Technology removed from tech stack.', 'info');
  };

  const handleMoveTech = (index: number, dir: 'up' | 'down') => {
    if (!requireAdmin('Reordering technologies')) return;
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= techRadarListState.length) return;
    const nextList = [...techRadarListState];
    const temp = nextList[index];
    nextList[index] = nextList[target];
    nextList[target] = temp;
    setTechRadarOverrides(nextList);
  };

  const handleSyncTechRadar = async () => {
    if (!requireAdmin('Syncing tech stack')) return;
    if (updateTechRadar) {
      await updateTechRadar(techRadarListState);
    }
    setTechRadarOverrides(null);
    showToast('Technical Stack & Tooling synced to Turso database!', 'success');
  };

  // Article / Blog CMS state
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState<Article['category']>('Architecture');
  const [articleContent, setArticleContent] = useState('');
  const [articleExcerpt, setArticleExcerpt] = useState('');
  const [articleTags, setArticleTags] = useState('Next.js 15, TypeScript');
  const [articleStatus, setArticleStatus] = useState<Article['status']>('Published');
  const [articleSearch, setArticleSearch] = useState('');
  const [articleParentFilter, setArticleParentFilter] = useState('All');
  const [articleSubFilter, setArticleSubFilter] = useState('All');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [isEditingArticle, setIsEditingArticle] = useState<boolean>(false);

  const handleCreateNewArticle = () => {
    if (!requireAdmin('Creating article')) return;
    const newId = generateNextArticleId(data.articles);
    const newArt: Article = {
      id: newId,
      title: 'Frappe Framework 2026: Team Onboarding Guideline',
      slug: newId,
      category: 'Frappe Framework',
      parentCategory: 'Fullstack',
      subCategory: 'Frappe Framework',
      views: '1.2k views',
      readRate: '96% read rate',
      readTime: '8 min read',
      publishedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Published',
      excerpt: 'Comprehensive onboarding blueprint for software engineers entering the Frappe & ERPNext ecosystem.',
      tags: ['Frappe Framework', 'Python', 'MariaDB', 'Ubuntu 22.04', 'Bench CLI'],
      forumUrl: 'https://discuss.frappe.io',
      forumBadge: 'Official Frappe Community Forum',
      codeSnippet: {
        filename: 'bench_quickstart.sh',
        language: 'Bash',
        code: `# 1. Update OS & install foundational packages\nsudo apt update && sudo apt upgrade -y\nsudo apt install -y git python3-dev python3-pip redis-server\n\n# 2. Start bench\nbench start`
      },
      content: `### Why This Guideline Exists\n\nMany engineers who start learning Frappe find the official documentation fragmented and overwhelming. This guide is crafted as an internal onboarding blueprint to help new team members understand what Frappe actually is, how its architecture functions, and how to set up a production-ready environment on Ubuntu 22.04 LTS without guesswork.\n\n---\n\n### 1. What is Frappe Framework?\n\nFrappe is a full-stack, batteries-included web framework written in **Python** (backend) and **JavaScript / Vue / Jinja** (frontend), backed by **MariaDB / PostgreSQL** and **Redis**.\n\n---\n\n### 2. Core Mental Model: The Frappe Triad\n\n1. **DocType**: Model + Schema + API + UI Form\n2. **Bench**: The CLI orchestrator\n3. **Hooks**: Lifecycle event handlers\n\n---\n\n### 3. Step-by-Step Installation on Ubuntu 22.04 LTS\n\nFollow the verified sequence in the terminal above.`
    };
    const next = [newArt, ...data.articles];
    updateArticles(next);
    setSelectedArticleId(newArt.id);
    setIsEditingArticle(true);
    showToast(`New guideline ${newId} initialized. Live editor opened.`, 'info');
  };

  const handleSaveArticle = async (updated: Article) => {
    if (!requireAdmin('Updating article')) return;
    const existingIndex = data.articles.findIndex((a) => a.id === updated.id);
    let next: Article[];
    if (existingIndex >= 0) {
      next = [...data.articles];
      next[existingIndex] = updated;
    } else {
      next = [updated, ...data.articles];
    }
    const ok = await updateArticles(next);
    if (ok) {
      setIsEditingArticle(false);
      showToast(`Article ${updated.id} saved & updated in Turso database!`, 'success');
    }
  };

  const handlePublishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAdmin('Publishing article')) return;
    if (!articleTitle.trim() || !articleContent.trim()) {
      showToast('Title and content are required.', 'error');
      return;
    }
    const newId = generateNextArticleId(data.articles);
    const newArt: Article = {
      id: newId,
      title: articleTitle.trim(),
      slug: articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: articleCategory,
      parentCategory: 'Fullstack',
      subCategory: 'Frappe Framework',
      views: '1.2k views',
      readRate: '92% read rate',
      readTime: '5 min read',
      publishedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: articleStatus,
      excerpt: articleExcerpt.trim() || articleContent.slice(0, 140) + '...',
      tags: articleTags.split(',').map((t) => t.trim()).filter(Boolean),
      content: articleContent,
    };
    const next = [newArt, ...data.articles];
    const ok = await updateArticles(next);
    if (ok) {
      showToast('Article published to blog vault!', 'success');
      setArticleTitle('');
      setArticleContent('');
      setArticleExcerpt('');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!requireAdmin('Deleting article')) return;
    const next = data.articles.filter((a) => a.id !== id);
    await updateArticles(next);
    showToast('Article removed from research vault.', 'info');
  };

  // Fetch Inquiries
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoadingInquiries(true);
        const res = await fetch('/api/contact');
        if (res.ok) {
          const json = await res.json();
          if (json.messages && Array.isArray(json.messages)) {
            setInquiries(json.messages);
          }
        }
      } catch (err) {
        console.error('Failed to load inquiries:', err);
      } finally {
        setLoadingInquiries(false);
      }
    };
    fetchInquiries();
  }, []);

  const handleToggleInquiryStatus = async (id: string, current: string) => {
    if (!requireAdmin('Updating inquiry status')) return;
    const nextStatus = current === 'unread' ? 'read' : 'unread';
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: nextStatus as any } : m))
        );
        showToast(`Inquiry marked as ${nextStatus}.`, 'info');
      }
    } catch {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!requireAdmin('Deleting inquiry')) return;
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries((prev) => prev.filter((m) => m.id !== id));
        showToast('Inquiry deleted.', 'info');
      }
    } catch {
      showToast('Failed to delete inquiry.', 'error');
    }
  };

  // JSON Vault actions & smart partial importer
  const [jsonInput, setJsonInput] = useState('');
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [jsonModalFullscreen, setJsonModalFullscreen] = useState(false);
  const [jsonTargetSection, setJsonTargetSection] = useState<string>('skills');

  // Target Section definitions for granular imports
  const TARGET_SECTION_TABS = useMemo(
    () => [
      { id: 'auto', label: '⚡ Smart Auto-Detect', sectionName: 'Entire / Auto' },
      { id: 'skills', label: '🎯 Skills', sectionName: 'Skills' },
      { id: 'techRadar', label: '⚡ Tech Radar / Tooling', sectionName: 'Tech Radar' },
      { id: 'whatIDo', label: '💼 What I Do', sectionName: 'What I Do' },
      { id: 'projects', label: '🚀 Projects', sectionName: 'Projects' },
      { id: 'experiences', label: '📜 Experiences', sectionName: 'Experiences' },
      { id: 'education', label: '🎓 Education', sectionName: 'Education' },
      { id: 'languages', label: '🌐 Languages', sectionName: 'Languages' },
      { id: 'articles', label: '✍️ Articles', sectionName: 'Articles' },
      { id: 'profile', label: '👤 Profile', sectionName: 'Profile' },
      { id: 'interests', label: '💡 Interests', sectionName: 'Interests' },
    ],
    []
  );

  // Canonical sample templates for all sections
  const SECTION_SAMPLES: Record<string, string> = useMemo(
    () => ({
      skills: JSON.stringify(
        {
          skills: [
            {
              title: 'Languages & Core',
              icon: 'code',
              skills: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'SQL', 'HTML5/CSS3'],
            },
            {
              title: 'Frameworks & Libraries',
              icon: 'layers',
              skills: ['React', 'Next.js', 'FastAPI', 'Node.js', 'Tailwind CSS'],
            },
            {
              title: 'Tools & Platforms',
              icon: 'wrench',
              skills: ['Git & GitHub', 'Docker', 'VS Code', 'Vercel', 'Linux'],
            },
            {
              title: 'Soft Skills',
              icon: 'users',
              skills: ['System Architecture', 'Problem Solving', 'Agile & Scrum', 'Technical Writing'],
            },
          ],
        },
        null,
        2
      ),
      whatIDo: JSON.stringify(
        {
          whatIDo: [
            {
              id: 'frappe-development',
              title: 'Frappe Development',
              description:
                'Developing and maintaining custom Frappe applications, workflows, DocTypes, permissions, and business features for business operations.',
              icon: 'code',
            },
            {
              id: 'backend-api',
              title: 'Backend & API Development',
              description:
                'Building backend logic, developing REST APIs, handling data validation and authentication, and connecting applications with databases and external services using Python.',
              icon: 'server',
            },
            {
              id: 'database-development',
              title: 'Database Development',
              description:
                'Designing database queries, managing relational databases, optimizing SQL operations, and handling data migration using MariaDB, MySQL, and PostgreSQL.',
              icon: 'database',
            },
          ],
        },
        null,
        2
      ),
      projects: JSON.stringify(
        {
          projects: [
            {
              id: 'sample-project',
              title: 'Enterprise ERP Suite',
              slug: 'enterprise-erp-suite',
              tagline: 'Custom Frappe & Next.js ERP for enterprise workflows',
              category: 'Enterprise Software',
              role: 'Lead Full-Stack Developer',
              image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
              tags: ['Frappe', 'Python', 'React', 'MariaDB'],
              featured: true,
              summary: 'End-to-end ERP deployment streamlining inventory, purchasing, and invoicing.',
              overview: 'Detailed overview of system requirements, implementation architecture, and team outcomes.',
              challenges: 'High volume transactional synchronization and strict role-based access control.',
              outcomes: ['50% reduction in reporting turnaround', 'Automated reconciliation routines'],
              metrics: [
                { label: 'Active Users', value: '2,500+' },
                { label: 'Sync Latency', value: '<120ms' },
              ],
              technologies: ['Frappe Framework', 'Python', 'Next.js', 'PostgreSQL'],
              githubUrl: 'https://github.com/example/erp',
              liveUrl: 'https://erp.example.com',
            },
          ],
        },
        null,
        2
      ),
      experiences: JSON.stringify(
        {
          experiences: [
            {
              id: 'sample-exp',
              role: 'Senior Software Engineer',
              company: 'Tech Solutions Co.',
              location: 'Phnom Penh, Cambodia',
              period: '2023 - Present',
              description: 'Leading enterprise application architecture and cloud-native backend deployments.',
              achievements: [
                'Engineered automated transactional pipelines handling 50k+ daily actions',
                'Reduced system latency by 45% via indexed database refactoring',
              ],
              technologies: ['Python', 'Frappe', 'React', 'Docker', 'PostgreSQL'],
            },
          ],
        },
        null,
        2
      ),
      education: JSON.stringify(
        {
          education: [
            {
              id: 'sample-edu',
              degree: 'Bachelor of Computer Science & Software Engineering',
              institution: 'Royal University of Phnom Penh (RUPP)',
              location: 'Phnom Penh, Cambodia',
              period: '2016 - 2020',
              honors: 'Graduated with Honors (GPA 3.85 / 4.0)',
            },
          ],
        },
        null,
        2
      ),
      languages: JSON.stringify(
        {
          languages: [
            {
              id: 'lang-km',
              language: 'Khmer',
              proficiency: 'Native',
              level: 'Native / Bilingual',
            },
            {
              id: 'lang-en',
              language: 'English',
              proficiency: 'Professional Working',
              level: 'C1 / Advanced',
            },
          ],
        },
        null,
        2
      ),
      articles: JSON.stringify(
        {
          articles: [
            {
              id: 'sample-art',
              slug: 'building-resilient-architectures',
              title: 'Building Resilient Microservices with Python and Frappe',
              excerpt: 'In-depth engineering patterns for scalable multi-tenant architectures.',
              date: '2024-03-15',
              readTime: '6 min read',
              category: 'Architecture',
              tags: ['Python', 'Frappe', 'Architecture'],
              featured: true,
              content: '# Building Resilient Microservices\n\nModern cloud systems demand resilience...',
            },
          ],
        },
        null,
        2
      ),
      profile: JSON.stringify(
        {
          profile: {
            name: 'Sun Phanith Vatanak',
            title: 'Software Engineer & ERP / Frappe Specialist',
            headline: 'Full-Stack Developer | Enterprise Systems Architect',
            bio: 'Software Engineer specializing in scalable enterprise platforms, custom ERP frameworks, and modern web architectures.',
            location: 'Phnom Penh, Cambodia',
            email: 'phanithvatanak.sun@gmail.com',
            phone: '+855 12 345 678',
            availability: 'Open for consulting & architectural advisory',
            stats: {
              yearsExperience: '4+',
              completedProjects: '25+',
              clientSatisfaction: '100%',
            },
          },
        },
        null,
        2
      ),
      interests: JSON.stringify(
        {
          interests: [
            { id: 'coffee', label: 'Coffee', icon: 'coffee' },
            { id: 'gaming', label: 'Gaming', icon: 'gamepad' },
            { id: 'travel', label: 'Travel', icon: 'compass' },
          ],
        },
        null,
        2
      ),
      techRadar: JSON.stringify(
        {
          techRadar: initialTechRadar,
        },
        null,
        2
      ),
    }),
    []
  );

  // Helper to extract clean live JSON formatted by section
  const getLiveSectionJson = (sectionKey: string): string => {
    if (sectionKey === 'auto') {
      return JSON.stringify(data, null, 2);
    }
    const sectionVal = (data as any)[sectionKey];
    if (sectionVal !== undefined) {
      return JSON.stringify({ [sectionKey]: sectionVal }, null, 2);
    }
    return '';
  };

  // Switch target section tab AND immediately populate editor with that section's live JSON
  const handleSelectTargetSection = (targetId: string) => {
    setJsonTargetSection(targetId);
    if (targetId === 'auto') {
      showToast('Switched to Auto-Detect mode. Paste any full or partial JSON.', 'info');
      return;
    }
    const liveJson = getLiveSectionJson(targetId);
    if (liveJson) {
      setJsonInput(liveJson);
      const tabMeta = TARGET_SECTION_TABS.find((t) => t.id === targetId);
      const sectionVal = (data as any)[targetId];
      const countMsg = Array.isArray(sectionVal) ? ` (${sectionVal.length} items)` : '';
      showToast(`Loaded live "${tabMeta?.sectionName || targetId}" JSON${countMsg}! Edit & Apply to update only this section.`, 'info');
    }
  };

  // Re-fetch current live section data to editor
  const handleReloadLiveTarget = () => {
    if (jsonTargetSection === 'auto') {
      setJsonInput(JSON.stringify(data, null, 2));
      showToast('Loaded full portfolio live JSON.', 'info');
      return;
    }
    const liveJson = getLiveSectionJson(jsonTargetSection);
    if (liveJson) {
      setJsonInput(liveJson);
      const tabMeta = TARGET_SECTION_TABS.find((t) => t.id === jsonTargetSection);
      showToast(`Reloaded live "${tabMeta?.sectionName || jsonTargetSection}" data.`, 'info');
    }
  };

  // Load a clean sample snippet for the active target
  const handleLoadSampleForTarget = () => {
    const targetKey = jsonTargetSection === 'auto' ? 'skills' : jsonTargetSection;
    const sample = SECTION_SAMPLES[targetKey];
    if (sample) {
      setJsonInput(sample);
      if (jsonTargetSection === 'auto') setJsonTargetSection('skills');
      const tabMeta = TARGET_SECTION_TABS.find((t) => t.id === targetKey);
      showToast(`Loaded clean "${tabMeta?.sectionName || targetKey}" sample template!`, 'info');
    } else {
      showToast(`Sample not available for "${targetKey}".`, 'info');
    }
  };

  // Open modal pre-focused and populated with a specific section
  const openJsonModalForSection = (sectionKey: string = 'skills') => {
    setJsonTargetSection(sectionKey);
    const liveJson = getLiveSectionJson(sectionKey);
    setJsonInput(liveJson);
    setJsonModalOpen(true);
    const tabMeta = TARGET_SECTION_TABS.find((t) => t.id === sectionKey);
    showToast(`Opened JSON Vault loaded with live "${tabMeta?.sectionName || sectionKey}" data.`, 'info');
  };

  // Real-time detection of payload structure & count
  const detectedSection = useMemo(() => {
    if (!jsonInput.trim()) return null;
    let cleaned = jsonInput.trim().replace(/,\s*$/, '');
    if (/^\s*"[a-zA-Z0-9_-]+"\s*:\s*[\[{]/.test(cleaned) && !cleaned.startsWith('{')) {
      cleaned = `{${cleaned}}`;
    }
    cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        if (jsonTargetSection !== 'auto') {
          return { section: jsonTargetSection, count: parsed.length, type: 'array' };
        }
        const first = parsed[0] || {};
        if ('period' in first && 'company' in first) return { section: 'experiences', count: parsed.length, type: 'array' };
        if ('category' in first && 'image' in first) return { section: 'projects', count: parsed.length, type: 'array' };
        if ('degree' in first || 'institution' in first) return { section: 'education', count: parsed.length, type: 'array' };
        if ('language' in first && 'proficiency' in first) return { section: 'languages', count: parsed.length, type: 'array' };
        if ('skills' in first && ('category' in first || 'title' in first || Array.isArray(first.skills))) return { section: 'skills', count: parsed.length, type: 'array' };
        if ('content' in first && 'slug' in first) return { section: 'articles', count: parsed.length, type: 'array' };
        if ('title' in first && ('icon' in first || 'description' in first)) return { section: 'whatIDo', count: parsed.length, type: 'array' };
        return { section: 'whatIDo', count: parsed.length, type: 'array' };
      }
      if (parsed && typeof parsed === 'object') {
        const keys = Object.keys(parsed);
        const valid = ['profile', 'whatIDo', 'projects', 'experiences', 'education', 'languages', 'skills', 'interests', 'articles', 'telemetry'];
        const matched = keys.filter((k) => valid.includes(k));
        if (matched.length === 1) {
          const val = parsed[matched[0]];
          const count = Array.isArray(val) ? val.length : undefined;
          return { section: matched[0], count, type: 'single' };
        }
        if (matched.length > 1) {
          return { section: matched.join(', '), type: 'multi', count: matched.length };
        }
      }
    } catch {
      return null;
    }
    return null;
  }, [jsonInput, jsonTargetSection]);

  const handleCopyJson = async () => {
    const success = await copyToClipboard(getFormattedJson());
    if (success) {
      showToast('Complete portfolio JSON copied to clipboard!', 'success');
    } else {
      showToast('Unable to copy automatically. Please copy the payload manually.', 'error');
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([getFormattedJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('portfolio-data.json downloaded!', 'success');
  };

  const handleFormatJson = () => {
    try {
      let cleaned = jsonInput.trim().replace(/,\s*$/, '');
      if (/^\s*"[a-zA-Z0-9_-]+"\s*:\s*[\[{]/.test(cleaned) && !cleaned.startsWith('{')) {
        cleaned = `{${cleaned}}`;
      }
      cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');
      const obj = JSON.parse(cleaned);
      setJsonInput(JSON.stringify(obj, null, 2));
      showToast('JSON beautified & syntax validated!', 'success');
    } catch (e: any) {
      showToast(`Cannot format JSON: ${e.message}`, 'error');
    }
  };

  const handlePasteClipboard = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setJsonInput(text);
          showToast('Pasted from clipboard!', 'success');
          return;
        }
      }
      showToast('Clipboard read access not available. Use Ctrl+V to paste.', 'info');
    } catch {
      showToast('Please use Ctrl+V to paste into editor.', 'info');
    }
  };

  const handleImportJsonSubmit = async () => {
    if (!requireAdmin('Importing custom JSON')) return;
    if (!jsonInput.trim()) {
      showToast('Please paste a JSON payload or section snippet first.', 'error');
      return;
    }
    const result = await importJson(jsonInput, jsonTargetSection);
    if (result.success) {
      const msg =
        result.count !== undefined
          ? `Successfully updated ${result.count} "${result.section}" items!`
          : `Successfully imported & rehydrated ${result.section || 'portfolio'}!`;
      showToast(msg, 'success');
      setJsonModalOpen(false);
      setJsonInput('');
    } else {
      showToast(`Import failed: ${result.error}`, 'error');
    }
  };

  const targetTabsScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollTargets = (direction: 'left' | 'right') => {
    if (targetTabsScrollRef.current) {
      targetTabsScrollRef.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth',
      });
    }
  };

  // Prevent background page from scrolling when JSON modal or editor modals are open
  useEffect(() => {
    const isModalActive =
      jsonModalOpen ||
      Boolean(editingEdu) ||
      Boolean(editingExp) ||
      Boolean(editingTech) ||
      Boolean(editingWhatIDo);

    if (!isModalActive) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverscroll = document.body.style.overscrollBehavior;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Completely lock both html and body so no wheel or touch can scroll the underlying page
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overscrollBehavior = 'none';

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Intercept document-level wheel events: allow scrolling only inside elements with overflow
    const handleDocumentWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const scrollable = target.closest('.overflow-y-auto, .overflow-y-scroll, textarea, input, select');
      if (!scrollable) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleDocumentWheel, { passive: false });

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
      document.body.style.overscrollBehavior = originalBodyOverscroll;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('wheel', handleDocumentWheel);
    };
  }, [jsonModalOpen, editingEdu, editingExp, editingTech, editingWhatIDo]);

  // Handle smooth mouse-wheel horizontal scrolling over the Target tabs and block background scroll bleed
  useEffect(() => {
    if (!jsonModalOpen) return;
    const el = targetTabsScrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0 || e.deltaX !== 0) {
        e.preventDefault();
        e.stopPropagation();
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        el.scrollBy({
          left: delta,
          behavior: 'auto',
        });
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [jsonModalOpen]);

  // Close modals or exit fullscreen on Escape key
  useEffect(() => {
    const isModalActive =
      jsonModalOpen ||
      Boolean(editingEdu) ||
      Boolean(editingExp) ||
      Boolean(editingTech) ||
      Boolean(editingWhatIDo);

    if (!isModalActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingTech) {
          setEditingTech(null);
        } else if (editingEdu) {
          setEditingEdu(null);
        } else if (editingWhatIDo) {
          setEditingWhatIDo(null);
        } else if (editingExp) {
          setEditingExp(null);
        } else if (jsonModalOpen) {
          if (jsonModalFullscreen) {
            setJsonModalFullscreen(false);
          } else {
            setJsonModalOpen(false);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jsonModalOpen, jsonModalFullscreen, editingTech, editingEdu, editingWhatIDo, editingExp]);

  const handleResetDefaultsConfirm = async () => {
    if (!requireAdmin('Factory resetting portfolio')) return;
    if (window.confirm('Reset all portfolio data, projects, and articles back to factory initial state?')) {
      await resetToDefaults();
      showToast('Portfolio data reset to factory defaults.', 'info');
    }
  };

  // Filtered views with 2-tier parent & subcategory support
  const filteredProjects = useMemo(() => {
    const q = projectSearch.toLowerCase().trim();
    let projs = data.projects;
    if (projectParentFilter !== 'All') {
      projs = projs.filter((p) => (p.parentCategory || 'Fullstack') === projectParentFilter);
    }
    if (projectSubFilter !== 'All') {
      projs = projs.filter((p) => (p.subCategory || '') === projectSubFilter);
    }
    if (projectCategoryFilter !== 'All') {
      projs = projs.filter((p) => p.category === projectCategoryFilter);
    }
    if (!q) return projs;
    return projs.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.parentCategory && p.parentCategory.toLowerCase().includes(q)) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [data.projects, projectSearch, projectCategoryFilter, projectParentFilter, projectSubFilter]);

  const filteredArticles = useMemo(() => {
    const q = articleSearch.toLowerCase().trim();
    let arts = data.articles;
    if (articleParentFilter !== 'All') {
      arts = arts.filter((a) => (a.parentCategory || 'Fullstack') === articleParentFilter);
    }
    if (articleSubFilter !== 'All') {
      arts = arts.filter((a) => (a.subCategory || '') === articleSubFilter);
    }
    if (!q) return arts;
    return arts.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        (a.parentCategory && a.parentCategory.toLowerCase().includes(q)) ||
        (a.subCategory && a.subCategory.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [data.articles, articleSearch, articleParentFilter, articleSubFilter]);

  const filteredInquiries = useMemo(() => {
    const q = inquirySearch.toLowerCase().trim();
    if (!q) return inquiries;
    return inquiries.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
    );
  }, [inquiries, inquirySearch]);

  const unreadInquiriesCount = useMemo(() => {
    return inquiries.filter((m) => m.status === 'unread').length;
  }, [inquiries]);

  // Sidebar navigation structure
  const pageNavItems = useMemo(
    () => [
      { id: 'home' as AdminTab, label: 'Home Page', subtitle: 'Hero, Stats & Services', icon: Home, badge: null, previewHref: '/#hero' },
      { id: 'about' as AdminTab, label: 'About Page', subtitle: 'Bio, Roles, Edu & Languages', icon: User, badge: null, previewHref: '/#about' },
      { id: 'projects' as AdminTab, label: 'Project Page', subtitle: 'Portfolio Showcase Vault', icon: FolderGit2, badge: data.projects.length.toString(), previewHref: '/projects' },
      { id: 'articles' as AdminTab, label: 'Blog Page', subtitle: 'Articles & Field Notes CMS', icon: FileCode, badge: data.articles.length.toString(), previewHref: '/blog' },
      { id: 'contact' as AdminTab, label: 'Contact Page', subtitle: 'Channels, Socials & Inbox', icon: Mail, badge: unreadInquiriesCount > 0 ? `${unreadInquiriesCount} new` : null, previewHref: '/contact' },
    ],
    [data.projects.length, data.articles.length, unreadInquiriesCount]
  );

  const systemNavItems = useMemo(
    () => [
      { id: 'overview' as AdminTab, label: 'Command Hub', subtitle: 'Telemetry & Quick KPIs', icon: Activity, badge: null, previewHref: '/' },
      { id: 'json' as AdminTab, label: 'Live JSON Vault', subtitle: 'State Inspector & Import', icon: Database, badge: 'Live', previewHref: null },
    ],
    []
  );

  const currentTabMeta = useMemo(() => {
    const all = [...pageNavItems, ...systemNavItems];
    return all.find((item) => item.id === activeTab) || pageNavItems[0];
  }, [activeTab, pageNavItems, systemNavItems]);

  if (!isAuthLoaded) {
    return (
      <div className="w-full min-h-screen bg-slate-50 dark:bg-[#0b1120] flex flex-col items-center justify-center p-4">
        <div className="relative size-10 mb-3">
          <div className="absolute inset-0 rounded-full border-2 border-sky-200 dark:border-slate-800 border-t-sky-600 dark:border-t-sky-400 animate-spin"></div>
        </div>
        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Verifying security state...
        </p>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-colors">
        {/* Background ambient lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-sky-400/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none"></div>

        {/* Top brand header */}
        <header className="w-full max-w-5xl mx-auto flex items-center justify-between z-10">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="size-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold font-mono text-sm flex items-center justify-center shadow-sm">
              SPV
            </span>
            <div>
              <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                Admin Console
              </span>
              <span className="text-[10px] font-mono block text-slate-500 dark:text-slate-400">
                Restricted Access
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-amber-400 transition-colors border border-slate-200 dark:border-slate-800 cursor-pointer text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-800 transition-all shadow-2xs hover:-translate-y-0.5 active:translate-y-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Site</span>
            </Link>
          </div>
        </header>

        {/* Center Auth Card */}
        <div className="w-full max-w-md mx-auto my-auto z-10 py-6 sm:py-8">
          <div className="bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 dark:shadow-sky-950/20 space-y-6">
            {/* Shield Icon Header */}
            <div className="text-center space-y-2">
              <div className="size-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/25">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 text-[11px] font-semibold border border-sky-200 dark:border-sky-500/20">
                <Lock className="w-3 h-3" />
                <span>Restricted Administrator Gate</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                Admin Authentication
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                Access to the admin console is strictly protected. Please enter the master passcode to proceed.
              </p>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-400 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Passcode Form */}
            <form onSubmit={handleUnlockAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  Admin Master Passcode
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    value={passcodeAttempt}
                    onChange={(e) => setPasscodeAttempt(e.target.value)}
                    placeholder="Enter admin passcode..."
                    autoFocus
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-md shadow-sky-600/25 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
              >
                {authLoading ? (
                  <>
                    <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                    <span>Verifying Passcode...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Unlock Admin Console</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <footer className="w-full max-w-md mx-auto text-center text-[11px] text-slate-400 dark:text-slate-500 z-10 pb-2">
          Protected by Session Verification & Master Passcode Security • SPV CMS
        </footer>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* TOP COMMAND HEADER BAR */}
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile Menu Trigger + Brand Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="size-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold font-mono text-sm flex items-center justify-center shadow-sm">
                SPV
              </span>
              <div>
                <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-1.5">
                  Admin Console
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-500/20">
                    CMS 2.0
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Modular Multi-Page Editor & JSON Vault
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Quick Controls, Light/Dark Switcher, Live Preview */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live JSON status indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Rehydration Active</span>
            </div>

            {/* LIGHT / DARK MODE TOGGLE (Fixed and fully visible in Admin Console!) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline text-slate-200">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline text-slate-700">Dark Mode</span>
                </>
              )}
            </button>

            {/* Toggle Full Width / Collapse Sidebar */}
            <button
              type="button"
              onClick={toggleSidebar}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
                sidebarCollapsed
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sky-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
              title={sidebarCollapsed ? 'Show Sidebar & Constrain Width' : 'Collapse Sidebar & Expand Dashboard Full Width'}
            >
              {sidebarCollapsed ? (
                <>
                  <PanelLeftOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Show Sidebar</span>
                </>
              ) : (
                <>
                  <PanelLeftClose className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span className="hidden sm:inline">Full Width</span>
                </>
              )}
            </button>

            {/* View Live Portfolio */}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-xs"
            >
              <Eye className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span className="hidden sm:inline">Preview Site</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            {/* Admin Verified Badge & Lock Button */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Verified</span>
              </div>
              <button
                onClick={handleLockConsole}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Lock Console / Sign Out"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Lock</span>
              </button>
            </div>

            {/* Factory Reset */}
            <button
              onClick={handleResetDefaultsConfirm}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-900 cursor-pointer"
              title="Factory Reset Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN TWO-COLUMN DASHBOARD LAYOUT */}
      <div className={`w-full ${sidebarCollapsed ? 'max-w-none px-4 sm:px-6 lg:px-8' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} py-6 transition-all duration-300`}>
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* SIDEBAR NAVIGATION (Desktop & Mobile Drawer) */}
          <aside
            className={`w-full lg:w-72 shrink-0 ${
              sidebarCollapsed
                ? (mobileSidebarOpen ? 'block' : 'hidden')
                : (mobileSidebarOpen ? 'block' : 'hidden lg:block')
            } transition-all`}
          >
            <div className="sticky top-24 space-y-6 bg-white dark:bg-[#0f172a] p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              {/* SECTION: MODULAR PAGE EDITORS */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Individual Page Editors
                  </span>
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Collapse sidebar (Expand to full width)"
                  >
                    <PanelLeftClose className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-medium hidden xl:inline">Collapse</span>
                  </button>
                </div>

                <div className="space-y-1 pt-1">
                  {pageNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl transition-colors ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold block">{item.label}</span>
                            <span
                              className={`text-[10px] block ${
                                isActive ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {item.subtitle}
                            </span>
                          </div>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                              isActive
                                ? 'bg-white text-sky-700'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION: SYSTEM & ARTICLES */}
              <div className="space-y-1.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-3">
                  Articles & System Engine
                </span>

                <div className="space-y-1 pt-1">
                  {systemNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl transition-colors ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold block">{item.label}</span>
                            <span
                              className={`text-[10px] block ${
                                isActive ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {item.subtitle}
                            </span>
                          </div>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                              isActive
                                ? 'bg-white text-sky-700'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* QUICK STATS WIDGET IN SIDEBAR */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>Active Engine:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Dynamic JSON</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>Last Log:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300" suppressHydrationWarning>
                    {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Synced'}
                  </span>
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={handleDownloadJson}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-sky-600" />
                    <span>Backup</span>
                  </button>
                  <button
                    onClick={() => openJsonModalForSection('skills')}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3 text-sky-600" />
                    <span>Import</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT WORKSPACE: ACTIVE MODULAR PAGE EDITOR */}
          <main className="flex-1 min-w-0 w-full space-y-6 pb-24">
            {/* FULL WIDTH MODE: QUICK TOP BAR & HORIZONTAL TAB NAVIGATOR */}
            {sidebarCollapsed && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm animate-fadeIn">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-semibold text-xs border border-sky-200/60 dark:border-sky-500/20 transition-colors cursor-pointer"
                    title="Restore sidebar navigation"
                  >
                    <PanelLeftOpen className="w-3.5 h-3.5" />
                    <span>Show Sidebar</span>
                  </button>
                  <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
                    Canvas: 100% Full Width
                  </span>
                </div>

                {/* Quick horizontal tab switcher in full width */}
                <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
                  {pageNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                          isActive
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WORKSPACE HEADER: Sticky Page Title & Action Bar */}
            <div className="sticky top-16 z-30 flex items-center justify-between gap-4 p-4 md:px-6 md:py-3.5 rounded-2xl bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <currentTabMeta.icon className="w-5 h-5" />
                </div>
                <h1 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white font-display">
                  {currentTabMeta.label}
                </h1>
              </div>

              {/* Action buttons on page editor header */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {currentTabMeta.previewHref && (
                  <Link
                    href={currentTabMeta.previewHref}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-600" />
                    <span className="hidden sm:inline">View Section</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </Link>
                )}

                {(activeTab === 'home' || activeTab === 'about' || activeTab === 'contact') && (
                  <button
                    onClick={() => handleSaveProfileAndLinks()}
                    className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/25 hover:shadow-sky-600/35 active:scale-95 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save {currentTabMeta.label} Changes</span>
                  </button>
                )}
              </div>
            </div>

            {/* ========================================================= */}
            {/* 1. HOME PAGE EDITOR (Hero, Stats, What I Do Services)     */}
            {/* ========================================================= */}
            {activeTab === 'home' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Hero Banner & Headline Configuration */}
                <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                        Hero Presentation & Identity
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Configures top-of-page headline, professional tagline, and hire availability badge.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-500/20">
                      Home Section
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Main Hero Heading
                      </label>
                      <input
                        type="text"
                        value={profileForm.heroHeading}
                        onChange={(e) => setProfileOverrides((prev) => ({ ...prev, heroHeading: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        placeholder="e.g. Engineering High-Throughput Web Applications"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Professional Role
                      </label>
                      <input
                        type="text"
                        value={profileForm.role}
                        onChange={(e) => setProfileOverrides((prev) => ({ ...prev, role: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        placeholder="e.g. Senior Frontend Developer & Systems Architect"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Hero Subtitle / Value Proposition
                      </label>
                      <input
                        type="text"
                        value={profileForm.heroSubtitle}
                        onChange={(e) => setProfileOverrides((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        placeholder="e.g. Architecting low-latency state sync and high-performance WebGL systems"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Hire Tagline
                      </label>
                      <input
                        type="text"
                        value={profileForm.tagline}
                        onChange={(e) => setProfileOverrides((prev) => ({ ...prev, tagline: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        placeholder="e.g. Available for high-impact contracts & staff roles"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Availability Status
                      </label>
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setProfileOverrides((prev) => ({ ...prev, isAvailableForHire: !profileForm.isAvailableForHire }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                            profileForm.isAvailableForHire ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              profileForm.isAvailableForHire ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {profileForm.isAvailableForHire ? 'Available for Hire (Green Beacon)' : 'Busy / Not Available'}
                        </span>
                      </div>
                    </div>

                    <AvatarImageManager
                      avatarUrl={profileForm.avatarUrl}
                      onChange={(newUrl) => setProfileOverrides((prev) => ({ ...prev, avatarUrl: newUrl }))}
                      defaultAvatarUrl={data.profile.avatarUrl}
                      showToast={showToast}
                      title="Hero Avatar & Profile Headshot"
                      subtitle="Displayed front-and-center on your homepage hero radar & about page."
                    />
                  </div>
                </div>

                {/* Hero Metrics & Stats Bar */}
                <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                        Quick Metrics & Stats Bar
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Displays proof-points in the hero banner (years of experience, completed apps, satisfaction).
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Years of Experience
                      </label>
                      <input
                        type="text"
                        value={profileForm.stats?.yearsExperience || '6+'}
                        onChange={(e) =>
                          setProfileOverrides((prev) => ({
                            ...prev,
                            stats: { ...profileForm.stats, yearsExperience: e.target.value } as any,
                          }))
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 font-mono"
                        placeholder="6+"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Completed Projects
                      </label>
                      <input
                        type="text"
                        value={profileForm.stats?.completedProjects || '45+'}
                        onChange={(e) =>
                          setProfileOverrides((prev) => ({
                            ...prev,
                            stats: { ...profileForm.stats, completedProjects: e.target.value } as any,
                          }))
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 font-mono"
                        placeholder="45+"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Client Satisfaction
                      </label>
                      <input
                        type="text"
                        value={profileForm.stats?.clientSatisfaction || '99%'}
                        onChange={(e) =>
                          setProfileOverrides((prev) => ({
                            ...prev,
                            stats: { ...profileForm.stats, clientSatisfaction: e.target.value } as any,
                          }))
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 font-mono"
                        placeholder="99%"
                      />
                    </div>
                  </div>
                </div>

                {/* What I Do Services (Frappe Child Table) */}
                <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                        <Layers className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                        <span>Home & What I Do Services</span>
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Manage capabilities and architectural focus cards shown on the homepage.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openJsonModalForSection('whatIDo')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                        title="Fast-paste a 'whatIDo' JSON snippet or array to update all service cards instantly"
                      >
                        <FileCode className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        <span>⚡ Quick Import &quot;What I Do&quot; JSON</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenAddWhatIDo}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Service Card</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {whatIDoList.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 relative group hover:border-sky-300 dark:hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="size-6 rounded-md bg-sky-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 text-[11px] font-bold font-mono flex items-center justify-center">
                              #{idx + 1}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">Icon: {item.icon}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveWhatIDo(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 rounded cursor-pointer"
                              title="Move left/up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveWhatIDo(idx, 'down')}
                              disabled={idx === whatIDoList.length - 1}
                              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 rounded cursor-pointer"
                              title="Move right/down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditWhatIDo(item)}
                              className="p-1 text-sky-600 hover:text-sky-500 transition-colors cursor-pointer"
                              title="Edit Card"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteWhatIDo(item.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete Card"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-body">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 2. ABOUT PAGE EDITOR (Bio, Career Timeline, Edu & Langs)  */}
            {/* ========================================================= */}
            {activeTab === 'about' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Personal Story & Identity */}
                <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                        About Story & Personal Narrative
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Powers the About section narrative, portrait avatar, and core professional coordinates.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Full Legal Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileOverrides((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Short Name / Moniker
                      </label>
                      <input
                        type="text"
                        value={profileForm.shortName}
                        onChange={(e) => setProfileOverrides((prev) => ({ ...prev, shortName: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Location (Base)
                      </label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileOverrides((prev) => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <AvatarImageManager
                      avatarUrl={profileForm.avatarUrl}
                      onChange={(newUrl) => setProfileOverrides((prev) => ({ ...prev, avatarUrl: newUrl }))}
                      defaultAvatarUrl={data.profile.avatarUrl}
                      showToast={showToast}
                      title="Profile Image / Headshot Avatar"
                      subtitle="Displayed on Home Hero banner and About Page Story Showcase."
                    />

                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Detailed Bio & Architectural Background
                      </label>
                      <textarea
                        rows={4}
                        value={profileForm.heroDescription}
                        onChange={(e) => setProfileOverrides((prev) => ({ ...prev, heroDescription: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 font-body leading-relaxed"
                        placeholder="Comprehensive developer bio, engineering philosophy, and domain focus..."
                      />
                    </div>
                  </div>
                </div>

                {/* Career Timeline & Roles */}
                <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                        <span>Career Timeline & Experience</span>
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Chronological professional history displayed on About page and downloadable resume.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenAddExp}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Career Role</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {data.experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-sky-300 dark:hover:border-slate-700 transition-all"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">{exp.role}</span>
                            <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">• {exp.company}</span>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {exp.period}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-body">{exp.description}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {exp.technologies.map((t, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 text-[10px] font-mono border border-sky-100 dark:border-sky-500/20"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingExp({ ...exp });
                              setIsNewExp(false);
                            }}
                            className="p-1.5 text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
                            title="Edit Experience"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExp(exp.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Experience"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education & Academic Credentials (FRAPPE CHILD TABLE) */}
                <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                        <span>Education & Academic Credentials</span>
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Manage degrees, institutions, GPA/honors, period, and coursework tags with unlimited entries.
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={handleOpenAddEducation}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Education Credential</span>
                      </button>
                      <button
                        onClick={handleSaveEducationAndLanguages}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Sync Credentials</span>
                      </button>
                    </div>
                  </div>

                  {/* Education Cards List */}
                  <div className="space-y-4">
                    {educationListState.map((edu, idx) => (
                      <div
                        key={edu.id || idx}
                        className="p-5 md:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-sky-300 dark:hover:border-slate-700 transition-all"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                              {edu.degree}
                            </span>
                            <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
                              • {edu.institution}
                            </span>
                            {edu.location && (
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                ({edu.location})
                              </span>
                            )}
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                              {edu.period}
                            </span>
                            {edu.honors && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/20">
                                <Award className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                <span>{edu.honors}</span>
                              </span>
                            )}
                          </div>

                          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                            {edu.description}
                          </p>

                          {edu.coursework && edu.coursework.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">
                                Coursework:
                              </span>
                              {edu.coursework.map((course, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 text-[10px] font-mono border border-sky-100 dark:border-sky-500/20"
                                >
                                  {course}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0 pt-1">
                          <button
                            type="button"
                            onClick={() => handleMoveEducation(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded cursor-pointer"
                            title="Move Up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveEducation(idx, 'down')}
                            disabled={idx === educationListState.length - 1}
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded cursor-pointer"
                            title="Move Down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditEducation(edu)}
                            className="p-1.5 text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
                            title="Edit Credential"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEducation(edu.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Credential"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spoken Languages (FRAPPE CHILD TABLE) */}
                <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                        <Languages className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                        <span>Spoken Languages</span>
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Language proficiencies, native scripts, and meters for the About section.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddLanguage}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Language</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {languagesListState.map((lang, idx) => (
                      <div
                        key={lang.id || idx}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={lang.language}
                            onChange={(e) => handleUpdateLanguage(idx, 'language', e.target.value)}
                            placeholder="Language Name"
                            className="font-bold text-sm text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-sky-500 focus:outline-none w-full mr-2"
                          />
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveLanguage(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded cursor-pointer"
                              title="Move up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveLanguage(idx, 'down')}
                              disabled={idx === languagesListState.length - 1}
                              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded cursor-pointer"
                              title="Move down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLanguage(lang.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete language"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Proficiency Level</label>
                          <input
                            type="text"
                            value={lang.level}
                            onChange={(e) => handleUpdateLanguage(idx, 'level', e.target.value)}
                            placeholder="e.g. Native Speaker / Fluent"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Native Script / Notation</label>
                          <input
                            type="text"
                            value={lang.nativeScript || ''}
                            onChange={(e) => handleUpdateLanguage(idx, 'nativeScript', e.target.value)}
                            placeholder="e.g. ភាសាខ្មែរ (មាតុភាសា)"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                          />
                        </div>

                        <div className="pt-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium text-slate-400">Proficiency Meter</span>
                            <span className="text-[11px] font-mono text-sky-600 dark:text-sky-400 font-bold">{lang.proficiency}%</span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={100}
                            value={lang.proficiency}
                            onChange={(e) => handleUpdateLanguage(idx, 'proficiency', parseInt(e.target.value))}
                            className="w-full accent-sky-600 cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Stack & Battle-Tested Tooling (Tech Radar - Relational Turso DB) */}
                <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                        <span>Technical Stack & Battle-Tested Tooling (Tech Radar)</span>
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Manage production technologies, tenure, proficiency, and tags stored in Turso relational tables (with categories, tags, and junction tables).
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handleOpenAddTech}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Technology</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSyncTechRadar}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Sync Tech Stack</span>
                      </button>
                    </div>
                  </div>

                  {/* Tech Radar Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {techRadarListState.map((tech, idx) => (
                      <div
                        key={tech.id || idx}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3 hover:border-sky-300 dark:hover:border-slate-700 transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                              {tech.category}
                            </span>
                            <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                              {tech.experienceYears}
                            </span>
                          </div>

                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            {tech.name}
                          </h3>

                          <div className="flex items-center gap-1.5 mt-1 mb-2">
                            <span className="size-1.5 rounded-full bg-emerald-500"></span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              {tech.proficiency}
                            </span>
                          </div>

                          {tech.tags && tech.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
                              {tech.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 text-[10px] font-mono border border-sky-100 dark:border-sky-500/20"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                          {/* Quick Toggle: Show in Homepage Hero Animation */}
                          <button
                            type="button"
                            onClick={async () => {
                              const nextShow = !tech.showOnHome;
                              const nextList = techRadarListState.map((t) =>
                                t.id === tech.id ? { ...t, showOnHome: nextShow } : t
                              );
                              setTechRadarOverrides(nextList);
                              if (updateTechRadar) await updateTechRadar(nextList);
                              showToast(
                                nextShow
                                  ? `"${tech.name}" added to Homepage Animation!`
                                  : `"${tech.name}" removed from Homepage Animation!`,
                                'success'
                              );
                            }}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all ${
                              tech.showOnHome
                                ? 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-bold border border-sky-300/80 dark:border-sky-500/40 shadow-2xs'
                                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-slate-200/60 dark:border-slate-800'
                            }`}
                            title="Click to toggle display in Homepage Hero Animation"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${tech.showOnHome ? 'bg-sky-500 animate-pulse' : 'bg-slate-400'}`} />
                            <span>{tech.showOnHome ? 'On Home' : 'Off Home'}</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveTech(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded cursor-pointer"
                              title="Move Up"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveTech(idx, 'down')}
                              disabled={idx === techRadarListState.length - 1}
                              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded cursor-pointer"
                              title="Move Down"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditTech(tech)}
                              className="p-1.5 text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
                              title="Edit Technology"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTech(tech.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete Technology"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 3. PROJECT PAGE EDITOR (List View & Details View CMS)     */}
            {/* ========================================================= */}
            {activeTab === 'projects' && (
              selectedProjectId ? (
                (() => {
                  const currentProject = data.projects.find((p) => p.id === selectedProjectId);
                  if (!currentProject) {
                    return (
                      <div className="p-8 text-center space-y-4 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800">
                        <p className="text-sm text-slate-500">Project not found.</p>
                        <button
                          onClick={() => { setSelectedProjectId(null); setIsEditingProject(false); }}
                          className="px-4 py-2 rounded-full text-xs font-semibold bg-sky-600 text-white cursor-pointer"
                        >
                          Return to List View
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {/* Sub-Header inside Opened Project */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => { setSelectedProjectId(null); setIsEditingProject(false); }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to List View</span>
                          </button>

                          <div className="hidden sm:flex items-center gap-2 text-xs">
                            <span className="font-mono text-slate-400">ID:</span>
                            <span className="font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-500/20">
                              {currentProject.id}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-xs">
                              {currentProject.title}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {currentProject.id && (
                            <Link
                              href={`/projects/${currentProject.id}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                              title="Open public page in new tab"
                            >
                              <span>Live Page</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}

                          {!isEditingProject ? (
                            <button
                              type="button"
                              onClick={() => setIsEditingProject(true)}
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/25 transition-all cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit Project</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setIsEditingProject(false)}
                              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 transition-colors cursor-pointer"
                            >
                              Exit Edit Mode
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Project Display Canvas: View or Edit Mode */}
                      <ProjectDetailsView
                        project={currentProject}
                        mode={isEditingProject ? 'edit' : 'view'}
                        onSave={handleSaveProject}
                        onCancel={() => setIsEditingProject(false)}
                      />
                    </div>
                  );
                })()
              ) : (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Top Bar with "+ Create Project" button */}
                  <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                          Projects & Production Systems
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-semibold border border-sky-200/80 dark:border-sky-500/20">
                          {filteredProjects.length} Systems
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Click on any <span className="font-semibold text-sky-600 dark:text-sky-400">Project ID</span> or title below to open it. Once opened, click the <strong>Edit</strong> button to edit and save.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateNewProject}
                      className="px-4 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Create Project</span>
                    </button>
                  </div>

                  {/* 2-Tier Filter Bar: Search + Parent Category + Subcategory */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by ID (e.g. pro-001), title, framework, or tags..."
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>

                    <select
                      value={projectParentFilter}
                      onChange={(e) => {
                        setProjectParentFilter(e.target.value);
                        setProjectSubFilter('All');
                      }}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <option value="All">All Parent Categories</option>
                      {PARENT_CATEGORIES.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={projectSubFilter}
                      onChange={(e) => setProjectSubFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <option value="All">All Subcategories</option>
                      {(projectParentFilter !== 'All'
                        ? getSubcategoriesForParent(projectParentFilter)
                        : PARENT_CATEGORIES.flatMap((p) => p.subcategories)
                      ).map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Projects List View Table */}
                  <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs min-w-[750px]">
                        <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-3.5 px-4">Project ID</th>
                            <th className="py-3.5 px-4">Title & Details</th>
                            <th className="py-3.5 px-3">Parent Category</th>
                            <th className="py-3.5 px-3">Sub-Framework</th>
                            <th className="py-3.5 px-3">Status</th>
                            <th className="py-3.5 px-3">Links</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
                          {filteredProjects.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-slate-400">
                                No projects matched your filter criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredProjects.map((p) => (
                              <tr key={p.id} className="hover:bg-sky-50/40 dark:hover:bg-slate-800/40 transition-colors group">
                                <td className="py-3 px-4 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedProjectId(p.id);
                                      setIsEditingProject(false);
                                    }}
                                    className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 hover:underline inline-flex items-center gap-1 cursor-pointer"
                                    title="Click to open project details"
                                  >
                                    <span>{p.id}</span>
                                  </button>
                                </td>
                                <td className="py-3 px-4">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedProjectId(p.id);
                                      setIsEditingProject(false);
                                    }}
                                    className="text-left font-bold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 block truncate max-w-sm cursor-pointer"
                                  >
                                    {p.title}
                                  </button>
                                  <span className="text-[10px] text-slate-400 block truncate max-w-sm mt-0.5">
                                    {p.description}
                                  </span>
                                </td>
                                <td className="py-3 px-3 whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold text-[11px] border border-sky-200/80 dark:border-sky-500/20">
                                    {p.parentCategory || 'Fullstack'}
                                  </span>
                                </td>
                                <td className="py-3 px-3 whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px] border border-slate-200 dark:border-slate-700">
                                    {p.subCategory || 'Frappe Framework'}
                                  </span>
                                </td>
                                <td className="py-3 px-3 whitespace-nowrap">
                                  <span
                                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                      p.status === 'Live'
                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20'
                                        : p.status === 'In Development'
                                        ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-200/50 dark:border-sky-500/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                    }`}
                                  >
                                    {p.status}
                                  </span>
                                </td>
                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-2">
                                    {p.liveUrl && (
                                      <a
                                        href={p.liveUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-slate-400 hover:text-sky-600"
                                        title="Live URL"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </a>
                                    )}
                                    {p.githubUrl && (
                                      <a
                                        href={p.githubUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-slate-400 hover:text-slate-800 dark:hover:text-white"
                                        title="GitHub URL"
                                      >
                                        <Github className="w-3.5 h-3.5" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    {/* View Public Live Page */}
                                    <Link
                                      href={`/projects/${p.id}`}
                                      target="_blank"
                                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                      title="Open live project in new tab"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedProjectId(p.id);
                                        setIsEditingProject(true);
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
                                      title="Edit Project"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteProject(p.id)}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                      title="Delete Project"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* ========================================================= */}
            {/* 4. CONTACT PAGE EDITOR (Channels, Socials Child Table, Inquiries) */}
            {/* ========================================================= */}
            {activeTab === 'contact' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Contact Coordinates */}
                <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                        Contact Settings & Inbound Coordinates
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Primary communication points on the Contact page, footer, and inquiry email router.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Primary Contact Email
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileOverrides((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Physical / Timezone Location
                      </label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileOverrides((prev) => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* FRAPPE-STYLE CHILD TABLE: SOCIAL & REPO PLATFORMS */}
                <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                        <Link2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                        <span>Social & Repo Platforms (Child Table)</span>
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Add and configure unlimited platforms (GitHub, LinkedIn, Twitter/X, Telegram, Discord, etc.) with icon selection and custom links.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSocialLink}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Platform / Link</span>
                    </button>
                  </div>

                  {/* Child Table */}
                  <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs min-w-[650px]">
                        <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-3 px-3 w-12 text-center">#</th>
                            <th className="py-3 px-4 w-44">Platform Name</th>
                            <th className="py-3 px-4 w-48">Icon Field</th>
                            <th className="py-3 px-4">Link URL</th>
                            <th className="py-3 px-4 w-28 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                          {socialLinksList.map((item, idx) => (
                            <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="py-3 px-3 text-center font-mono text-slate-400 text-[11px]">
                                {idx + 1}
                              </td>

                              <td className="py-3 px-4">
                                <input
                                  type="text"
                                  value={item.platform}
                                  onChange={(e) => handleUpdateSocialLink(idx, 'platform', e.target.value)}
                                  placeholder="e.g. GitHub"
                                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 font-semibold"
                                />
                              </td>

                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="size-8 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-100 dark:border-sky-500/20">
                                    <PlatformIconBadge icon={item.icon} className="w-4 h-4" />
                                  </div>
                                  <select
                                    value={item.icon}
                                    onChange={(e) => handleUpdateSocialLink(idx, 'icon', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                                  >
                                    {AVAILABLE_PLATFORM_ICONS.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <input
                                  type="text"
                                  value={item.url}
                                  onChange={(e) => handleUpdateSocialLink(idx, 'url', e.target.value)}
                                  placeholder="https://..."
                                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 font-mono"
                                />
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveSocialLink(idx, 'up')}
                                    disabled={idx === 0}
                                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded cursor-pointer"
                                    title="Move Up"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveSocialLink(idx, 'down')}
                                    disabled={idx === socialLinksList.length - 1}
                                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded cursor-pointer"
                                    title="Move Down"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSocialLink(item.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                    title="Delete Row"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Client Inquiries Inbox */}
                <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                        <Mail className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                        <span>Client Inquiries Inbox</span>
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Real-time inquiries received from client contact form submissions.
                      </p>
                    </div>

                    <div className="relative min-w-[220px]">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search inquiries..."
                        value={inquirySearch}
                        onChange={(e) => setInquirySearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {filteredInquiries.length === 0 ? (
                      <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                        No inquiries matching current filter.
                      </div>
                    ) : (
                      filteredInquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            inq.status === 'unread'
                              ? 'bg-sky-50/60 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800/60'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2.5">
                              <div className="size-9 rounded-full bg-sky-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center text-xs">
                                {inq.name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-sm text-slate-900 dark:text-white block">{inq.name}</span>
                                <a
                                  href={`mailto:${inq.email}`}
                                  className="text-xs text-sky-600 dark:text-sky-400 hover:underline"
                                >
                                  {inq.email}
                                </a>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(inq.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <button
                                onClick={() => handleToggleInquiryStatus(inq.id, inq.status)}
                                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                                  inq.status === 'unread'
                                    ? 'bg-sky-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                {inq.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
                              </button>
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Delete inquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-body pl-11">
                            {inq.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 5. ARTICLES & BLOG CMS                                    */}
            {/* ========================================================= */}
            {activeTab === 'articles' && (
              selectedArticleId ? (
                (() => {
                  const currentArticle = data.articles.find((a) => a.id === selectedArticleId);
                  if (!currentArticle) {
                    return (
                      <div className="p-8 text-center space-y-4 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800">
                        <p className="text-sm text-slate-500">Article not found.</p>
                        <button
                          onClick={() => { setSelectedArticleId(null); setIsEditingArticle(false); }}
                          className="px-4 py-2 rounded-full text-xs font-semibold bg-sky-600 text-white"
                        >
                          Return to List View
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {/* Sub-Header inside Opened Article */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => { setSelectedArticleId(null); setIsEditingArticle(false); }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to List View</span>
                          </button>

                          <div className="hidden sm:flex items-center gap-2 text-xs">
                            <span className="font-mono text-slate-400">ID:</span>
                            <span className="font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-500/20">
                              {currentArticle.id}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-xs">
                              {currentArticle.title}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/blog/${currentArticle.id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title="Open public page in new tab"
                          >
                            <span>Live Page</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>

                          {!isEditingArticle ? (
                            <button
                              type="button"
                              onClick={() => setIsEditingArticle(true)}
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/25 transition-all cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit Article</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setIsEditingArticle(false)}
                              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 transition-colors cursor-pointer"
                            >
                              Exit Edit Mode
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Article Display Canvas: View or Edit Mode */}
                      <BlogDetailsView
                        article={currentArticle}
                        mode={isEditingArticle ? 'edit' : 'view'}
                        onSave={handleSaveArticle}
                        onCancel={() => setIsEditingArticle(false)}
                      />
                    </div>
                  );
                })()
              ) : (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* List View Top Bar */}
                  <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                          Articles & Engineering Guidelines
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-semibold border border-sky-200/80 dark:border-sky-500/20">
                          {filteredArticles.length} Entries
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Click on any <span className="font-semibold text-sky-600 dark:text-sky-400">Blog ID</span> or title below to open it. Once opened, click the <strong>Edit</strong> button to edit and save.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateNewArticle}
                      className="px-4 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Create Guideline</span>
                    </button>
                  </div>

                  {/* List View Search & Filter Bar */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by ID (e.g. blog-001), title, category, or tags..."
                        value={articleSearch}
                        onChange={(e) => setArticleSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>

                    <select
                      value={articleParentFilter}
                      onChange={(e) => {
                        setArticleParentFilter(e.target.value);
                        setArticleSubFilter('All');
                      }}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <option value="All">All Parent Categories</option>
                      {PARENT_CATEGORIES.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={articleSubFilter}
                      onChange={(e) => setArticleSubFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <option value="All">All Subcategories</option>
                      {(articleParentFilter !== 'All'
                        ? getSubcategoriesForParent(articleParentFilter)
                        : PARENT_CATEGORIES.flatMap((p) => p.subcategories)
                      ).map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Full-Width Articles List View Table */}
                  <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs min-w-[750px]">
                        <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-3.5 px-4">Blog ID</th>
                            <th className="py-3.5 px-4">Title & Details</th>
                            <th className="py-3.5 px-3">Parent Category</th>
                            <th className="py-3.5 px-3">Sub-Framework</th>
                            <th className="py-3.5 px-3">Status</th>
                            <th className="py-3.5 px-3">Forum</th>
                            <th className="py-3.5 px-3">Engagement</th>
                            <th className="py-3.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
                          {filteredArticles.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="py-8 text-center text-slate-400">
                                No articles matched your search query.
                              </td>
                            </tr>
                          ) : (
                            filteredArticles.map((art) => (
                              <tr
                                key={art.id}
                                className="hover:bg-sky-50/40 dark:hover:bg-slate-800/40 transition-colors group"
                              >
                                {/* Clickable Blog ID */}
                                <td className="py-3 px-4 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedArticleId(art.id);
                                      setIsEditingArticle(false);
                                    }}
                                    className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 hover:underline inline-flex items-center gap-1 cursor-pointer"
                                    title="Click to open blog details"
                                  >
                                    <span>{art.id}</span>
                                  </button>
                                </td>

                                {/* Title & Slug (Clickable to open) */}
                                <td className="py-3 px-4">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedArticleId(art.id);
                                      setIsEditingArticle(false);
                                    }}
                                    className="text-left font-bold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 block truncate max-w-sm cursor-pointer"
                                  >
                                    {art.title}
                                  </button>
                                  <span className="text-[10px] text-slate-400 block truncate max-w-sm mt-0.5">
                                    {art.excerpt}
                                  </span>
                                </td>

                                {/* Parent Category */}
                                <td className="py-3 px-3 whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold text-[11px] border border-sky-200/80 dark:border-sky-500/20">
                                    {art.parentCategory || 'Fullstack'}
                                  </span>
                                </td>

                                {/* Subcategory */}
                                <td className="py-3 px-3 whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px] border border-slate-200 dark:border-slate-700">
                                    {art.subCategory || art.category}
                                  </span>
                                </td>

                                {/* Status */}
                                <td className="py-3 px-3 whitespace-nowrap">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                      art.status === 'Published'
                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                        : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                    }`}
                                  >
                                    {art.status}
                                  </span>
                                </td>

                                {/* Forum Thread */}
                                <td className="py-3 px-3 whitespace-nowrap">
                                  {art.forumUrl ? (
                                    <a
                                      href={art.forumUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:text-sky-700 text-[10px] font-medium"
                                      title="Open forum thread"
                                    >
                                      <MessageSquare className="w-2.5 h-2.5" />
                                      <span>discuss.frappe.io</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  ) : (
                                    <span className="text-slate-400 text-[10px]">—</span>
                                  )}
                                </td>

                                {/* Metrics */}
                                <td className="py-3 px-3 whitespace-nowrap text-[11px] text-slate-500 dark:text-slate-400">
                                  <div>{art.views}</div>
                                  <div className="text-[10px] text-slate-400">{art.readTime}</div>
                                </td>

                                {/* Actions */}
                                <td className="py-3 px-3 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1.5">
                                    {/* Open Reader */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedArticleId(art.id);
                                        setIsEditingArticle(false);
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                                      title="Open blog in reader mode"
                                    >
                                      <Eye className="w-3 h-3" />
                                      <span>Open</span>
                                    </button>

                                    {/* Direct Edit */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedArticleId(art.id);
                                        setIsEditingArticle(true);
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                                      title="Open directly in edit mode"
                                    >
                                      <Edit className="w-3 h-3" />
                                      <span>Edit</span>
                                    </button>

                                    {/* View Public Live Page */}
                                    <Link
                                      href={`/blog/${art.id}`}
                                      target="_blank"
                                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                      title="View live public page in new tab"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>

                                    {/* Delete */}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteArticle(art.id)}
                                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                                      title="Delete article"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* ========================================================= */}
            {/* 6. COMMAND HUB / TELEMETRY OVERVIEW                       */}
            {/* ========================================================= */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* KPI Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Reads</span>
                      <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-display mb-1">{data.telemetry.totalReads}</div>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{data.telemetry.totalReadsGrowth} monthly index</span>
                  </div>

                  <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Published Projects</span>
                      <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
                        <FolderGit2 className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-display mb-1">{data.projects.length}</div>
                    <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">100% indexed in showcase</span>
                  </div>

                  <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Client Inquiries</span>
                      <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
                        <Mail className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-display mb-1">{inquiries.length}</div>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Inbox active</span>
                  </div>

                  <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">System Nominal</span>
                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Activity className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-display mb-1">99.98%</div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono" suppressHydrationWarning>
                      {lastUpdated ? `Sync: ${new Date(lastUpdated).toLocaleTimeString()}` : 'Real-time state synced'}
                    </span>
                  </div>
                </div>

                {/* Quick Shortcuts to Individual Page Editors */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div
                    onClick={() => setActiveTab('home')}
                    className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-400 dark:hover:border-sky-500 cursor-pointer transition-all group"
                  >
                    <div className="size-10 rounded-2xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Home className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mb-1">Home Page Editor</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Hero banner, headline, tagline, stats bar, and What I Do services child table.
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab('about')}
                    className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-400 dark:hover:border-sky-500 cursor-pointer transition-all group"
                  >
                    <div className="size-10 rounded-2xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <User className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mb-1">About Page Editor</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Narrative bio, career timeline roles, education credentials, and spoken languages.
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab('projects')}
                    className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-400 dark:hover:border-sky-500 cursor-pointer transition-all group"
                  >
                    <div className="size-10 rounded-2xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mb-1">Project Page Editor</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Manage portfolio inventory, add innovation projects, edit live links & repos.
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab('contact')}
                    className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-400 dark:hover:border-sky-500 cursor-pointer transition-all group"
                  >
                    <div className="size-10 rounded-2xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mb-1">Contact Page Editor</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Contact coordinates, social & repo platforms child table, and client inquiries inbox.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 7. LIVE JSON VAULT                                        */}
            {/* ========================================================= */}
            {activeTab === 'json' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-1">
                      Live JSON Payload & Architecture
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      The whole website synchronizes from this living JSON payload. Any save event serializes here and re-renders pages without full reload.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openJsonModalForSection('skills')}
                      className="px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Section Importer & Vault</span>
                    </button>
                    <button
                      onClick={handleCopyJson}
                      className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={handleDownloadJson}
                      className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-6 overflow-hidden shadow-2xl relative group">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-500"></span>
                      portfolio-payload.json
                    </span>
                    <span suppressHydrationWarning>{lastUpdated ? `Last modified: ${new Date(lastUpdated).toLocaleString()}` : 'Live'}</span>
                  </div>
                  <pre className="text-sky-300 font-mono text-xs overflow-x-auto max-h-[600px] leading-relaxed scrollbar-thin">
                    {getFormattedJson()}
                  </pre>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODALS: ADD/EDIT EDUCATION, SERVICE CARD, PROJECT, ETC.   */}
      {/* ========================================================= */}

      {/* ADD / EDIT EDUCATION CREDENTIAL MODAL */}
      {editingEdu &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingEdu(null);
            }}
            onWheel={(e) => {
              if (e.target === e.currentTarget) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150 overscroll-contain select-none"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl h-auto max-h-[85vh] flex flex-col shadow-2xl overflow-hidden select-text">
              {/* Pinned Header */}
              <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white/95 dark:bg-slate-900/95">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                      {isNewEdu ? 'Add Academic Credential' : 'Edit Academic Credential'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Configure degrees, university institutions, and academic coursework
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingEdu(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="p-6 sm:p-8 space-y-5 overflow-y-auto overscroll-contain flex-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Degree & Specialization Title
                  </label>
                  <input
                    type="text"
                    value={editingEdu.degree}
                    onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                    placeholder="e.g. Master of Science in Software Architecture"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Institution / University
                    </label>
                    <input
                      type="text"
                      value={editingEdu.institution}
                      onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                      placeholder="e.g. Cambodia Academy of Digital Technology"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Location (City, Country)
                    </label>
                    <input
                      type="text"
                      value={editingEdu.location}
                      onChange={(e) => setEditingEdu({ ...editingEdu, location: e.target.value })}
                      placeholder="e.g. Phnom Penh, Cambodia"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Period (e.g. 2023 - 2025)
                    </label>
                    <input
                      type="text"
                      value={editingEdu.period}
                      onChange={(e) => setEditingEdu({ ...editingEdu, period: e.target.value })}
                      placeholder="2023 - 2025"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Honors, Distinction & GPA
                    </label>
                    <input
                      type="text"
                      value={editingEdu.honors || ''}
                      onChange={(e) => setEditingEdu({ ...editingEdu, honors: e.target.value })}
                      placeholder="e.g. Summa Cum Laude • GPA 3.90 / 4.0"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Academic Focus & Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingEdu.description}
                    onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                    placeholder="Focus on distributed systems, cloud computing, compilers, and microservices."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Key Coursework & Competencies (comma-separated tags)
                  </label>
                  <input
                    type="text"
                    value={(editingEdu.coursework || []).join(', ')}
                    onChange={(e) =>
                      setEditingEdu({
                        ...editingEdu,
                        coursework: e.target.value.split(',').map((c) => c.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Distributed Systems, Cloud Native Architecture, Compilers & Runtimes, Algorithms"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              {/* Pinned Action Footer */}
              <div className="flex justify-end gap-3 px-6 sm:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingEdu(null)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEduModal}
                  className="px-7 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-md shadow-sky-600/25 transition-all cursor-pointer"
                >
                  Save Credential
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ADD / EDIT TECH RADAR ITEM MODAL */}
      {editingTech &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingTech(null);
            }}
            onWheel={(e) => {
              if (e.target === e.currentTarget) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150 overscroll-contain select-none"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl h-auto max-h-[85vh] flex flex-col shadow-2xl overflow-hidden select-text">
              {/* Pinned Header */}
              <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white/95 dark:bg-slate-900/95">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                      {isNewTech ? 'Add Production Technology' : 'Edit Production Technology'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Configure stack classification, experience tenure, and homepage animation visibility
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingTech(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="p-6 sm:p-8 space-y-5 overflow-y-auto overscroll-contain flex-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Technology / Tool Name
                  </label>
                  <input
                    type="text"
                    value={editingTech.name}
                    onChange={(e) => setEditingTech({ ...editingTech, name: e.target.value })}
                    placeholder="e.g. Next.js & React, Python, Frappe Framework, MariaDB"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Category
                    </label>
                    <select
                      value={editingTech.category}
                      onChange={(e) => setEditingTech({ ...editingTech, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all cursor-pointer"
                    >
                      <option value="Backend & Enterprise Logic">Backend & Enterprise Logic</option>
                      <option value="Databases & Data Engineering">Databases & Data Engineering</option>
                      <option value="Frontend & Modern Web">Frontend & Modern Web</option>
                      <option value="Cloud, Notifications & Tooling">Cloud, Notifications & Tooling</option>
                      <option value="Architecture & Craft">Architecture & Craft</option>
                      <option value="Languages & Core">Languages & Core</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Experience / Tenure
                    </label>
                    <input
                      type="text"
                      value={editingTech.experienceYears}
                      onChange={(e) => setEditingTech({ ...editingTech, experienceYears: e.target.value })}
                      placeholder="e.g. 4+ yrs"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Proficiency Classification
                  </label>
                  <select
                    value={editingTech.proficiency}
                    onChange={(e) => setEditingTech({ ...editingTech, proficiency: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all cursor-pointer"
                  >
                    <option value="Production Battle-Tested">Production Battle-Tested (Proven in high-traffic production)</option>
                    <option value="Core Daily Stack">Core Daily Stack (Used in active daily development)</option>
                    <option value="Advanced Specialization">Advanced Specialization (Niche / AI / High-impact architecture)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Sub-specializations & Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(editingTech.tags || []).join(', ')}
                    onChange={(e) =>
                      setEditingTech({
                        ...editingTech,
                        tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    placeholder="e.g. App Router, Server Components, Distributed Caching, MariaDB"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                </div>

                {/* Show on Homepage Hero Animation Checkbox */}
                <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/80 dark:bg-sky-500/10 border border-sky-200/80 dark:border-sky-500/20 flex items-center justify-between gap-4 transition-all hover:border-sky-400/50">
                  <div className="space-y-0.5">
                    <label htmlFor="showOnHomeCheckbox" className="text-sm font-bold text-slate-900 dark:text-slate-100 block cursor-pointer">
                      Show in Homepage Hero Planetary Animation
                    </label>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Feature this skill icon in the dynamic rotating planetary orbit displayed prominently on the homepage hero
                    </p>
                  </div>
                  <input
                    id="showOnHomeCheckbox"
                    type="checkbox"
                    checked={Boolean(editingTech.showOnHome)}
                    onChange={(e) => setEditingTech({ ...editingTech, showOnHome: e.target.checked })}
                    className="w-5 h-5 rounded-md border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Pinned Action Footer */}
              <div className="flex justify-end gap-3 px-6 sm:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingTech(null)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTechModal}
                  className="px-7 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-md shadow-sky-600/25 transition-all cursor-pointer"
                >
                  Save Technology
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ADD / EDIT WHAT I DO SERVICE CARD MODAL */}
      {editingWhatIDo &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingWhatIDo(null);
            }}
            onWheel={(e) => {
              if (e.target === e.currentTarget) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150 overscroll-contain select-none"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl h-auto max-h-[85vh] flex flex-col shadow-2xl overflow-hidden select-text">
              {/* Pinned Header */}
              <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white/95 dark:bg-slate-900/95">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                      {isNewWhatIDo ? 'Add Service Card' : 'Edit Service Card'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Configure service offering titles, iconic representations, and value proposition
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingWhatIDo(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="p-6 sm:p-8 space-y-5 overflow-y-auto overscroll-contain flex-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Service Title
                  </label>
                  <input
                    type="text"
                    value={editingWhatIDo.title}
                    onChange={(e) => setEditingWhatIDo({ ...editingWhatIDo, title: e.target.value })}
                    placeholder="e.g. Distributed Systems Architecture & Micro-Frontends"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Icon Identifier
                  </label>
                  <select
                    value={editingWhatIDo.icon}
                    onChange={(e) => setEditingWhatIDo({ ...editingWhatIDo, icon: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all cursor-pointer"
                  >
                    <option value="terminal">terminal (Terminal / CLI / Distributed Runtimes)</option>
                    <option value="palette">palette (UI / UX / Dynamic Design Systems)</option>
                    <option value="rocket">rocket (Performance / Ultra Low-Latency Optimization)</option>
                    <option value="cpu">cpu (Systems Architecture / Cloud & Infrastructure)</option>
                    <option value="code">code (Clean Architecture & Polyglot Development)</option>
                    <option value="shield">shield (Security, Auditing & Resilience)</option>
                    <option value="database">database (Relational Databases & Real-time State)</option>
                    <option value="layers">layers (Micro-frontends & Distributed Components)</option>
                    <option value="globe">globe (Global Edge Networks & CDN Infrastructure)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Detailed Service Description
                  </label>
                  <textarea
                    rows={4}
                    value={editingWhatIDo.description}
                    onChange={(e) => setEditingWhatIDo({ ...editingWhatIDo, description: e.target.value })}
                    placeholder="Describe your capabilities, technologies used, and client value proposition in detail."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all leading-relaxed"
                  />
                </div>
              </div>

              {/* Pinned Action Footer */}
              <div className="flex justify-end gap-3 px-6 sm:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingWhatIDo(null)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveWhatIDoModal}
                  className="px-7 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-md shadow-sky-600/25 transition-all cursor-pointer"
                >
                  Save Service Card
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* EXPERIENCE MODAL (KEPT SAME AS REQUESTED) */}
      {editingExp &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingExp(null);
            }}
            onWheel={(e) => {
              if (e.target === e.currentTarget) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150 overscroll-contain select-none"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl h-auto max-h-[85vh] flex flex-col shadow-2xl overflow-hidden select-text">
              {/* Pinned Header */}
              <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white/95 dark:bg-slate-900/95">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                      {isNewExp ? 'Add Career Role' : 'Edit Career Experience'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Configure corporate or freelance role tenure, organization details, and technology stack
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingExp(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="p-6 sm:p-8 space-y-5 overflow-y-auto overscroll-contain flex-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={editingExp.role}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    placeholder="e.g. Lead Systems Architect & Senior Frontend Engineer"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={editingExp.company}
                      onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                      placeholder="e.g. Global Distributed Systems Lab"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Period (e.g. 2022 - PRESENT)
                    </label>
                    <input
                      type="text"
                      value={editingExp.period}
                      onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                      placeholder="e.g. 2022 - PRESENT"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Role Description & Key Accomplishments
                  </label>
                  <textarea
                    rows={4}
                    value={editingExp.description}
                    onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                    placeholder="Architecting end-to-end distributed systems, mentoring engineering squads, and reducing query latency."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Technologies & Tooling (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingExp.technologies.join(', ')}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    placeholder="React 19, Next.js 15, TypeScript, Tailwind CSS, Frappe Framework, MariaDB"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              {/* Pinned Action Footer */}
              <div className="flex justify-end gap-3 px-6 sm:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingExp(null)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveExpModal}
                  className="px-7 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-md shadow-sky-600/25 transition-all cursor-pointer"
                >
                  Save Experience
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* SMART JSON VAULT IMPORTER MODAL */}
      {jsonModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                if (jsonModalFullscreen) setJsonModalFullscreen(false);
                else setJsonModalOpen(false);
              }
            }}
            onWheel={(e) => {
              if (e.target === e.currentTarget) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className={`fixed inset-0 z-[9999] flex items-center justify-center ${
              jsonModalFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'
            } bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150 overscroll-contain`}
          >
            <div
              className={`bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl relative flex flex-col overflow-hidden transition-all duration-200 overscroll-contain ${
                jsonModalFullscreen
                  ? 'w-screen h-screen max-w-none max-h-none rounded-none'
                  : 'w-[96vw] max-w-6xl h-[92vh] max-h-[94vh] rounded-3xl'
              }`}
            >
              {/* Header Command Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                        JSON Vault & Partial Section Importer
                      </h3>
                      {detectedSection && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-500/20 font-mono">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>
                            Detected: {detectedSection.count ? `${detectedSection.count} ` : ''}
                            &quot;{detectedSection.section}&quot;
                          </span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Paste full portfolio JSON or section snippets (e.g. &quot;whatIDo&quot;: [...], projects, experiences). Auto-detects & merges instantly.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>Paste</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFormatJson}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="Format & Validate JSON"
                  >
                    <Code2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Format JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setJsonInput('')}
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs transition-colors cursor-pointer"
                    title="Clear editor"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setJsonModalFullscreen(!jsonModalFullscreen)}
                    className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                    title={jsonModalFullscreen ? 'Exit Fullscreen (Esc)' : 'Maximize Fullscreen'}
                  >
                    {jsonModalFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setJsonModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer ml-1"
                    title="Close (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Section Quick Switcher Tabs */}
              <div className="px-3 sm:px-6 py-2.5 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 sm:gap-3 shrink-0 overscroll-contain">
                {/* Left scroll chevron button */}
                <button
                  type="button"
                  onClick={() => scrollTargets('left')}
                  className="hidden sm:flex p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 shrink-0 cursor-pointer transition-colors"
                  title="Scroll targets left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Horizontal scrollable targets with dedicated mouse wheel listener */}
                <div
                  ref={targetTabsScrollRef}
                  className="flex items-center gap-1.5 text-xs overflow-x-auto scrollbar-none py-1 flex-1 min-w-0 overscroll-contain select-none"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 hidden sm:inline shrink-0">
                    Target:
                  </span>
                  {TARGET_SECTION_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleSelectTargetSection(tab.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                        jsonTargetSection === tab.id
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-slate-700/80'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Right scroll chevron button */}
                <button
                  type="button"
                  onClick={() => scrollTargets('right')}
                  className="hidden sm:flex p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 shrink-0 cursor-pointer transition-colors"
                  title="Scroll targets right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Right action buttons pinned */}
                <div className="flex items-center gap-2 shrink-0 pl-1.5 border-l border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleReloadLiveTarget}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer whitespace-nowrap"
                    title="Reload current live portfolio data for this section"
                  >
                    <RotateCcw className="w-3 h-3 text-sky-500" />
                    <span className="hidden md:inline">Reload Live</span>
                  </button>

                  <span className="text-slate-300 dark:text-slate-700">•</span>

                  <button
                    type="button"
                    onClick={handleLoadSampleForTarget}
                    className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Sample
                  </button>
                </div>
              </div>

              {/* Target Section Safety Status Bar */}
              <div className="px-6 py-2 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono shrink-0">
                <div className="flex items-center gap-2">
                  {jsonTargetSection === 'auto' ? (
                    <span className="inline-flex items-center gap-1.5 text-sky-400">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Mode: <strong>Smart Auto-Detect</strong> — Snippets and full JSON merge into matching keys without wiping other data.</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>
                        Target: <strong className="text-white underline">{TARGET_SECTION_TABS.find((t) => t.id === jsonTargetSection)?.sectionName}</strong>. Applying will update <u>ONLY</u> this section. All other sections (Projects, Experiences, Profile, etc.) remain untouched.
                      </span>
                    </span>
                  )}
                </div>
                <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-500">
                  <span>Live 2-Way State Binding</span>
                </div>
              </div>

              {/* Editor Workspace */}
              <div className="flex-1 p-4 sm:p-6 flex flex-col min-h-0 bg-slate-950">
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={`Paste either full JSON or section snippet here.

Example for "${jsonTargetSection === 'auto' ? 'skills' : jsonTargetSection}":
${SECTION_SAMPLES[jsonTargetSection === 'auto' ? 'skills' : jsonTargetSection] || '// Paste JSON here'}`}
                  className="w-full flex-1 p-4 sm:p-6 rounded-2xl bg-slate-900/90 text-sky-300 font-mono text-xs sm:text-sm border border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/40 resize-none scrollbar-thin leading-relaxed"
                />
              </div>

              {/* Command Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-3.5 bg-white dark:bg-[#0f172a] border-t border-slate-100 dark:border-slate-800 gap-3 shrink-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>
                    {jsonTargetSection !== 'auto'
                      ? `Target focused: Only "${TARGET_SECTION_TABS.find((t) => t.id === jsonTargetSection)?.sectionName}" will be modified on Apply.`
                      : 'Loose snippets supported (trailing commas auto-stripped). Merges without wiping untouched sections.'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 justify-end">
                  <button
                    type="button"
                    onClick={() => setJsonModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleImportJsonSubmit}
                    className="px-6 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/25 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>
                      {jsonTargetSection !== 'auto'
                        ? `Apply & Update "${TARGET_SECTION_TABS.find((t) => t.id === jsonTargetSection)?.sectionName}"`
                        : 'Apply & Rehydrate Portfolio'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
