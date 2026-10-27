'use client';

import React, { useMemo } from 'react';
import { Cpu, Terminal, Database, Code2, Layers, Globe, Server } from 'lucide-react';
import { usePortfolioData } from './PortfolioDataContext';
import { initialTechRadar } from '@/lib/data';
import { TechRadarItem } from '@/lib/types';

// =========================================================================
// Authentic SVG Vector Icons for Battle-Tested Tooling
// =========================================================================
const NextJsIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-slate-900 dark:fill-white`}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.836 17.587l-7.234-9.33v9.33H8.75V6.413h2.122l7.214 9.308v-9.308h1.852v11.174h-2.102z" />
  </svg>
);

const TypeScriptIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect width="24" height="24" rx="5" fill="#3178C6" />
    <path
      d="M11.5 13.5H9.2v5.5H7.5v-5.5H5.2V12h6.3v1.5zm7.3 2.1c-.2.7-.6 1.3-1.2 1.7-.6.4-1.4.6-2.4.6-1.1 0-2-.3-2.6-.9-.6-.6-.9-1.5-.9-2.7h1.7c0 .7.2 1.2.5 1.5.3.3.8.5 1.4.5.6 0 1-.1 1.3-.4.3-.2.4-.6.4-1 0-.3-.1-.6-.3-.8-.2-.2-.6-.4-1.2-.6l-1.1-.3c-.9-.3-1.6-.7-2-1.2-.4-.5-.6-1.1-.6-1.9 0-.9.3-1.7 1-2.2.7-.5 1.6-.8 2.7-.8 1.1 0 2 .3 2.6.8.6.6.9 1.4.9 2.5h-1.7c0-.6-.2-1.1-.5-1.4-.3-.3-.7-.5-1.3-.5-.5 0-.9.1-1.2.4-.3.2-.4.6-.4.9 0 .3.1.5.3.7.2.2.6.4 1.2.6l1.1.3c1 .3 1.7.7 2.1 1.2.4.5.6 1.2.6 2z"
      fill="#ffffff"
    />
  </svg>
);

const ReactIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} text-[#61DAFB]`} fill="none" stroke="currentColor" strokeWidth="1.5">
    <ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(0 12 12)" />
    <ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(120 12 12)" />
    <circle cx="12" cy="12" r="2.2" fill="#61DAFB" stroke="none" />
  </svg>
);

const PythonIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path
      d="M11.928 2c-3.142 0-2.95 1.36-2.95 1.36l.006 1.41h2.986v.426H6.182S3.85 4.93 3.85 8.358c0 3.427 2.03 3.308 2.03 3.308h1.213v-1.72s-.066-2.03 1.996-2.03h3.447s1.93.033 1.93-1.9v-2.12S14.654 2 11.928 2zm-1.63 1.144a.65.65 0 1 1 0 1.3.65.65 0 0 1 0-1.3z"
      fill="#3776AB"
    />
    <path
      d="M12.072 22c3.142 0 2.95-1.36 2.95-1.36l-.006-1.41h-2.986v-.426h5.788s2.332.266 2.332-3.162c0-3.427-2.03-3.308-2.03-3.308h-1.213v1.72s.066 2.03-1.996 2.03H11.46s-1.93-.033-1.93 1.9v2.12S9.346 22 12.072 22zm1.63-1.144a.65.65 0 1 1 0-1.3.65.65 0 0 1 0 1.3z"
      fill="#FFD438"
    />
  </svg>
);

const FrappeIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect width="24" height="24" rx="5" fill="#0089FF" />
    <path d="M7 6h10v2.5H9.6v3.2h6v2.4h-6v4.4H7V6z" fill="#ffffff" />
  </svg>
);

const MariaDBIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} text-amber-500`} fill="none" stroke="currentColor" strokeWidth="2">
    <ellipse cx="12" cy="5" rx="9" ry="3" fill="#C07135" fillOpacity="0.25" stroke="#C07135" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" stroke="#C07135" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke="#C07135" />
  </svg>
);

const DockerIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#2496ED">
    <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186zm-2.954 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H8.075a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186zm-2.954 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.12a.186.186 0 00-.185.185v1.887c0 .102.083.186.185.186zm11.808 2.714h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186H16.93a.186.186 0 00-.186.185v1.888c0 .102.083.185.186.185zm-8.854 0h2.119a.186.186 0 00.185-.185V9.006a.185.185 0 00-.185-.186H8.075a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185zm-2.954 0h2.119a.186.186 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.12a.186.186 0 00-.185.185v1.888c0 .102.083.185.185.185zm-2.954 0h2.119a.186.186 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.166a.186.186 0 00-.186.185v1.888c0 .102.083.185.186.185zM23.77 11.83c-.417-.674-1.393-.974-2.316-.763-.198-.925-.795-1.503-1.637-1.503-.43 0-.853.155-1.225.45-.63-.44-1.428-.68-2.264-.68-.216 0-.434.017-.648.05V9.2c0-.205-.167-.372-.372-.372h-1.5a.372.372 0 00-.373.372v1.986H.373a.373.373 0 00-.373.372c0 3.79 1.77 6.438 4.73 7.078 1.488.322 3.19.485 5.06.485 7.63 0 12.827-3.905 13.98-7.291z" />
  </svg>
);

const TailwindIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-[#38BDF8]`}>
    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
  </svg>
);

const QdrantIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect width="24" height="24" rx="5" fill="#E11D48" />
    <path d="M12 4l6 3.5v7l-6 3.5-6-3.5v-7L12 4z" stroke="#ffffff" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="12" cy="11" r="2.2" fill="#ffffff" />
    <path d="M12 4v7m0 0l6 3.5m-6-3.5l-6 3.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const JavaScriptIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect width="24" height="24" rx="5" fill="#F7DF1E" />
    <path
      d="M7.5 17.5c.3.5.7.8 1.3.8.7 0 1.2-.4 1.2-1.3v-5.2h1.8v5.2c0 1.9-1.1 2.8-2.9 2.8-1.3 0-2.2-.6-2.6-1.5l1.2-.8zm6.5-.2c.4.7 1 1.1 1.9 1.1.8 0 1.4-.4 1.4-1 0-.6-.5-.9-1.4-1.3l-.5-.2c-1.4-.6-2.3-1.3-2.3-2.8 0-1.6 1.3-2.7 3.2-2.7 1.4 0 2.4.5 3 1.7l-1.3.9c-.3-.6-.7-.9-1.7-.9-.8 0-1.3.4-1.3 1 0 .5.4.8 1.3 1.2l.5.2c1.6.7 2.5 1.4 2.5 2.9 0 1.8-1.4 2.8-3.4 2.8-1.8 0-3-.9-3.4-2l1.2-.8z"
      fill="#000000"
    />
  </svg>
);

const GitIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#F05032">
    <path d="M21.707 10.293l-8-8a.999.999 0 00-1.414 0l-1.854 1.854 2.378 2.378a2 2 0 11-1.414 1.414L9 5.556 3.707 10.849a.999.999 0 000 1.414l8 8a.999.999 0 001.414 0l8.586-8.586a1 1 0 000-1.384zM12 18a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
);

const RestApiIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center rounded bg-emerald-600 text-[10px] font-mono font-black text-white`}>
    API
  </div>
);

// Helper to resolve an icon and brand colors based on tool name & category
function resolveToolVisual(name: string, category: string) {
  const q = name.toLowerCase();

  if (q.includes('next')) {
    return {
      icon: NextJsIcon,
      color: '#0ea5e9',
      glow: 'rgba(14, 165, 233, 0.35)',
    };
  }
  if (q.includes('typescript') || q === 'ts') {
    return {
      icon: TypeScriptIcon,
      color: '#3178C6',
      glow: 'rgba(49, 120, 198, 0.35)',
    };
  }
  if (q.includes('react')) {
    return {
      icon: ReactIcon,
      color: '#61DAFB',
      glow: 'rgba(97, 218, 251, 0.35)',
    };
  }
  if (q.includes('python')) {
    return {
      icon: PythonIcon,
      color: '#3776AB',
      glow: 'rgba(55, 118, 171, 0.35)',
    };
  }
  if (q.includes('frappe') || q.includes('erpnext')) {
    return {
      icon: FrappeIcon,
      color: '#0089FF',
      glow: 'rgba(0, 137, 255, 0.35)',
    };
  }
  if (q.includes('maria') || q.includes('mysql') || q.includes('sql')) {
    return {
      icon: MariaDBIcon,
      color: '#C07135',
      glow: 'rgba(192, 113, 53, 0.35)',
    };
  }
  if (q.includes('docker') || q.includes('container')) {
    return {
      icon: DockerIcon,
      color: '#2496ED',
      glow: 'rgba(36, 150, 237, 0.35)',
    };
  }
  if (q.includes('tailwind') || q.includes('css')) {
    return {
      icon: TailwindIcon,
      color: '#38BDF8',
      glow: 'rgba(56, 189, 248, 0.35)',
    };
  }
  if (q.includes('qdrant') || q.includes('vector') || q.includes('ai')) {
    return {
      icon: QdrantIcon,
      color: '#E11D48',
      glow: 'rgba(225, 29, 72, 0.35)',
    };
  }
  if (q.includes('javascript') || q === 'js') {
    return {
      icon: JavaScriptIcon,
      color: '#F7DF1E',
      glow: 'rgba(247, 223, 30, 0.35)',
    };
  }
  if (q.includes('git')) {
    return {
      icon: GitIcon,
      color: '#F05032',
      glow: 'rgba(240, 80, 50, 0.35)',
    };
  }
  if (q.includes('api') || q.includes('rest') || q.includes('webhook')) {
    return {
      icon: RestApiIcon,
      color: '#10B981',
      glow: 'rgba(16, 185, 129, 0.35)',
    };
  }

  // Fallback: Elegant initials icon with category color
  const initials = name
    .split(/[\s/&-]+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const isDatabase = category.toLowerCase().includes('database') || category.toLowerCase().includes('data');
  const isBackend = category.toLowerCase().includes('backend');
  const isCloud = category.toLowerCase().includes('cloud') || category.toLowerCase().includes('devops');

  const fallbackColor = isDatabase ? '#F59E0B' : isBackend ? '#8B5CF6' : isCloud ? '#06B6D4' : '#0EA5E9';

  const FallbackIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <div
      className={`${className} rounded-md flex items-center justify-center font-mono font-bold text-[10px] text-white shadow-xs`}
      style={{ backgroundColor: fallbackColor }}
    >
      {initials || <Code2 className="w-3.5 h-3.5 text-white" />}
    </div>
  );

  return {
    icon: FallbackIcon,
    color: fallbackColor,
    glow: 'rgba(14, 165, 233, 0.25)',
  };
}

export function HeroTechStackAnimation() {
  const { data } = usePortfolioData();

  // Dynamically derive Tech Radar list from database or static fallback
  const techRadarItems: TechRadarItem[] = useMemo(() => {
    return data.techRadar && data.techRadar.length > 0 ? data.techRadar : initialTechRadar;
  }, [data.techRadar]);

  // Dynamically filter items selected via the "showOnHome" checkbox
  const activeTools = useMemo(() => {
    const checked = techRadarItems.filter((item) => Boolean(item.showOnHome));
    // If no tools are explicitly checked yet, default to top 8 items
    return checked.length > 0 ? checked : techRadarItems.slice(0, 8);
  }, [techRadarItems]);

  // Distribute tools across Outer and Inner orbital rings
  const { outerTools, innerTools } = useMemo(() => {
    if (activeTools.length <= 5) {
      return { outerTools: activeTools, innerTools: [] };
    }
    const outerCount = Math.ceil(activeTools.length * 0.55);
    return {
      outerTools: activeTools.slice(0, outerCount),
      innerTools: activeTools.slice(outerCount),
    };
  }, [activeTools]);

  // Orbital Radii in pixels
  const outerRadius = 136;
  const innerRadius = 80;

  return (
    <div className="relative flex flex-col items-center justify-center mx-auto pointer-events-none select-none">
      {/* Frameless Floating Orbital Stage */}
      <div className="relative w-[330px] h-[330px] sm:w-[350px] sm:h-[350px] flex items-center justify-center mx-auto">
        {/* Ambient backdrop glow that blends organically into the page */}
        <div className="absolute inset-0 rounded-full bg-sky-400/10 dark:bg-sky-500/10 blur-2xl pointer-events-none" />

        {/* Concentric SVG Orbital Tracks */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 340">
          <defs>
            <radialGradient id="framelessRadarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.12" />
              <stop offset="65%" stopColor="#0ea5e9" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Center soft aura */}
          <circle cx="170" cy="170" r={outerRadius + 8} fill="url(#framelessRadarGlow)" />

          {/* Outer Orbit Track */}
          <circle
            cx="170"
            cy="170"
            r={outerRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            className="text-sky-300/60 dark:text-sky-500/25"
          />

          {/* Inner Orbit Track (rendered when innerTools exist) */}
          {innerTools.length > 0 && (
            <circle
              cx="170"
              cy="170"
              r={innerRadius}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 3"
              className="text-sky-300/50 dark:text-sky-500/20"
            />
          )}

          {/* Subtle Crosshair Axis Lines */}
          <line
            x1="170"
            y1="34"
            x2="170"
            y2="306"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2 3"
            className="text-sky-300/30 dark:text-slate-800"
          />
          <line
            x1="34"
            y1="170"
            x2="306"
            y2="170"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2 3"
            className="text-sky-300/30 dark:text-slate-800"
          />
        </svg>

        {/* Continuous Sweeping Radar Beam */}
        <div
          className="absolute w-[270px] h-[270px] rounded-full pointer-events-none animate-tech-sweep"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg 280deg, rgba(14, 165, 233, 0.05) 330deg, rgba(14, 165, 233, 0.18) 360deg)',
          }}
        />

        {/* Center Futuristic Core Hub */}
        <div className="relative z-10 w-16 h-16 rounded-full bg-white/90 dark:bg-slate-900/90 border border-sky-300/80 dark:border-sky-500/40 shadow-lg shadow-sky-500/15 flex flex-col items-center justify-center p-1 text-center backdrop-blur-md">
          <div className="relative flex items-center justify-center">
            <span className="absolute -inset-1 rounded-full bg-sky-400/25 dark:bg-sky-500/20 animate-ping" />
            <Cpu className="w-5 h-5 text-sky-600 dark:text-sky-400 relative z-10" />
          </div>
          <span className="text-[8px] font-mono font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 tracking-tight">
            STACK
          </span>
        </div>

        {/* ----------------- DYNAMIC OUTER ORBIT RING (Clockwise Continuous) ----------------- */}
        <div className="absolute inset-0 flex items-center justify-center animate-tech-orbit-cw">
          {outerTools.map((tool, idx) => {
            const angle = (idx * 2 * Math.PI) / outerTools.length;
            const x = outerRadius * Math.cos(angle);
            const y = outerRadius * Math.sin(angle);
            const visual = resolveToolVisual(tool.name, tool.category);
            const Icon = visual.icon;

            return (
              <div
                key={tool.id || `outer-${idx}`}
                className="absolute"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                {/* Counter-rotation keeps icon upright continuously */}
                <div className="animate-tech-counter-cw">
                  <div
                    className="relative p-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-md shadow-sky-900/5 dark:shadow-sky-500/10 flex items-center justify-center"
                    style={{
                      boxShadow: `0 4px 14px -2px ${visual.glow}`,
                    }}
                  >
                    <Icon className="w-5 h-5" />

                    {/* Small brand accent badge */}
                    <span
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-slate-900"
                      style={{ backgroundColor: visual.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ----------------- DYNAMIC INNER ORBIT RING (Counter-Clockwise Continuous) ----------------- */}
        {innerTools.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center animate-tech-orbit-ccw">
            {innerTools.map((tool, idx) => {
              const angle = (idx * 2 * Math.PI) / innerTools.length + Math.PI / 4;
              const x = innerRadius * Math.cos(angle);
              const y = innerRadius * Math.sin(angle);
              const visual = resolveToolVisual(tool.name, tool.category);
              const Icon = visual.icon;

              return (
                <div
                  key={tool.id || `inner-${idx}`}
                  className="absolute"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  {/* Counter-rotation keeps icon upright continuously */}
                  <div className="animate-tech-counter-ccw">
                    <div
                      className="relative p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-sm shadow-sky-900/5 dark:shadow-sky-500/10 flex items-center justify-center"
                      style={{
                        boxShadow: `0 3px 10px -2px ${visual.glow}`,
                      }}
                    >
                      <Icon className="w-4 h-4" />

                      <span
                        className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-white dark:border-slate-900"
                        style={{ backgroundColor: visual.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modern Minimalist Status Capsule (Shows Dynamic Selected Count) */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 -mt-2 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-sky-200/60 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 shadow-2xs">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500" />
        </span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">Battle-Tested</span>
        <span>•</span>
        <span>{activeTools.length} Production Engines</span>
      </div>
    </div>
  );
}
