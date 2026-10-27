import { Project, Experience, SkillCategory, WhatIDoItem, InterestItem, EducationItem, SpokenLanguage, Article, ContactMessage, TelemetryMetrics, DeveloperProfile, PortfolioData, TechRadarItem } from './types';

export const developerProfile = {
  name: 'Sun Phanith Vatanak',
  shortName: 'Phanith Vatanak',
  initials: 'SPV',
  brandName: 'SPV Portfolio',
  role: 'Web Application Developer',
  location: 'Phnom Penh, Cambodia',
  email: 'phanith.vatanak@gmail.com',
  isAvailableForHire: true,
  avatarUrl: 'https://ik.imagekit.io/zucd2dshr2/my-portfolio/Gemini_Generated_Image_6oyoz56oyoz56oyo.jpg',
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
    "id": "frappe-development",
    "title": "Frappe Development",
    "description": "Developing and maintaining custom Frappe applications, workflows, DocTypes, permissions, and business features for business operations.",
    "icon": "code"
  },
  {
    "id": "backend-api",
    "title": "Backend & API Development",
    "description": "Building backend logic, developing REST APIs, handling data validation and authentication, and connecting applications with databases and external services using Python.",
    "icon": "server"
  },
  {
    "id": "database-development",
    "title": "Database Development",
    "description": "Designing database queries, managing relational databases, optimizing SQL operations, and handling data migration using MariaDB, MySQL, and PostgreSQL.",
    "icon": "database"
  },
  {
    "id": "recruitment-systems",
    "title": "Recruitment System Development",
    "description": "Developing recruitment features for candidate management, job orders, application workflows, candidate screening, interview scheduling, and recruitment data processing.",
    "icon": "users"
  },
  {
    "id": "payroll-systems",
    "title": "HRMS & Payroll Systems",
    "description": "Supporting and maintaining HR and payroll systems, troubleshooting issues, managing employee data, and improving business workflows related to payroll operations.",
    "icon": "wallet"
  },
  {
    "id": "ecommerce-development",
    "title": "E-commerce Development",
    "description": "Building online shopping experiences with product catalogs, inventory management, shopping carts, order processing, payment workflows, and customer account features.",
    "icon": "shopping-cart"
  },
  {
    "id": "system-integration",
    "title": "System Integration & Automation",
    "description": "Integrating APIs, implementing web push notifications, automating business processes, and connecting systems to improve operational efficiency.",
    "icon": "workflow"
  },
  {
    "id": "ai-development",
    "title": "AI & Vector Database Integration",
    "description": "Exploring AI-powered CV extraction, candidate profile processing, semantic search, and vector database integration using Qdrant.",
    "icon": "brain-circuit"
  },
  {
    "id": "sql-reporting",
    "title": "SQL Reporting & Data Management",
    "description": "Writing complex SQL queries, building business reports, investigating data issues, and preparing structured data to support business operations.",
    "icon": "chart-no-axes-combined"
  }
];

export const experiences: Experience[] = [
  {
    "id": "exp-1",
    "role": "Web Developer",
    "company": "HRINC (Cambodia) Co., Ltd",
    "period": "Jan 2025 - Present",
    "status": "Current Role",
    "description": "Developing and maintaining business applications using the Frappe Framework, with a focus on the Recruitment Management System (RMS), HRMS, and payroll-related systems. Working on custom application features, backend logic, database operations, system integrations, user permissions, and AI-assisted recruitment functionality.",
    "technologies": [
      "Frappe Framework",
      "Python",
      "JavaScript",
      "SQL",
      "MariaDB",
      "ERPNext",
      "HRMS",
      "Firebase Cloud Messaging",
      "Qdrant"
    ],
    "highlights": [
      "Develop and maintain custom recruitment features for candidate management, job orders, application processing, screening, and interview scheduling",
      "Implement role-based permissions and access control to manage user access to recruitment data and system features",
      "Develop AI-assisted CV extraction and candidate profile processing workflows",
      "Work on candidate data synchronization and vector database integration with Qdrant",
      "Develop and troubleshoot web push notifications and real-time notification features using Firebase Cloud Messaging",
      "Support HRMS and payroll systems, troubleshoot application issues, and maintain business workflows",
      "Write and optimize SQL queries for data retrieval, reporting, and database troubleshooting"
    ]
  },
  {
    "id": "exp-2",
    "role": "Junior Web Developer",
    "company": "HRINC (Cambodia) Co., Ltd",
    "period": "Mar 2023 - Jan 2025",
    "description": "Contributed to the development and maintenance of web applications, supporting recruitment system features, database operations, and business requirements. Worked on application interfaces, existing functionality, SQL queries, troubleshooting, and technical improvements while building practical experience in web development.",
    "technologies": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "SQL",
      "Python",
      "Web Development",
      "Database Management"
    ],
    "highlights": [
      "Develop and maintain web application features based on business requirements",
      "Support recruitment system functionality and improvements to candidate-related workflows",
      "Build and update application interfaces using HTML, CSS, and JavaScript",
      "Write SQL queries to retrieve, validate, and manage application data",
      "Investigate application errors and resolve technical issues",
      "Assist with database maintenance, data migration, testing, and system support"
    ]
  },
  {
    "id": "exp-3",
    "role": "Web Developer Intern",
    "company": "HRINC (Cambodia) Co., Ltd",
    "period": "Dec 2022 - Mar 2023",
    "description": "Gained practical experience in web development by assisting with application maintenance, basic feature implementation, testing, and troubleshooting. Learned the company's development practices and worked with web technologies to build a foundation for further development responsibilities.",
    "technologies": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "SQL",
      "Web Development",
      "Application Testing"
    ],
    "highlights": [
      "Assist with website and web application maintenance",
      "Implement basic interface updates and frontend improvements",
      "Help test application functionality and identify software issues",
      "Support troubleshooting and bug fixing for existing features",
      "Build foundational skills in web development, programming, and database operations"
    ]
  },
  {
    "id": "exp-4",
    "role": "Database Developer",
    "company": "Norton University",
    "period": "Dec 2021 - Dec 2022",
    "description": "Worked on database-related development and application functionality using Microsoft SQL Server and Visual Basic .NET. Focused on SQL queries, data management, database operations, and troubleshooting to support data-driven applications and daily operational requirements.",
    "technologies": [
      "Microsoft SQL Server",
      "T-SQL",
      "Visual Basic .NET",
      "Database Development",
      "SQL Queries",
      "Data Management"
    ],
    "highlights": [
      "Write and maintain SQL queries for data retrieval and database operations",
      "Work with Microsoft SQL Server to manage and maintain application data",
      "Develop and maintain database-related application functionality using Visual Basic .NET",
      "Troubleshoot data inconsistencies and database-related issues",
      "Support data processing and improve the reliability of database operations"
    ]
  },
  {
    "id": "exp-5",
    "role": "IT Technician",
    "company": "Norton University",
    "period": "Jul 2021 - Dec 2021",
    "description": "Provided technical support for computers, software, and IT equipment. Assisted users with technical issues, performed hardware and software troubleshooting, and supported routine IT operations to help maintain a reliable working environment.",
    "technologies": [
      "IT Support",
      "Technical Troubleshooting",
      "Windows",
      "Computer Hardware",
      "Software Installation",
      "System Maintenance"
    ],
    "highlights": [
      "Troubleshoot computer hardware, software, and operating system issues",
      "Assist users with technical problems and IT support requests",
      "Support software installation, configuration, and basic system maintenance",
      "Help maintain computer equipment and workplace IT systems",
      "Identify and resolve routine technical issues affecting daily operations"
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

export const initialTechRadar: TechRadarItem[] = [
  // Backend & Enterprise Logic
  {
    id: 'tr-python',
    name: 'Python',
    category: 'Backend & Enterprise Logic',
    proficiency: 'Core Daily Stack',
    experienceYears: '4+ yrs',
    tags: ['Backend APIs', 'Automation', 'Data Pipelines', 'Scripting'],
    showOnHome: true
  },
  {
    id: 'tr-frappe',
    name: 'Frappe Framework',
    category: 'Backend & Enterprise Logic',
    proficiency: 'Production Battle-Tested',
    experienceYears: '3+ yrs',
    tags: ['DocTypes', 'Workflows', 'ERPNext', 'HRMS Architecture', 'Permissions'],
    showOnHome: true
  },
  {
    id: 'tr-rest-api',
    name: 'RESTful API & Webhooks',
    category: 'Backend & Enterprise Logic',
    proficiency: 'Production Battle-Tested',
    experienceYears: '4+ yrs',
    tags: ['API Contracts', 'JSON Payloads', 'Authentication', 'Webhooks'],
    showOnHome: false
  },

  // Databases & Data Engineering
  {
    id: 'tr-mariadb',
    name: 'MariaDB / MySQL',
    category: 'Databases & Data Engineering',
    proficiency: 'Production Battle-Tested',
    experienceYears: '4+ yrs',
    tags: ['Query Optimization', 'Indexing', 'Schema Design', 'Data Migrations'],
    showOnHome: true
  },
  {
    id: 'tr-mssql',
    name: 'Microsoft SQL Server',
    category: 'Databases & Data Engineering',
    proficiency: 'Production Battle-Tested',
    experienceYears: '3+ yrs',
    tags: ['T-SQL', 'Database Queries', 'Data Integrity', 'Systems Support'],
    showOnHome: false
  },
  {
    id: 'tr-qdrant',
    name: 'Qdrant Vector Database',
    category: 'Databases & Data Engineering',
    proficiency: 'Advanced Specialization',
    experienceYears: '2+ yrs',
    tags: ['Vector Embeddings', 'Semantic Search', 'AI CV Extraction', 'Similarity Search'],
    showOnHome: true
  },

  // Frontend & Modern Web
  {
    id: 'tr-javascript',
    name: 'JavaScript (ES6+)',
    category: 'Frontend & Modern Web',
    proficiency: 'Production Battle-Tested',
    experienceYears: '5+ yrs',
    tags: ['Async/Await', 'DOM Manipulation', 'Event Loop', 'Component State'],
    showOnHome: false
  },
  {
    id: 'tr-typescript',
    name: 'TypeScript',
    category: 'Frontend & Modern Web',
    proficiency: 'Core Daily Stack',
    experienceYears: '3+ yrs',
    tags: ['Strict Mode', 'Interfaces', 'Generics', 'Type Safety'],
    showOnHome: true
  },
  {
    id: 'tr-nextjs',
    name: 'Next.js & React',
    category: 'Frontend & Modern Web',
    proficiency: 'Core Daily Stack',
    experienceYears: '3+ yrs',
    tags: ['App Router', 'Server Components', 'Responsive UI', 'Hooks'],
    showOnHome: true
  },
  {
    id: 'tr-html-css',
    name: 'HTML5, CSS3 & Tailwind',
    category: 'Frontend & Modern Web',
    proficiency: 'Production Battle-Tested',
    experienceYears: '5+ yrs',
    tags: ['Responsive Layouts', 'Flexbox & Grid', 'Tailwind CSS', 'Semantic HTML'],
    showOnHome: true
  },

  // Cloud, Notifications & Tooling
  {
    id: 'tr-fcm',
    name: 'Firebase Cloud Messaging (FCM)',
    category: 'Cloud, Notifications & Tooling',
    proficiency: 'Production Battle-Tested',
    experienceYears: '2+ yrs',
    tags: ['Web Push Notifications', 'Real-time Messaging', 'Service Workers'],
    showOnHome: false
  },
  {
    id: 'tr-git',
    name: 'Git & GitHub Workflows',
    category: 'Cloud, Notifications & Tooling',
    proficiency: 'Core Daily Stack',
    experienceYears: '4+ yrs',
    tags: ['Version Control', 'Pull Requests', 'Branching', 'Code Review'],
    showOnHome: false
  },
  {
    id: 'tr-linux-docker',
    name: 'Linux & Docker Basics',
    category: 'Cloud, Notifications & Tooling',
    proficiency: 'Production Battle-Tested',
    experienceYears: '3+ yrs',
    tags: ['Linux Server Ops', 'Bash / Terminal', 'Containerization', 'Dev Environments'],
    showOnHome: true
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
    "id": "edu-1",
    "degree": "Bachelor Degree of Computer Science",
    "institution": "Norton University",
    "location": "Phnom Penh, Cambodia",
    "period": "2020 - 2024",
    "honors": "Graduated with Honors (GPA 3.85 / 4.0)",
    "description": "Specialized in Computer Science, software development, database systems, and web technologies.",
    "coursework": [
      "Data Structures & Algorithms",
      "Distributed Systems Architecture",
      "Database Systems & Query Optimization",
      "Software Testing & CI/CD Pipelines",
      "Human-Computer Interaction (HCI)"
    ]
  },
  {
    "id": "edu-2",
    "degree": "Grade 12",
    "institution": "Chompuvon High School",
    "location": "Phnom Penh, Cambodia",
    "period": "2020",
    "honors": "",
    "description": "",
    "coursework": []
  },
  {
    "id": "edu-3",
    "degree": "Web Development Course",
    "institution": "Udemy",
    "location": "Online",
    "period": "Jul 2020",
    "honors": "",
    "description": "Completed online learning in web development to build foundational knowledge of website development and web technologies.",
    "coursework": [
      "Web Development"
    ]
  },
  {
    "id": "edu-4",
    "degree": "English Short Course",
    "institution": "ACE (Australian Centre for Education)",
    "location": "Cambodia",
    "period": "Jul 2020",
    "honors": "",
    "description": "Completed an English language short course to develop English communication skills.",
    "coursework": [
      "English Language",
      "Communication Skills"
    ]
  },
  {
    "id": "edu-5",
    "degree": "English Language Studies",
    "institution": "DPSS (Developing Potential for Success School)",
    "location": "Cambodia",
    "period": "Jan 2017",
    "honors": "",
    "description": "Studied English to develop language proficiency and communication skills.",
    "coursework": [
      "English Language"
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
    id: 'pro-001',
    title: 'SPV ERPNext Multi-Tenant Orchestrator',
    slug: 'pro-001',
    description: 'High-availability multi-tenant Frappe Bench orchestration cluster managing automated tenant provisioning, custom MariaDB schema isolation, and background Celery queue workers.',
    longDescription: 'An enterprise-grade multi-tenant orchestration control plane engineered on top of Frappe Framework and ERPNext. Features zero-downtime bench migrations, automated SSL certificate lifecycle dispatching with Let\'s Encrypt, dynamic tenant database routing across MariaDB Galera clusters, and real-time site health telemetry.',
    parentCategory: 'Fullstack',
    subCategory: 'Frappe Framework',
    category: 'Full Stack',
    tags: ['Frappe Framework', 'Python', 'MariaDB', 'Ubuntu 22.04', 'Redis', 'Bench CLI'],
    liveUrl: 'https://erp.example.com',
    githubUrl: 'https://github.com/example/erpnext-orchestrator',
    iconName: 'terminal',
    stars: 1240,
    featured: true,
    status: 'Live',
    metrics: '99.99% Uptime • 150+ Tenant Sites Isolated',
    architectureHighlights: [
      'DocType-driven multi-tenant database router isolating MariaDB Galera instances',
      'Automated Frappe Bench site provisioning and schema migration worker pipeline',
      'Unified Redis cluster handling cache invalidation and high-throughput background queue jobs'
    ],
    previewGradient: 'from-sky-950 via-slate-900 to-slate-950',
    codeSnippet: {
      filename: 'tenant_provisioner.py',
      language: 'Python',
      code: `import frappe
from frappe.utils import now_datetime

def provision_tenant_site(site_domain, db_name, admin_password):
    """Programmatically orchestrate isolated Frappe site with custom DocTypes"""
    bench = frappe.init(site=site_domain)
    frappe.connect()
    
    # Initialize workspace configuration
    site_config = frappe.get_doc({
        "doctype": "Tenant Workspace",
        "domain": site_domain,
        "database_name": db_name,
        "status": "Active",
        "provisioned_on": now_datetime()
    })
    site_config.insert(ignore_permissions=True)
    frappe.db.commit()
    return {"status": "success", "site": site_domain}`
    },
    content: `### Executive Overview & Architecture
The SPV ERPNext Multi-Tenant Orchestrator is an internal enterprise automation platform designed to deploy, monitor, and scale Frappe and ERPNext tenant instances across Ubuntu 22.04 LTS servers without manual CLI intervention.

---

### Core Engineering Innovations
1. **Isolated MariaDB Tenancy**: Each customer receives an isolated database with strictly partitioned utf8mb4 schemas, ensuring compliance and zero data leakage.
2. **Bench Microservice Orchestration**: Integrates directly with the \`bench\` CLI via a Python subprocess RPC worker pool, orchestrating commands like \`bench new-site\`, \`bench migrate\`, and \`bench backup\` asynchronously.
3. **Automated Reverse Proxy & SSL**: Interacts with Nginx Lua scripts to dynamically route HTTP Host headers to internal gunicorn/werkzeug sockets without requiring Nginx reloads.`
  },
  {
    id: 'pro-002',
    title: 'TaskFlow Collaborative Engine',
    slug: 'pro-002',
    description: 'A collaborative real-time task management and kanban engine designed for high-velocity engineering squads. Features CRDT board sync and offline persistence.',
    longDescription: 'Engineered for distributed high-velocity engineering squads. Features multi-column kanban boards, real-time presence indicators, customizable sprint retrospectives, and fine-grained role-based permission controls.',
    parentCategory: 'Frontend',
    subCategory: 'React Js',
    category: 'Web Apps',
    tags: ['React Js', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit'],
    liveUrl: 'https://taskflow-preview.example.com',
    githubUrl: 'https://github.com/example/taskflow-app',
    iconName: 'task-alt',
    stars: 840,
    featured: true,
    status: 'Live',
    metrics: '40k+ Active Tasks Tracked • Sub-50ms Sync',
    architectureHighlights: [
      'Smooth 60FPS drag-and-drop physics engine with fluid touch controls',
      'Sub-50ms conflict-free replicated data types (CRDT) for multiplayer board sync',
      'Offline-first synchronization with persistent IndexedDB caching'
    ],
    previewGradient: 'from-sky-50 via-sky-100/60 to-blue-50',
    content: `### Real-Time Collaborative Architecture
TaskFlow delivers a seamless multiplayer kanban experience similar to Figma and Linear. Built with React 19, TypeScript, and stateful WebSockets, team members can rearrange sprints, edit markdown task cards, and assign sprint story points simultaneously with zero merge conflicts.`
  },
  {
    id: 'pro-003',
    title: 'Crypto Telemetry & Market Analytics',
    slug: 'pro-003',
    description: 'Real-time cryptocurrency price tracker with GPU-accelerated charts and portfolio value calculation across 500+ decentralized exchange pairs.',
    longDescription: 'Financial telemetry dashboard delivering ultra-low-latency price streaming across 500+ decentralized exchange pairs. Features customizable technical indicator overlays (MACD, RSI, Bollinger Bands) and instant wallet balance aggregation.',
    parentCategory: 'Frontend',
    subCategory: 'Vue Js',
    category: 'Web Apps',
    tags: ['Vue Js', 'TypeScript', 'D3.js', 'WebSockets'],
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
    previewGradient: 'from-sky-50 via-sky-100/60 to-blue-50',
    content: `### Telemetry Ingestion Pipeline
Processes high-frequency trading ticks from Binance, Coinbase, and Uniswap WebSocket streams, deduplicating data in Web Workers before updating reactive Vue 3 reactive refs.`
  },
  {
    id: 'pro-004',
    title: 'Enterprise Microservices Gateway',
    slug: 'pro-004',
    description: 'High-throughput asynchronous backend service gateway written in Python and FastAPI, handling authentication, token-bucket rate limiting, and database connection pooling.',
    longDescription: 'An enterprise microservices gateway providing sub-15ms proxy routing, cryptographic JWT validation, automated Swagger schema validation, and PostgreSQL connection multiplexing.',
    parentCategory: 'Backend',
    subCategory: 'Python',
    category: 'Full Stack',
    tags: ['Python', 'FastAPI', 'Postgresql', 'Docker & Containers', 'Redis'],
    liveUrl: 'https://api-gateway.example.com',
    githubUrl: 'https://github.com/example/python-microservices-gateway',
    iconName: 'terminal',
    stars: 910,
    featured: true,
    status: 'Live',
    metrics: '15,000 req/sec • Sub-15ms Latency',
    architectureHighlights: [
      'Asynchronous ASGI request dispatching with uvloop event loop optimization',
      'Distributed Redis sliding-window rate limiters with millisecond accuracy',
      'Automated OpenAPI documentation generation with strict Pydantic models'
    ],
    previewGradient: 'from-slate-900 via-sky-950 to-slate-900',
    content: `### High-Throughput Python Architecture
Written in modern Python 3.12 leveraging AsyncIO and \`uvloop\`. Routes and proxies mission-critical transactions across internal service clusters.`
  },
  {
    id: 'pro-005',
    title: 'Distributed Ledger & Vector Database Hub',
    slug: 'pro-005',
    description: 'Relational and semantic vector storage pipeline built on PostgreSQL and pgvector for ultra-fast document search and schema migrations.',
    longDescription: 'High-speed relational storage tier configured with connection pooling (PgBouncer), read replica failover automation, and pgvector embeddings indexing for sub-100ms similarity lookups.',
    parentCategory: 'Database',
    subCategory: 'Postgresql',
    category: 'AI & Tools',
    tags: ['Postgresql', 'pgvector & Embeddings', 'Redis', 'Python'],
    liveUrl: 'https://db-hub.example.com',
    githubUrl: 'https://github.com/example/postgres-vector-hub',
    iconName: 'cpu',
    stars: 1040,
    featured: true,
    status: 'Live',
    metrics: 'Sub-100ms Vector Recall • 99.99% Reliability',
    architectureHighlights: [
      'Hierarchical Navigable Small World (HNSW) indexing on 1536-dimensional vectors',
      'Automated zero-downtime database migrations with forward-only schema rollouts',
      'Hot stand-by streaming replication across three availability zones'
    ],
    previewGradient: 'from-slate-950 via-sky-950 to-slate-900',
    content: `### Database Architecture & Indexing Strategy
Leverages PostgreSQL 16 with \`pgvector\` extensions to index over 1.2 million embeddings vectors with HNSW search trees, supporting real-time cosine distance queries.`
  },
  {
    id: 'pro-006',
    title: 'RAG Edge Vector Indexer',
    slug: 'pro-006',
    description: 'Distributed dense-sparse embeddings pipeline with sub-100ms retrieval latencies on Cloudflare Workers and PostgreSQL.',
    longDescription: 'High-speed semantic search orchestration layer that chunks, embeds, and reranks technical documentation on edge runtimes. Features token-budget-aware context compaction and hybrid lexical scoring.',
    parentCategory: 'AI & Tools',
    subCategory: 'LangChain / RAG',
    category: 'AI & Tools',
    tags: ['LangChain / RAG', 'OpenAI / Gemini APIs', 'Postgresql', 'Next Js'],
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
    previewGradient: 'from-sky-900 via-indigo-950 to-slate-950',
    content: `### RAG Vector Orchestration
Chunks complex documentation using semantic boundaries and executes parallel dense and sparse queries to produce synthesized answers with exact citations.`
  },
  {
    id: 'pro-007',
    title: 'Neural Canvas WebGPU',
    slug: 'pro-007',
    description: 'Hardware-accelerated generative particle canvas rendering 250,000 real-time compute shader particles directly via WebGPU.',
    longDescription: 'Interactive spatial simulation running custom WGSL compute pipelines on the GPU. Features zero-copy CPU-to-GPU memory transfer, reactive audio frequency buffers, and spatial particle physics at 120 FPS.',
    parentCategory: 'Frontend',
    subCategory: 'WebGPU / WebGL',
    category: 'Open Source',
    tags: ['WebGPU / WebGL', 'TypeScript', 'React Js'],
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
    previewGradient: 'from-sky-900 via-indigo-950 to-slate-900',
    content: `### GPU Compute Shaders in the Browser
Runs WGSL compute passes directly on physical GPU workgroups, moving all particle dynamics calculation away from the JavaScript main thread.`
  },
  {
    id: 'pro-008',
    title: 'DevOps Cloud Container Autopilot',
    slug: 'pro-008',
    description: 'Automated container cluster deployment pipeline for Ubuntu 22.04 LTS servers with Docker, Docker Compose, and automated reverse proxy management.',
    longDescription: 'Production DevOps blueprint tool that automates secure server initialization, firewall policies, Redis cache clusters, and zero-downtime container updates.',
    parentCategory: 'DevOps & Cloud',
    subCategory: 'Docker & Containers',
    category: 'Open Source',
    tags: ['Docker & Containers', 'Ubuntu / Linux', 'CI/CD Pipelines', 'Nginx & Proxies'],
    liveUrl: 'https://devops-autopilot.example.com',
    githubUrl: 'https://github.com/example/devops-cloud-autopilot',
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
    previewGradient: 'from-slate-900 via-sky-950 to-slate-900',
    content: `### Infrastructure as Code Blueprint
A standardized set of battle-tested Docker Compose templates, Bash provisioning scripts, and Nginx reverse proxy templates for production Ubuntu cloud droplets.`
  }
];

export const initialArticles: Article[] = [
  {
    id: 'blog-001',
    title: 'Frappe Framework 2026: Practical Onboarding Guideline & Production Quickstart',
    slug: 'blog-001',
    parentCategory: 'Fullstack',
    subCategory: 'Frappe Framework',
    category: 'Fullstack',
    views: '16,800 views',
    readRate: '96% read rate',
    readTime: '10 min read',
    publishedDate: 'Jan 15, 2026',
    status: 'Published',
    featured: true,
    forumUrl: 'https://discuss.frappe.io',
    forumBadge: 'Official Frappe Community Forum',
    excerpt: 'The missing onboarding guideline for software engineers entering the Frappe & ERPNext ecosystem. Clear mental models on DocTypes, Bench CLI, Hooks, and production setup on Ubuntu 22.04 LTS.',
    tags: ['Frappe Framework', 'Python', 'MariaDB', 'Ubuntu 22.04', 'ERPNext', 'Bench CLI'],
    codeSnippet: {
      filename: 'bench_quickstart.sh',
      language: 'Bash',
      code: `# 1. Update system & install foundational dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install -y git python3-dev python3-setuptools python3-pip python3-venv virtualenv libmariadb-dev-compat libmariadb-dev redis-server curl

# 2. Configure MariaDB for Frappe (UTF8MB4 requirement)
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
# [mysqld]
# character-set-client-handshake = FALSE
# character-set-server = utf8mb4
# collation-server = utf8mb4_unicode_ci

# 3. Install Frappe-Bench and Initialize Site
pip3 install frappe-bench
bench init --frappe-branch version-15 frappe-bench
cd frappe-bench
bench new-site development.local --mariadb-root-password your_root_password
bench start`
    },
    content: `### Why This Guideline Exists

Many engineers who start learning Frappe find the official documentation fragmented and overwhelming. This guide is crafted as an internal onboarding blueprint to help new team members understand what Frappe actually is, how its architecture functions, and how to set up a production-ready environment on Ubuntu 22.04 LTS without guesswork.

---

### 1. What is Frappe Framework?

Frappe is a full-stack, batteries-included web framework written in **Python** (backend) and **JavaScript / Vue / Jinja** (frontend), backed by **MariaDB / PostgreSQL** and **Redis**.

Unlike Django or FastAPI where you manually build admin dashboards, authentication tables, permission matrices, and REST APIs from scratch:

- **DocTypes are Metadata**: In Frappe, creating a "DocType" creates the database table, the JSON schema, the REST API endpoints, and the full interactive UI form automatically.
- **Role-Based Access Control (RBAC)**: Built-in granular user permissions at document and field levels.
- **Background Jobs**: Integrated Celery/Redis queue workers for email, webhooks, and asynchronous processing.

---

### 2. Core Mental Model: The Frappe Triad

To master Frappe, you only need to understand three core concepts:

1. **DocType**: The blueprint (equivalent to Django Model + Serializer + Admin View).
2. **Bench**: The CLI tool that orchestrates multiple apps, sites, Python virtualenvs, and background workers.
3. **Hooks (hooks.py)**: The event-bus mechanism that lets you hook custom Python logic into document lifecycles (e.g., \`before_insert\`, \`validate\`, \`on_submit\`, and custom API endpoints).

---

### 3. Step-by-Step Installation on Ubuntu 22.04 LTS

Follow the validated sequence below to get your bench running without version mismatch errors:

1. **System Packages**: Install Python 3.10+, Git, curl, MariaDB server, and Redis server.
2. **MariaDB Character Set**: Ensure MariaDB uses \`utf8mb4\` character set; otherwise, Frappe schema migrations will throw collation errors.
3. **Node & Yarn**: Install Node.js v18 LTS and Yarn globally (\`npm install -g yarn\`).
4. **Bench Initialization**: Initialize \`frappe-bench\` using \`bench init --frappe-branch version-15 frappe-bench\`.
5. **Site Creation**: Create your first local tenant using \`bench new-site demo.local\`.

\`\`\`bash:bench_quickstart.sh
# 1. Update system & install foundational dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install -y git python3-dev python3-setuptools python3-pip python3-venv virtualenv libmariadb-dev-compat libmariadb-dev redis-server curl

# 2. Configure MariaDB for Frappe (UTF8MB4 requirement)
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
# [mysqld]
# character-set-client-handshake = FALSE
# character-set-server = utf8mb4
# collation-server = utf8mb4_unicode_ci

# 3. Install Frappe-Bench and Initialize Site
pip3 install frappe-bench
bench init --frappe-branch version-15 frappe-bench
cd frappe-bench
bench new-site development.local --mariadb-root-password your_root_password
bench start
\`\`\`

---

### 4. Community Discussion & Support

Have questions or encountered an edge-case on Ubuntu? This guide is actively shared on the official **Frappe Community Forum**. Join the discussion, share your bench configurations, and get community feedback directly on discuss.frappe.io.`
  },
  {
    id: 'blog-002',
    title: 'Architecting High-Concurrence Streaming UIs with React 19 & Next.js App Router',
    slug: 'blog-002',
    parentCategory: 'Frontend',
    subCategory: 'React Js',
    category: 'Frontend',
    views: '14,200 views',
    readRate: '92% read rate',
    readTime: '12 min read',
    publishedDate: 'Oct 28, 2024',
    status: 'Published',
    featured: false,
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
    id: 'blog-003',
    title: 'Mastering Turbopack vs Webpack in Large Scale Repos',
    slug: 'blog-003',
    parentCategory: 'Frontend',
    subCategory: 'Next Js',
    category: 'Frontend',
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
    id: 'blog-004',
    title: 'Benchmarking WebGL Shaders & Canvas 2D in React Apps',
    slug: 'blog-004',
    parentCategory: 'Frontend',
    subCategory: 'WebGPU / WebGL',
    category: 'Frontend',
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
    id: 'blog-005',
    title: 'Building Production RAG Pipelines with Vector Embeddings',
    slug: 'blog-005',
    parentCategory: 'AI & Tools',
    subCategory: 'Vector Search',
    category: 'AI & Tools',
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
    id: 'blog-006',
    title: 'Zero-Runtime CSS in 2025: Tailwind v4 vs StyleX',
    slug: 'blog-006',
    parentCategory: 'Frontend',
    subCategory: 'Tailwind CSS',
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
    id: 'blog-007',
    title: 'Micro-Frontends vs Monoliths: A Practical Retrospective',
    slug: 'blog-007',
    parentCategory: 'Fullstack',
    subCategory: 'Next.js Fullstack',
    category: 'Fullstack',
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
    id: 'blog-008',
    title: 'Optimizing LCP & INP Core Web Vitals to Sub-100ms',
    slug: 'blog-008',
    parentCategory: 'Backend',
    subCategory: 'Python',
    category: 'Backend',
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
  private techRadar: TechRadarItem[] = [...initialTechRadar];
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
      techRadar: this.techRadar,
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
    if (partial.techRadar) this.techRadar = [...partial.techRadar];
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
    this.techRadar = [...initialTechRadar];
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
