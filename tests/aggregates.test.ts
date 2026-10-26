// ===== Tier 1 QA Test Suite: Aggregation Math Verification =====
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  averageDailySpend,
  monthChangePercent,
  calculateMonthOverMonthChange,
  rankCategoryTotals,
  fillMonthlyTotals,
} from '../src/utils/aggregates';

describe('Aggregation Pure Math & Zero-Division Safety (Tier 1)', () => {
  test('averageDailySpend handles standard calculation correctly', () => {
    assert.equal(averageDailySpend(310000, 31), 10000);
    assert.equal(averageDailySpend(10050, 10), 1005);
  });

  test('averageDailySpend guards against zero division, negative days, and NaN', () => {
    assert.equal(averageDailySpend(310000, 0), 0);
    assert.equal(averageDailySpend(310000, -5), 0);
    assert.equal(averageDailySpend(0, 31), 0);
    assert.equal(averageDailySpend(NaN, 31), 0);
    assert.equal(averageDailySpend(310000, NaN), 0);
    assert.equal(averageDailySpend(Infinity, 31), 0);
  });

  test('monthChangePercent calculates percentage accurately', () => {
    // Current 200, Previous 100 -> +100%
    assert.equal(monthChangePercent(20000, 10000), 100);
    // Current 50, Previous 100 -> -50%
    assert.equal(monthChangePercent(5000, 10000), -50);
    // Equal spending -> 0%
    assert.equal(monthChangePercent(10000, 10000), 0);
  });

  test('monthChangePercent returns null when previous month was zero or negative', () => {
    assert.equal(monthChangePercent(5000, 0), null);
    assert.equal(monthChangePercent(5000, -100), null);
    assert.equal(monthChangePercent(5000, NaN), null);
  });

  test('calculateMonthOverMonthChange returns both percentage and absolute difference', () => {
    const res = calculateMonthOverMonthChange(15000, 10000);
    assert.equal(res.percentageChange, 50);
    assert.equal(res.differencePaise, 5000);
  });

  test('rankCategoryTotals sorts descending and computes percentages safely', () => {
    const input = [
      {
        categoryId: 'cat_food',
        totalPaise: 4000,
        transactionCount: 2,
        category: {
          id: 'cat_food',
          name: 'Food',
          emoji: '🍔',
          iconName: 'utensils',
          groupName: 'Daily',
          isSystem: true,
          isArchived: false,
          sortOrder: 1,
          createdAt: '',
          updatedAt: '',
        },
      },
      {
        categoryId: 'cat_rent',
        totalPaise: 6000,
        transactionCount: 1,
        category: {
          id: 'cat_rent',
          name: 'Rent',
          emoji: '🏠',
          iconName: 'home',
          groupName: 'Housing',
          isSystem: true,
          isArchived: false,
          sortOrder: 2,
          createdAt: '',
          updatedAt: '',
        },
      },
    ];

    const ranked = rankCategoryTotals(input, 10000);
    assert.equal(ranked[0].categoryId, 'cat_rent');
    assert.equal(ranked[0].percentage, 60);
    assert.equal(ranked[1].categoryId, 'cat_food');
    assert.equal(ranked[1].percentage, 40);

    // Empty array and zero overall total
    assert.deepEqual(rankCategoryTotals([], 10000), []);
    const zeroRanked = rankCategoryTotals(input, 0);
    assert.equal(zeroRanked[0].percentage, 0);
  });

  test('fillMonthlyTotals fills missing gaps with zero paise and counts', () => {
    const months = ['2026-08', '2026-09', '2026-10'];
    const data = [
      { yearMonth: '2026-09', totalPaise: 50000, transactionCount: 3 },
    ];

    const filled = fillMonthlyTotals(months, data);
    assert.equal(filled.length, 3);
    assert.equal(filled[0].yearMonth, '2026-08');
    assert.equal(filled[0].totalPaise, 0);
    assert.equal(filled[1].yearMonth, '2026-09');
    assert.equal(filled[1].totalPaise, 50000);
    assert.equal(filled[2].yearMonth, '2026-10');
    assert.equal(filled[2].totalPaise, 0);
  });
});
