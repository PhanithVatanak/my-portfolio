export interface CategoryDefinition {
  id: string;
  name: string;
  description: string;
  subcategories: string[];
}

export const PARENT_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'fullstack',
    name: 'Fullstack',
    description: 'End-to-end web applications, integrated frameworks, and ERP architectures',
    subcategories: [
      'Frappe Framework',
      'Next.js Fullstack',
      'Remix / React Router',
      'Nuxt.js',
      'Laravel + Inertia',
      'SvelteKit',
      'T3 Stack',
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend',
    description: 'Modern user interfaces, client-side performance, and design systems',
    subcategories: [
      'React Js',
      'Next Js',
      'Vue Js',
      'TypeScript',
      'Tailwind CSS',
      'WebGPU / WebGL',
      'Angular',
      'Micro-Frontends',
    ],
  },
  {
    id: 'backend',
    name: 'Backend',
    description: 'High-throughput APIs, distributed microservices, and server runtimes',
    subcategories: [
      'Python',
      'Django',
      'FastAPI',
      'Php',
      'Laravel',
      'Node.js / Express',
      'Go / Golang',
      'Rust',
    ],
  },
  {
    id: 'database',
    name: 'Database',
    description: 'Relational databases, high-speed caches, and vector indexers',
    subcategories: [
      'Postgresql',
      'Mysql',
      'Mariadb',
      'Redis',
      'SQLite / Turso',
      'MongoDB',
      'pgvector & Embeddings',
    ],
  },
  {
    id: 'devops-cloud',
    name: 'DevOps & Cloud',
    description: 'Containerization, server configuration, CI/CD, and edge networking',
    subcategories: [
      'Docker & Containers',
      'Ubuntu / Linux',
      'CI/CD Pipelines',
      'Nginx & Proxies',
      'Cloudflare Workers / Edge',
      'AWS / Cloud Architecture',
    ],
  },
  {
    id: 'ai-tools',
    name: 'AI & Tools',
    description: 'Large language models, semantic vector search, and developer automation',
    subcategories: [
      'LangChain / RAG',
      'OpenAI / Gemini APIs',
      'Vector Search',
      'Agentic Systems',
      'Prompt Engineering',
    ],
  },
];

export const ALL_PARENT_NAMES = PARENT_CATEGORIES.map((c) => c.name);

export function getSubcategoriesForParent(parentName?: string): string[] {
  if (!parentName) return [];
  const found = PARENT_CATEGORIES.find(
    (c) => c.name.toLowerCase() === parentName.toLowerCase() || c.id.toLowerCase() === parentName.toLowerCase()
  );
  return found ? found.subcategories : [];
}

export function detectParentCategory(categoryOrTag?: string): string {
  if (!categoryOrTag) return 'Fullstack';
  const norm = categoryOrTag.toLowerCase();

  for (const parent of PARENT_CATEGORIES) {
    if (parent.name.toLowerCase() === norm) return parent.name;
    for (const sub of parent.subcategories) {
      if (sub.toLowerCase() === norm || norm.includes(sub.toLowerCase())) {
        return parent.name;
      }
    }
  }

  if (norm.includes('frappe') || norm.includes('erpnext') || norm.includes('full stack') || norm.includes('fullstack')) {
    return 'Fullstack';
  }
  if (norm.includes('front') || norm.includes('react') || norm.includes('vue') || norm.includes('ui') || norm.includes('css')) {
    return 'Frontend';
  }
  if (norm.includes('back') || norm.includes('python') || norm.includes('django') || norm.includes('php') || norm.includes('node') || norm.includes('go')) {
    return 'Backend';
  }
  if (norm.includes('data') || norm.includes('sql') || norm.includes('redis') || norm.includes('postgres') || norm.includes('mongo')) {
    return 'Database';
  }
  if (norm.includes('devops') || norm.includes('docker') || norm.includes('linux') || norm.includes('ubuntu') || norm.includes('cloud')) {
    return 'DevOps & Cloud';
  }
  if (norm.includes('ai') || norm.includes('llm') || norm.includes('rag') || norm.includes('vector')) {
    return 'AI & Tools';
  }

  return 'Fullstack';
}
