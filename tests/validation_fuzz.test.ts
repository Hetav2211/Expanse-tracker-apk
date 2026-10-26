// ===== Tier 2 & Tier 4 QA Test Suite: Fuzzing & Adversarial Perimeter Testing =====
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  ExpenseInputSchema,
  CategoryInputSchema,
  BudgetInputSchema,
  BackupDatabaseRecordSchema,
  safeItemAt,
} from '../src/utils/validation';

describe('Property-Based Fuzzing & Adversarial Testing (Tier 2 & Tier 4)', () => {
  test('safeItemAt gracefully handles out-of-bounds, negative, and null inputs', () => {
    const list = ['Apple', 'Banana', 'Cherry'];
    assert.equal(safeItemAt(list, 0), 'Apple');
    assert.equal(safeItemAt(list, 2), 'Cherry');
    assert.equal(safeItemAt(list, -1), undefined);
    assert.equal(safeItemAt(list, 3), undefined);
    assert.equal(safeItemAt(list, 9999), undefined);
    assert.equal(safeItemAt(null, 0), undefined);
    assert.equal(safeItemAt(undefined, 0), undefined);
  });

  test('Fuzz testing: 1,000 random adversarial inputs to ExpenseInputSchema never crash', () => {
    const adversarialSeeds = [
      null,
      undefined,
      {},
      [],
      '',
      '   ',
      '0',
      -1,
      -999999,
      0,
      NaN,
      Infinity,
      -Infinity,
      Number.MAX_SAFE_INTEGER,
      '👨‍👩‍👧‍👦',
      'مرحبا بالعالم', // RTL Arabic
      'a'.repeat(1000), // 1,000 character unbroken string
      "'; DROP TABLE expenses; --", // SQL injection string
      '{"hack": true}',
      '<script>alert("xss")</script>',
    ];

    for (let i = 0; i < 1000; i++) {
      const randomSeed = adversarialSeeds[i % adversarialSeeds.length];
      const payload = {
        amountPaise: i % 2 === 0 ? randomSeed : Math.floor(Math.random() * 100000) - 500,
        categoryId: i % 3 === 0 ? randomSeed : `cat_${i}`,
        expenseDate: i % 4 === 0 ? randomSeed : '2026-10-26',
        note: i % 5 === 0 ? randomSeed : `Note ${i}`,
        merchant: i % 6 === 0 ? randomSeed : `Merchant ${i}`,
        paymentMethod: i % 7 === 0 ? randomSeed : 'upi',
      };

      // The schema must either parse cleanly or return a safe ZodError — NEVER throw unhandled runtime exceptions
      assert.doesNotThrow(() => {
        ExpenseInputSchema.safeParse(payload);
      });
    }
  });

  test('CategoryInputSchema handles unicode, emojis, and trim transformations cleanly', () => {
    const valid = CategoryInputSchema.parse({
      name: '  Coffee & Snacks  ',
      emoji: '☕',
      groupName: ' Food ',
    });

    assert.equal(valid.name, 'Coffee & Snacks');
    assert.equal(valid.emoji, '☕');
    assert.equal(valid.groupName, 'Food');

    // Fuzz 200 adversarial category inputs
    for (let i = 0; i < 200; i++) {
      assert.doesNotThrow(() => {
        CategoryInputSchema.safeParse({
          name: i % 2 === 0 ? '' : 'Valid Category',
          emoji: i % 3 === 0 ? '👨‍👩‍👧‍👦' : '📦',
        });
      });
    }
  });

  test('BackupDatabaseRecordSchema detects corrupted JSON backups and provides safe fallbacks', () => {
    // Malformed payloads
    const corruptedPayloads = [
      null,
      {},
      { data: null },
      { data: { expenses: 'not-an-array' } },
      { data: { expenses: [{ amount_paise: -500 }] } }, // negative amount
      { data: { categories: [{ id: 123 }] } }, // number id instead of string
    ];

    for (const corrupted of corruptedPayloads) {
      const res = BackupDatabaseRecordSchema.safeParse(corrupted);
      assert.equal(res.success, false, `Should have rejected corrupted payload`);
    }

    // Valid backup payload
    const validPayload = {
      version: 1,
      appName: 'Personal Expense Tracker',
      exportedAt: '2026-10-26T22:00:00.000Z',
      data: {
        categories: [
          {
            id: 'cat_food',
            name: 'Food',
            emoji: '🍔',
            icon_name: 'utensils',
            group_name: 'Daily',
            is_system: 1,
            is_archived: 0,
            sort_order: 1,
          },
        ],
        expenses: [
          {
            id: 'exp_1',
            amount_paise: 25000,
            category_id: 'cat_food',
            expense_date: '2026-10-26',
            merchant: 'Swiggy',
            payment_method: 'upi',
          },
        ],
        budgets: [
          {
            id: 'b_1',
            year_month: '2026-10',
            amount_paise: 500000,
          },
        ],
      },
    };

    const validResult = BackupDatabaseRecordSchema.safeParse(validPayload);
    assert.equal(validResult.success, true);
    if (validResult.success) {
      assert.equal(validResult.data.data.expenses.length, 1);
      assert.equal(validResult.data.data.expenses[0].amount_paise, 25000);
      assert.equal(validResult.data.data.categories[0].name, 'Food');
    }
  });
});
