// ===== CSV Export Utility (Apple Principal QA Architecture) =====
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { getAllExpensesForExport } from '../db/expenseRepository';
import { paiseToRupees } from './currency';

function escapeCsvCell(cell: string | number | null | undefined): string {
  if (cell === null || cell === undefined) return '';
  const str = String(cell);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function exportExpensesToCsv(): Promise<boolean> {
  try {
    const expenses = await getAllExpensesForExport();

    const headers = [
      'Date',
      'Category Group',
      'Category Name',
      'Amount (INR)',
      'Merchant / Place',
      'Payment Method',
      'Note',
    ];

    const rows = expenses.map((e) => [
      escapeCsvCell(e.expenseDate),
      escapeCsvCell(e.category?.groupName ?? 'Other'),
      escapeCsvCell(e.category?.name ?? 'Expense'),
      escapeCsvCell(paiseToRupees(e.amountPaise).toFixed(2)),
      escapeCsvCell(e.merchant || ''),
      escapeCsvCell(e.paymentMethod || ''),
      escapeCsvCell(e.note || ''),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `expenses_${timestamp}.csv`;
    // Disk hygiene: Write to cache directory rather than permanent document directory
    const dir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
    const fileUri = `${dir}${filename}`;

    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Expenses CSV',
        UTI: 'public.comma-separated-values-text',
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error exporting expenses to CSV:', error);
    throw error;
  }
}
