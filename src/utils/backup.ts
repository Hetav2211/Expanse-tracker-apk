// ===== Database Backup & Restore Utility (Apple Principal QA Architecture) =====
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { getDatabase } from '../db/database';
import { appEvents, EVENTS } from './events';
import { BackupDatabaseRecordSchema } from './validation';

export async function exportDatabaseBackup(): Promise<boolean> {
  let fileUri = '';
  try {
    const db = await getDatabase();

    const [categories, expenses, budgets] = await Promise.all([
      db.getAllAsync('SELECT * FROM categories'),
      db.getAllAsync('SELECT * FROM expenses'),
      db.getAllAsync('SELECT * FROM monthly_budgets'),
    ]);

    const backupPayload = {
      version: 1,
      appName: 'Personal Expense Tracker',
      exportedAt: new Date().toISOString(),
      data: {
        categories,
        expenses,
        budgets,
      },
    };

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `expense_tracker_backup_${timestamp}.json`;
    // Disk hygiene: Write to cache directory rather than permanent document directory
    const dir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
    fileUri = `${dir}${filename}`;

    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(backupPayload, null, 2), {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Export Backup JSON',
        UTI: 'public.json',
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error creating backup:', error);
    throw error;
  }
}

export async function importDatabaseBackup(): Promise<{ success: boolean; message: string }> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return { success: false, message: 'File selection cancelled' };
    }

    const fileAsset = result.assets[0];
    if (!fileAsset?.uri) {
      return { success: false, message: 'Invalid file asset selected' };
    }

    const fileContent = await FileSystem.readAsStringAsync(fileAsset.uri);

    // Schema Validation at the Perimeter (Section 1C)
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(fileContent);
    } catch {
      return { success: false, message: 'Corrupted backup file: Not valid JSON' };
    }

    const parseResult = BackupDatabaseRecordSchema.safeParse(parsedJson);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || 'Schema validation failed';
      return { success: false, message: `Invalid backup schema: ${issue}` };
    }

    const validData = parseResult.data.data;
    const db = await getDatabase();

    await db.withTransactionAsync(async () => {
      // 1. Restore categories with safe defaults
      for (const cat of validData.categories) {
        await db.runAsync(
          `INSERT OR REPLACE INTO categories (id, name, emoji, icon_name, group_name, is_system, is_archived, sort_order, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            cat.id,
            cat.name,
            cat.emoji,
            cat.icon_name,
            cat.group_name,
            cat.is_system,
            cat.is_archived,
            cat.sort_order,
            cat.created_at,
            cat.updated_at,
          ]
        );
      }

      // 2. Restore expenses
      for (const exp of validData.expenses) {
        await db.runAsync(
          `INSERT OR REPLACE INTO expenses (id, amount_paise, category_id, expense_date, note, merchant, payment_method, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            exp.id,
            exp.amount_paise,
            exp.category_id,
            exp.expense_date,
            exp.note ?? null,
            exp.merchant ?? null,
            exp.payment_method ?? null,
            exp.created_at,
            exp.updated_at,
          ]
        );
      }

      // 3. Restore budgets
      for (const b of validData.budgets) {
        await db.runAsync(
          `INSERT OR REPLACE INTO monthly_budgets (id, year_month, amount_paise, category_id, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [b.id, b.year_month, b.amount_paise, b.category_id ?? null, b.created_at, b.updated_at]
        );
      }
    });

    appEvents.emit(EVENTS.EXPENSES_CHANGED);
    appEvents.emit(EVENTS.CATEGORIES_CHANGED);
    appEvents.emit(EVENTS.BUDGETS_CHANGED);

    return {
      success: true,
      message: `Restored ${validData.expenses.length} expenses and ${validData.categories.length} categories successfully!`,
    };
  } catch (error) {
    console.error('Error importing backup:', error);
    return { success: false, message: 'Failed to restore backup: ' + (error instanceof Error ? error.message : String(error)) };
  }
}
