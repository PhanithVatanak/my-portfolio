import { Project, Experience, SkillCategory, WhatIDoItem, InterestItem, EducationItem, SpokenLanguage, Article, ContactMessage, TelemetryMetrics, DeveloperProfile, PortfolioData } from './types';

export const developerProfile = {
  name: 'Sun Phanith Vatanak',
  shortName: 'Phanith',
  initials: 'SPV',
  brandName: 'SPV Portfolio',
  role: 'Web Developer & Senior Systems Architect',
  location: 'Phnom Penh, Cambodia',
  email: 'sun.phanith.vatanak@example.com',
  isAvailableForHire: true,
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2Wvq-xz7PqYbYaX496x-EiUQZVQCIkuMGqAU-DbnDg3lRFTaoT5iFH5SV8040Fxjbr3ZjDWVK3CY1E4kEIA5rFGBbK_USlaG0_rHIbKseJL7jX_yiBB65Q9V5-VTWWF04Rbte1aAfM0Kk7RJR00p2qIBjII_tOEhph9fAvUwRp24jvsYDNE3mhPneuEF3j3qXLXQ_s5U3s_-UpynPCALAuJThtNGUs76oJfc8vRX12KS5Uzh4k7HBAJxEDQwG3oIBfg9PJy99vkk',
  tagline: "Let's build something together.",
  heroHeading: "Hi, I'm Sun Phanith Vatanak",
  heroSubtitle: "Web Developer based in Phnom Penh",
  heroDescription: "I build accessible, pixel-perfect web experiences using Next.js and TypeScript. With a passion for clean code and user-centric design, I turn complex problems into simple, beautiful interfaces.",
  longDescription: "Senior Systems Architect & Full-Stack Engineer engineering resilient distributed infrastructure, real-time telemetry, and technical web interfaces.",
  socials: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    telegram: 'https://t.me/example',
    email: 'mailto:sun.phanith.vatanak@example.com',
  },
  socialLinks: [
    { id: 'soc-1', platform: 'GitHub', url: 'https://github.com', icon: 'github', label: 'GitHub Vault' },
    { id: 'soc-2', platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin', label: 'LinkedIn Profile' },
    { id: 'soc-3', platform: 'Twitter / X', url: 'https://twitter.com', icon: 'twitter', label: 'Twitter / X Feed' },
    { id: 'soc-4', platform: 'Telegram', url: 'https://t.me/example', icon: 'send', label: 'Telegram Direct' },
    { id: 'soc-5', platform: 'Email', url: 'mailto:sun.phanith.vatanak@example.com', icon: 'mail', label: 'Direct Email' },
  ],
  stats: {
    yearsExperience: '6+',
    completedProjects: '45+',
    clientSatisfaction: '99%',
  }
};

export const whatIDoItems: WhatIDoItem[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'Crafting responsive and interactive UIs with modern React ecosystems and performance in mind.',
    icon: 'terminal'
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Implementation',
    description: 'Translating design mockups into pixel-perfect, accessible code that looks great on any device.',
    icon: 'palette'
  },
  {
    id: 'web-perf',
    title: 'Web Optimization',
    description: 'Ensuring fast load times, SEO best practices, and smooth interactions for better user retention.',
    icon: 'rocket'
  }
];

export const experiences: Experience[] = [
  {
    id: 'exp-1',
    role: 'Senior Frontend Developer',
    company: 'Tech Solutions Cambodia',
    period: '2022 - PRESENT',
    status: 'Current Role',
    description: "Leading the frontend team in rebuilding the company's core product using Next.js 14 & 15. Improved site performance by 40% and established a comprehensive design system. Mentored junior developers and implemented rigorous code review processes.",
    technologies: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'Jest', 'Vercel'],
    highlights: [
      'Engineered streaming SSR architecture reducing TTFB from 380ms to 42ms',
      'Unified component library across 4 distributed enterprise web apps',
      'Spearheaded performance optimization boosting Lighthouse scores to 98+'
    ]
  },
  {
    id: 'exp-2',
    role: 'Web Developer',
    company: 'Digital Creative Agency',
    period: '2020 - 2022',
    description: 'Collaborated with designers to deliver high-quality marketing websites for international clients. Utilized React and Tailwind CSS to create responsive layouts. Managed multiple projects simultaneously while maintaining strict deadlines.',
    technologies: ['React', 'Tailwind CSS', 'GraphQL', 'Next.js', 'Figma', 'Framer Motion'],
    highlights: [
      'Shipped 18 client production deployments on tight release timelines',
      'Introduced micro-interaction pipelines yielding a 26% bump in user dwell time'
    ]
  },
  {
    id: 'exp-3',
    role: 'Freelance Developer',
    company: 'Self-Employed',
    period: '2018 - 2020',
    description: 'Started my journey building custom WordPress themes and small business websites. Gained proficiency in HTML, CSS, JavaScript, and PHP. Learned the fundamentals of client communication and project management.',
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'PHP', 'WordPress', 'MySQL'],
    highlights: [
      'Delivered bespoke web portals for over 25 Southeast Asian local businesses',
      'Mastered fundamentals of full-stack data flow, SEO indexing, and cross-browser styling'
    ]
  }
];

export const skillCategories: SkillCategory[] = [
  {
    title: 'Languages & Core',
    icon: 'code',
    skills: ['JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3', 'SQL']
  },
  {
    title: 'Frameworks & Libraries',
    icon: 'layers',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'Redux', 'Node.js']
  },
  {
    title: 'Tools & Platforms',
    icon: 'wrench',
    skills: ['Git & GitHub', 'VS Code', 'Figma', 'Vercel', 'Docker']
  },
  {
    title: 'Soft Skills',
    icon: 'users',
    skills: ['Team Leadership', 'Problem Solving', 'Agile Methodology', 'Technical Writing']
  }
];

export const personalInterests: InterestItem[] = [
  { id: 'coffee', label: 'Coffee', icon: 'coffee' },
  { id: 'music', label: 'Music', icon: 'headphones' },
  { id: 'gaming', label: 'Gaming', icon: 'gamepad' },
  { id: 'travel', label: 'Travel', icon: 'compass' },
  { id: 'photography', label: 'Photography', icon: 'camera' },
];

export const educationList: EducationItem[] = [
  {
    id: 'edu-1',
    degree: 'Bachelor of Computer Science & Software Engineering',
    institution: 'Royal University of Phnom Penh (RUPP)',
    location: 'Phnom Penh, Cambodia',
    period: '2016 - 2020',
    honors: 'Graduated with Honors (GPA 3.85 / 4.0)',
    description: 'Specialized in Software Engineering, Distributed Systems, Data Structures & Algorithms, and Modern Web Architectures. President of the University Web Engineering Circle.',
    coursework: [
      'Data Structures & Algorithms',
      'Distributed Systems Architecture',
      'Database Systems & Query Optimization',
      'Software Testing & CI/CD Pipelines',
      'Human-Computer Interaction (HCI)'
    ]
  },
  {
    id: 'edu-2',
    degree: 'Advanced Web Architecture & Cloud Systems Specialist',
    institution: 'AWS Academy & Modern Web Engineering Guild',
    location: 'Online Accreditation',
    period: '2021',
    honors: 'Certified Cloud Solutions & Performance Specialist',
    description: 'Specialized accreditation covering edge computing, WebGL & compute shaders, React Server Components streaming, and distributed micro-frontends.',
    coursework: [
      'Edge Compute Architecture',
      'Serverless Microservices',
      'Performance Optimization & Web Vitals'
    ]
  }
];

export const spokenLanguages: SpokenLanguage[] = [
  {
    id: 'lang-1',
    language: 'Khmer',
    level: 'Native Speaker',
    proficiency: 100,
    nativeScript: 'ភាសាខ្មែរ (មាតុភាសា)'
  },
  {
    id: 'lang-2',
    language: 'English',
    level: 'Professional Working & Fluent',
    proficiency: 95,
    nativeScript: 'Full Professional Working Proficiency (C1 / IELTS 7.5)'
  },
  {
    id: 'lang-3',
    language: 'French',
    level: 'Elementary / Conversational',
    proficiency: 45,
    nativeScript: 'Niveau Élémentaire (A2)'
  }
];

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'E-commerce Dashboard',
    slug: 'e-commerce-dashboard',
    description: 'A comprehensive admin dashboard for managing inventory, orders, and customer analytics. Features real-time data updates and report generation.',
    longDescription: 'An enterprise-grade administrative suite built with Next.js App Router and TypeScript. Orchestrates inventory sync across multi-location hubs, automated invoice dispatching, customer churn predictive signals, and instant revenue analytics via WebSockets.',
    category: 'Web Apps',
    tags: ['Next.js', 'TypeScript', 'Tailwind'],
    liveUrl: 'https://ecommerce-preview.example.com',
    githubUrl: 'https://github.com/example/ecommerce-dashboard',
    iconName: 'shopping-cart',
    stars: 524,
    featured: true,
    status: 'Live',
    metrics: '99.98% Uptime • 120ms P95 API Latency',
    architectureHighlights: [
      'Server Components for streaming dashboard widgets without client bundle bloat',
      'Optimistic mutations with React hooks for instant table edits',
      'Dynamic export pipelines streaming CSV/PDF generation in background workers'
    ],
    previewGradient: 'from-sky-50 via-sky-100/60 to-blue-50'
  },
  {
    id: 'proj-2',
    title: 'TaskFlow App',
    slug: 'taskflow-app',
    description: 'A collaborative task management tool designed for remote teams. Includes drag-and-drop boards, user authentication, and activity logs.',
    longDescription: 'Engineered for distributed high-velocity engineering squads. Features multi-column kanban boards, real-time presence indicators, customizable sprint retrospectives, and fine-grained role-based permission controls.',
    category: 'Web Apps',
    tags: ['React', 'Redux', 'Firebase'],
    liveUrl: 'https://taskflow-preview.example.com',
    githubUrl: 'https://github.com/example/taskflow-app',
    iconName: 'task-alt',
    stars: 840,
    featured: true,
    status: 'Live',
    metrics: '40k+ Active Tasks Tracked • 4.9/5 Rating',
    architectureHighlights: [
      'Smooth 60FPS drag-and-drop physics engine with fluid touch controls',
      'Sub-50ms conflict-free replicated data types (CRDT) for multiplayer board sync',
      'Offline-first synchronization with persistent IndexedDB caching'
    ],
    previewGradient: 'from-sky-50 via-sky-100/60 to-blue-50'
  },
  {
    id: 'proj-3',
    title: 'Crypto Tracker',
    slug: 'crypto-tracker',
    description: 'Real-time cryptocurrency price tracker with interactive charts and portfolio value calculation. Connects to public APIs for live market data.',
    longDescription: 'Financial telemetry dashboard delivering ultra-low-latency price streaming across 500+ decentralized exchange pairs. Features customizable technical indicator overlays (MACD, RSI, Bollinger Bands) and instant wallet balance aggregation.',
    category: 'Web Apps',
    tags: ['Vue.js', 'D3.js', 'Node.js'],
    liveUrl: 'https://cryptotracker-preview.example.com',
    githubUrl: 'https://github.com/example/crypto-tracker',
    iconName: 'monitoring',
    stars: 672,
    featured: true,
    status: 'Live',
    metrics: '500+ Live Pairs • Sub-second Price Feeds',
    architectureHighlights: [
      'High-throughput WebSocket multiplexer maintaining persistent broker streams',
      'GPU-accelerated D3 time-series rendering handling 100,000 continuous tick points',
      'Local-first encrypted portfolio storage with zero tracking'
    ],
    previewGradient: 'from-sky-50 via-sky-100/60 to-blue-50'
  },
  {
    id: 'proj-4',
    title: 'Portfolio V1',
    slug: 'portfolio-v1',
    description: 'My personal portfolio website designed to showcase my skills and projects. Built with performance and accessibility best practices.',
    longDescription: 'The initial foundational release of the personal engineering vault, demonstrating zero-dependency vanilla architecture, flawless 100 Lighthouse audits, fluid CSS typography, and high-contrast accessible design systems.',
    category: 'Full Stack',
    tags: ['HTML/CSS', 'JavaScript', 'Webpack'],
    liveUrl: 'https://v1-portfolio.example.com',
    githubUrl: 'https://github.com/example/portfolio-v1',
    iconName: 'public',
    stars: 310,
    featured: true,
    status: 'Archived',
    metrics: '100/100 Lighthouse Performance & A11y',
    architectureHighlights: [
      'Handcrafted semantic markup with zero third-party framework overhead',
      'Micro-animations calibrated for 120Hz ProMotion displays',
      'Accessible focus trap navigation and ARIA landmarks throughout'
    ],
    previewGradient: 'from-sky-50 via-sky-100/60 to-blue-50'
  },
  {
    id: 'proj-5',
    title: 'Aether Engine',
    slug: 'aether-engine',
    description: 'Autonomous real-time UI stream compiler built with WebGPU & Rust. Compiles layout trees into direct GPU drawing primitives.',
    longDescription: 'Experimental low-level graphics system parsing React-like tree structures directly into WebGPU compute pipelines. Achieves 10x throughput for data-dense telemetry dashboards compared to standard DOM reflows.',
    category: 'Open Source',
    tags: ['Rust', 'WebGPU', 'TypeScript', 'WASM'],
    liveUrl: 'https://aether-preview.example.com',
    githubUrl: 'https://github.com/example/aether-engine',
    iconName: 'terminal',
    stars: 1489,
    featured: false,
    status: 'In Development',
    metrics: '1,489 GitHub Stars • Production v2.4',
    architectureHighlights: [
      'Zero-allocation memory model compiled into WebAssembly bytecode',
      'Direct-to-screen quad buffer rendering eliminating layout recalculation cascades',
      'Dual-target cross-compilation for native desktop and modern browsers'
    ],
    previewGradient: 'from-slate-900 via-sky-950 to-slate-900'
  },
  {
    id: 'proj-6',
    title: 'RAG Edge Vector Indexer',
    slug: 'rag-edge-vector-indexer',
    description: 'Distributed dense-sparse embeddings pipeline with sub-100ms retrieval latencies on Cloudflare Workers and PostgreSQL.',
    longDescription: 'High-speed semantic search orchestration layer that chunks, embeds, and reranks technical documentation on edge runtimes. Features token-budget-aware context compaction and hybrid lexical scoring.',
    category: 'AI & Tools',
    tags: ['Next.js', 'pgvector', 'LangChain', 'OpenAI'],
    liveUrl: 'https://rag-edge.example.com',
    githubUrl: 'https://github.com/example/rag-edge',
    iconName: 'cpu',
    stars: 780,
    featured: false,
    status: 'Live',
    metrics: 'Sub-100ms Vector Recall • 98% Accuracy',
    architectureHighlights: [
      'Hybrid BM25 + cosine similarity vector recall blend',
      'Contextual token compression reducing model context costs by 64%',
      'Serverless edge streaming with automatic fallback caching'
    ],
    previewGradient: 'from-sky-900 via-indigo-950 to-slate-950'
  },
  {
    id: 'proj-7',
    title: 'Neural Canvas WebGPU',
    slug: 'neural-canvas-webgpu',
    description: 'Hardware-accelerated generative particle canvas rendering 250,000 real-time compute shader particles directly via WebGPU.',
    longDescription: 'Interactive spatial simulation running custom WGSL compute pipelines on the GPU. Features zero-copy CPU-to-GPU memory transfer, reactive audio frequency buffers, and spatial particle physics at 120 FPS.',
    category: 'Open Source',
    tags: ['WebGPU', 'TypeScript', 'WGSL', 'React'],
    liveUrl: 'https://neural-canvas.example.com',
    githubUrl: 'https://github.com/example/neural-canvas-webgpu',
    iconName: 'cpu',
    stars: 940,
    featured: true,
    status: 'Live',
    metrics: '250,000 Particles • 120 FPS Fluid Rate',
    architectureHighlights: [
      'Raw WGSL compute shaders executing parallel particle physics on GPU cores',
      'Dual ping-pong storage buffers for collision avoidance',
      'Fallback detection with graceful WebGL2 rasterization adapter'
    ],
    previewGradient: 'from-sky-900 via-indigo-950 to-slate-900'
  },
  {
    id: 'proj-8',
    title: 'Distributed Edge Gateway',
    slug: 'distributed-edge-gateway',
    description: 'Ultra-low latency reverse proxy and rate limiting gateway written in Rust with Next.js edge runtime adapters.',
    longDescription: 'High-concurrency micro-gateway routing API requests across 35 edge regions with sub-5ms routing overhead. Provides dynamic token bucket rate limiting and automatic SSL certificate orchestration.',
    category: 'AI & Tools',
    tags: ['Rust', 'Next.js', 'TypeScript', 'Distributed Systems'],
    liveUrl: 'https://edge-gateway.example.com',
    githubUrl: 'https://github.com/example/distributed-edge-gateway',
    iconName: 'terminal',
    stars: 1120,
    featured: false,
    status: 'Live',
    metrics: 'Sub-5ms Edge Routing • 1.2M req/sec',
    architectureHighlights: [
      'Async Tokio network reactor handling 100,000 persistent edge sockets',
      'Cryptographic token verification directly at the nearest CDN edge node',
      'Integrated distributed telemetry tracing with OpenTelemetry standard'
    ],
    previewGradient: 'from-slate-900 via-sky-950 to-slate-900'
  }
];

export const initialArticles: Article[] = [
  {
    id: 'art-1',
    title: 'Architecting High-Concurrence Streaming UIs with React 19 & Next.js App Router',
    slug: 'architecting-high-concurrence-streaming-uis',
    category: 'Architecture',
    views: '14,200 views',
    readRate: '92% read rate',
    readTime: '12 min read',
    publishedDate: 'Oct 28, 2024',
    status: 'Published',
    featured: true,
    excerpt: 'An in-depth analysis of streaming hydration, edge rendering benchmarks, distributed cache invalidation, and advanced Suspense boundary patterns under high request concurrency.',
    tags: ['Architecture', 'Next.js', 'React 19', 'Edge Computing'],
    codeSnippet: {
      filename: 'streaming-rsc.tsx',
      language: 'TSX',
      code: `// High-frequency RSC edge dispatcher
export async function StreamFeed({
  channelId,
}: { channelId: string }) {
  const stream = await fetchTelemetryStream(channelId);

  return (
    <Suspense fallback={<TelemetrySkeleton />}>
      <EdgeBoundary bufferSize={1024}>
        {stream.pipeThrough(createRenderStream())}
      </EdgeBoundary>
    </Suspense>
  );
}`,
      metrics: {
        ttfb: '42ms',
        hydrationCost: 'Zero Client Hydration Cost'
      }
    },
    content: `When scaling web applications to thousands of simultaneous socket connections, standard client-side hydration quickly encounters severe execution bottlenecks. In this technical deep dive, we investigate how React 19's streaming server components combined with edge runtime dispatchers fundamentally change the concurrency equation.

### Key Architectural Pillars:
1. **Incremental HTML Streaming**: Yielding critical above-the-fold bytes within 42ms.
2. **Selective Hydration Boundaries**: Isolating complex interaction islands without blocking primary content.
3. **Edge Pipeline Multiplexing**: Routing live telemetry data streams directly through standard ReadableStream abstractions.

By moving rendering work from mobile client devices to edge compute nodes, we observed a 74% reduction in Total Blocking Time (TBT) and near-instantaneous perceptual load times across all target regions.`
  },
  {
    id: 'art-2',
    title: 'Mastering Turbopack vs Webpack in Large Scale Repos',
    slug: 'mastering-turbopack-vs-webpack',
    category: 'Build Tools',
    views: '8,420 views',
    readRate: '84% read rate',
    readTime: '8 min read',
    publishedDate: 'Sep 28, 2024',
    status: 'Published',
    excerpt: 'Real telemetry data benchmarks across a 150,000-line monorepo. Cold compile drops by 78%, memory retention graphs, and persistent bundle bottlenecks.',
    tags: ['Rust', 'V8 Bundles', 'Build Tools', 'Turbopack'],
    content: `Migrating an enterprise monorepo with over 150,000 lines of TypeScript from traditional Webpack 5 to Rust-powered Turbopack provided concrete metrics on developer iteration loops. Cold compile dropped from 48.6 seconds down to 10.7 seconds, with hot module replacement (HMR) speeds consistently remaining under 80 milliseconds even as module graphs expanded.`
  },
  {
    id: 'art-3',
    title: 'Benchmarking WebGL Shaders & Canvas 2D in React Apps',
    slug: 'benchmarking-webgl-shaders-and-canvas-2d',
    category: 'Performance',
    views: '9,150 views',
    readRate: '87% read rate',
    readTime: '10 min read',
    publishedDate: 'Sep 14, 2024',
    status: 'Published',
    excerpt: 'Offloading heavy DOM layout math to GPU compute fragments. Frame time graphs, OffscreenCanvas thread offloading, and memory lifecycle analysis.',
    tags: ['GLSL', 'WebGL2', 'Performance', 'Graphics'],
    content: `When rendering dense financial graphs and real-time scatter plots containing over 50,000 data elements, standard SVG and DOM reconciliation collapses below 15 FPS. By offloading coordinate math to customized GLSL vertex shaders inside an OffscreenCanvas worker thread, we achieved rock-solid 60 FPS performance without stealing any main thread execution cycles.`
  },
  {
    id: 'art-4',
    title: 'Building Production RAG Pipelines with Vector Embeddings',
    slug: 'building-production-rag-pipelines',
    category: 'AI & LLMs',
    views: '11,400 views',
    readRate: '89% read rate',
    readTime: '15 min read',
    publishedDate: 'Aug 30, 2024',
    status: 'Published',
    excerpt: 'Techniques for hybrid dense-sparse vector recall, contextual chunk reranking, and sub-200ms semantic search with pgvector and OpenAI embedding models.',
    tags: ['pgvector', 'LangChain', 'AI & LLMs', 'RAG'],
    content: `A deep dive into building enterprise-grade Retrieval-Augmented Generation systems. We explore reciprocal rank fusion (RRF) between lexical BM25 algorithms and cosine similarity on 1536-dimensional vectors, demonstrating how contextual chunk reranking reduces hallucination frequency by 42%.`
  },
  {
    id: 'art-5',
    title: 'Zero-Runtime CSS in 2025: Tailwind v4 vs StyleX',
    slug: 'zero-runtime-css-tailwind-v4',
    category: 'Frontend',
    views: '6,100 views',
    readRate: '79% read rate',
    readTime: '6 min read',
    publishedDate: 'Aug 12, 2024',
    status: 'Published',
    excerpt: 'Examining the death of CSS-in-JS runtime costs. LightningCSS compilation speeds, type safety comparisons, and atomic deduplication mechanics.',
    tags: ['Tailwind v4', 'LightningCSS', 'StyleX', 'CSS Engine'],
    content: `CSS-in-JS runtimes like styled-components and emotion carried heavy computational costs: runtime style tag injections, stylesheet deduplication on every render, and massive JavaScript bundle overhead. We compare Tailwind CSS v4's Rust-powered engine with Meta's compile-time StyleX.`
  },
  {
    id: 'art-6',
    title: 'Micro-Frontends vs Monoliths: A Practical Retrospective',
    slug: 'micro-frontends-vs-monoliths',
    category: 'Architecture',
    views: '7,890 views',
    readRate: '81% read rate',
    readTime: '11 min read',
    publishedDate: 'Jul 22, 2024',
    status: 'Published',
    excerpt: 'A three-year engineering post-mortem migrating 8 engineering teams away from Module Federation back into a unified Next.js monorepo workspace.',
    tags: ['Turborepo', 'Microfrontends', 'Architecture', 'Scale'],
    content: `While Module Federation and independent micro-frontend deployments promised autonomy, they introduced severe operational complexity: version drift, duplicated runtime dependencies, fragile shared contracts, and fractured user experiences. Here is our detailed retrospective on consolidating 8 discrete frontends into an integrated Turborepo monorepo.`
  },
  {
    id: 'art-7',
    title: 'Optimizing LCP & INP Core Web Vitals to Sub-100ms',
    slug: 'optimizing-lcp-and-inp-core-web-vitals',
    category: 'Performance',
    views: '12,300 views',
    readRate: '94% read rate',
    readTime: '7 min read',
    publishedDate: 'Jul 05, 2024',
    status: 'Published',
    excerpt: 'Techniques to eliminate main thread blockage during user input events. Microtask yielding with scheduler.yield() and critical resource font preconnects.',
    tags: ['INP < 50ms', 'Scheduler API', 'Performance', 'Web Vitals'],
    content: `With Google's Interaction to Next Paint (INP) metric officially superseding First Input Delay (FID), eliminating main-thread execution stalls is paramount. We demonstrate practical patterns using modern scheduler.yield() primitives, passive listener decorators, and layout read/write phase decoupling.`
  }
];

export const telemetryMetrics: TelemetryMetrics = {
  totalReads: '48.2k',
  totalReadsGrowth: '+18.4%',
  activeArticles: 24,
  pendingDrafts: 3,
  productionCount: 21,
  stagedCount: 3,
  clientInquiries: 142,
  clientInquiriesGrowth: '+32% conv',
  awaitingScoping: 8,
  avgReadDuration: '6m 45s',
  readDurationDiff: '+12s index',
  depthEngagement: 88,
};

// Global in-memory storage for contact submissions and dynamic state across the applet runtime
class PortfolioDatabase {
  private messages: ContactMessage[] = [
    {
      id: 'msg-1',
      name: 'Elena Rostova',
      email: 'elena.rostova@techventure.io',
      message: 'Hi Phanith, we came across your work on streaming RSC architectures and would love to discuss a Senior Frontend Architect contract for our high-frequency trading analytics portal.',
      createdAt: '2024-11-12T14:32:00Z',
      status: 'unread'
    },
    {
      id: 'msg-2',
      name: 'Marcus Vance',
      email: 'm.vance@innovatedesign.co',
      message: 'Impressive portfolio! We are rebuilding our core SaaS app with Next.js 15 and need a specialist who understands WebGPU and responsive design systems. Are you available for consultation next month?',
      createdAt: '2024-11-10T09:15:00Z',
      status: 'read'
    },
    {
      id: 'msg-3',
      name: 'David Kim',
      email: 'david@kimventures.com',
      message: 'Wanted to commend your in-depth article on Turbopack vs Webpack. It helped our engineering team make the migration decision smoothly!',
      createdAt: '2024-11-05T18:45:00Z',
      status: 'replied'
    }
  ];

  private profile: DeveloperProfile = { ...developerProfile };
  private whatIDo: WhatIDoItem[] = [...whatIDoItems];
  private experiences: Experience[] = [...experiences];
  private education: EducationItem[] = [...educationList];
  private languages: SpokenLanguage[] = [...spokenLanguages];
  private skills: SkillCategory[] = [...skillCategories];
  private interests: InterestItem[] = [...personalInterests];
  private articles: Article[] = [...initialArticles];
  private projects: Project[] = [...initialProjects];
  private telemetry: TelemetryMetrics = { ...telemetryMetrics };
  private subscribers: string[] = ['subscriber1@example.com', 'team@techdigest.io'];

  // Rate limiting map: ip -> array of request timestamps
  private rateLimits = new Map<string, number[]>();

  public getData(): PortfolioData {
    return {
      profile: this.profile,
      whatIDo: this.whatIDo,
      projects: this.projects,
      experiences: this.experiences,
      education: this.education,
      languages: this.languages,
      skills: this.skills,
      interests: this.interests,
      articles: this.articles,
      telemetry: this.telemetry,
    };
  }

  public updateData(partial: Partial<PortfolioData>): PortfolioData {
    if (partial.profile) this.profile = { ...this.profile, ...partial.profile };
    if (partial.whatIDo) this.whatIDo = [...partial.whatIDo];
    if (partial.projects) this.projects = [...partial.projects];
    if (partial.experiences) this.experiences = [...partial.experiences];
    if (partial.education) this.education = [...partial.education];
    if (partial.languages) this.languages = [...partial.languages];
    if (partial.skills) this.skills = [...partial.skills];
    if (partial.interests) this.interests = [...partial.interests];
    if (partial.articles) this.articles = [...partial.articles];
    if (partial.telemetry) this.telemetry = { ...this.telemetry, ...partial.telemetry };
    return this.getData();
  }

  public resetData(): PortfolioData {
    this.profile = { ...developerProfile };
    this.whatIDo = [...whatIDoItems];
    this.projects = [...initialProjects];
    this.experiences = [...experiences];
    this.education = [...educationList];
    this.languages = [...spokenLanguages];
    this.skills = [...skillCategories];
    this.interests = [...personalInterests];
    this.articles = [...initialArticles];
    this.telemetry = { ...telemetryMetrics };
    return this.getData();
  }

  public getMessages(): ContactMessage[] {
    return this.messages;
  }

  public addMessage(name: string, email: string, message: string): ContactMessage {
    const newMessage: ContactMessage = {
      id: 'msg-' + Date.now(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
      status: 'unread'
    };
    this.messages.unshift(newMessage);
    return newMessage;
  }

  public updateMessageStatus(id: string, status: 'unread' | 'read' | 'replied'): boolean {
    const msg = this.messages.find(m => m.id === id);
    if (msg) {
      msg.status = status;
      return true;
    }
    return false;
  }

  public deleteMessage(id: string): boolean {
    const idx = this.messages.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.messages.splice(idx, 1);
      return true;
    }
    return false;
  }

  public getArticles(): Article[] {
    return this.articles;
  }

  public addArticle(article: Omit<Article, 'id'>): Article {
    const newArt: Article = {
      ...article,
      id: 'art-' + Date.now(),
    };
    this.articles.unshift(newArt);
    return newArt;
  }

  public deleteArticle(id: string): boolean {
    const idx = this.articles.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.articles.splice(idx, 1);
      return true;
    }
    return false;
  }

  public getProjects(): Project[] {
    return this.projects;
  }

  public addProject(project: Omit<Project, 'id'>): Project {
    const newProj: Project = {
      ...project,
      id: 'proj-' + Date.now(),
    };
    this.projects.unshift(newProj);
    return newProj;
  }

  public deleteProject(id: string): boolean {
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.projects.splice(idx, 1);
      return true;
    }
    return false;
  }

  public addSubscriber(email: string): boolean {
    if (!this.subscribers.includes(email.toLowerCase())) {
      this.subscribers.push(email.toLowerCase());
      return true;
    }
    return false;
  }

  public checkRateLimit(identifier: string, limit: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const timestamps = this.rateLimits.get(identifier) || [];
    const recent = timestamps.filter(t => now - t < windowMs);
    if (recent.length >= limit) {
      return false;
    }
    recent.push(now);
    this.rateLimits.set(identifier, recent);
    return true;
  }
}

// Global singleton instance
export const portfolioDb = new PortfolioDatabase();
