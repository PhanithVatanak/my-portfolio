import { createClient, Client } from '@libsql/client';
import { PortfolioData, ContactMessage } from '@/lib/types';
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
} from '@/lib/data';

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
        `CREATE TABLE IF NOT EXISTS portfolio_vault (
          id TEXT PRIMARY KEY,
          data TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );`,
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
    interests: personalInterests,
    articles: initialArticles,
    telemetry: telemetryMetrics,
  };
}

export async function getPortfolioFromDb(): Promise<{ data: PortfolioData; source: 'turso' | 'static' }> {
  const client = getTursoClient();
  const defaultData = getDefaultPortfolioData();

  if (!client) {
    return { data: defaultData, source: 'static' };
  }

  try {
    await ensureTursoSchema();
    const result = await client.execute({
      sql: 'SELECT data, updated_at FROM portfolio_vault WHERE id = ? LIMIT 1',
      args: ['main'],
    });

    if (result.rows && result.rows.length > 0) {
      const rawJson = result.rows[0].data as string;
      const parsed = JSON.parse(rawJson);
      return {
        data: {
          ...defaultData,
          ...parsed,
          profile: parsed.profile ? { ...defaultData.profile, ...parsed.profile } : defaultData.profile,
        },
        source: 'turso',
      };
    }

    // Auto-seed Turso on first read if empty
    await client.execute({
      sql: 'INSERT INTO portfolio_vault (id, data, updated_at) VALUES (?, ?, ?)',
      args: ['main', JSON.stringify(defaultData), new Date().toISOString()],
    });

    return { data: defaultData, source: 'turso' };
  } catch (err) {
    console.error('[Turso] Error fetching portfolio data, falling back to static:', err);
    return { data: defaultData, source: 'static' };
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

  if (!client) {
    return merged;
  }

  try {
    await ensureTursoSchema();
    await client.execute({
      sql: `INSERT INTO portfolio_vault (id, data, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              data = excluded.data,
              updated_at = excluded.updated_at`,
      args: ['main', JSON.stringify(merged), new Date().toISOString()],
    });
  } catch (err) {
    console.error('[Turso] Error saving portfolio data:', err);
    throw err;
  }

  return merged;
}

export async function resetPortfolioInDb(): Promise<PortfolioData> {
  const client = getTursoClient();
  const defaultData = getDefaultPortfolioData();

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
