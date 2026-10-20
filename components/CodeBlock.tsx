'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
import { useToast } from './ToastContext';

export interface CodeBlockProps {
  code: string;
  filename?: string;
  language?: string;
  className?: string;
}

export function CodeBlock({
  code,
  filename = 'bench_quickstart.sh',
  language = 'Bash',
  className = ''
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    if (!code) return;
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopied(true);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  return (
    <div className={`rounded-xl bg-[#0b0f19] border border-slate-800 text-xs text-slate-200 font-mono shadow-md overflow-hidden my-4 group ${className}`}>
      {/* Code Block Window Header */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* OS Terminal Window Dots */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>

          {/* Filename with icon */}
          <div className="flex items-center gap-1.5 min-w-0">
            <Terminal className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-semibold text-slate-300 font-mono text-[11px] sm:text-xs truncate">
              {filename || 'bench_quickstart.sh'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Language Badge */}
          <span className="px-2 py-0.5 rounded bg-slate-800/90 text-sky-400 border border-slate-700/60 text-[10px] uppercase font-bold tracking-wider font-mono">
            {language || 'Bash'}
          </span>

          {/* Copy Button strictly labeled 'Copy' / 'Copied!' */}
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-sans font-medium transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/50 shadow-xs'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 hover:text-white'
            }`}
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-sky-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body */}
      <pre className="overflow-x-auto p-4 text-[11px] sm:text-xs leading-relaxed font-mono text-slate-200 bg-[#0b0f19] selection:bg-sky-500/30">
        <code>{code}</code>
      </pre>
    </div>
  );
}
