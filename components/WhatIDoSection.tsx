'use client';

import React from 'react';
import {
  Terminal,
  Palette,
  Rocket,
  Code2,
  Server,
  Database,
  Users,
  Wallet,
  ShoppingCart,
  Workflow,
  BrainCircuit,
  BarChart3,
  Cpu,
  Shield,
  Layers,
  Globe,
  Zap,
  Briefcase
} from 'lucide-react';
import { usePortfolioData } from '@/components/PortfolioDataContext';

export function WhatIDoSection() {
  const { data } = usePortfolioData();
  const whatIDoItems = data.whatIDo || [];

  const getIcon = (icon: string) => {
    const norm = (icon || '').toLowerCase().trim();
    switch (norm) {
      case 'terminal':
        return <Terminal className="w-5 h-5" />;
      case 'palette':
      case 'design':
        return <Palette className="w-5 h-5" />;
      case 'rocket':
      case 'performance':
        return <Rocket className="w-5 h-5" />;
      case 'code':
      case 'frappe':
      case 'development':
        return <Code2 className="w-5 h-5" />;
      case 'server':
      case 'api':
      case 'backend':
        return <Server className="w-5 h-5" />;
      case 'database':
      case 'sql':
      case 'storage':
        return <Database className="w-5 h-5" />;
      case 'users':
      case 'recruitment':
      case 'hr':
        return <Users className="w-5 h-5" />;
      case 'wallet':
      case 'payroll':
      case 'hrms':
        return <Wallet className="w-5 h-5" />;
      case 'shopping-cart':
      case 'shoppingcart':
      case 'ecommerce':
      case 'cart':
        return <ShoppingCart className="w-5 h-5" />;
      case 'workflow':
      case 'automation':
      case 'integration':
        return <Workflow className="w-5 h-5" />;
      case 'brain-circuit':
      case 'braincircuit':
      case 'ai':
      case 'brain':
        return <BrainCircuit className="w-5 h-5" />;
      case 'chart-no-axes-combined':
      case 'chart':
      case 'reporting':
      case 'analytics':
        return <BarChart3 className="w-5 h-5" />;
      case 'cpu':
        return <Cpu className="w-5 h-5" />;
      case 'shield':
        return <Shield className="w-5 h-5" />;
      case 'layers':
        return <Layers className="w-5 h-5" />;
      case 'globe':
        return <Globe className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <section className="w-full space-y-8">
      {/* Section Header */}
      <div className="flex flex-col gap-2 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-semibold w-fit mx-auto md:mx-0">
          <Briefcase className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>Core Capabilities</span>
        </div>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold font-display text-slate-900 dark:text-slate-50 tracking-tight">
          What I Do &amp; <span className="text-sky-600 dark:text-sky-400">Core Services</span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-body mx-auto md:mx-0">
          Specialized engineering capabilities, custom ERP systems, and scalable backend solutions I deliver for modern businesses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {whatIDoItems.map((item) => (
          <div
            key={item.id}
            className="p-6 md:p-7 rounded-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-sky-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-sky-300/80 dark:hover:border-slate-700/80 transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              <div className="size-11 rounded-xl bg-sky-50 dark:bg-slate-800/80 border border-sky-200/60 dark:border-slate-700/60 flex items-center justify-center mb-4 text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-200 shadow-xs">
                {getIcon(item.icon)}
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-50 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-body">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
