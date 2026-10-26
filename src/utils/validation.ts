// ===== Apple Principal QA: Perimeter Schema Validation (Zod) =====
import { z } from 'zod';
import { PAYMENT_METHODS } from '../types';

const PaymentMethodEnum = z.enum(['cash', 'upi', 'credit_card', 'debit_card', 'net_banking', 'other']);

/**
 * Validates and sanitizes expense input before SQLite persistence.
 * Prevents invalid amounts, missing categories, or unhandled nulls.
 */
export const ExpenseInputSchema = z.object({
  amountPaise: z.number().int().positive('Amount must be a positive integer in paise').max(100_000_000_000, 'Amount exceeds maximum supported limit'),
  categoryId: z.string().min(1, 'Category ID is required'),
  expenseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  note: z.string().max(500, 'Note must not exceed 500 characters').nullable().optional().transform(v => v?.trim() || null),
  merchant: z.string().max(150, 'Merchant must not exceed 150 characters').nullable().optional().transform(v => v?.trim() || null),
  paymentMethod: PaymentMethodEnum.nullable().optional().default(null),
});

export type ValidatedExpenseInput = z.infer<typeof ExpenseInputSchema>;

/**
 * Validates and sanitizes category input.
 */
export const CategoryInputSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Name must not exceed 100 characters').transform(v => v.trim()),
  emoji: z.string().min(1, 'Emoji is required').max(8, 'Emoji must be a valid glyph').default('🏷️'),
  iconName: z.string().min(1).max(50).default('tag'),
  groupName: z.string().min(1).max(50).default('Custom').transform(v => v.trim()),
});

export type ValidatedCategoryInput = z.infer<typeof CategoryInputSchema>;

/**
 * Validates and sanitizes monthly budget input.
 */
export const BudgetInputSchema = z.object({
  yearMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be formatted as YYYY-MM'),
  amountPaise: z.number().int().positive('Budget amount must be a positive integer in paise').max(100_000_000_000),
  categoryId: z.string().nullable().optional().default(null),
});

export type ValidatedBudgetInput = z.infer<typeof BudgetInputSchema>;

/**
 * Resilient schema for imported database backups.
 * Defends against malformed JSON, corrupted data, or missing columns.
 */
export const BackupDatabaseRecordSchema = z.object({
  version: z.number().int().default(1),
  appName: z.string().optional().default('Personal Expense Tracker'),
  exportedAt: z.string().optional(),
  data: z.object({
    categories: z.array(
      z.object({
        id: z.string(),
        name: z.string().default('Untitled Category'),
        emoji: z.string().default('🏷️'),
        icon_name: z.string().default('tag'),
        group_name: z.string().default('Other'),
        is_system: z.union([z.number(), z.boolean()]).transform(v => (v ? 1 : 0)).default(0),
        is_archived: z.union([z.number(), z.boolean()]).transform(v => (v ? 1 : 0)).default(0),
        sort_order: z.number().default(0),
        created_at: z.string().default(() => new Date().toISOString()),
        updated_at: z.string().default(() => new Date().toISOString()),
      })
    ).default([]),
    expenses: z.array(
      z.object({
        id: z.string(),
        amount_paise: z.number().int().positive(),
        category_id: z.string(),
        expense_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        note: z.string().nullable().optional().default(null),
        merchant: z.string().nullable().optional().default(null),
        payment_method: z.string().nullable().optional().default(null),
        created_at: z.string().default(() => new Date().toISOString()),
        updated_at: z.string().default(() => new Date().toISOString()),
      })
    ).default([]),
    budgets: z.array(
      z.object({
        id: z.string(),
        year_month: z.string().regex(/^\d{4}-\d{2}$/),
        amount_paise: z.number().int().positive(),
        category_id: z.string().nullable().optional().default(null),
        created_at: z.string().default(() => new Date().toISOString()),
        updated_at: z.string().default(() => new Date().toISOString()),
      })
    ).default([]),
  }),
});

export type ValidatedBackupPayload = z.infer<typeof BackupDatabaseRecordSchema>;

/**
 * Safe bounds-checked array access utility (Section 1A: Safe Collection Indexing).
 */
export function safeItemAt<T>(array: T[] | null | undefined, index: number): T | undefined {
  if (!array || index < 0 || index >= array.length) {
    return undefined;
  }
  return array[index];
}
