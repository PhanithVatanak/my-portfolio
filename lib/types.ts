export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  category: 'Web Apps' | 'Open Source' | 'AI & Tools' | 'Full Stack';
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  iconName: 'shopping-cart' | 'task-alt' | 'monitoring' | 'public' | 'terminal' | 'cpu';
  stars?: number;
  featured?: boolean;
  status: 'Live' | 'In Development' | 'Archived';
  metrics?: string;
  architectureHighlights?: string[];
  previewGradient?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  status?: string;
  description: string;
  technologies: string[];
  highlights?: string[];
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}

export interface WhatIDoItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface InterestItem {
  id: string;
  label: string;
  icon: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  honors?: string;
  description: string;
  coursework?: string[];
}

export interface SpokenLanguage {
  id: string;
  language: string;
  level: string;
  proficiency: number; // e.g. 100, 90
  nativeScript?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: 'Architecture' | 'Build Tools' | 'Frontend' | 'AI & LLMs' | 'Performance' | 'Developer Log';
  views: string;
  readRate: string;
  readTime: string;
  publishedDate: string;
  status: 'Published' | 'Draft' | 'In Review';
  excerpt: string;
  tags: string[];
  featured?: boolean;
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
    metrics: { ttfb: string; hydrationCost: string };
  };
  content?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}

export interface TelemetryMetrics {
  totalReads: string;
  totalReadsGrowth: string;
  activeArticles: number;
  pendingDrafts: number;
  productionCount: number;
  stagedCount: number;
  clientInquiries: number;
  clientInquiriesGrowth: string;
  awaitingScoping: number;
  avgReadDuration: string;
  readDurationDiff: string;
  depthEngagement: number;
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  icon: string;
  label?: string;
}

export interface DeveloperProfile {
  name: string;
  shortName: string;
  initials: string;
  brandName: string;
  role: string;
  location: string;
  email: string;
  isAvailableForHire: boolean;
  avatarUrl: string;
  tagline: string;
  heroHeading: string;
  heroSubtitle: string;
  heroDescription: string;
  longDescription: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    telegram?: string;
    email?: string;
    [key: string]: string | undefined;
  };
  socialLinks?: SocialLinkItem[];
  stats: {
    yearsExperience: string;
    completedProjects: string;
    clientSatisfaction: string;
  };
}

export interface PortfolioData {
  profile: DeveloperProfile;
  whatIDo: WhatIDoItem[];
  projects: Project[];
  experiences: Experience[];
  education: EducationItem[];
  languages: SpokenLanguage[];
  skills: SkillCategory[];
  interests: InterestItem[];
  articles: Article[];
  telemetry: TelemetryMetrics;
}
