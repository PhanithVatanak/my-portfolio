'use client';

import React from 'react';
import {
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  MapPin,
  CheckCircle2,
  Globe,
  Sparkles,
  Phone,
  FileCheck2,
} from 'lucide-react';
import { usePortfolioData } from '@/components/PortfolioDataContext';

interface ResumeContentProps {
  className?: string;
  zoomLevel?: 'normal' | 'large' | 'fit';
  includePhoto?: boolean;
}

export function ResumeContent({
  className = '',
  zoomLevel = 'normal',
  includePhoto = false,
}: ResumeContentProps) {
  const { data } = usePortfolioData();
  const developerProfile = data.profile;
  const experiences = data.experiences;
  const skillCategories = data.skills;
  const educationList = data.education;
  const spokenLanguages = data.languages;

  return (
    <div
      id="resume-printable-area"
      className={`resume-a4-sheet bg-white text-slate-900 mx-auto transition-all duration-200 select-text font-sans ${
        zoomLevel === 'large' ? 'text-[14px]' : 'text-[13px]'
      } ${className}`}
      style={{
        width: '100%',
        maxWidth: '860px',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        color: '#0f172a',
      }}
    >
      <div className="px-[8px] py-6 sm:py-8 space-y-6 sm:space-y-7">
        {/* ================= A4 HEADER ================= */}
        <header className="border-b-2 border-slate-900/10 pb-6 space-y-4 print-break-inside-avoid">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
              {includePhoto && developerProfile.avatarUrl && (
                <div className="shrink-0 pt-0.5">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden ring-2 ring-slate-200/90 shadow-md bg-slate-100 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={developerProfile.avatarUrl}
                      alt={developerProfile.name}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-300/80 tracking-wide">
                  <span className="size-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>AVAILABLE FOR FULL-TIME ROLES & ARCHITECTURE ADVISORY</span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-[27px] font-black text-slate-950 font-display tracking-tight uppercase whitespace-nowrap">
                  {developerProfile.name}
                </h1>

                <p className="text-sky-700 font-extrabold text-sm sm:text-base tracking-wide font-display">
                  {developerProfile.role} • Systems Architect
                </p>

                <p className="text-slate-600 text-xs sm:text-[13px] max-w-xl leading-relaxed pt-0.5">
                  Full-Stack Web Application Developer specializing in Next.js 15, TypeScript, Frappe Framework, Python, and scalable distributed enterprise applications.
                </p>
              </div>
            </div>

            {/* Contact details card */}
            <div className="flex flex-col gap-1.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200/90 shrink-0 sm:min-w-[225px] shadow-2xs">
              <span className="flex items-center gap-2 font-medium">
                <MapPin className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                <span>{developerProfile.location}</span>
              </span>
              <span className="flex items-center gap-2 font-medium">
                <Mail className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                <a
                  href={`mailto:${developerProfile.email}`}
                  className="hover:text-sky-800 underline decoration-sky-300 underline-offset-2"
                >
                  {developerProfile.email}
                </a>
              </span>
              <span className="flex items-center gap-2 font-medium">
                <Globe className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                <a
                  href="https://github.com/vatanak-vault"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-sky-800"
                >
                  github.com/vatanak-vault
                </a>
              </span>
              <span className="flex items-center gap-2 font-medium">
                <Phone className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                <span>+855 (0) 12 345 678</span>
              </span>
              <span className="flex items-center gap-2 font-medium text-emerald-700 pt-0.5 border-t border-slate-200 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Open to Relocation / Remote</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="py-2.5 px-3 rounded-lg bg-sky-50/70 border border-sky-200/60 text-center">
              <span className="block text-xl sm:text-2xl font-black text-sky-800 font-display">
                {developerProfile.stats.yearsExperience}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                Years Experience
              </span>
            </div>

            <div className="py-2.5 px-3 rounded-lg bg-sky-50/70 border border-sky-200/60 text-center">
              <span className="block text-xl sm:text-2xl font-black text-sky-800 font-display">
                {developerProfile.stats.completedProjects}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                Shipped Projects
              </span>
            </div>

            <div className="py-2.5 px-3 rounded-lg bg-sky-50/70 border border-sky-200/60 text-center">
              <span className="block text-xl sm:text-2xl font-black text-sky-800 font-display">
                {developerProfile.stats.clientSatisfaction}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                Satisfaction Rate
              </span>
            </div>

            <div className="py-2.5 px-3 rounded-lg bg-sky-50/70 border border-sky-200/60 text-center">
              <span className="block text-xl sm:text-2xl font-black text-sky-800 font-display">
                98+
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                Lighthouse Score
              </span>
            </div>
          </div>
        </header>

        {/* ================= EXECUTIVE SUMMARY ================= */}
        <section className="space-y-2 print-break-inside-avoid">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-sky-800 uppercase border-b border-sky-100 pb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Profile & Architecture Summary</span>
          </div>
          <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
            Senior Systems Architect & Full-Stack Engineer with 6+ years of practical tenure building, deploying, and maintaining production business platforms, high-throughput recruitment management systems (RMS), enterprise HRMS, and modern web applications. Specialized in Next.js 15, TypeScript, Frappe Framework, Python, MariaDB, and vector database workflows. Proven track record delivering responsive web interfaces, optimizing SQL pipelines, and maintaining mission-critical business software.
          </p>
        </section>

        {/* ================= WORK EXPERIENCE ================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-sky-100 pb-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-sky-800 uppercase">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Professional Work Experience</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">6+ Years Cumulative</span>
          </div>

          <div className="space-y-4">
            {experiences.map((exp, idx) => (
              <div
                key={exp.id || idx}
                className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2.5 print-break-inside-avoid"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/60 pb-2">
                  <div>
                    <h3 className="font-bold text-slate-950 text-sm sm:text-base">
                      {exp.role}
                    </h3>
                    <span className="text-xs font-bold text-sky-700">
                      {exp.company}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white text-slate-700 font-semibold border border-slate-300 inline-block self-start sm:self-auto">
                    {exp.period}
                  </span>
                </div>

                <p className="text-slate-700 text-xs sm:text-[13px] leading-relaxed">
                  {exp.description}
                </p>

                {/* Achievements */}
                {exp.highlights && exp.highlights.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Core Responsibilities & Milestones:
                    </span>
                    {exp.highlights.slice(0, 4).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-700 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech chips */}
                {exp.technologies && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-slate-200/60">
                    {exp.technologies.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ================= TWO-COLUMN: SKILLS & EDUCATION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          {/* TECHNICAL SKILLS */}
          <section className="space-y-3 print-break-inside-avoid">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-sky-800 uppercase border-b border-sky-100 pb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Core Technical Skills</span>
            </div>

            <div className="space-y-2.5">
              {skillCategories.map((cat, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                  <span className="font-bold text-xs text-slate-900 block">
                    {cat.title}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cat.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10.5px] px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* EDUCATION & LANGUAGES */}
          <section className="space-y-4 print-break-inside-avoid">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-sky-800 uppercase border-b border-sky-100 pb-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Education & Credentials</span>
              </div>

              <div className="space-y-2.5">
                {educationList.map((edu) => (
                  <div key={edu.id} className="p-3 rounded-lg bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-slate-950 text-xs">
                        {edu.degree}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 shrink-0">
                        {edu.period}
                      </span>
                    </div>
                    <span className="text-xs text-sky-700 font-semibold block">
                      {edu.institution}
                    </span>
                    <p className="text-[11.5px] text-slate-600 leading-relaxed">
                      {edu.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Spoken Languages:
              </span>
              <div className="flex flex-wrap gap-2">
                {spokenLanguages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-800 font-medium"
                  >
                    {lang.language}: <strong className="text-slate-950">{lang.proficiency}</strong>
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ================= A4 FOOTER ================= */}
        <footer className="pt-4 border-t-2 border-slate-900/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-500 print-break-inside-avoid">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-3.5 h-3.5 text-sky-700" />
            <span>Sun Phanith Vatanak • Executive Curriculum Vitae (A4 Format)</span>
          </div>
          <div>
            <span>Official Dossier • Verified Authentic</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
