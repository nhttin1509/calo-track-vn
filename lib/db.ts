import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL || 'file:local.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

const db = createClient({
  url,
  authToken,
});

// Helper to initialize tables
export async function initDB() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      calories INTEGER NOT NULL,
      protein INTEGER DEFAULT 0,
      carbs INTEGER DEFAULT 0,
      fat INTEGER DEFAULT 0,
      micronutrients TEXT,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        height REAL,
        weight REAL,
        age INTEGER,
        gender TEXT,
        activity_level TEXT,
        body_fat REAL,
        goal TEXT,
        tdee INTEGER,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migrations (Check if column exists, if not add it - simplified for Turso/SQLite)
  // Note: 'ADD COLUMN IF NOT EXISTS' is not standard SQLite, but LibSQL might support it or we ignore error
  try {
    await db.execute('ALTER TABLE entries ADD COLUMN micronutrients TEXT');
  } catch (e) { }

  try {
    await db.execute('ALTER TABLE user_profile ADD COLUMN body_fat REAL');
  } catch (e) { }
}

// Auto-init on import (side-effect, useful for serverless cold starts to ensure schema)
initDB().catch(console.error);

export default db;
