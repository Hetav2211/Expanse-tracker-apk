// ===== Tier 1 QA Test Suite: Date Math & Boundaries Verification =====
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  todayDateString,
  currentYearMonth,
  isValidDateString,
  isValidYearMonth,
  formatDateDisplay,
  formatDateShort,
  formatMonthDisplay,
  formatMonthLabel,
  previousMonth,
  nextMonth,
  monthStartDate,
  monthEndDate,
  totalDaysInMonth,
  getLastNMonths,
  dateToYearMonth,
} from '../src/utils/dates';

describe('Date Utilities & Leap Year Boundaries (Tier 1)', () => {
  test('todayDateString and currentYearMonth match ISO pattern', () => {
    assert.match(todayDateString(), /^\d{4}-\d{2}-\d{2}$/);
    assert.match(currentYearMonth(), /^\d{4}-\d{2}$/);
  });

  test('isValidDateString validates real calendar dates and detects leap year boundaries', () => {
    assert.equal(isValidDateString('2026-10-26'), true);
    assert.equal(isValidDateString('2024-02-29'), true); // 2024 is leap year
    assert.equal(isValidDateString('2025-02-29'), false); // 2025 is not leap year
    assert.equal(isValidDateString('2026-04-31'), false); // April has 30 days
    assert.equal(isValidDateString('2026-13-01'), false); // Invalid month 13
    assert.equal(isValidDateString(''), false);
    assert.equal(isValidDateString('invalid-date'), false);
    assert.equal(isValidDateString(null as any), false);
  });

  test('isValidYearMonth validates YYYY-MM accurately', () => {
    assert.equal(isValidYearMonth('2026-10'), true);
    assert.equal(isValidYearMonth('2026-01'), true);
    assert.equal(isValidYearMonth('2026-13'), false);
    assert.equal(isValidYearMonth('2026'), false);
    assert.equal(isValidYearMonth(''), false);
  });

  test('formatDateDisplay never throws RangeError on invalid strings', () => {
    assert.equal(formatDateDisplay('2026-10-26'), '26 Oct 2026');
    assert.equal(formatDateDisplay(''), '');
    assert.doesNotThrow(() => formatDateDisplay('malformed-string'));
    assert.doesNotThrow(() => formatDateDisplay(null as any));
  });

  test('formatMonthDisplay formats month and year accurately', () => {
    assert.equal(formatMonthDisplay('2026-10'), 'October 2026');
    assert.equal(formatMonthDisplay('2026-01'), 'January 2026');
    assert.doesNotThrow(() => formatMonthDisplay(''));
  });

  test('previousMonth and nextMonth handle year boundary rollovers seamlessly', () => {
    // January -> December rollover
    assert.equal(previousMonth('2026-01'), '2025-12');
    // December -> January rollover
    assert.equal(nextMonth('2025-12'), '2026-01');
    // Standard transition
    assert.equal(previousMonth('2026-10'), '2026-09');
    assert.equal(nextMonth('2026-10'), '2026-11');
  });

  test('monthStartDate and monthEndDate compute accurate days', () => {
    assert.equal(monthStartDate('2026-02'), '2026-02-01');
    assert.equal(monthEndDate('2026-02'), '2026-02-28');
    assert.equal(monthEndDate('2024-02'), '2024-02-29'); // Leap year
    assert.equal(monthEndDate('2026-10'), '2026-10-31');
  });

  test('totalDaysInMonth returns exact days', () => {
    assert.equal(totalDaysInMonth('2026-02'), 28);
    assert.equal(totalDaysInMonth('2024-02'), 29); // Leap year
    assert.equal(totalDaysInMonth('2026-04'), 30);
    assert.equal(totalDaysInMonth('2026-10'), 31);
  });

  test('getLastNMonths produces chronological sequence including bounds', () => {
    const list = getLastNMonths(6, '2026-10');
    assert.equal(list.length, 6);
    assert.equal(list[0], '2026-05');
    assert.equal(list[5], '2026-10');
  });

  test('dateToYearMonth extracts clean substring with fallback', () => {
    assert.equal(dateToYearMonth('2026-10-26'), '2026-10');
    assert.match(dateToYearMonth(''), /^\d{4}-\d{2}$/);
  });
});
