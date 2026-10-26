// ===== Database Migrations (Apple Principal QA Architecture) =====
import * as SQLite from 'expo-sqlite';

interface Migration {
  version: number;
  up: string[];
}

const migrations: Migration[] = [
  {
    version: 1,
    up: [
      // Categories table
      `CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        emoji TEXT NOT NULL DEFAULT '📦',
        icon_name TEXT NOT NULL DEFAULT 'package',
        group_name TEXT NOT NULL DEFAULT 'Other',
        is_system INTEGER NOT NULL DEFAULT 1,
        is_archived INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
      );`,

      // Expenses table
      `CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY NOT NULL,
        amount_paise INTEGER NOT NULL CHECK(amount_paise > 0),
        category_id TEXT NOT NULL REFERENCES categories(id),
        expense_date TEXT NOT NULL,
        note TEXT,
        merchant TEXT,
        payment_method TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
      );`,

      // Indexes for expenses
      `CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);`,
      `CREATE INDEX IF NOT EXISTS idx_expenses_category_date ON expenses(category_id, expense_date);`,
      `CREATE INDEX IF NOT EXISTS idx_expenses_year_month ON expenses(substr(expense_date, 1, 7));`,

      // Monthly budgets table
      `CREATE TABLE IF NOT EXISTS monthly_budgets (
        id TEXT PRIMARY KEY NOT NULL,
        year_month TEXT NOT NULL,
        amount_paise INTEGER NOT NULL CHECK(amount_paise > 0),
        category_id TEXT REFERENCES categories(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
        UNIQUE(year_month, category_id)
      );`,

      // Migration version tracking
      `CREATE TABLE IF NOT EXISTS schema_version (
        version INTEGER PRIMARY KEY NOT NULL
      );`,
    ],
  },
  {
    version: 2,
    up: [
      // Performance optimization indexes for 120Hz ProMotion list filtering
      `CREATE INDEX IF NOT EXISTS idx_expenses_payment_date ON expenses(payment_method, expense_date);`,
      `CREATE INDEX IF NOT EXISTS idx_categories_archived_order ON categories(is_archived, sort_order);`,
    ],
  },
];

/**
 * Run all pending migrations in order with transaction safety.
 */
export async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  // Ensure schema_version table exists
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS schema_version (version INTEGER PRIMARY KEY NOT NULL);`
  );

  // Get current version
  const result = await db.getFirstAsync<{ version: number }>(
    'SELECT MAX(version) as version FROM schema_version'
  );
  const currentVersion = result?.version ?? 0;

  // Run pending migrations
  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      await db.withTransactionAsync(async () => {
        for (const sql of migration.up) {
          await db.execAsync(sql);
        }
        await db.runAsync(
          'INSERT INTO schema_version (version) VALUES (?)',
          [migration.version]
        );
      });
      console.log(`[DB] Migration v${migration.version} applied successfully`);
    }
  }
}
