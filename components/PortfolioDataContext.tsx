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
  TelemetryMetrics,
  TechRadarItem
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
  telemetryMetrics as initialTelemetry,
  initialTechRadar
} from '@/lib/data';

const defaultPortfolioData: PortfolioData = {
  profile: initialProfile,
  whatIDo: initialWhatIDo,
  projects: initialProjects,
  experiences: initialExperiences,
  education: initialEducation,
  languages: initialLanguages,
  skills: initialSkills,
  techRadar: initialTechRadar,
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
  updateTechRadar?: (techRadar: TechRadarItem[]) => Promise<boolean>;
  updateInterests?: (interests: InterestItem[]) => Promise<boolean>;
  updateArticles: (articles: Article[]) => Promise<boolean>;
  resetToDefaults: () => Promise<boolean>;
  importJson: (jsonString: string, targetSection?: string) => Promise<{ success: boolean; section?: string; count?: number; error?: string }>;
  getFormattedJson: () => string;
}

function normalizeDataSlugs(pData: PortfolioData): PortfolioData {
  if (!pData) return pData;
  const articles = (pData.articles || []).map((art) => {
    if (art.id && (art.slug !== art.id || art.slug?.includes('frappe-framework-2026-guideline'))) {
      return { ...art, slug: art.id };
    }
    return art;
  });
  const projects = (pData.projects || []).map((proj) => {
    if (proj.id && proj.slug !== proj.id) {
      return { ...proj, slug: proj.id };
    }
    return proj;
  });
  return { ...pData, articles, projects };
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
          return normalizeDataSlugs({ ...defaultPortfolioData, ...parsed });
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
          const normalized = normalizeDataSlugs(resData.data);
          setData(normalized);
          setLastUpdated(resData.timestamp || new Date().toISOString());
          try {
            localStorage.setItem('spv_portfolio_live_data', JSON.stringify(normalized));
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
    const normalized = normalizeDataSlugs(updated);
    setData(normalized);
    const now = new Date().toISOString();
    setLastUpdated(now);

    // Save to localStorage immediately
    try {
      localStorage.setItem('spv_portfolio_live_data', JSON.stringify(normalized));
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

  const updateTechRadar = useCallback(
    async (techRadar: TechRadarItem[]): Promise<boolean> => {
      return saveData({ techRadar });
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
    async (
      jsonString: string,
      targetSection?: string
    ): Promise<{ success: boolean; section?: string; count?: number; error?: string }> => {
      try {
        let cleaned = (jsonString || '').trim();
        if (!cleaned) {
          return { success: false, error: 'JSON payload is empty' };
        }

        // 1. Remove trailing comma at the very end of the string
        cleaned = cleaned.replace(/,\s*$/, '');

        // 2. Loose snippet repair: if it starts with a key without outer braces, e.g. "whatIDo": [ ... ]
        if (/^\s*"[a-zA-Z0-9_-]+"\s*:\s*[\[{]/.test(cleaned) && !cleaned.startsWith('{')) {
          cleaned = `{${cleaned}}`;
        }

        // 3. Remove trailing commas before closing braces/brackets (e.g. { "a": 1, })
        cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');

        let parsed: any;
        try {
          parsed = JSON.parse(cleaned);
        } catch (jsonErr: any) {
          return { success: false, error: `Invalid JSON syntax: ${jsonErr.message}` };
        }

        // 4. Handle raw array payload e.g. [ { "id": "...", ... } ]
        if (Array.isArray(parsed)) {
          let section = targetSection;
          if (!section || section === 'auto') {
            const first = parsed[0] || {};
            if ('period' in first && 'company' in first) {
              section = 'experiences';
            } else if ('category' in first && 'image' in first) {
              section = 'projects';
            } else if ('degree' in first || 'institution' in first) {
              section = 'education';
            } else if ('language' in first && 'proficiency' in first) {
              section = 'languages';
            } else if ('skills' in first && ('category' in first || 'title' in first || Array.isArray(first.skills))) {
              section = 'skills';
            } else if ('content' in first && 'slug' in first) {
              section = 'articles';
            } else if ('title' in first && ('icon' in first || 'description' in first)) {
              section = 'whatIDo';
            } else {
              section = 'whatIDo';
            }
          }
          parsed = { [section]: parsed };
        }

        if (!parsed || typeof parsed !== 'object') {
          return { success: false, error: 'Parsed JSON is not an object or array' };
        }

        // 5. Determine which section(s) are being updated
        const validKeys = [
          'profile',
          'whatIDo',
          'projects',
          'experiences',
          'education',
          'languages',
          'skills',
          'techRadar',
          'interests',
          'articles',
          'telemetry'
        ];

        let keys = Object.keys(parsed);
        let recognizedKeys = keys.filter((k) => validKeys.includes(k));

        // If user explicitly chose a target section and the payload is an unwrapped object (e.g. raw profile or single object)
        if (recognizedKeys.length === 0 && targetSection && targetSection !== 'auto' && validKeys.includes(targetSection)) {
          parsed = { [targetSection]: parsed };
          keys = Object.keys(parsed);
          recognizedKeys = [targetSection];
        }

        if (recognizedKeys.length === 0) {
          return {
            success: false,
            error: `Unrecognized payload structure. Expected one of: ${validKeys.join(', ')}`
          };
        }

        // 6. Merge with current live data
        const merged: PortfolioData = {
          ...data,
          ...parsed,
          profile: parsed.profile ? { ...data.profile, ...parsed.profile } : data.profile,
        };

        await commitData(merged);

        let sectionSummary = recognizedKeys.join(', ');
        let count: number | undefined = undefined;
        if (recognizedKeys.length === 1) {
          const singleVal = parsed[recognizedKeys[0]];
          if (Array.isArray(singleVal)) {
            count = singleVal.length;
          }
        }

        return {
          success: true,
          section: sectionSummary,
          count
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Invalid JSON format';
        return { success: false, error: msg };
      }
    },
    [data, commitData]
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
        updateTechRadar,
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
