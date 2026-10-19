'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PortfolioData,
  DeveloperProfile,
  WhatIDoItem,
  Project,
  Experience,
  EducationItem,
  SpokenLanguage,
  Article,
  SkillCategory,
  InterestItem,
  TelemetryMetrics
} from '@/lib/types';
import {
  developerProfile as initialProfile,
  whatIDoItems as initialWhatIDo,
  initialProjects,
  experiences as initialExperiences,
  educationList as initialEducation,
  spokenLanguages as initialLanguages,
  skillCategories as initialSkills,
  personalInterests as initialInterests,
  initialArticles,
  telemetryMetrics as initialTelemetry
} from '@/lib/data';

const defaultPortfolioData: PortfolioData = {
  profile: initialProfile,
  whatIDo: initialWhatIDo,
  projects: initialProjects,
  experiences: initialExperiences,
  education: initialEducation,
  languages: initialLanguages,
  skills: initialSkills,
  interests: initialInterests,
  articles: initialArticles,
  telemetry: initialTelemetry,
};

interface PortfolioDataContextType {
  data: PortfolioData;
  isLoading: boolean;
  lastUpdated: string | null;
  saveData: (partial: Partial<PortfolioData>) => Promise<boolean>;
  updateProfile: (profile: Partial<DeveloperProfile>) => Promise<boolean>;
  updateWhatIDo: (items: WhatIDoItem[]) => Promise<boolean>;
  updateProjects: (projects: Project[]) => Promise<boolean>;
  updateExperiences: (experiences: Experience[]) => Promise<boolean>;
  updateEducation: (education: EducationItem[]) => Promise<boolean>;
  updateLanguages: (languages: SpokenLanguage[]) => Promise<boolean>;
  updateSkills?: (skills: SkillCategory[]) => Promise<boolean>;
  updateInterests?: (interests: InterestItem[]) => Promise<boolean>;
  updateArticles: (articles: Article[]) => Promise<boolean>;
  resetToDefaults: () => Promise<boolean>;
  importJson: (jsonString: string) => Promise<{ success: boolean; error?: string }>;
  getFormattedJson: () => string;
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

export function PortfolioDataProvider({ children }: { children: React.ReactNode }) {
  // Lazy initialize state from localStorage if available
  const [data, setData] = useState<PortfolioData>(() => {
    if (typeof window === 'undefined') return defaultPortfolioData;
    try {
      const cached = localStorage.getItem('spv_portfolio_live_data');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          return { ...defaultPortfolioData, ...parsed };
        }
      }
    } catch {
      // fallback
    }
    return defaultPortfolioData;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Sync with API on initial load
  useEffect(() => {
    let active = true;

    fetch('/api/portfolio-data')
      .then((res) => res.json())
      .then((resData) => {
        if (active && resData.success && resData.data) {
          setData(resData.data);
          setLastUpdated(resData.timestamp || new Date().toISOString());
          try {
            localStorage.setItem('spv_portfolio_live_data', JSON.stringify(resData.data));
          } catch {
            // storage quota
          }
        }
      })
      .catch((err) => {
        console.error('Failed to sync from /api/portfolio-data:', err);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Central commit function
  const commitData = useCallback(async (updated: PortfolioData): Promise<boolean> => {
    setData(updated);
    const now = new Date().toISOString();
    setLastUpdated(now);

    // Save to localStorage immediately
    try {
      localStorage.setItem('spv_portfolio_live_data', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed saving to localStorage:', e);
    }

    // Log the JSON representation as requested
    console.log('%c[PORTFOLIO DATA UPDATED // LIVE JSON]', 'color: #0284c7; font-weight: bold;', updated);

    // Persist to server via API
    try {
      const res = await fetch('/api/portfolio-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      return res.ok;
    } catch (err) {
      console.error('Server sync failed:', err);
      return false;
    }
  }, []);

  const saveData = useCallback(
    async (partial: Partial<PortfolioData>): Promise<boolean> => {
      const merged: PortfolioData = {
        ...data,
        ...partial,
        profile: partial.profile ? { ...data.profile, ...partial.profile } : data.profile,
      };
      return commitData(merged);
    },
    [data, commitData]
  );

  const updateProfile = useCallback(
    async (profile: Partial<DeveloperProfile>): Promise<boolean> => {
      return saveData({ profile: { ...data.profile, ...profile } });
    },
    [data, saveData]
  );

  const updateWhatIDo = useCallback(
    async (items: WhatIDoItem[]): Promise<boolean> => {
      return saveData({ whatIDo: items });
    },
    [saveData]
  );

  const updateProjects = useCallback(
    async (projects: Project[]): Promise<boolean> => {
      return saveData({ projects });
    },
    [saveData]
  );

  const updateExperiences = useCallback(
    async (experiences: Experience[]): Promise<boolean> => {
      return saveData({ experiences });
    },
    [saveData]
  );

  const updateEducation = useCallback(
    async (education: EducationItem[]): Promise<boolean> => {
      return saveData({ education });
    },
    [saveData]
  );

  const updateLanguages = useCallback(
    async (languages: SpokenLanguage[]): Promise<boolean> => {
      return saveData({ languages });
    },
    [saveData]
  );

  const updateSkills = useCallback(
    async (skills: SkillCategory[]): Promise<boolean> => {
      return saveData({ skills });
    },
    [saveData]
  );

  const updateInterests = useCallback(
    async (interests: InterestItem[]): Promise<boolean> => {
      return saveData({ interests });
    },
    [saveData]
  );

  const updateArticles = useCallback(
    async (articles: Article[]): Promise<boolean> => {
      return saveData({ articles });
    },
    [saveData]
  );

  const resetToDefaults = useCallback(async (): Promise<boolean> => {
    try {
      localStorage.removeItem('spv_portfolio_live_data');
      await fetch('/api/portfolio-data', { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setData(defaultPortfolioData);
    setLastUpdated(new Date().toISOString());
    return true;
  }, []);

  const importJson = useCallback(
    async (jsonString: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const parsed = JSON.parse(jsonString);
        if (!parsed || typeof parsed !== 'object') {
          return { success: false, error: 'JSON payload must be a valid object' };
        }
        if (!parsed.profile || !parsed.projects) {
          return { success: false, error: 'JSON must include at least profile and projects objects' };
        }
        const full: PortfolioData = {
          ...defaultPortfolioData,
          ...parsed,
          profile: { ...defaultPortfolioData.profile, ...parsed.profile },
        };
        await commitData(full);
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Invalid JSON format';
        return { success: false, error: msg };
      }
    },
    [commitData]
  );

  const getFormattedJson = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  return (
    <PortfolioDataContext.Provider
      value={{
        data,
        isLoading,
        lastUpdated,
        saveData,
        updateProfile,
        updateWhatIDo,
        updateProjects,
        updateExperiences,
        updateEducation,
        updateLanguages,
        updateSkills,
        updateInterests,
        updateArticles,
        resetToDefaults,
        importJson,
        getFormattedJson,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
}
