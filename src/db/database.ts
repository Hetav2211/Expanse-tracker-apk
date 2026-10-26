// ===== Database Initialization & Connection (Apple Principal QA Architecture) =====
import * as SQLite from 'expo-sqlite';
import { runMigrations } from './migrations/index';
import { seedDefaultCategories } from './seed';

let db: SQLite.SQLiteDatabase | null = null;

const DB_NAME = 'expense_tracker.db';

/**
 * Get or create the database connection.
 * Configured with WAL, foreign keys, and bounded RAM cache.
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync(DB_NAME);

  // Enable foreign keys
  await db.execAsync('PRAGMA foreign_keys = ON;');

  // Enable WAL mode for high-concurrency 120fps read/write pacing
  await db.execAsync('PRAGMA journal_mode = WAL;');

  // Bounded cache size (-4000 = ~4MB in RAM) to respect mobile memory budget
  await db.execAsync('PRAGMA cache_size = -4000;');

  // Enable auto_vacuum = INCREMENTAL for disk space reclamation
  await db.execAsync('PRAGMA auto_vacuum = INCREMENTAL;');

  // Run migrations
  await runMigrations(db);

  // Seed default categories
  await seedDefaultCategories(db);

  return db;
}

/**
 * Compaction routine to release freed disk blocks back to the OS (Section 3B).
 */
export async function vacuumDatabase(): Promise<void> {
  if (db) {
    try {
      await db.execAsync('PRAGMA incremental_vacuum(50);');
    } catch (e) {
      console.warn('Vacuum warning:', e);
    }
  }
}

/**
 * Close the database connection.
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}
