// ===== Category Repository =====
import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';
import { Category, CategoryGroup } from '../types';
import { getDatabase } from './database';

function mapRow(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    emoji: row.emoji as string,
    iconName: row.icon_name as string,
    groupName: row.group_name as string,
    isSystem: Boolean(row.is_system),
    isArchived: Boolean(row.is_archived),
    sortOrder: row.sort_order as number,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getAllCategories(includeArchived: boolean = false): Promise<Category[]> {
  const db = await getDatabase();
  const where = includeArchived ? '' : 'WHERE is_archived = 0';
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM categories ${where} ORDER BY sort_order ASC, name ASC`
  );
  return rows.map(mapRow);
}

export async function getCategoriesGrouped(includeArchived: boolean = false): Promise<CategoryGroup[]> {
  const categories = await getAllCategories(includeArchived);
  const groupMap = new Map<string, Category[]>();

  for (const cat of categories) {
    const group = groupMap.get(cat.groupName) ?? [];
    group.push(cat);
    groupMap.set(cat.groupName, group);
  }

  return Array.from(groupMap.entries()).map(([name, categories]) => ({
    name,
    categories,
  }));
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  );
  return row ? mapRow(row) : null;
}

import { CategoryInputSchema } from '../utils/validation';

export async function createCategory(data: {
  name: string;
  emoji: string;
  iconName: string;
  groupName: string;
}): Promise<string> {
  const validated = CategoryInputSchema.parse(data);
  const db = await getDatabase();
  const id = `cat_custom_${Crypto.randomUUID().slice(0, 8)}`;
  const now = new Date().toISOString();

  // Get max sort order
  const maxRow = await db.getFirstAsync<{ max_order: number }>(
    'SELECT MAX(sort_order) as max_order FROM categories'
  );
  const sortOrder = (maxRow?.max_order ?? 0) + 1;

  await db.runAsync(
    `INSERT INTO categories (id, name, emoji, icon_name, group_name, is_system, is_archived, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?, ?)`,
    [id, validated.name, validated.emoji, validated.iconName, validated.groupName, sortOrder, now, now]
  );

  return id;
}

export async function updateCategory(id: string, data: {
  name?: string;
  emoji?: string;
  iconName?: string;
  groupName?: string;
}): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const sets: string[] = ['updated_at = ?'];
  const args: (string | number | null)[] = [now];

  if (data.name !== undefined) { sets.push('name = ?'); args.push(data.name); }
  if (data.emoji !== undefined) { sets.push('emoji = ?'); args.push(data.emoji); }
  if (data.iconName !== undefined) { sets.push('icon_name = ?'); args.push(data.iconName); }
  if (data.groupName !== undefined) { sets.push('group_name = ?'); args.push(data.groupName); }

  args.push(id);
  await db.runAsync(`UPDATE categories SET ${sets.join(', ')} WHERE id = ?`, args as any);

}

export async function archiveCategory(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE categories SET is_archived = 1, updated_at = ? WHERE id = ?',
    [new Date().toISOString(), id]
  );
}

export async function restoreCategory(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE categories SET is_archived = 0, updated_at = ? WHERE id = ?',
    [new Date().toISOString(), id]
  );
}

export async function isCategoryUsed(id: string): Promise<boolean> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM expenses WHERE category_id = ?',
    [id]
  );
  return (row?.count ?? 0) > 0;
}

export async function searchCategories(query: string): Promise<Category[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM categories
     WHERE is_archived = 0 AND (name LIKE ? OR emoji LIKE ?)
     ORDER BY sort_order ASC`,
    [`%${query}%`, `%${query}%`]
  );
  return rows.map(mapRow);
}
