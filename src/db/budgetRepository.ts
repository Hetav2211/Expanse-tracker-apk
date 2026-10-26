// ===== Budget Repository =====
import * as Crypto from 'expo-crypto';
import { BudgetStatus, Category, MonthlyBudget } from '../types';
import { getDatabase } from './database';

function mapRow(row: Record<string, unknown>): MonthlyBudget {
  return {
    id: row.id as string,
    yearMonth: row.year_month as string,
    amountPaise: row.amount_paise as number,
    categoryId: (row.category_id as string) || null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getBudgetsForMonth(yearMonth: string): Promise<MonthlyBudget[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM monthly_budgets WHERE year_month = ? ORDER BY category_id IS NULL DESC, category_id ASC`,
    [yearMonth]
  );
  return rows.map(mapRow);
}

export async function getOverallBudget(yearMonth: string): Promise<MonthlyBudget | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    `SELECT * FROM monthly_budgets WHERE year_month = ? AND category_id IS NULL`,
    [yearMonth]
  );
  return row ? mapRow(row) : null;
}

import { BudgetInputSchema } from '../utils/validation';

export async function setCategoryBudget(yearMonth: string, categoryId: string | null, amountPaise: number): Promise<string> {
  const validated = BudgetInputSchema.parse({ yearMonth, categoryId, amountPaise });
  const db = await getDatabase();
  const now = new Date().toISOString();

  // Check if budget exists
  const existing = validated.categoryId
    ? await db.getFirstAsync<Record<string, unknown>>(
      'SELECT id FROM monthly_budgets WHERE year_month = ? AND category_id = ?',
      [validated.yearMonth, validated.categoryId]
    )
    : await db.getFirstAsync<Record<string, unknown>>(
      'SELECT id FROM monthly_budgets WHERE year_month = ? AND category_id IS NULL',
      [validated.yearMonth]
    );

  if (existing) {
    const id = existing.id as string;
    await db.runAsync(
      'UPDATE monthly_budgets SET amount_paise = ?, updated_at = ? WHERE id = ?',
      [validated.amountPaise, now, id]
    );
    return id;
  }

  const id = Crypto.randomUUID();
  await db.runAsync(
    `INSERT INTO monthly_budgets (id, year_month, amount_paise, category_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, validated.yearMonth, validated.amountPaise, validated.categoryId, now, now]
  );
  return id;
}

export async function deleteBudget(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM monthly_budgets WHERE id = ?', [id]);
}

export async function getBudgetStatuses(yearMonth: string): Promise<BudgetStatus[]> {
  const db = await getDatabase();
  const budgets = await getBudgetsForMonth(yearMonth);

  const statuses: BudgetStatus[] = [];

  for (const budget of budgets) {
    let spentPaise: number;
    let category: Category | null = null;

    if (budget.categoryId) {
      // Category-specific budget
      const spentRow = await db.getFirstAsync<{ total: number }>(
        `SELECT COALESCE(SUM(amount_paise), 0) as total FROM expenses
         WHERE category_id = ? AND substr(expense_date, 1, 7) = ?`,
        [budget.categoryId, yearMonth]
      );
      spentPaise = spentRow?.total ?? 0;

      const catRow = await db.getFirstAsync<Record<string, unknown>>(
        'SELECT * FROM categories WHERE id = ?',
        [budget.categoryId]
      );
      if (catRow) {
        category = {
          id: catRow.id as string,
          name: catRow.name as string,
          emoji: catRow.emoji as string,
          iconName: catRow.icon_name as string,
          groupName: catRow.group_name as string,
          isSystem: Boolean(catRow.is_system),
          isArchived: Boolean(catRow.is_archived),
          sortOrder: catRow.sort_order as number,
          createdAt: catRow.created_at as string,
          updatedAt: catRow.updated_at as string,
        };
      }
    } else {
      // Overall budget
      const spentRow = await db.getFirstAsync<{ total: number }>(
        `SELECT COALESCE(SUM(amount_paise), 0) as total FROM expenses
         WHERE substr(expense_date, 1, 7) = ?`,
        [yearMonth]
      );
      spentPaise = spentRow?.total ?? 0;
    }

    const remainingPaise = budget.amountPaise - spentPaise;
    const percentUsed = budget.amountPaise > 0 ? (spentPaise / budget.amountPaise) * 100 : 0;

    statuses.push({
      budget,
      spentPaise,
      remainingPaise,
      percentUsed,
      isExceeded: spentPaise > budget.amountPaise,
      category,
    });
  }

  return statuses;
}
