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
  Clipboard,
  CheckCheck
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
  SocialLinkItem
} from '@/lib/types';

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

  // Projects Modal / Edit State (kept intact as requested)
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('All');

  const handleOpenAddProject = () => {
    const newProj: Project = {
      id: 'proj-' + Date.now(),
      title: 'New Innovation App',
      slug: 'new-innovation-app',
      description: 'High-performance interactive web application built with modern standards.',
      longDescription: 'Comprehensive full-stack system incorporating distributed edge rendering and low-latency state synchronization.',
      category: 'Web Apps',
      tags: ['Next.js 15', 'TypeScript', 'Tailwind CSS'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      iconName: 'terminal',
      status: 'Live',
      stars: 42,
    };
    setEditingProject(newProj);
    setIsNewProject(true);
  };

  const handleSaveProjectModal = async () => {
    if (!requireAdmin('Saving project')) return;
    if (!editingProject) return;
    let nextProjects: Project[];
    if (isNewProject) {
      nextProjects = [editingProject, ...data.projects];
    } else {
      nextProjects = data.projects.map((p) => (p.id === editingProject.id ? editingProject : p));
    }
    const ok = await updateProjects(nextProjects);
    if (ok) {
      showToast(`Project "${editingProject.title}" saved & synced!`, 'success');
      setEditingProject(null);
    } else {
      showToast('Failed to save project.', 'error');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!requireAdmin('Deleting project')) return;
    const nextProjects = data.projects.filter((p) => p.id !== id);
    const ok = await updateProjects(nextProjects);
    if (ok) {
      showToast('Project deleted from vault.', 'info');
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

  // Article / Blog CMS state
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState<Article['category']>('Architecture');
  const [articleContent, setArticleContent] = useState('');
  const [articleExcerpt, setArticleExcerpt] = useState('');
  const [articleTags, setArticleTags] = useState('Next.js 15, TypeScript');
  const [articleStatus, setArticleStatus] = useState<Article['status']>('Published');
  const [articleSearch, setArticleSearch] = useState('');

  const handlePublishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAdmin('Publishing article')) return;
    if (!articleTitle.trim() || !articleContent.trim()) {
      showToast('Title and content are required.', 'error');
      return;
    }
    const newArt: Article = {
      id: 'art-' + Date.now(),
      title: articleTitle.trim(),
      slug: articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: articleCategory,
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
    const isModalActive = jsonModalOpen || Boolean(editingEdu) || Boolean(editingExp);
    if (!isModalActive) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [jsonModalOpen, editingEdu, editingExp]);

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

  // Close JSON modal or exit fullscreen on Escape key
  useEffect(() => {
    if (!jsonModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (jsonModalFullscreen) {
          setJsonModalFullscreen(false);
        } else {
          setJsonModalOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jsonModalOpen, jsonModalFullscreen]);

  const handleResetDefaultsConfirm = async () => {
    if (!requireAdmin('Factory resetting portfolio')) return;
    if (window.confirm('Reset all portfolio data, projects, and articles back to factory initial state?')) {
      await resetToDefaults();
      showToast('Portfolio data reset to factory defaults.', 'info');
    }
  };

  // Filtered views
  const filteredProjects = useMemo(() => {
    const q = projectSearch.toLowerCase().trim();
    let projs = data.projects;
    if (projectCategoryFilter !== 'All') {
      projs = projs.filter((p) => p.category === projectCategoryFilter);
    }
    if (!q) return projs;
    return projs.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [data.projects, projectSearch, projectCategoryFilter]);

  const filteredArticles = useMemo(() => {
    const q = articleSearch.toLowerCase().trim();
    if (!q) return data.articles;
    return data.articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [data.articles, articleSearch]);

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
      { id: 'projects' as AdminTab, label: 'Project Page', subtitle: 'Portfolio Showcase Vault', icon: FolderGit2, badge: data.projects.length.toString(), previewHref: '/#projects' },
      { id: 'contact' as AdminTab, label: 'Contact Page', subtitle: 'Channels, Socials & Inbox', icon: Mail, badge: unreadInquiriesCount > 0 ? `${unreadInquiriesCount} new` : null, previewHref: '/#contact' },
    ],
    [data.projects.length, unreadInquiriesCount]
  );

  const systemNavItems = useMemo(
    () => [
      { id: 'articles' as AdminTab, label: 'Blog & Articles', subtitle: 'Markdown Publication CMS', icon: FileCode, badge: data.articles.length.toString(), previewHref: '/#blog' },
      { id: 'overview' as AdminTab, label: 'Command Hub', subtitle: 'Telemetry & Quick KPIs', icon: Activity, badge: null, previewHref: '/' },
      { id: 'json' as AdminTab, label: 'Live JSON Vault', subtitle: 'State Inspector & Import', icon: Database, badge: 'Live', previewHref: null },
    ],
    [data.articles.length]
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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* SIDEBAR NAVIGATION (Desktop & Mobile Drawer) */}
          <aside
            className={`w-full lg:w-72 shrink-0 ${
              mobileSidebarOpen ? 'block' : 'hidden lg:block'
            } transition-all`}
          >
            <div className="sticky top-24 space-y-6 bg-white dark:bg-[#0f172a] p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              {/* SECTION: MODULAR PAGE EDITORS */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-3">
                  Individual Page Editors
                </span>

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
                  <span className="font-mono text-slate-700 dark:text-slate-300">
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
            {/* WORKSPACE HEADER: Breadcrumbs & Page Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  <span>Admin</span>
                  <span>/</span>
                  <span className="text-sky-600 dark:text-sky-400">
                    {pageNavItems.some((p) => p.id === activeTab) ? 'Page Editors' : 'System'}
                  </span>
                  <span>/</span>
                  <span className="text-slate-900 dark:text-white font-bold">{currentTabMeta.label}</span>
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-2.5">
                  <currentTabMeta.icon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  <span>{currentTabMeta.label}</span>
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {currentTabMeta.subtitle}. Modifications serialize directly into the reactive portfolio JSON state.
                </p>
              </div>

              {/* Action buttons on page editor header */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {currentTabMeta.previewHref && (
                  <Link
                    href={currentTabMeta.previewHref}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-600" />
                    <span>View Section</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </Link>
                )}

                {(activeTab === 'home' || activeTab === 'about' || activeTab === 'contact') && (
                  <button
                    onClick={() => handleSaveProfileAndLinks()}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
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

                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Avatar Image URL
                      </label>
                      <input
                        type="text"
                        value={profileForm.avatarUrl}
                        onChange={(e) => setProfileOverrides((prev) => ({ ...prev, avatarUrl: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100"
                      />
                    </div>

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
              </div>
            )}

            {/* ========================================================= */}
            {/* 3. PROJECT PAGE EDITOR (Showcase, Inventory, Modal CRUD)  */}
            {/* ========================================================= */}
            {activeTab === 'projects' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex flex-wrap items-center gap-3 flex-1">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search projects by title, category, or tags..."
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>

                    <select
                      value={projectCategoryFilter}
                      onChange={(e) => setProjectCategoryFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <option value="All">All Categories</option>
                      <option value="Web Apps">Web Apps</option>
                      <option value="Open Source">Open Source</option>
                      <option value="AI & Tools">AI & Tools</option>
                      <option value="Full Stack">Full Stack</option>
                    </select>
                  </div>

                  <button
                    onClick={handleOpenAddProject}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Project</span>
                  </button>
                </div>

                {/* Projects Inventory Table */}
                <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-3.5 px-5">Title & Path Slug</th>
                          <th className="py-3.5 px-4">Category</th>
                          <th className="py-3.5 px-4">Tech Stack</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4">Links</th>
                          <th className="py-3.5 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
                        {filteredProjects.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-5">
                              <span className="font-bold text-slate-900 dark:text-white block text-sm">{p.title}</span>
                              <span className="font-mono text-[10px] text-slate-400">/{p.slug}</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[11px] text-sky-600 dark:text-sky-400 font-semibold">
                              {p.category}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap gap-1 max-w-[260px]">
                                {p.tags.slice(0, 3).map((t, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-mono"
                                  >
                                    {t}
                                  </span>
                                ))}
                                {p.tags.length > 3 && (
                                  <span className="text-[10px] text-slate-400 font-mono">+{p.tags.length - 3}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
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
                            <td className="py-3.5 px-4">
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
                            <td className="py-3.5 px-5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingProject({ ...p });
                                    setIsNewProject(false);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
                                  title="Edit Project"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(p.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                  title="Delete Project"
                                >
                                  <Trash2 className="w-4 h-4" />
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
                {/* Post Drafter Form */}
                <div className="lg:col-span-5 space-y-4">
                  <form onSubmit={handlePublishArticle} className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-base font-bold text-slate-900 dark:text-white font-display">Draft New Article</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold">
                        Markdown Ready
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Next.js 15 Streaming Performance Deep Dive"
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Category</label>
                        <select
                          value={articleCategory}
                          onChange={(e) => setArticleCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                        >
                          <option value="Architecture">Architecture</option>
                          <option value="Frontend">Frontend</option>
                          <option value="Performance">Performance</option>
                          <option value="AI & LLMs">AI & LLMs</option>
                          <option value="Build Tools">Build Tools</option>
                          <option value="Developer Log">Developer Log</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Status</label>
                        <select
                          value={articleStatus}
                          onChange={(e) => setArticleStatus(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                        >
                          <option value="Published">Published</option>
                          <option value="Draft">Draft</option>
                          <option value="In Review">In Review</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Tags (comma-separated)</label>
                      <input
                        type="text"
                        placeholder="Next.js, WebGPU, Streaming"
                        value={articleTags}
                        onChange={(e) => setArticleTags(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Excerpt</label>
                      <input
                        type="text"
                        placeholder="Short 1-2 sentence overview..."
                        value={articleExcerpt}
                        onChange={(e) => setArticleExcerpt(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Markdown Body</label>
                      <textarea
                        rows={6}
                        required
                        placeholder="Detailed architectural breakdown and code benchmarks..."
                        value={articleContent}
                        onChange={(e) => setArticleContent(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish to Blog Vault</span>
                    </button>
                  </form>
                </div>

                {/* Articles Registry Table */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search articles in vault..."
                        value={articleSearch}
                        onChange={(e) => setArticleSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-3 px-4">Title</th>
                            <th className="py-3 px-3">Category</th>
                            <th className="py-3 px-3">Status</th>
                            <th className="py-3 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
                          {filteredArticles.map((art) => (
                            <tr key={art.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="py-3 px-4">
                                <span className="font-bold text-slate-900 dark:text-white block truncate max-w-[220px]">
                                  {art.title}
                                </span>
                                <span className="text-[10px] text-slate-400">{art.publishedDate}</span>
                              </td>
                              <td className="py-3 px-3 font-mono text-[11px] text-sky-600 dark:text-sky-400">{art.category}</td>
                              <td className="py-3 px-3">
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
                              <td className="py-3 px-3 text-right">
                                <button
                                  onClick={() => handleDeleteArticle(art.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
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
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
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
                    <span>{lastUpdated ? `Last modified: ${new Date(lastUpdated).toLocaleString()}` : 'Live'}</span>
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
      {editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl p-6 md:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  {isNewEdu ? 'Add New Education Credential' : 'Edit Academic Credential'}
                </h3>
              </div>
              <button
                onClick={() => setEditingEdu(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Degree & Specialization Title
                </label>
                <input
                  type="text"
                  value={editingEdu.degree}
                  onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Institution / University
                  </label>
                  <input
                    type="text"
                    value={editingEdu.institution}
                    onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                    placeholder="e.g. Royal University of Phnom Penh"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Location (City, Country)
                  </label>
                  <input
                    type="text"
                    value={editingEdu.location}
                    onChange={(e) => setEditingEdu({ ...editingEdu, location: e.target.value })}
                    placeholder="e.g. Phnom Penh, Cambodia"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Period (e.g. 2019 - 2023)
                  </label>
                  <input
                    type="text"
                    value={editingEdu.period}
                    onChange={(e) => setEditingEdu({ ...editingEdu, period: e.target.value })}
                    placeholder="2019 - 2023"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Honors, Distinction & GPA
                  </label>
                  <input
                    type="text"
                    value={editingEdu.honors || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, honors: e.target.value })}
                    placeholder="e.g. Summa Cum Laude • GPA 3.85 / 4.0"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Academic Focus & Description
                </label>
                <textarea
                  rows={3}
                  value={editingEdu.description}
                  onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                  placeholder="Focus on software engineering, distributed networks, and real-time computing."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
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
                  placeholder="Distributed Systems, Cloud Architecture, Data Structures, WebGPU"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingEdu(null)}
                className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEduModal}
                className="px-6 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 cursor-pointer"
              >
                Save Credential
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT WHAT I DO SERVICE CARD MODAL */}
      {editingWhatIDo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  {isNewWhatIDo ? 'Add Service Card' : 'Edit Service Card'}
                </h3>
              </div>
              <button
                onClick={() => setEditingWhatIDo(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  value={editingWhatIDo.title}
                  onChange={(e) => setEditingWhatIDo({ ...editingWhatIDo, title: e.target.value })}
                  placeholder="e.g. Distributed Systems Architecture"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Icon Identifier
                </label>
                <select
                  value={editingWhatIDo.icon}
                  onChange={(e) => setEditingWhatIDo({ ...editingWhatIDo, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                >
                  <option value="terminal">terminal (Terminal / CLI)</option>
                  <option value="palette">palette (UI / UX / Design)</option>
                  <option value="rocket">rocket (Performance / Optimization)</option>
                  <option value="cpu">cpu (Systems / Hardware / GPU)</option>
                  <option value="code">code (Clean Architecture)</option>
                  <option value="shield">shield (Security & Auditing)</option>
                  <option value="database">database (Data & Storage)</option>
                  <option value="layers">layers (Micro-frontends)</option>
                  <option value="globe">globe (Global Edge / CDN)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Detailed Service Description
                </label>
                <textarea
                  rows={4}
                  value={editingWhatIDo.description}
                  onChange={(e) => setEditingWhatIDo({ ...editingWhatIDo, description: e.target.value })}
                  placeholder="Describe your capabilities, technologies used, and client value proposition."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingWhatIDo(null)}
                className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveWhatIDoModal}
                className="px-6 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 cursor-pointer"
              >
                Save Service Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT MODAL (KEPT SAME AS REQUESTED) */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl p-6 md:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  {isNewProject ? 'Add New Project' : 'Edit Project Vault'}
                </h3>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Slug</label>
                  <input
                    type="text"
                    value={editingProject.slug}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  >
                    <option value="Web Apps">Web Apps</option>
                    <option value="Open Source">Open Source</option>
                    <option value="AI & Tools">AI & Tools</option>
                    <option value="Full Stack">Full Stack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  >
                    <option value="Live">Live</option>
                    <option value="In Development">In Development</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Short Description</label>
                <input
                  type="text"
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Long Architectural Overview</label>
                <textarea
                  rows={3}
                  value={editingProject.longDescription}
                  onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Live Demo URL</label>
                  <input
                    type="text"
                    value={editingProject.liveUrl}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">GitHub Repo URL</label>
                  <input
                    type="text"
                    value={editingProject.githubUrl}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editingProject.tags.join(', ')}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProjectModal}
                className="px-6 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 cursor-pointer"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPERIENCE MODAL (KEPT SAME AS REQUESTED) */}
      {editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl p-6 md:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  {isNewExp ? 'Add Career Role' : 'Edit Career Experience'}
                </h3>
              </div>
              <button
                onClick={() => setEditingExp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Role Title</label>
                <input
                  type="text"
                  value={editingExp.role}
                  onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={editingExp.company}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Period (e.g. 2022 - PRESENT)</label>
                  <input
                    type="text"
                    value={editingExp.period}
                    onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Role Description</label>
                <textarea
                  rows={3}
                  value={editingExp.description}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={editingExp.technologies.join(', ')}
                  onChange={(e) =>
                    setEditingExp({
                      ...editingExp,
                      technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingExp(null)}
                className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveExpModal}
                className="px-6 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 cursor-pointer"
              >
                Save Experience
              </button>
            </div>
          </div>
        </div>
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
