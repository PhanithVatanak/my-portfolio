'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Share2,
  Check,
  Copy,
  Clock,
  Eye,
  MessageSquare,
  ExternalLink,
  Terminal,
  Save,
  CheckCircle2,
  Hash,
  Calendar,
  Layers,
  BookOpen,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Type,
  Palette,
  Bold,
  Italic,
  Underline,
  Code as CodeIcon,
  Highlighter,
  SlidersHorizontal,
  ChevronDown,
  Tag,
  Sparkles,
  Eraser
} from 'lucide-react';
import { Article } from '@/lib/types';
import { useToast } from './ToastContext';
import { usePortfolioData } from './PortfolioDataContext';
import { PARENT_CATEGORIES, getSubcategoriesForParent, detectParentCategory } from '@/lib/categories';
import { copyToClipboard } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';

interface BlogDetailsViewProps {
  article: Article;
  mode?: 'view' | 'edit';
  onSave?: (updated: Article) => Promise<boolean | void> | void;
  onCancel?: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function parseInlineStyle(styleStr: string): React.CSSProperties {
  const styleObj: Record<string, string> = {};
  if (!styleStr) return styleObj;

  const declarations = styleStr.split(';');
  for (const decl of declarations) {
    const colonIdx = decl.indexOf(':');
    if (colonIdx === -1) continue;
    const property = decl.slice(0, colonIdx).trim();
    const value = decl.slice(colonIdx + 1).trim();
    if (!property || !value) continue;

    // Convert kebab-case property to camelCase for React
    const camelProperty = property.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    styleObj[camelProperty] = value;
  }
  return styleObj as React.CSSProperties;
}

export function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  const tokenRegex = /(<span\s+[^>]*>[\s\S]*?<\/span>|<mark\s+[^>]*>[\s\S]*?<\/mark>|<u>[\s\S]*?<\/u>|~~[\s\S]*?~~|\*\*[\s\S]*?\*\*|\*[\s\S]*?\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/gi;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (!part) return null;

    // 1. <span style="..." class="...">...</span>
    const spanMatch = part.match(/^<span\s+([^>]*)>([\s\S]*?)<\/span>$/i);
    if (spanMatch) {
      const attrsStr = spanMatch[1];
      const innerContent = spanMatch[2];
      const styleMatch = attrsStr.match(/style="([^"]*)"/i);
      const classMatch = attrsStr.match(/class(?:Name)?="([^"]*)"/i);
      const parsedStyle = styleMatch ? parseInlineStyle(styleMatch[1]) : {};
      const className = classMatch ? classMatch[1] : '';

      return (
        <span key={i} style={parsedStyle} className={className}>
          {renderInlineMarkdown(innerContent)}
        </span>
      );
    }

    // 2. <mark style="...">...</mark>
    const markMatch = part.match(/^<mark\s+([^>]*)>([\s\S]*?)<\/mark>$/i);
    if (markMatch) {
      const attrsStr = markMatch[1];
      const innerContent = markMatch[2];
      const styleMatch = attrsStr.match(/style="([^"]*)"/i);
      const parsedStyle = styleMatch ? parseInlineStyle(styleMatch[1]) : {};

      return (
        <mark
          key={i}
          style={parsedStyle}
          className="px-1.5 py-0.5 rounded text-slate-950 font-medium"
        >
          {renderInlineMarkdown(innerContent)}
        </mark>
      );
    }

    // 3. <u>...</u>
    if (part.toLowerCase().startsWith('<u>') && part.toLowerCase().endsWith('</u>')) {
      return (
        <u key={i} className="underline underline-offset-2">
          {renderInlineMarkdown(part.slice(3, -4))}
        </u>
      );
    }

    // 4. ~~strikethrough~~
    if (part.startsWith('~~') && part.endsWith('~~')) {
      return (
        <del key={i} className="line-through opacity-75">
          {renderInlineMarkdown(part.slice(2, -2))}
        </del>
      );
    }

    // 5. **bold**
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-slate-900 dark:text-slate-100">
          {renderInlineMarkdown(part.slice(2, -2))}
        </strong>
      );
    }

    // 6. *italic*
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return (
        <em key={i} className="italic text-slate-800 dark:text-slate-200">
          {renderInlineMarkdown(part.slice(1, -1))}
        </em>
      );
    }

    // 7. `code`
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-mono text-xs sm:text-[13px] border border-slate-200 dark:border-slate-700/60"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // 8. [link](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-600 dark:text-sky-400 underline font-medium hover:text-sky-500 inline-flex items-center gap-0.5"
        >
          <span>{linkMatch[1]}</span>
          <ExternalLink className="w-3 h-3 inline" />
        </a>
      );
    }

    return part;
  });
}

export interface MarkdownBlock {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'hr' | 'ul' | 'ol' | 'blockquote' | 'p' | 'code';
  content: string;
  items?: string[];
  id?: string;
  fontRole?: string;
  language?: string;
  filename?: string;
}

export function parseMarkdownBlocks(text: string): MarkdownBlock[] {
  const lines = text.split(/\r?\n/);
  const blocks: MarkdownBlock[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({
        type: 'p',
        content: currentParagraph.join(' ').trim()
      });
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList) {
      blocks.push({
        type: currentList.type,
        content: '',
        items: [...currentList.items]
      });
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    // Fenced Code Block (e.g. ```bash:bench_quickstart.sh or ```bash or ```)
    if (trimmed.startsWith('```')) {
      flushParagraph();
      flushList();
      const meta = trimmed.slice(3).trim();
      let language = 'Bash';
      let filename = 'bench_quickstart.sh';
      if (meta) {
        if (meta.includes(':')) {
          const parts = meta.split(':');
          language = parts[0].trim() || 'Bash';
          filename = parts[1].trim() || 'bench_quickstart.sh';
        } else if (meta.includes(' ')) {
          const parts = meta.split(/\s+/);
          language = parts[0].trim() || 'Bash';
          filename = parts.slice(1).join(' ').trim() || 'bench_quickstart.sh';
        } else {
          language = meta;
          const lower = meta.toLowerCase();
          if (lower === 'bash' || lower === 'sh') {
            filename = 'bench_quickstart.sh';
          } else if (lower === 'python' || lower === 'py') {
            filename = 'script.py';
          } else if (lower === 'javascript' || lower === 'js') {
            filename = 'index.js';
          } else if (lower === 'typescript' || lower === 'ts') {
            filename = 'app.ts';
          } else {
            filename = `snippet.${lower}`;
          }
        }
      }

      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }

      blocks.push({
        type: 'code',
        content: codeLines.join('\n'),
        language,
        filename
      });
      continue;
    }

    if (trimmed === '---' || trimmed === '***') {
      flushParagraph();
      flushList();
      blocks.push({ type: 'hr', content: '' });
      continue;
    }

    // Heading matches h1 to h6
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      const typeKey = (`h${level}`) as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      const headingContent = headingMatch[2].trim();
      blocks.push({
        type: typeKey,
        content: headingContent,
        id: slugify(headingContent)
      });
      continue;
    }

    if (trimmed.startsWith('>')) {
      flushParagraph();
      flushList();
      blocks.push({
        type: 'blockquote',
        content: trimmed.replace(/^>\s*/, '').trim()
      });
      continue;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushParagraph();
      const itemText = trimmed.replace(/^[-*]\s+/, '').trim();
      if (currentList && currentList.type === 'ul') {
        currentList.items.push(itemText);
      } else {
        flushList();
        currentList = { type: 'ul', items: [itemText] };
      }
      continue;
    }

    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      const itemText = orderedMatch[2].trim();
      if (currentList && currentList.type === 'ol') {
        currentList.items.push(itemText);
      } else {
        flushList();
        currentList = { type: 'ol', items: [itemText] };
      }
      continue;
    }

    if (currentList) {
      flushList();
    }
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  return blocks;
}

export function FormattedArticleContent({ content = '' }: { content?: string }) {
  const blocks = useMemo(() => parseMarkdownBlocks(content), [content]);

  return (
    <div className="space-y-4 font-body">
      {blocks.map((block, idx) => {
        if (block.type === 'hr') {
          return <hr key={idx} className="my-8 border-slate-200 dark:border-slate-800" />;
        }

        if (block.type === 'h1') {
          return (
            <h1
              key={idx}
              id={block.id}
              className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-slate-50 pt-8 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 group scroll-mt-24"
            >
              <a href={`#${block.id}`} className="text-slate-400 group-hover:text-sky-500 transition-colors">
                <Hash className="w-5 h-5 opacity-40 group-hover:opacity-100" />
              </a>
              <span>{renderInlineMarkdown(block.content)}</span>
            </h1>
          );
        }

        if (block.type === 'h2') {
          return (
            <h2
              key={idx}
              id={block.id}
              className="text-lg sm:text-xl font-extrabold font-display text-slate-900 dark:text-slate-100 pt-7 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 group scroll-mt-24"
            >
              <a href={`#${block.id}`} className="text-slate-400 group-hover:text-sky-500 transition-colors">
                <Hash className="w-4 h-4 opacity-40 group-hover:opacity-100" />
              </a>
              <span>{renderInlineMarkdown(block.content)}</span>
            </h2>
          );
        }

        if (block.type === 'h3') {
          return (
            <h3
              key={idx}
              id={block.id}
              className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-slate-100 pt-5 pb-1 flex items-center gap-2 group scroll-mt-24"
            >
              <a href={`#${block.id}`} className="text-slate-400 group-hover:text-sky-500 transition-colors">
                <Hash className="w-4 h-4 opacity-40 group-hover:opacity-100" />
              </a>
              <span>{renderInlineMarkdown(block.content)}</span>
            </h3>
          );
        }

        if (block.type === 'h4') {
          return (
            <h4
              key={idx}
              id={block.id}
              className="text-sm sm:text-base font-semibold font-display text-slate-900 dark:text-slate-200 pt-4 pb-1 scroll-mt-24"
            >
              <span>{renderInlineMarkdown(block.content)}</span>
            </h4>
          );
        }

        if (block.type === 'h5') {
          return (
            <h5
              key={idx}
              id={block.id}
              className="text-xs sm:text-sm font-semibold font-display uppercase tracking-wider text-slate-700 dark:text-slate-300 pt-3 pb-0.5 scroll-mt-24"
            >
              <span>{renderInlineMarkdown(block.content)}</span>
            </h5>
          );
        }

        if (block.type === 'h6') {
          return (
            <h6
              key={idx}
              id={block.id}
              className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 pt-2 pb-0.5 scroll-mt-24"
            >
              <span>{renderInlineMarkdown(block.content)}</span>
            </h6>
          );
        }

        if (block.type === 'ul' && block.items) {
          return (
            <ul key={idx} className="space-y-2 pl-5 list-disc text-sm sm:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed marker:text-sky-500">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="pl-1">
                  {renderInlineMarkdown(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'ol' && block.items) {
          return (
            <ol key={idx} className="space-y-2 pl-5 list-decimal text-sm sm:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed marker:text-sky-500 marker:font-semibold">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="pl-1">
                  {renderInlineMarkdown(item)}
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === 'blockquote') {
          return (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/25 border-l-4 border-sky-500 text-xs sm:text-sm text-slate-750 dark:text-slate-200 leading-relaxed my-3"
            >
              {renderInlineMarkdown(block.content)}
            </div>
          );
        }

        if (block.type === 'code') {
          return (
            <CodeBlock
              key={idx}
              code={block.content}
              filename={block.filename || 'bench_quickstart.sh'}
              language={block.language || 'Bash'}
            />
          );
        }

        return (
          <p key={idx} className="text-sm sm:text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
            {renderInlineMarkdown(block.content)}
          </p>
        );
      })}
    </div>
  );
}

// Structured section model for visual section builder
export interface VisualSection {
  id: string;
  format: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'blockquote' | 'ul' | 'ol';
  fontRole: 'header' | 'sub-header' | 'title' | 'sub-title' | 'content' | 'mono';
  heading: string;
  content: string;
}

// Convert markdown text to editable sections
function parseSectionsFromMarkdown(markdown: string): VisualSection[] {
  const blocks = parseMarkdownBlocks(markdown);
  if (blocks.length === 0) {
    return [
      {
        id: 'sec-1',
        format: 'h2',
        fontRole: 'header',
        heading: 'Overview',
        content: 'Write the section description here...'
      }
    ];
  }

  const sections: VisualSection[] = [];
  let currentSection: VisualSection | null = null;

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(b.type)) {
      if (currentSection) {
        sections.push(currentSection);
      }
      let fontRole: VisualSection['fontRole'] = 'header';
      if (b.type === 'h1') fontRole = 'header';
      else if (b.type === 'h2') fontRole = 'sub-header';
      else if (b.type === 'h3') fontRole = 'title';
      else if (b.type === 'h4') fontRole = 'sub-title';
      else fontRole = 'content';

      currentSection = {
        id: `sec-${sections.length + 1}`,
        format: b.type as any,
        fontRole,
        heading: b.content,
        content: ''
      };
    } else {
      let blockText = '';
      if (b.type === 'ul' && b.items) {
        blockText = b.items.map((it) => `- ${it}`).join('\n');
      } else if (b.type === 'ol' && b.items) {
        blockText = b.items.map((it, idx) => `${idx + 1}. ${it}`).join('\n');
      } else if (b.type === 'blockquote') {
        blockText = `> ${b.content}`;
      } else if (b.type === 'code') {
        const langTag = b.language ? (b.filename ? `${b.language}:${b.filename}` : b.language) : '';
        blockText = `\`\`\`${langTag}\n${b.content}\n\`\`\``;
      } else if (b.type === 'p') {
        blockText = b.content;
      }

      if (currentSection) {
        currentSection.content = currentSection.content
          ? `${currentSection.content}\n\n${blockText}`
          : blockText;
      } else {
        currentSection = {
          id: `sec-${sections.length + 1}`,
          format: 'p',
          fontRole: 'content',
          heading: '',
          content: blockText
        };
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections.length > 0
    ? sections
    : [
        {
          id: 'sec-1',
          format: 'h2',
          fontRole: 'header',
          heading: 'Overview',
          content: ''
        }
      ];
}

// Convert visual sections back into markdown
function serializeSectionsToMarkdown(sections: VisualSection[]): string {
  const parts: string[] = [];

  sections.forEach((sec) => {
    if (sec.heading && sec.heading.trim()) {
      let prefix = '## ';
      if (sec.format === 'h1') prefix = '# ';
      else if (sec.format === 'h2') prefix = '## ';
      else if (sec.format === 'h3') prefix = '### ';
      else if (sec.format === 'h4') prefix = '#### ';
      else if (sec.format === 'h5') prefix = '##### ';
      else if (sec.format === 'h6') prefix = '###### ';

      parts.push(`${prefix}${sec.heading.trim()}`);
    }

    if (sec.content && sec.content.trim()) {
      parts.push(sec.content.trim());
    }

    parts.push('---');
  });

  if (parts.length > 0 && parts[parts.length - 1] === '---') {
    parts.pop();
  }

  return parts.join('\n\n');
}

// Word-style color palette options
const COLOR_PALETTE = [
  { name: 'Sky Blue', hex: '#0284c7', class: 'text-sky-600 dark:text-sky-400' },
  { name: 'Royal Blue', hex: '#2563eb', class: 'text-blue-600 dark:text-blue-400' },
  { name: 'Emerald Green', hex: '#059669', class: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Amber Gold', hex: '#d97706', class: 'text-amber-600 dark:text-amber-400' },
  { name: 'Rose Red', hex: '#e11d48', class: 'text-rose-600 dark:text-rose-400' },
  { name: 'Violet Purple', hex: '#7c3aed', class: 'text-purple-600 dark:text-purple-400' },
  { name: 'Dark Slate', hex: '#334155', class: 'text-slate-700 dark:text-slate-300' }
];

const HIGHLIGHT_PALETTE = [
  { name: 'Yellow Highlight', hex: '#fef08a' },
  { name: 'Sky Highlight', hex: '#bae6fd' },
  { name: 'Emerald Highlight', hex: '#a7f3d0' },
  { name: 'Rose Highlight', hex: '#fecdd3' }
];

// Helper to compute visual styling and labels for section format and font role
function getHeadingStyleClasses(format: VisualSection['format'], fontRole: VisualSection['fontRole']) {
  let sizeClass = 'text-base font-semibold';
  let borderClass = '';
  let badgeLabel = 'P (Body)';

  switch (format) {
    case 'h1':
      sizeClass = 'text-2xl sm:text-3xl font-black';
      borderClass = 'border-b-2 border-sky-500/40 pb-2';
      badgeLabel = 'H1 Main Heading';
      break;
    case 'h2':
      sizeClass = 'text-xl sm:text-2xl font-extrabold';
      borderClass = 'border-b border-slate-300 dark:border-slate-700 pb-1.5';
      badgeLabel = 'H2 Sub-Header';
      break;
    case 'h3':
      sizeClass = 'text-lg sm:text-xl font-bold';
      badgeLabel = 'H3 Title';
      break;
    case 'h4':
      sizeClass = 'text-base sm:text-lg font-semibold';
      badgeLabel = 'H4 Sub-Title';
      break;
    case 'h5':
      sizeClass = 'text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300';
      badgeLabel = 'H5 Section Tag';
      break;
    case 'h6':
      sizeClass = 'text-xs font-mono font-bold uppercase tracking-widest text-slate-500';
      badgeLabel = 'H6 Sub-Tag';
      break;
    case 'blockquote':
      sizeClass = 'text-sm italic pl-3 border-l-4 border-amber-500 bg-amber-500/5 py-1';
      badgeLabel = 'Pro-Tip Callout';
      break;
    case 'p':
    default:
      sizeClass = 'text-sm font-normal';
      badgeLabel = 'Paragraph';
      break;
  }

  let fontClass = 'font-sans';
  let fontLabel = 'Content Font';
  switch (fontRole) {
    case 'header':
      fontClass = 'font-display font-extrabold tracking-tight';
      fontLabel = 'Display Header Font';
      break;
    case 'sub-header':
      fontClass = 'font-display font-bold';
      fontLabel = 'Display Sub-Header Font';
      break;
    case 'title':
      fontClass = 'font-sans font-bold';
      fontLabel = 'Title Font';
      break;
    case 'sub-title':
      fontClass = 'font-sans font-medium text-slate-600 dark:text-slate-400';
      fontLabel = 'Sub-Title Font';
      break;
    case 'mono':
      fontClass = 'font-mono';
      fontLabel = 'Code Monospace Font';
      break;
    case 'content':
    default:
      fontClass = 'font-sans';
      fontLabel = 'Body Font';
      break;
  }

  return { sizeClass, borderClass, fontClass, badgeLabel, fontLabel };
}

export function BlogDetailsView({
  article,
  mode = 'view',
  onSave,
  onCancel
}: BlogDetailsViewProps) {
  const { data } = usePortfolioData();
  const developerProfile = data.profile;
  const { showToast } = useToast();

  const isEdit = mode === 'edit';

  const [formData, setFormData] = useState<Article>({ ...article });
  const [rawTags, setRawTags] = useState(article.tags?.join(', ') || '');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editorTab, setEditorTab] = useState<'sections' | 'markdown' | 'preview'>('sections');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Visual Section Builder State
  const [sections, setSections] = useState<VisualSection[]>(() =>
    parseSectionsFromMarkdown(article.content || '')
  );

  useEffect(() => {
    setFormData({ ...article });
    setRawTags(article.tags?.join(', ') || '');
    setSections(parseSectionsFromMarkdown(article.content || ''));
  }, [article]);

  useEffect(() => {
    if (isEdit) return;
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isEdit]);

  const tableOfContents = useMemo(() => {
    const blocks = parseMarkdownBlocks(formData.content || '');
    return blocks
      .filter((b) => ['h1', 'h2', 'h3', 'h4'].includes(b.type))
      .map((b) => ({
        level: b.type === 'h1' ? 1 : b.type === 'h2' ? 2 : b.type === 'h3' ? 3 : 4,
        title: b.content,
        id: b.id || slugify(b.content)
      }));
  }, [formData.content]);

  const handleCopyCode = async (codeText?: string) => {
    const textToCopy = codeText || formData.codeSnippet?.code || '';
    if (!textToCopy) return;

    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopiedSnippet(true);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopiedSnippet(false), 2000);
    } else {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleShareLink = async () => {
    if (typeof window !== 'undefined') {
      const ok = await copyToClipboard(window.location.href);
      if (ok) {
        setCopiedLink(true);
        showToast('Article URL copied to clipboard!', 'success');
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        showToast('Failed to copy URL', 'error');
      }
    }
  };

  // Section Builder Actions
  const handleAddSection = () => {
    const newSec: VisualSection = {
      id: `sec-${Date.now()}`,
      format: 'h2',
      fontRole: 'sub-header',
      heading: 'New Section Title',
      content: 'Enter detailed content and breakdown here...'
    };
    const updated = [...sections, newSec];
    setSections(updated);
    const md = serializeSectionsToMarkdown(updated);
    setFormData((prev) => ({ ...prev, content: md }));
    showToast('New section added to publication', 'info');
  };

  const handleUpdateSection = (id: string, updates: Partial<VisualSection>) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setSections(updated);
    const md = serializeSectionsToMarkdown(updated);
    setFormData((prev) => ({ ...prev, content: md }));
  };

  const handleDeleteSection = (id: string) => {
    if (sections.length <= 1) {
      showToast('An article must have at least one section', 'error');
      return;
    }
    const updated = sections.filter((s) => s.id !== id);
    setSections(updated);
    const md = serializeSectionsToMarkdown(updated);
    setFormData((prev) => ({ ...prev, content: md }));
    showToast('Section removed', 'info');
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) {
      return;
    }
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIdx, 0, moved);
    setSections(reordered);
    const md = serializeSectionsToMarkdown(reordered);
    setFormData((prev) => ({ ...prev, content: md }));
  };

  // Tracks the active input or textarea where the user selected text
  const [activeSelection, setActiveSelection] = useState<{
    sectionId: string;
    field: 'heading' | 'content';
    elementId: string;
  } | null>(null);

  // Apply formatting ONLY to currently selected text in active element (Heading or Content)
  const applySelectionWrap = (
    sectionId: string,
    prefix: string,
    suffix: string,
    preferredField?: 'heading' | 'content'
  ) => {
    let targetField: 'heading' | 'content' = preferredField || 'content';
    let targetElId = `section-text-${sectionId}`;

    if (activeSelection && activeSelection.sectionId === sectionId) {
      targetField = activeSelection.field;
      targetElId = activeSelection.elementId;
    } else if (preferredField === 'heading') {
      targetField = 'heading';
      targetElId = `heading-input-${sectionId}`;
    }

    const el = document.getElementById(targetElId) as HTMLInputElement | HTMLTextAreaElement | null;
    if (!el) {
      const fallback = (document.getElementById(`section-text-${sectionId}`) ||
        document.getElementById(`heading-input-${sectionId}`)) as HTMLInputElement | HTMLTextAreaElement | null;
      if (!fallback) return;
      applyToElement(fallback, sectionId, targetField, prefix, suffix);
      return;
    }

    applyToElement(el, sectionId, targetField, prefix, suffix);
  };

  const applyToElement = (
    el: HTMLInputElement | HTMLTextAreaElement,
    sectionId: string,
    field: 'heading' | 'content',
    prefix: string,
    suffix: string
  ) => {
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const val = el.value || '';
    const hasSelection = start !== end;
    const selectedText = hasSelection ? val.substring(start, end) : 'selected text';
    const replacement = `${prefix}${selectedText}${suffix}`;
    const newVal = val.substring(0, start) + replacement + val.substring(end);

    if (field === 'heading') {
      handleUpdateSection(sectionId, { heading: newVal });
    } else {
      handleUpdateSection(sectionId, { content: newVal });
    }

    setTimeout(() => {
      el.focus();
      const newSelStart = start + prefix.length;
      const newSelEnd = newSelStart + selectedText.length;
      el.setSelectionRange(newSelStart, newSelEnd);
    }, 50);
  };

  // Apply font family specifically to selected text
  const applyFontToSelection = (sectionId: string, fontFamily: string) => {
    applySelectionWrap(sectionId, `<span style="font-family: ${fontFamily};">`, '</span>');
  };

  // Apply font size & weight specifically to selected text
  const applySizeToSelection = (sectionId: string, sizeType: string) => {
    let styleStr = '';
    switch (sizeType) {
      case 'h1':
        styleStr = 'font-size: 1.875rem; font-weight: 800; line-height: 2.25rem;';
        break;
      case 'h2':
        styleStr = 'font-size: 1.5rem; font-weight: 700; line-height: 2rem;';
        break;
      case 'h3':
        styleStr = 'font-size: 1.25rem; font-weight: 700; line-height: 1.75rem;';
        break;
      case 'h4':
        styleStr = 'font-size: 1rem; font-weight: 600;';
        break;
      case 'normal':
        styleStr = 'font-size: 0.875rem; font-weight: 400;';
        break;
      case 'small':
        styleStr = 'font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;';
        break;
    }
    applySelectionWrap(sectionId, `<span style="${styleStr}">`, '</span>');
  };

  // Clear styling tags from highlighted text
  const clearSelectionFormatting = (sectionId: string) => {
    let targetField: 'heading' | 'content' = 'content';
    let targetElId = `section-text-${sectionId}`;

    if (activeSelection && activeSelection.sectionId === sectionId) {
      targetField = activeSelection.field;
      targetElId = activeSelection.elementId;
    }

    const el = document.getElementById(targetElId) as HTMLInputElement | HTMLTextAreaElement | null;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const val = el.value || '';
    if (start === end) {
      showToast('Please highlight text first to clear its formatting', 'info');
      return;
    }

    const selectedText = val.substring(start, end);
    const cleaned = selectedText
      .replace(/<span\s+[^>]*>/gi, '')
      .replace(/<\/span>/gi, '')
      .replace(/<mark\s+[^>]*>/gi, '')
      .replace(/<\/mark>/gi, '')
      .replace(/<u>/gi, '')
      .replace(/<\/u>/gi, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/~~/g, '');

    const newVal = val.substring(0, start) + cleaned + val.substring(end);

    if (targetField === 'heading') {
      handleUpdateSection(sectionId, { heading: newVal });
    } else {
      handleUpdateSection(sectionId, { content: newVal });
    }

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start, start + cleaned.length);
    }, 50);
    showToast('Formatting cleared on selected text', 'success');
  };

  const insertCodeBlockIntoSection = (sectionId: string) => {
    const defaultCodeSnippet = '```bash:bench_quickstart.sh\n# 1. Update system & install foundational dependencies\nsudo apt update && sudo apt upgrade -y\nsudo apt install -y git python3-dev python3-setuptools python3-pip python3-venv virtualenv libmariadb-dev-compat libmariadb-dev redis-server curl\n\n# 2. Configure MariaDB for Frappe (UTF8MB4 requirement)\nsudo nano /etc/mysql/mariadb.conf.d/50-server.cnf\n# [mysqld]\n# character-set-client-handshake = FALSE\n# character-set-server = utf8mb4\n# collation-server = utf8mb4_unicode_ci\n\n# 3. Install Frappe-Bench and Initialize Site\npip3 install frappe-bench\nbench init --frappe-branch version-15 frappe-bench\ncd frappe-bench\nbench new-site development.local --mariadb-root-password your_root_password\nbench start\n```';

    const el = document.getElementById(`section-text-${sectionId}`) as HTMLTextAreaElement | null;
    if (el) {
      const start = el.selectionStart ?? el.value.length;
      const end = el.selectionEnd ?? el.value.length;
      const val = el.value || '';
      const prefix = start > 0 && val[start - 1] !== '\n' ? '\n\n' : '';
      const suffix = end < val.length && val[end] !== '\n' ? '\n\n' : '';
      const newVal = val.substring(0, start) + prefix + defaultCodeSnippet + suffix + val.substring(end);
      handleUpdateSection(sectionId, { content: newVal });
      setTimeout(() => {
        el.focus();
        const cursor = start + prefix.length + defaultCodeSnippet.length;
        el.setSelectionRange(cursor, cursor);
      }, 50);
    } else {
      const sec = sections.find((s) => s.id === sectionId);
      const existing = sec?.content ? `${sec.content}\n\n` : '';
      handleUpdateSection(sectionId, { content: `${existing}${defaultCodeSnippet}` });
    }
    showToast('Code block template inserted into section!', 'success');
  };

  const handleSaveArticle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Article title cannot be empty', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const updatedArticle: Article = {
        ...formData,
        tags: rawTags.split(',').map((t) => t.trim()).filter(Boolean),
        slug: formData.slug || slugify(formData.title),
      };

      if (onSave) {
        await onSave(updatedArticle);
      }
      showToast('Article saved & published to blog vault!', 'success');
    } catch {
      showToast('Failed to save article.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const availableSubcategories = getSubcategoriesForParent(formData.parentCategory || 'Fullstack');

  return (
    <div className="w-full relative min-h-screen bg-slate-50/50 dark:bg-[#0b1120]">
      {/* Scroll Reading Progress Bar (View Mode) */}
      {!isEdit && (
        <div
          className="fixed top-0 left-0 right-0 h-1 bg-sky-500 z-50 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      )}

      {/* Admin Editor Top Banner */}
      {isEdit && (
        <div className="sticky top-16 z-30 w-full bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-sky-500/30 text-white px-4 sm:px-8 py-3 shadow-xl transition-all">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block">
                  Admin Live In-Place Editor
                </span>
                <span className="text-xs text-slate-300 font-medium truncate max-w-sm block">
                  Editing: {formData.title || 'Untitled Article'} ({formData.id})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}

              {formData.id && (
                <Link
                  href={`/blog/${formData.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-sky-300 bg-sky-950/60 hover:bg-sky-900/80 border border-sky-700/50 transition-colors"
                  title="View live public article in new tab"
                >
                  <span>View Live Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}

              <button
                type="button"
                onClick={() => handleSaveArticle()}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/30 transition-all disabled:opacity-70 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Article</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Navigation Breadcrumb (View Mode) */}
        {!isEdit && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Back to Field Notes</span>
            </Link>

            <div className="flex items-center gap-2">
              {formData.forumUrl && (
                <a
                  href={formData.forumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-sm transition-all"
                  title="Open official discussion on Frappe Community Forum"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Discuss on Frappe Forum</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              )}

              <button
                onClick={handleShareLink}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
                title="Copy article link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Reading / Editor Canvas */}
          <article className="lg:col-span-8 space-y-6">
            {/* Article Meta Header */}
            <header className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {isEdit ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Parent Category (Domain)
                      </label>
                      <select
                        value={formData.parentCategory || 'Fullstack'}
                        onChange={(e) => {
                          const newParent = e.target.value;
                          const subs = getSubcategoriesForParent(newParent);
                          setFormData({
                            ...formData,
                            parentCategory: newParent,
                            subCategory: subs[0] || '',
                            category: newParent
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                      >
                        {PARENT_CATEGORIES.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Subcategory (Framework)
                      </label>
                      <select
                        value={formData.subCategory || availableSubcategories[0] || ''}
                        onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                      >
                        {availableSubcategories.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Publication Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="In Review">In Review</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/20">
                      {formData.id}
                    </span>
                    <span className="px-3 py-0.5 rounded-full font-semibold bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/20">
                      {formData.parentCategory || formData.category}
                    </span>
                    {formData.subCategory && (
                      <span className="px-2.5 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {formData.subCategory}
                      </span>
                    )}
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formData.readTime}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formData.publishedDate}
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              {isEdit ? (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Article Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter article headline..."
                    className="w-full text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50 font-display tracking-tight leading-tight px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border-2 border-sky-500/40 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              ) : (
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 font-display tracking-tight leading-tight">
                  {formData.title}
                </h1>
              )}

              {/* Author Info Bar */}
              <div className="flex items-center gap-3 pt-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                  {developerProfile.initials || 'PV'}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>{developerProfile.name}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      Author & Systems Architect
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Personal Development & Engineering Vault
                  </div>
                </div>
              </div>
            </header>

            {/* Frappe Community Forum Card */}
            {(formData.forumUrl || isEdit) && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-transparent border border-sky-200 dark:border-sky-500/20 shadow-sm space-y-2.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider">
                      <MessageSquare className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                      <span>{formData.forumBadge || 'Official Frappe Community Forum Discussion'}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      This guideline is written as an onboarding blueprint for new team members and actively shared on discuss.frappe.io.
                    </p>
                  </div>

                  {formData.forumUrl && !isEdit && (
                    <a
                      href={formData.forumUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-sm transition-all whitespace-nowrap"
                    >
                      <span>Join discuss.frappe.io</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {isEdit && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-sky-200/60 dark:border-sky-500/20">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 block mb-0.5">
                        Forum Discussion URL
                      </label>
                      <input
                        type="url"
                        value={formData.forumUrl || ''}
                        onChange={(e) => setFormData({ ...formData, forumUrl: e.target.value })}
                        placeholder="https://discuss.frappe.io/t/your-thread"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 block mb-0.5">
                        Forum Badge Label
                      </label>
                      <input
                        type="text"
                        value={formData.forumBadge || ''}
                        onChange={(e) => setFormData({ ...formData, forumBadge: e.target.value })}
                        placeholder="Official Frappe Community Forum"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Lead Excerpt */}
            {isEdit ? (
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Lead Excerpt (Summary / TL;DR)
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="One or two sentences summarizing the key learning outcomes..."
                  className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed"
                />
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border-l-4 border-sky-500 shadow-sm text-slate-700 dark:text-slate-300 text-xs sm:text-sm italic leading-relaxed">
                {formData.excerpt}
              </div>
            )}

            {/* Quickstart Command Snippet Box */}
            <div className="space-y-2">
              {formData.codeSnippet && formData.codeSnippet.code && (
                <CodeBlock
                  code={formData.codeSnippet.code}
                  filename={formData.codeSnippet.filename || 'bench_quickstart.sh'}
                  language={formData.codeSnippet.language || 'Bash'}
                />
              )}
            </div>

            {/* Content Tabs: Visual Section Builder / Raw Markdown / Live Preview */}
            {isEdit ? (
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-sky-500" />
                      <span>Article Sections & Rich Content Builder</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Organize content into structured sections. Format headings (h1–h6), font roles, and color-code text.
                    </p>
                  </div>

                  {/* Mode Tabs */}
                  <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setEditorTab('sections')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        editorTab === 'sections'
                          ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Section Builder
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab('markdown')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        editorTab === 'markdown'
                          ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Raw Markdown
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab('preview')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        editorTab === 'preview'
                          ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Live Preview
                    </button>
                  </div>
                </div>

                {/* TAB 1: VISUAL SECTION BUILDER */}
                {editorTab === 'sections' && (
                  <div className="space-y-4">
                    {/* Add Section Button Top */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {sections.length} Sections Defined
                      </span>

                      <button
                        type="button"
                        onClick={handleAddSection}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Section</span>
                      </button>
                    </div>

                    {/* Section Cards */}
                    <div className="space-y-4">
                      {sections.map((sec, sIdx) => {
                        const textareaId = `section-text-${sec.id}`;
                        const headingStyles = getHeadingStyleClasses(sec.format, sec.fontRole);

                        return (
                          <div
                            key={sec.id}
                            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5 transition-all"
                          >
                            {/* Section Controls Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center text-[10px] font-bold font-mono">
                                  {sIdx + 1}
                                </span>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  Section {sIdx + 1}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 flex-wrap">
                                {/* Format Selector (h1 - h6, p, blockquote) */}
                                <div className="flex items-center gap-1 text-xs">
                                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Format:</span>
                                  <select
                                    value={sec.format}
                                    onChange={(e) => {
                                      const newFormat = e.target.value as VisualSection['format'];
                                      let newFontRole = sec.fontRole;
                                      if (newFormat === 'h1' || newFormat === 'h2') newFontRole = 'header';
                                      else if (newFormat === 'h3') newFontRole = 'title';
                                      else if (newFormat === 'h4') newFontRole = 'sub-title';
                                      else if (newFormat === 'h6') newFontRole = 'mono';
                                      else if (newFormat === 'p') newFontRole = 'content';
                                      handleUpdateSection(sec.id, { format: newFormat, fontRole: newFontRole });
                                    }}
                                    className="px-2 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer"
                                  >
                                    <option value="h1">H1 Header</option>
                                    <option value="h2">H2 Sub-Header</option>
                                    <option value="h3">H3 Title</option>
                                    <option value="h4">H4 Sub-Title</option>
                                    <option value="h5">H5 Section Tag</option>
                                    <option value="h6">H6 Sub-Tag</option>
                                    <option value="p">Paragraph</option>
                                    <option value="blockquote">Pro-Tip Callout</option>
                                  </select>
                                </div>

                                {/* Font Role Selector */}
                                <div className="flex items-center gap-1 text-xs">
                                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Font:</span>
                                  <select
                                    value={sec.fontRole}
                                    onChange={(e) =>
                                      handleUpdateSection(sec.id, { fontRole: e.target.value as any })
                                    }
                                    className="px-2 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer"
                                  >
                                    <option value="header">Header Font (Display Bold)</option>
                                    <option value="sub-header">Sub-Header Font</option>
                                    <option value="title">Title Font (Medium)</option>
                                    <option value="sub-title">Sub-Title Font</option>
                                    <option value="content">Content Font (Body)</option>
                                    <option value="mono">Code Monospace Font</option>
                                  </select>
                                </div>

                                {/* Move Controls */}
                                <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveSection(sIdx, 'up')}
                                    disabled={sIdx === 0}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                                    title="Move section up"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveSection(sIdx, 'down')}
                                    disabled={sIdx === sections.length - 1}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                                    title="Move section down"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSection(sec.id)}
                                    className="p-1 rounded text-slate-400 hover:text-rose-500 cursor-pointer"
                                    title="Delete section"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Section Heading Input with Live Font & Size Feedback */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                    Section Heading / Title
                                  </label>
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-300/60 dark:border-sky-500/30">
                                    Base Tag: {headingStyles.badgeLabel}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 italic hidden sm:inline">
                                  Select words here or below to apply color & font to selection only
                                </span>
                              </div>
                              <input
                                id={`heading-input-${sec.id}`}
                                type="text"
                                value={sec.heading}
                                onFocus={() => setActiveSelection({ sectionId: sec.id, field: 'heading', elementId: `heading-input-${sec.id}` })}
                                onSelect={() => setActiveSelection({ sectionId: sec.id, field: 'heading', elementId: `heading-input-${sec.id}` })}
                                onMouseUp={() => setActiveSelection({ sectionId: sec.id, field: 'heading', elementId: `heading-input-${sec.id}` })}
                                onKeyUp={() => setActiveSelection({ sectionId: sec.id, field: 'heading', elementId: `heading-input-${sec.id}` })}
                                onChange={(e) => handleUpdateSection(sec.id, { heading: e.target.value })}
                                placeholder={`Enter ${headingStyles.badgeLabel} text...`}
                                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all ${headingStyles.sizeClass} ${headingStyles.fontClass} ${headingStyles.borderClass}`}
                              />
                            </div>

                            {/* Word-Style Rich Text Formatting Toolbar (Applies ONLY to Selected Text) */}
                            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                              {/* Top Bar: Target Status + Clear Formatting */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/80 pb-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-sky-500" />
                                    Active Target:
                                  </span>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 font-semibold">
                                    {activeSelection?.sectionId === sec.id
                                      ? (activeSelection.field === 'heading' ? '📌 Heading Input Selection' : '📝 Body Textarea Selection')
                                      : 'Highlight words to style'}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => clearSelectionFormatting(sec.id)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                  title="Clear color, font and formatting from selected text"
                                >
                                  <Eraser className="w-3 h-3" />
                                  <span>Clear Format</span>
                                </button>
                              </div>

                              {/* Controls: Font, Size, Styles, Colors & Highlights for Selection */}
                              <div className="flex flex-wrap items-center gap-2">
                                {/* Font Selector for Selected Text */}
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">Font:</span>
                                  <select
                                    onChange={(e) => {
                                      if (!e.target.value) return;
                                      applyFontToSelection(sec.id, e.target.value);
                                      e.target.value = '';
                                    }}
                                    defaultValue=""
                                    className="px-2 py-1 rounded-md text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer shadow-2xs"
                                    title="Change font family for selected text only"
                                  >
                                    <option value="" disabled>Apply Font to Selection...</option>
                                    <option value="var(--font-syne), 'Syne', sans-serif">Display Header Font (Syne)</option>
                                    <option value="system-ui, -apple-system, sans-serif">Modern Sans (Inter / Clean)</option>
                                    <option value="Georgia, 'Times New Roman', serif">Editorial Serif (Classic)</option>
                                    <option value="ui-monospace, 'Courier New', monospace">Code Monospace (Terminal)</option>
                                    <option value="'Brush Script MT', cursive">Handwriting / Script</option>
                                  </select>
                                </div>

                                {/* Size / Format Selector for Selected Text */}
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">Size:</span>
                                  <select
                                    onChange={(e) => {
                                      if (!e.target.value) return;
                                      applySizeToSelection(sec.id, e.target.value);
                                      e.target.value = '';
                                    }}
                                    defaultValue=""
                                    className="px-2 py-1 rounded-md text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer shadow-2xs"
                                    title="Change font size for selected text only"
                                  >
                                    <option value="" disabled>Apply Size to Selection...</option>
                                    <option value="h1">H1 Size (30px Bold)</option>
                                    <option value="h2">H2 Size (24px Bold)</option>
                                    <option value="h3">H3 Size (20px Bold)</option>
                                    <option value="h4">H4 Size (16px Medium)</option>
                                    <option value="normal">Normal Body (14px)</option>
                                    <option value="small">Small Tag (11px Uppercase)</option>
                                  </select>
                                </div>

                                <span className="text-slate-300 dark:text-slate-700">|</span>

                                {/* Basic Inline Styles */}
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => applySelectionWrap(sec.id, '**', '**')}
                                    className="p-1.5 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
                                    title="Bold selected text"
                                  >
                                    <Bold className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => applySelectionWrap(sec.id, '*', '*')}
                                    className="p-1.5 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
                                    title="Italic selected text"
                                  >
                                    <Italic className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => applySelectionWrap(sec.id, '<u>', '</u>')}
                                    className="p-1.5 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
                                    title="Underline selected text"
                                  >
                                    <Underline className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => applySelectionWrap(sec.id, '`', '`')}
                                    className="p-1.5 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
                                    title="Inline Code on selected text"
                                  >
                                    <CodeIcon className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => insertCodeBlockIntoSection(sec.id)}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
                                    title="Insert code block with filename and copy button"
                                  >
                                    <Terminal className="w-3.5 h-3.5 text-sky-500" />
                                    <span>+ Code Block</span>
                                  </button>
                                </div>

                                <span className="text-slate-300 dark:text-slate-700">|</span>

                                {/* Word Color Palette for Selected Text */}
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-0.5">
                                    <Palette className="w-3 h-3 text-sky-500" />
                                    Color:
                                  </span>
                                  {COLOR_PALETTE.map((col) => (
                                    <button
                                      key={col.hex}
                                      type="button"
                                      onClick={() =>
                                        applySelectionWrap(
                                          sec.id,
                                          `<span style="color: ${col.hex}">`,
                                          '</span>'
                                        )
                                      }
                                      className="w-4 h-4 rounded-full border border-white dark:border-slate-800 shadow-2xs hover:scale-130 transition-transform cursor-pointer"
                                      style={{ backgroundColor: col.hex }}
                                      title={`Color selected text with ${col.name}`}
                                    />
                                  ))}
                                </div>

                                <span className="text-slate-300 dark:text-slate-700">|</span>

                                {/* Word Highlight Palette for Selected Text */}
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-0.5">
                                    <Highlighter className="w-3 h-3 text-amber-500" />
                                    Highlight:
                                  </span>
                                  {HIGHLIGHT_PALETTE.map((hl) => (
                                    <button
                                      key={hl.hex}
                                      type="button"
                                      onClick={() =>
                                        applySelectionWrap(
                                          sec.id,
                                          `<mark style="background-color: ${hl.hex}">`,
                                          '</mark>'
                                        )
                                      }
                                      className="w-4 h-4 rounded-md border border-white dark:border-slate-800 shadow-2xs hover:scale-130 transition-transform cursor-pointer"
                                      style={{ backgroundColor: hl.hex }}
                                      title={`Highlight selected text with ${hl.name}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Section Content Area */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Section Body & Paragraph Content
                              </label>
                              <textarea
                                id={textareaId}
                                rows={5}
                                value={sec.content}
                                onFocus={() => setActiveSelection({ sectionId: sec.id, field: 'content', elementId: textareaId })}
                                onSelect={() => setActiveSelection({ sectionId: sec.id, field: 'content', elementId: textareaId })}
                                onMouseUp={() => setActiveSelection({ sectionId: sec.id, field: 'content', elementId: textareaId })}
                                onKeyUp={() => setActiveSelection({ sectionId: sec.id, field: 'content', elementId: textareaId })}
                                onChange={(e) => handleUpdateSection(sec.id, { content: e.target.value })}
                                placeholder="Enter paragraphs, lists (- item or 1. item), or formatted text..."
                                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                              />
                            </div>

                            {/* Instant Live Section Preview */}
                            <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4 space-y-2.5">
                              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60 dark:border-slate-800">
                                <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                                  <Eye className="w-3.5 h-3.5 text-sky-500" />
                                  <span>Live Section Preview (What Readers See):</span>
                                </span>
                                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300">
                                  {headingStyles.badgeLabel} • {headingStyles.fontLabel}
                                </span>
                              </div>

                              <div className="pt-1">
                                {sec.heading ? (
                                  <div className={`${headingStyles.sizeClass} ${headingStyles.fontClass} ${headingStyles.borderClass} text-slate-900 dark:text-slate-50 flex items-center gap-2 mb-2`}>
                                    <Hash className="w-4 h-4 text-sky-500/50 shrink-0" />
                                    <span>{renderInlineMarkdown(sec.heading)}</span>
                                  </div>
                                ) : (
                                  <div className="text-xs italic text-slate-400 mb-2">
                                    (No heading title set yet)
                                  </div>
                                )}

                                {sec.content ? (
                                  <FormattedArticleContent content={sec.content} />
                                ) : (
                                  <div className="text-xs italic text-slate-400">
                                    (Type in the body above to see preview)
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add Section Button Bottom */}
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="w-full py-3 rounded-2xl border-2 border-dashed border-sky-300 dark:border-sky-500/30 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 text-sky-600 dark:text-sky-400 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Another Section</span>
                    </button>
                  </div>
                )}

                {/* TAB 2: RAW MARKDOWN EDITOR */}
                {editorTab === 'markdown' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 flex-wrap p-2 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            content: (formData.content || '') + '\n\n### New Section Heading\n'
                          })
                        }
                        className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-[11px]"
                      >
                        + Heading 3
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            content: (formData.content || '') + '\n\n1. First step\n2. Second step\n'
                          })
                        }
                        className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-[11px]"
                      >
                        + Numbered List
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            content: (formData.content || '') + '\n\n- Key requirement\n- Architecture component\n'
                          })
                        }
                        className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-[11px]"
                      >
                        + Bullet List
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            content:
                              (formData.content || '') + '\n\n> 💡 Pro Tip: Make sure MariaDB character set is utf8mb4.\n'
                          })
                        }
                        className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-[11px]"
                      >
                        + Pro Tip Callout
                      </button>
                    </div>

                    <textarea
                      rows={16}
                      value={formData.content || ''}
                      onChange={(e) => {
                        const newContent = e.target.value;
                        setFormData({ ...formData, content: newContent });
                        setSections(parseSectionsFromMarkdown(newContent));
                      }}
                      placeholder="Write your tutorial markdown here (### headings, 1. steps, **bold**, and `code` tags)..."
                      className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                )}

                {/* TAB 3: LIVE PREVIEW */}
                {editorTab === 'preview' && (
                  <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <FormattedArticleContent content={formData.content} />
                  </div>
                )}
              </div>
            ) : (
              <div className="pt-2">
                <FormattedArticleContent content={formData.content} />
              </div>
            )}

            {/* Tags and Metadata Footer */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Topics & Framework Domains
              </span>

              {isEdit ? (
                <div>
                  <input
                    type="text"
                    value={rawTags}
                    onChange={(e) => setRawTags(e.target.value)}
                    placeholder="Frappe Framework, Python, Ubuntu 22.04, Bench CLI"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Separate tags with commas</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {formData.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Back Button & Community CTA (View Mode) */}
            {!isEdit && (
              <div className="pt-8 pb-14 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to All Publications</span>
                </Link>

                {formData.forumUrl && (
                  <a
                    href={formData.forumUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Join Discussion on Frappe Forum</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </article>

          {/* Sticky Learning Sidebar (Right Column) */}
          <aside className="lg:col-span-4 space-y-5 sticky top-20">
            {/* Table of Contents Card */}
            {tableOfContents.length > 0 && (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                  <span>Table of Contents</span>
                </div>

                <nav className="space-y-1 text-xs">
                  {tableOfContents.map((item, idx) => (
                    <a
                      key={idx}
                      href={`#${item.id}`}
                      className={`block py-1 leading-snug hover:text-sky-600 dark:hover:text-sky-400 transition-colors ${
                        item.level >= 3
                          ? 'pl-3 text-slate-600 dark:text-slate-400'
                          : 'font-semibold text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Technical Specification Card */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Layers className="w-3.5 h-3.5 text-sky-500" />
                <span>Publication Specification</span>
              </div>

              <div className="space-y-2 divide-y divide-slate-100 dark:divide-slate-800/80">
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Article ID</span>
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{formData.id}</span>
                </div>
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Parent Category</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.parentCategory || formData.category}</span>
                </div>
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Subcategory</span>
                  <span className="font-semibold text-sky-600 dark:text-sky-400">{formData.subCategory || 'General'}</span>
                </div>
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Verified Platform</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Ubuntu 22.04 LTS</span>
                </div>
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Estimated Reading</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.readTime}</span>
                </div>
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Peer Validation</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Production Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Copy Script Widget */}
            {formData.codeSnippet && formData.codeSnippet.code && (
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 shadow-lg border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    Quick Commands
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{formData.codeSnippet.filename}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Run these verified bench initialization commands directly in your Ubuntu terminal:
                </p>
                <button
                  type="button"
                  onClick={() => handleCopyCode(formData.codeSnippet?.code)}
                  className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-sky-600/30"
                >
                  {copiedSnippet ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span className="font-semibold text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Floating Bottom Quick-Save Bar (When Editing) */}
      {isEdit && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900/95 dark:bg-slate-950/95 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-sky-500/40 backdrop-blur-md">
          <span className="text-xs text-slate-300 font-medium hidden sm:inline">
            Unsaved changes in editor
          </span>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={() => handleSaveArticle()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/30 transition-all disabled:opacity-70 cursor-pointer"
          >
            {isSaving ? (
              <>
                <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Article</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
