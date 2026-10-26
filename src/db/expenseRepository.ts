// ===== Expense Repository =====
import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';
import { Expense, ExpenseWithCategory, Category, PaymentMethod, MonthlyTotal, CategoryTotal } from '../types';
import { getDatabase } from './database';

function mapRowToExpense(row: Record<string, unknown>): Expense {
  return {
    id: row.id as string,
    amountPaise: row.amount_paise as number,
    categoryId: row.category_id as string,
    expenseDate: row.expense_date as string,
    note: (row.note as string) || null,
    merchant: (row.merchant as string) || null,
    paymentMethod: (row.payment_method as PaymentMethod) || null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapRowToCategory(row: Record<string, unknown>): Category {
  return {
    id: row.cat_id as string || row.id as string,
    name: row.cat_name as string || row.name as string,
    emoji: row.cat_emoji as string || row.emoji as string,
    iconName: row.cat_icon_name as string || row.icon_name as string,
    groupName: row.cat_group_name as string || row.group_name as string,
    isSystem: Boolean(row.cat_is_system ?? row.is_system),
    isArchived: Boolean(row.cat_is_archived ?? row.is_archived),
    sortOrder: (row.cat_sort_order as number) ?? (row.sort_order as number) ?? 0,
    createdAt: (row.cat_created_at as string) || (row.created_at as string) || '',
    updatedAt: (row.cat_updated_at as string) || (row.updated_at as string) || '',
  };
}

function mapRowToExpenseWithCategory(row: Record<string, unknown>): ExpenseWithCategory {
  return {
    ...mapRowToExpense(row),
    category: {
      id: row.cat_id as string,
      name: row.cat_name as string,
      emoji: row.cat_emoji as string,
      iconName: row.cat_icon_name as string,
      groupName: row.cat_group_name as string,
      isSystem: Boolean(row.cat_is_system),
      isArchived: Boolean(row.cat_is_archived),
      sortOrder: (row.cat_sort_order as number) ?? 0,
      createdAt: (row.cat_created_at as string) || '',
      updatedAt: (row.cat_updated_at as string) || '',
    },
  };
}

const EXPENSE_WITH_CATEGORY_SELECT = `
  e.id, e.amount_paise, e.category_id, e.expense_date, e.note, e.merchant, e.payment_method, e.created_at, e.updated_at,
  c.id as cat_id, c.name as cat_name, c.emoji as cat_emoji, c.icon_name as cat_icon_name,
  c.group_name as cat_group_name, c.is_system as cat_is_system, c.is_archived as cat_is_archived,
  c.sort_order as cat_sort_order, c.created_at as cat_created_at, c.updated_at as cat_updated_at
`;

import { ExpenseInputSchema } from '../utils/validation';

export async function createExpense(data: {
  amountPaise: number;
  categoryId: string;
  expenseDate: string;
  note?: string | null;
  merchant?: string | null;
  paymentMethod?: PaymentMethod | null;
}): Promise<string> {
  const validated = ExpenseInputSchema.parse(data);
  const db = await getDatabase();
  const id = Crypto.randomUUID();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO expenses (id, amount_paise, category_id, expense_date, note, merchant, payment_method, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, validated.amountPaise, validated.categoryId, validated.expenseDate, validated.note, validated.merchant, validated.paymentMethod, now, now]
  );

  return id;
}

export async function updateExpense(id: string, data: {
  amountPaise: number;
  categoryId: string;
  expenseDate: string;
  note?: string | null;
  merchant?: string | null;
  paymentMethod?: PaymentMethod | null;
}): Promise<void> {
  const validated = ExpenseInputSchema.parse(data);
  const db = await getDatabase();
  const now = new Date().toISOString();

  await db.runAsync(
    `UPDATE expenses SET amount_paise = ?, category_id = ?, expense_date = ?, note = ?, merchant = ?, payment_method = ?, updated_at = ?
     WHERE id = ?`,
    [validated.amountPaise, validated.categoryId, validated.expenseDate, validated.note, validated.merchant, validated.paymentMethod, now, id]
  );
}

export async function deleteExpense(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
}

export async function getExpenseById(id: string): Promise<ExpenseWithCategory | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    `SELECT ${EXPENSE_WITH_CATEGORY_SELECT}
     FROM expenses e
     JOIN categories c ON e.category_id = c.id
     WHERE e.id = ?`,
    [id]
  );
  return row ? mapRowToExpenseWithCategory(row) : null;
}

export async function getExpenses(params: {
  yearMonth?: string;
  categoryId?: string;
  paymentMethod?: string;
  searchQuery?: string;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}): Promise<ExpenseWithCategory[]> {
  const db = await getDatabase();
  const conditions: string[] = [];
  const args: any[] = [];


  if (params.yearMonth) {
    conditions.push("substr(e.expense_date, 1, 7) = ?");
    args.push(params.yearMonth);
  }
  if (params.categoryId) {
    conditions.push("e.category_id = ?");
    args.push(params.categoryId);
  }
  if (params.paymentMethod) {
    conditions.push("e.payment_method = ?");
    args.push(params.paymentMethod);
  }
  if (params.searchQuery) {
    conditions.push("(e.note LIKE ? OR e.merchant LIKE ? OR c.name LIKE ?)");
    const q = `%${params.searchQuery}%`;
    args.push(q, q, q);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sortCol = params.sortBy === 'amount' ? 'e.amount_paise' : 'e.expense_date';
  const sortDir = params.sortOrder === 'asc' ? 'ASC' : 'DESC';
  const orderBy = `ORDER BY ${sortCol} ${sortDir}, e.created_at DESC`;

  const limitClause = params.limit ? `LIMIT ${params.limit}` : '';
  const offsetClause = params.offset ? `OFFSET ${params.offset}` : '';

  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT ${EXPENSE_WITH_CATEGORY_SELECT}
     FROM expenses e
     JOIN categories c ON e.category_id = c.id
     ${where} ${orderBy} ${limitClause} ${offsetClause}`,
    args
  );

  return rows.map(mapRowToExpenseWithCategory);
}

export async function getMonthlyTotal(yearMonth: string): Promise<{ totalPaise: number; transactionCount: number }> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ total: number; count: number }>(
    `SELECT COALESCE(SUM(amount_paise), 0) as total, COUNT(*) as count
     FROM expenses
     WHERE substr(expense_date, 1, 7) = ?`,
    [yearMonth]
  );
  return { totalPaise: row?.total ?? 0, transactionCount: row?.count ?? 0 };
}

export async function getMonthlyTotals(months: string[]): Promise<MonthlyTotal[]> {
  if (months.length === 0) return [];

  const db = await getDatabase();
  const placeholders = months.map(() => '?').join(',');
  const rows = await db.getAllAsync<{ year_month: string; total: number; count: number }>(
    `SELECT substr(expense_date, 1, 7) as year_month,
            COALESCE(SUM(amount_paise), 0) as total,
            COUNT(*) as count
     FROM expenses
     WHERE substr(expense_date, 1, 7) IN (${placeholders})
     GROUP BY substr(expense_date, 1, 7)`,
    months
  );

  return rows.map((r) => ({
    yearMonth: r.year_month,
    totalPaise: r.total,
    transactionCount: r.count,
  }));
}

export async function getCategoryTotals(yearMonth: string): Promise<Array<{ categoryId: string; totalPaise: number; transactionCount: number; category: Category }>> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT e.category_id,
            COALESCE(SUM(e.amount_paise), 0) as total_paise,
            COUNT(*) as count,
            c.id as cat_id, c.name as cat_name, c.emoji as cat_emoji, c.icon_name as cat_icon_name,
            c.group_name as cat_group_name, c.is_system as cat_is_system, c.is_archived as cat_is_archived,
            c.sort_order as cat_sort_order, c.created_at as cat_created_at, c.updated_at as cat_updated_at
     FROM expenses e
     JOIN categories c ON e.category_id = c.id
     WHERE substr(e.expense_date, 1, 7) = ?
     GROUP BY e.category_id
     ORDER BY total_paise DESC`,
    [yearMonth]
  );

  return rows.map((r) => ({
    categoryId: r.category_id as string,
    totalPaise: r.total_paise as number,
    transactionCount: r.count as number,
    category: {
      id: r.cat_id as string,
      name: r.cat_name as string,
      emoji: r.cat_emoji as string,
      iconName: r.cat_icon_name as string,
      groupName: r.cat_group_name as string,
      isSystem: Boolean(r.cat_is_system),
      isArchived: Boolean(r.cat_is_archived),
      sortOrder: (r.cat_sort_order as number) ?? 0,
      createdAt: (r.cat_created_at as string) || '',
      updatedAt: (r.cat_updated_at as string) || '',
    },
  }));
}

export async function getExpenseCount(): Promise<number> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM expenses');
  return row?.count ?? 0;
}

export async function getAllExpensesForExport(): Promise<ExpenseWithCategory[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT ${EXPENSE_WITH_CATEGORY_SELECT}
     FROM expenses e
     JOIN categories c ON e.category_id = c.id
     ORDER BY e.expense_date DESC, e.created_at DESC`
  );
  return rows.map(mapRowToExpenseWithCategory);
}

export async function deleteAllExpenses(): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM expenses');
}
