'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Send, Lock, User, AtSign, MessageSquare, Check, Copy, Github, Linkedin, Twitter, Loader2, Sparkles, Globe, Youtube, Code2 } from 'lucide-react';
import { useToast } from './ToastContext';
import { usePortfolioData } from '@/components/PortfolioDataContext';
import { copyToClipboard } from '@/lib/utils';

function DynamicContactSocialIcon({ icon, className }: { icon?: string; className?: string }) {
  const norm = (icon || '').toLowerCase();
  if (norm.includes('github')) return <Github className={className} />;
  if (norm.includes('linkedin')) return <Linkedin className={className} />;
  if (norm.includes('twitter') || norm === 'x') return <Twitter className={className} />;
  if (norm.includes('telegram') || norm.includes('send')) return <Send className={className} />;
  if (norm.includes('discord') || norm.includes('message')) return <MessageSquare className={className} />;
  if (norm.includes('mail') || norm.includes('email')) return <Mail className={className} />;
  if (norm.includes('youtube')) return <Youtube className={className} />;
  if (norm.includes('gitlab') || norm.includes('code')) return <Code2 className={className} />;
  return <Globe className={className} />;
}

export function ContactSection() {
  const { data } = usePortfolioData();
  const developerProfile = data.profile;
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleCopyEmail = async () => {
    const success = await copyToClipboard(developerProfile.email);
    if (success) {
      setCopiedEmail(true);
      showToast('Email address copied to clipboard!', 'info');
      setTimeout(() => setCopiedEmail(false), 2500);
    } else {
      showToast('Failed to copy email address.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Client-side quick check
    const errors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please provide your name (at least 2 characters).';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Please provide a message with at least 10 characters.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showToast('Please fix the errors in the form before submitting.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setFieldErrors(data.details);
        }
        throw new Error(data.error || 'Failed to submit message.');
      }

      showToast(data.message || 'Message sent successfully! I will reply soon.', 'success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full relative py-6 md:py-12">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-200/40 dark:bg-sky-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-96 h-96 bg-blue-100/50 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Left Column: Header & Info */}
        <div className="flex-1 flex flex-col justify-start lg:pt-4">
          <div className="mb-10">
            <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-5 border border-sky-200/60 dark:border-sky-500/20 shadow-xs">
              <span className="size-1.5 rounded-full bg-sky-600 dark:bg-sky-400 animate-pulse"></span>
              Contact
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-[-0.033em] mb-6 text-slate-900 dark:text-slate-50 font-display">
              Let&apos;s build something <span className="text-sky-600 dark:text-sky-400">together</span>.
            </h1>

            <p className="font-body text-slate-600 dark:text-slate-300 text-lg leading-relaxed max-w-[540px]">
              I&apos;m currently open to new opportunities. Whether you have a question about a project, want to collaborate, or just want to say hi, I&apos;ll try my best to get back to you!
            </p>
          </div>

          <div className="flex flex-col gap-5 mt-auto">
            {/* Email Directly */}
            <div className="flex items-start gap-4 p-4 rounded-2xl border border-sky-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:border-sky-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md hover:shadow-sky-100 dark:hover:shadow-sky-950/20 transition-all duration-300 group">
              <div className="size-12 rounded-xl bg-sky-100/80 dark:bg-slate-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Email me directly
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${developerProfile.email}`}
                    className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-400 transition-colors break-all"
                  >
                    {developerProfile.email}
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="p-1.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 rounded-md transition-colors"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Based In Location */}
            <div className="flex items-start gap-4 p-4 rounded-2xl border border-sky-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:border-sky-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md hover:shadow-sky-100 dark:hover:shadow-sky-950/20 transition-all duration-300 group">
              <div className="size-12 rounded-xl bg-sky-100/80 dark:bg-slate-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Based in
                </p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {developerProfile.location}
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pl-2 pt-2 flex-wrap">
              {(developerProfile.socialLinks && developerProfile.socialLinks.length > 0
                ? developerProfile.socialLinks
                : [
                    { id: '1', platform: 'GitHub', url: developerProfile.socials.github, icon: 'github' },
                    { id: '2', platform: 'LinkedIn', url: developerProfile.socials.linkedin, icon: 'linkedin' },
                    { id: '3', platform: 'Twitter', url: developerProfile.socials.twitter, icon: 'twitter' },
                  ]
              ).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.platform}
                  title={link.platform}
                  className="size-11 rounded-full border border-sky-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-sky-600 hover:text-white hover:border-sky-600 hover:shadow-md hover:shadow-sky-200/50 dark:hover:shadow-sky-900/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <DynamicContactSocialIcon icon={link.icon} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Form Container */}
        <div className="flex-1 lg:max-w-[500px]">
          <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-xl shadow-sky-900/5 dark:shadow-sky-950/30 border border-sky-100 dark:border-slate-800 relative overflow-hidden group/form">
            {/* Decorative subtle gradient glow */}
            <div className="absolute -top-[100px] -right-[100px] w-[220px] h-[220px] bg-sky-200/50 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <h3 className="text-xl font-bold mb-6 flex items-center gap-2.5 text-slate-900 dark:text-slate-50 font-display">
              <span className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <MessageSquare className="w-5 h-5" />
              </span>
              <span>Send me a message</span>
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Name Input */}
              <label className="flex flex-col flex-1">
                <span className="font-body text-sm font-semibold leading-normal pb-2 text-slate-700 dark:text-slate-300">
                  Name
                </span>
                <div className="relative group/input">
                  <span className="absolute left-4 top-4 text-slate-400 group-focus-within/input:text-sky-600 dark:group-focus-within/input:text-sky-400 transition-colors">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                    }}
                    placeholder="John Doe"
                    className="w-full rounded-xl outline-none border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-sky-500 dark:focus:border-sky-400 focus:ring-4 focus:ring-sky-500/15 h-14 placeholder:text-slate-400 dark:placeholder:text-slate-600 pl-12 pr-4 text-base font-normal text-slate-800 dark:text-slate-100 transition-all shadow-xs"
                  />
                </div>
                {fieldErrors.name && (
                  <span className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.name}</span>
                )}
              </label>

              {/* Email Input */}
              <label className="flex flex-col flex-1">
                <span className="font-body text-sm font-semibold leading-normal pb-2 text-slate-700 dark:text-slate-300">
                  Email
                </span>
                <div className="relative group/input">
                  <span className="absolute left-4 top-4 text-slate-400 group-focus-within/input:text-sky-600 dark:group-focus-within/input:text-sky-400 transition-colors">
                    <AtSign className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                    }}
                    placeholder="john@example.com"
                    className="w-full rounded-xl outline-none border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-sky-500 dark:focus:border-sky-400 focus:ring-4 focus:ring-sky-500/15 h-14 placeholder:text-slate-400 dark:placeholder:text-slate-600 pl-12 pr-4 text-base font-normal text-slate-800 dark:text-slate-100 transition-all shadow-xs"
                  />
                </div>
                {fieldErrors.email && (
                  <span className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.email}</span>
                )}
              </label>

              {/* Message Input */}
              <label className="flex flex-col flex-1">
                <span className="font-body text-sm font-semibold leading-normal pb-2 text-slate-700 dark:text-slate-300">
                  Message
                </span>
                <div className="relative group/input">
                  <span className="absolute left-4 top-4 text-slate-400 group-focus-within/input:text-sky-600 dark:group-focus-within/input:text-sky-400 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </span>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: '' });
                    }}
                    placeholder="Tell me about your project..."
                    className="w-full rounded-xl outline-none border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-sky-500 dark:focus:border-sky-400 focus:ring-4 focus:ring-sky-500/15 min-h-[150px] placeholder:text-slate-400 dark:placeholder:text-slate-600 pl-12 pr-4 py-4 text-base font-normal text-slate-800 dark:text-slate-100 transition-all shadow-xs resize-none"
                  ></textarea>
                </div>
                {fieldErrors.message && (
                  <span className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.message}</span>
                )}
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-sky-600 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-sky-500 hover:shadow-lg hover:shadow-sky-600/30 transition-all duration-200 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Message...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Trust indicator */}
          <div className="mt-6 flex justify-center items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 font-body">
            <Lock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Your information is safe and never shared.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
