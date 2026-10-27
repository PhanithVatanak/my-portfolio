import { createClient, Client } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { PortfolioData, ContactMessage, TechRadarItem, Experience, EducationItem } from '@/lib/types';
import {
  developerProfile,
  whatIDoItems,
  experiences,
  educationList,
  spokenLanguages,
  skillCategories,
  personalInterests,
  initialArticles,
  initialProjects,
  telemetryMetrics,
  initialTechRadar,
} from '@/lib/data';

const LOCAL_VAULT_PATH = path.join(process.cwd(), 'lib', 'portfolio_vault.json');

function readLocalVault(): PortfolioData | null {
  try {
    if (fs.existsSync(LOCAL_VAULT_PATH)) {
      const raw = fs.readFileSync(LOCAL_VAULT_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed as PortfolioData;
      }
    }
  } catch (e) {
    console.warn('[LocalVault] Failed to read portfolio_vault.json:', e);
  }
  return null;
}

function writeLocalVault(data: PortfolioData): void {
  try {
    fs.writeFileSync(LOCAL_VAULT_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.warn('[LocalVault] Failed to write portfolio_vault.json:', e);
  }
}

let clientInstance: Client | null = null;
let schemaInitialized = false;

export function isTursoConfigured(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}

export function getTursoClient(): Client | null {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    return null;
  }

  if (!clientInstance) {
    try {
      clientInstance = createClient({
        url,
        authToken,
      });
    } catch (err) {
      console.error('[Turso] Failed to initialize client:', err);
      return null;
    }
  }

  return clientInstance;
}

export async function ensureTursoSchema(): Promise<boolean> {
  if (schemaInitialized) return true;
  const client = getTursoClient();
  if (!client) return false;

  try {
    await client.batch(
      [
        // Enable foreign keys
        `PRAGMA foreign_keys = ON;`,

        // 1. Snapshot Vault Table
        `CREATE TABLE IF NOT EXISTS portfolio_vault (
          id TEXT PRIMARY KEY,
          data TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );`,

        // 2. Tech Radar: Categories Table
        `CREATE TABLE IF NOT EXISTS tech_categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          order_index INTEGER DEFAULT 0
        );`,

        // 3. Tech Radar: Items Table (Foreign Key to tech_categories)
        `CREATE TABLE IF NOT EXISTS tech_items (
          id TEXT PRIMARY KEY,
          category_id TEXT NOT NULL REFERENCES tech_categories(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          proficiency TEXT NOT NULL,
          experience_years TEXT NOT NULL,
          show_on_home INTEGER DEFAULT 0,
          order_index INTEGER DEFAULT 0
        );`,

        // 4. Tech Radar: Tags Table
        `CREATE TABLE IF NOT EXISTS tech_tags (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE
        );`,

        // 5. Tech Radar: Junction / Join Table (Many-to-Many relationship with Foreign Keys)
        `CREATE TABLE IF NOT EXISTS tech_item_tags (
          tech_item_id TEXT NOT NULL REFERENCES tech_items(id) ON DELETE CASCADE,
          tag_id TEXT NOT NULL REFERENCES tech_tags(id) ON DELETE CASCADE,
          PRIMARY KEY (tech_item_id, tag_id)
        );`,

        // 6. Experiences Table
        `CREATE TABLE IF NOT EXISTS experiences (
          id TEXT PRIMARY KEY,
          role TEXT NOT NULL,
          company TEXT NOT NULL,
          period TEXT NOT NULL,
          status TEXT,
          description TEXT NOT NULL,
          order_index INTEGER DEFAULT 0
        );`,

        // 7. Experience Technologies Table (One-to-Many relationship with Foreign Key)
        `CREATE TABLE IF NOT EXISTS experience_technologies (
          id TEXT PRIMARY KEY,
          experience_id TEXT NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
          tech_name TEXT NOT NULL
        );`,

        // 8. Experience Highlights Table (One-to-Many relationship with Foreign Key)
        `CREATE TABLE IF NOT EXISTS experience_highlights (
          id TEXT PRIMARY KEY,
          experience_id TEXT NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
          highlight TEXT NOT NULL,
          order_index INTEGER DEFAULT 0
        );`,

        // 9. Education Table
        `CREATE TABLE IF NOT EXISTS education (
          id TEXT PRIMARY KEY,
          degree TEXT NOT NULL,
          institution TEXT NOT NULL,
          location TEXT,
          period TEXT NOT NULL,
          honors TEXT,
          description TEXT,
          order_index INTEGER DEFAULT 0
        );`,

        // 10. Education Coursework Table (One-to-Many relationship with Foreign Key)
        `CREATE TABLE IF NOT EXISTS education_coursework (
          id TEXT PRIMARY KEY,
          education_id TEXT NOT NULL REFERENCES education(id) ON DELETE CASCADE,
          course_name TEXT NOT NULL
        );`,

        // 11. Contact Messages Table
        `CREATE TABLE IF NOT EXISTS contact_messages (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          message TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'unread',
          created_at TEXT NOT NULL
        );`,
      ],
      'write'
    );
    try {
      await client.execute('ALTER TABLE tech_items ADD COLUMN show_on_home INTEGER DEFAULT 0;');
    } catch {
      // Column already exists
    }
    schemaInitialized = true;
    return true;
  } catch (err) {
    console.error('[Turso] Error initializing schema:', err);
    return false;
  }
}

export function getDefaultPortfolioData(): PortfolioData {
  return {
    profile: developerProfile,
    whatIDo: whatIDoItems,
    projects: initialProjects,
    experiences: experiences,
    education: educationList,
    languages: spokenLanguages,
    skills: skillCategories,
    techRadar: initialTechRadar,
    interests: personalInterests,
    articles: initialArticles,
    telemetry: telemetryMetrics,
  };
}

/**
 * Fetch Tech Radar items from Turso using a normalized multi-table JOIN query.
 * Joins tech_items, tech_categories, tech_item_tags (junction table), and tech_tags.
 */
export async function getTechRadarFromDb(): Promise<TechRadarItem[]> {
  const client = getTursoClient();
  if (!client) return initialTechRadar;

  try {
    await ensureTursoSchema();
    const result = await client.execute(`
      SELECT 
        ti.id,
        ti.name,
        tc.name AS category,
        ti.proficiency,
        ti.experience_years AS experienceYears,
        ti.order_index AS orderIndex,
        COALESCE(ti.show_on_home, 0) AS showOnHome,
        COALESCE((
          SELECT GROUP_CONCAT(tt.name, '||')
          FROM tech_item_tags tit
          JOIN tech_tags tt ON tit.tag_id = tt.id
          WHERE tit.tech_item_id = ti.id
        ), '') AS tags
      FROM tech_items ti
      JOIN tech_categories tc ON ti.category_id = tc.id
      ORDER BY ti.order_index ASC, ti.name ASC;
    `);

    if (!result.rows || result.rows.length === 0) {
      // Auto seed relational tech radar tables if empty
      await saveTechRadarToDb(initialTechRadar);
      return initialTechRadar;
    }

    return result.rows.map((row) => ({
      id: row.id as string,
      name: row.name as string,
      category: row.category as string,
      proficiency: row.proficiency as any,
      experienceYears: row.experienceYears as string,
      showOnHome: Boolean(row.showOnHome === 1 || row.showOnHome === '1' || row.showOnHome === true),
      tags: row.tags ? (row.tags as string).split('||').filter(Boolean) : [],
    }));
  } catch (err) {
    console.error('[Turso] Error querying relational tech radar:', err);
    return initialTechRadar;
  }
}

/**
 * Persist Tech Radar items into Turso normalized relational tables with Foreign Keys and Junction Table.
 */
export async function saveTechRadarToDb(items: TechRadarItem[]): Promise<boolean> {
  const client = getTursoClient();
  if (!client) return false;

  try {
    await ensureTursoSchema();
    const statements: { sql: string; args: any[] }[] = [];

    // 1. Gather all unique categories and upsert them
    const categoriesMap = new Map<string, string>();
    items.forEach((item, idx) => {
      const cat = item.category.trim();
      if (!categoriesMap.has(cat)) {
        const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const catId = 'cat-' + slug;
        categoriesMap.set(cat, catId);
        statements.push({
          sql: `INSERT INTO tech_categories (id, name, slug, order_index)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(slug) DO UPDATE SET name = excluded.name;`,
          args: [catId, cat, slug, idx],
        });
      }
    });

    // 2. Clear stale junction records and items to re-sync
    statements.push({ sql: `DELETE FROM tech_item_tags;`, args: [] });
    statements.push({ sql: `DELETE FROM tech_items;`, args: [] });

    // 3. Insert items, tags, and junction table rows
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const catId = categoriesMap.get(it.category.trim()) || 'cat-general';
      const itemId = it.id || `tr-${Date.now()}-${i}`;

      statements.push({
        sql: `INSERT INTO tech_items (id, category_id, name, proficiency, experience_years, show_on_home, order_index)
              VALUES (?, ?, ?, ?, ?, ?, ?);`,
        args: [itemId, catId, it.name, it.proficiency, it.experienceYears, it.showOnHome ? 1 : 0, i],
      });

      for (const tag of it.tags || []) {
        const cleanTag = tag.trim();
        if (!cleanTag) continue;
        const tagId = 'tag-' + cleanTag.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        statements.push({
          sql: `INSERT INTO tech_tags (id, name) VALUES (?, ?)
                ON CONFLICT(name) DO NOTHING;`,
          args: [tagId, cleanTag],
        });

        statements.push({
          sql: `INSERT OR IGNORE INTO tech_item_tags (tech_item_id, tag_id)
                VALUES (?, (SELECT id FROM tech_tags WHERE name = ? LIMIT 1));`,
          args: [itemId, cleanTag],
        });
      }
    }

    await client.batch(statements, 'write');
    return true;
  } catch (err) {
    console.error('[Turso] Error saving relational tech radar:', err);
    return false;
  }
}

/**
 * Sync experiences into the relational experiences, experience_technologies, and experience_highlights tables.
 */
async function syncExperiencesToRelational(client: Client, exps: Experience[]): Promise<void> {
  try {
    const stmts: { sql: string; args: any[] }[] = [
      { sql: 'DELETE FROM experience_highlights;', args: [] },
      { sql: 'DELETE FROM experience_technologies;', args: [] },
      { sql: 'DELETE FROM experiences;', args: [] },
    ];
    exps.forEach((exp, idx) => {
      stmts.push({
        sql: `INSERT INTO experiences (id, role, company, period, status, description, order_index)
              VALUES (?, ?, ?, ?, ?, ?, ?);`,
        args: [exp.id, exp.role, exp.company, exp.period, exp.status || '', exp.description, idx],
      });
      (exp.technologies || []).forEach((tech, tIdx) => {
        stmts.push({
          sql: `INSERT INTO experience_technologies (id, experience_id, tech_name) VALUES (?, ?, ?);`,
          args: [`${exp.id}-tech-${tIdx}`, exp.id, tech],
        });
      });
      (exp.highlights || []).forEach((hl, hIdx) => {
        stmts.push({
          sql: `INSERT INTO experience_highlights (id, experience_id, highlight, order_index) VALUES (?, ?, ?, ?);`,
          args: [`${exp.id}-hl-${hIdx}`, exp.id, hl, hIdx],
        });
      });
    });
    await client.batch(stmts, 'write');
  } catch (e) {
    console.warn('[Turso] Relational experiences sync note:', e);
  }
}

/**
 * Sync education into the relational education and education_coursework tables.
 */
async function syncEducationToRelational(client: Client, edus: EducationItem[]): Promise<void> {
  try {
    const stmts: { sql: string; args: any[] }[] = [
      { sql: 'DELETE FROM education_coursework;', args: [] },
      { sql: 'DELETE FROM education;', args: [] },
    ];
    edus.forEach((edu, idx) => {
      stmts.push({
        sql: `INSERT INTO education (id, degree, institution, location, period, honors, description, order_index)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        args: [edu.id, edu.degree, edu.institution, edu.location || '', edu.period, edu.honors || '', edu.description || '', idx],
      });
      (edu.coursework || []).forEach((course, cIdx) => {
        stmts.push({
          sql: `INSERT INTO education_coursework (id, education_id, course_name) VALUES (?, ?, ?);`,
          args: [`${edu.id}-cw-${cIdx}`, edu.id, course],
        });
      });
    });
    await client.batch(stmts, 'write');
  } catch (e) {
    console.warn('[Turso] Relational education sync note:', e);
  }
}

export async function getPortfolioFromDb(): Promise<{ data: PortfolioData; source: 'turso' | 'static' | 'local_vault' }> {
  const client = getTursoClient();
  const defaultData = getDefaultPortfolioData();
  const localSaved = readLocalVault();

  const baselineData: PortfolioData = localSaved
    ? {
        ...defaultData,
        ...localSaved,
        profile: localSaved.profile ? { ...defaultData.profile, ...localSaved.profile } : defaultData.profile,
      }
    : defaultData;

  if (!client) {
    return { data: baselineData, source: localSaved ? 'local_vault' : 'static' };
  }

  try {
    await ensureTursoSchema();

    // 1. Fetch snapshot from vault
    const result = await client.execute({
      sql: 'SELECT data, updated_at FROM portfolio_vault WHERE id = ? LIMIT 1',
      args: ['main'],
    });

    // 2. Fetch normalized relational Tech Radar via SQL JOIN
    const relationalTechRadar = await getTechRadarFromDb();

    if (result.rows && result.rows.length > 0) {
      const rawJson = result.rows[0].data as string;
      const parsed = JSON.parse(rawJson);
      const articles = (parsed.articles || baselineData.articles || []).map((a: any) => ({
        ...a,
        slug: a.id || a.slug,
      }));
      const projects = (parsed.projects || baselineData.projects || []).map((p: any) => ({
        ...p,
        slug: p.id || p.slug,
      }));
      const finalData: PortfolioData = {
        ...baselineData,
        ...parsed,
        articles,
        projects,
        profile: parsed.profile ? { ...baselineData.profile, ...parsed.profile } : baselineData.profile,
        techRadar: relationalTechRadar && relationalTechRadar.length > 0 ? relationalTechRadar : (parsed.techRadar || baselineData.techRadar),
      };
      writeLocalVault(finalData);
      return {
        data: finalData,
        source: 'turso',
      };
    }

    // Auto-seed Turso on first read if empty (use baselineData so any local edits are pushed to Turso!)
    const seedData = baselineData;
    await client.execute({
      sql: 'INSERT INTO portfolio_vault (id, data, updated_at) VALUES (?, ?, ?)',
      args: ['main', JSON.stringify(seedData), new Date().toISOString()],
    });

    // Seed relational tables
    await saveTechRadarToDb(seedData.techRadar || initialTechRadar);
    await syncExperiencesToRelational(client, seedData.experiences);
    await syncEducationToRelational(client, seedData.education);

    writeLocalVault(seedData);
    return { data: seedData, source: 'turso' };
  } catch (err) {
    console.error('[Turso] Error fetching portfolio data, falling back to local/static:', err);
    return { data: baselineData, source: localSaved ? 'local_vault' : 'static' };
  }
}

export async function savePortfolioToDb(partial: Partial<PortfolioData>): Promise<PortfolioData> {
  const client = getTursoClient();
  const current = (await getPortfolioFromDb()).data;

  const merged: PortfolioData = {
    ...current,
    ...partial,
    profile: partial.profile ? { ...current.profile, ...partial.profile } : current.profile,
  };

  // Always persist locally to JSON file immediately
  writeLocalVault(merged);

  if (!client) {
    return merged;
  }

  try {
    await ensureTursoSchema();

    // 1. Update snapshot
    await client.execute({
      sql: `INSERT INTO portfolio_vault (id, data, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              data = excluded.data,
              updated_at = excluded.updated_at`,
      args: ['main', JSON.stringify(merged), new Date().toISOString()],
    });

    // 2. Update relational tables
    if (partial.techRadar) {
      await saveTechRadarToDb(partial.techRadar);
    }
    if (partial.experiences) {
      await syncExperiencesToRelational(client, partial.experiences);
    }
    if (partial.education) {
      await syncEducationToRelational(client, partial.education);
    }
  } catch (err) {
    console.error('[Turso] Error saving portfolio data:', err);
    throw err;
  }

  return merged;
}

export async function resetPortfolioInDb(): Promise<PortfolioData> {
  const client = getTursoClient();
  const defaultData = getDefaultPortfolioData();

  writeLocalVault(defaultData);

  if (!client) {
    return defaultData;
  }

  try {
    await ensureTursoSchema();
    await client.execute({
      sql: `INSERT INTO portfolio_vault (id, data, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              data = excluded.data,
              updated_at = excluded.updated_at`,
      args: ['main', JSON.stringify(defaultData), new Date().toISOString()],
    });

    await saveTechRadarToDb(initialTechRadar);
    await syncExperiencesToRelational(client, experiences);
    await syncEducationToRelational(client, educationList);
  } catch (err) {
    console.error('[Turso] Error resetting portfolio data:', err);
  }

  return defaultData;
}

export async function getContactMessagesFromDb(): Promise<ContactMessage[]> {
  const client = getTursoClient();
  if (!client) return [];

  try {
    await ensureTursoSchema();
    const result = await client.execute('SELECT * FROM contact_messages ORDER BY created_at DESC');
    return result.rows.map((row) => ({
      id: row.id as string,
      name: row.name as string,
      email: row.email as string,
      message: row.message as string,
      status: (row.status as any) || 'unread',
      createdAt: row.created_at as string,
    }));
  } catch (err) {
    console.error('[Turso] Error fetching messages:', err);
    return [];
  }
}

export async function saveContactMessageToDb(msg: ContactMessage): Promise<boolean> {
  const client = getTursoClient();
  if (!client) return false;

  try {
    await ensureTursoSchema();
    await client.execute({
      sql: 'INSERT INTO contact_messages (id, name, email, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      args: [msg.id, msg.name, msg.email, msg.message, msg.status, msg.createdAt],
    });
    return true;
  } catch (err) {
    console.error('[Turso] Error inserting message:', err);
    return false;
  }
}
