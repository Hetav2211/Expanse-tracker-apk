// ===== INR Currency Formatting Utilities (Apple Principal QA Architecture) =====
// All monetary values are stored as integer paise (1 INR = 100 paise)

/**
 * Convert rupees (as number) to paise (integer).
 * Rounds to nearest paise to avoid floating-point issues.
 * Guards against NaN, infinity, and negative numbers.
 */
export function rupeesToPaise(rupees: number): number {
  if (!Number.isFinite(rupees) || rupees <= 0) return 0;
  return Math.round(rupees * 100);
}

/**
 * Convert a user-entered string (e.g. "1250.50") to paise.
 * Returns null if the input is invalid or non-positive.
 */
export function parseRupeesToPaise(input: string | null | undefined): number | null {
  if (!input || typeof input !== 'string') return null;
  const cleaned = input.replace(/[₹,\s]/g, '');
  if (cleaned === '' || cleaned === '.') return null;
  const num = parseFloat(cleaned);
  if (!Number.isFinite(num) || isNaN(num) || num <= 0) return null;
  if (num > 99_99_99_999) return null; // ~100 crore max ceiling
  return rupeesToPaise(num);
}

/**
 * Convert paise to rupees (number).
 */
export function paiseToRupees(paise: number): number {
  if (!Number.isFinite(paise) || isNaN(paise)) return 0;
  return paise / 100;
}

/**
 * Format number with Indian grouping without currency symbol.
 */
function formatIndianNumber(num: number, showDecimals: boolean): string {
  const safeNum = Math.max(0, num);
  const parts = showDecimals ? safeNum.toFixed(2).split('.') : Math.round(safeNum).toString().split('.');
  const intPart = parts[0];
  const decPart = parts[1];

  // Indian grouping: first 3 digits from right, then groups of 2
  const lastThree = intPart.slice(-3);
  const remaining = intPart.slice(0, -3);

  let formatted = lastThree;
  if (remaining.length > 0) {
    formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  return decPart ? `${formatted}.${decPart}` : formatted;
}

/**
 * Format paise as INR string with ₹ symbol and Indian grouping.
 * e.g. 12550000 → "₹1,25,500.00"
 */
export function formatINR(paise: number, showDecimals: boolean = true): string {
  if (!Number.isFinite(paise) || isNaN(paise)) {
    return showDecimals ? '₹0.00' : '₹0';
  }

  const rupees = paiseToRupees(paise);

  try {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(rupees);
    return formatted;
  } catch {
    // Fallback formatting for environments without full ICU
    return `₹${formatIndianNumber(rupees, showDecimals)}`;
  }
}

/**
 * Format paise as short INR (e.g. "₹1.25L", "₹50K").
 */
export function formatINRShort(paise: number): string {
  if (!Number.isFinite(paise) || isNaN(paise) || paise <= 0) {
    return '₹0';
  }

  const rupees = paiseToRupees(paise);

  if (rupees >= 1_00_00_000) {
    return `₹${(rupees / 1_00_00_000).toFixed(1)}Cr`;
  }
  if (rupees >= 1_00_000) {
    return `₹${(rupees / 1_00_000).toFixed(1)}L`;
  }
  if (rupees >= 1_000) {
    return `₹${(rupees / 1_000).toFixed(1)}K`;
  }
  return formatINR(paise, false);
}

/**
 * Format paise as plain rupees string (for input fields).
 * e.g. 12550 → "125.50", 10000 → "100"
 */
export function paiseToInputString(paise: number): string {
  if (!Number.isFinite(paise) || isNaN(paise) || paise <= 0) return '';
  const rupees = paiseToRupees(paise);
  if (rupees % 1 === 0) return rupees.toString();
  return rupees.toFixed(2);
}

export const formatRupees = formatINR;
export const formatRupeesCompact = formatINRShort;
