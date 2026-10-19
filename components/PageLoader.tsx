'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Sparkles } from 'lucide-react';

export function PageLoader() {
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return !sessionStorage.getItem('spv_vault_loaded');
    } catch {
      return false;
    }
  });

  const [progress, setProgress] = useState(12);
  const [statusText, setStatusText] = useState('CONNECTING TO NODE...');

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatusText('SYSTEM ONLINE // READY');
          setTimeout(() => {
            setLoading(false);
            try {
              sessionStorage.setItem('spv_vault_loaded', 'true');
            } catch {
              // ignore
            }
          }, 250);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 22) + 12;
        if (next > 40 && next < 70) {
          setStatusText('COMPILING SHADERS & RUNTIME...');
        } else if (next >= 70 && next < 95) {
          setStatusText('HYDRATING REACT 19 HYPERDRIVE...');
        }
        return next > 100 ? 100 : next;
      });
    }, 75);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <>
      {/* Top glowing laser progress line (visible during initial site boot) */}
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none h-[2.5px] bg-transparent">
          <motion.div
            initial={{ width: '0%', opacity: 1 }}
            animate={{ width: `${progress}%`, opacity: 1 }}
            transition={{ duration: 0.1 }}
            className="h-full bg-gradient-to-r from-sky-400 via-sky-500 to-cyan-300 shadow-[0_0_12px_#0284c7]"
          />
        </div>
      )}

      {/* Futuristic Fullscreen Loading HUD on first entrance */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl text-white font-mono"
          >
            {/* Ambient Background Glow */}
            <div className="absolute w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

            <div className="relative z-10 flex flex-col items-center gap-6 px-6 max-w-md w-full text-center">
              {/* Rotating Holographic Radar Rings */}
              <div className="relative size-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-sky-500/20 border-t-sky-400 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-2 border-sky-400/30 border-b-sky-300 animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
                <div className="absolute inset-4 rounded-full border border-sky-500/40 border-dashed animate-spin [animation-duration:3s]"></div>
                <div className="size-10 rounded-xl bg-sky-500/20 border border-sky-400/50 flex items-center justify-center shadow-lg shadow-sky-500/30">
                  <Terminal className="w-5 h-5 text-sky-400" />
                </div>
              </div>

              {/* Identity & Status */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold">
                  <span className="size-1.5 rounded-full bg-sky-400 animate-ping"></span>
                  <span>SPV PORTFOLIO // VAULT v2.5</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white font-display">
                  Sun Phanith Vatanak
                </h2>
                <p className="text-xs text-sky-400/80 font-mono tracking-wide">
                  {statusText}
                </p>
              </div>

              {/* Progress Bar & Percentage */}
              <div className="w-full space-y-2">
                <div className="w-full h-2 rounded-full bg-slate-900 border border-sky-500/30 overflow-hidden p-0.5 shadow-inner">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-300 shadow-[0_0_10px_#38bdf8]"
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'easeOut', duration: 0.1 }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-sky-400">
                    <Sparkles className="w-3 h-3" />
                    <span>INITIALIZING</span>
                  </span>
                  <span className="font-bold text-sky-300">{progress}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
