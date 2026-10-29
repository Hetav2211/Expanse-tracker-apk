// ===== Tier 1 QA Test Suite: Currency Formatting & Math Verification =====
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  rupeesToPaise,
  paiseToRupees,
  parseRupeesToPaise,
  formatINR,
  formatINRShort,
  paiseToInputString,
} from '../src/utils/currency';

describe('Currency Logic & Boundary Value Analysis (Tier 1)', () => {
  test('rupeesToPaise handles standard and floating-point fractional values correctly', () => {
    assert.equal(rupeesToPaise(100), 10000);
    assert.equal(rupeesToPaise(0.5), 50);
    assert.equal(rupeesToPaise(1250.55), 125055);
    // Floating point rounding edge
    assert.equal(rupeesToPaise(19.99), 1999);
  });

  test('rupeesToPaise handles boundary and invalid values safely', () => {
    assert.equal(rupeesToPaise(0), 0);
    assert.equal(rupeesToPaise(-50), 0);
    assert.equal(rupeesToPaise(NaN), 0);
    assert.equal(rupeesToPaise(Infinity), 0);
    assert.equal(rupeesToPaise(-Infinity), 0);
  });

  test('paiseToRupees converts accurately without mutation', () => {
    assert.equal(paiseToRupees(10000), 100);
    assert.equal(paiseToRupees(50), 0.5);
    assert.equal(paiseToRupees(0), 0);
    assert.equal(paiseToRupees(NaN), 0);
  });

  test('parseRupeesToPaise parses standard user inputs', () => {
    assert.equal(parseRupeesToPaise('100'), 10000);
    assert.equal(parseRupeesToPaise('1250.50'), 125050);
    assert.equal(parseRupeesToPaise('₹1,250.50'), 125050);
    assert.equal(parseRupeesToPaise('  500  '), 50000);
    assert.equal(parseRupeesToPaise('₹ 10,00,000'), 100000000);
  });

  test('parseRupeesToPaise rejects invalid, empty, or negative inputs with null', () => {
    assert.equal(parseRupeesToPaise(''), null);
    assert.equal(parseRupeesToPaise('.'), null);
    assert.equal(parseRupeesToPaise('0'), null);
    assert.equal(parseRupeesToPaise('-50'), null);
    assert.equal(parseRupeesToPaise('abc'), null);
    assert.equal(parseRupeesToPaise('₹0.00'), null);
    assert.equal(parseRupeesToPaise(null as any), null);
    assert.equal(parseRupeesToPaise(undefined as any), null);
    // Ceiling overflow check (> 100 crore)
    assert.equal(parseRupeesToPaise('1000000000000'), null);
  });

  test('formatINR formats currency with ₹ and Indian numbering system', () => {
    const formatted = formatINR(12550000, true);
    // Should include ₹ and comma separation
    assert.match(formatted, /₹/);
    assert.match(formatted, /1.*25.*500/);

    // Zero paise
    assert.equal(formatINR(0, false), '₹0');

    // NaN / Infinity safe fallback
    assert.equal(formatINR(NaN, true), '₹0.00');
    assert.equal(formatINR(Infinity, false), '₹0');
  });

  test('formatINRShort formats compact labels correctly', () => {
    assert.equal(formatINRShort(0), '₹0');
    assert.equal(formatINRShort(50000), '₹500'); // 500 rupees
    assert.equal(formatINRShort(150000), '₹1.5K'); // 1,500 rupees
    assert.equal(formatINRShort(15000000), '₹1.5L'); // 1.5 Lakh rupees
    assert.equal(formatINRShort(1500000000), '₹1.5Cr'); // 1.5 Crore rupees
    assert.equal(formatINRShort(NaN), '₹0');
    assert.equal(formatINRShort(-100), '₹0');
  });

  test('paiseToInputString formats clean numeric strings for inputs', () => {
    assert.equal(paiseToInputString(10000), '100');
    assert.equal(paiseToInputString(12550), '125.50');
    assert.equal(paiseToInputString(0), '');
    assert.equal(paiseToInputString(NaN), '');
  });

  test('cleanAmountInput sanitizes single-digit, decimal, and regional inputs safely without vanishing', () => {
    const { cleanAmountInput } = require('../src/utils/currency');
    // Single digit entry (User reported bug fix)
    assert.equal(cleanAmountInput('1'), '1');
    assert.equal(cleanAmountInput('5'), '5');
    assert.equal(cleanAmountInput('0'), '0');

    // Multi-digit & decimals
    assert.equal(cleanAmountInput('50'), '50');
    assert.equal(cleanAmountInput('500.50'), '500.50');
    assert.equal(cleanAmountInput('12,50'), '12.50'); // Comma keypad
    assert.equal(cleanAmountInput('1,250.50'), '1250.50'); // Thousands + decimal
    assert.equal(cleanAmountInput('100.555'), '100.55'); // 2 decimal limit
    assert.equal(cleanAmountInput('100..5'), '100.5'); // Multiple dots guard

    // Regional numerals (Devanagari, Gujarati)
    assert.equal(cleanAmountInput('५'), '5');
    assert.equal(cleanAmountInput('૫૦૦'), '500');
    assert.equal(cleanAmountInput('१२५.५०'), '125.50');

    // Empty or non-numeric
    assert.equal(cleanAmountInput(''), '');
    assert.equal(cleanAmountInput('abc'), '');
  });
});
