// ===== Aggregation Utilities (Apple Principal QA: Defensive Math & Boundaries) =====
import { CategoryTotal, MonthlyTotal } from '../types';
import { elapsedDaysInMonth } from './dates';

/**
 * Calculate average daily spend for a month with extreme boundary safety (Tier 1).
 * Guards against NaN, negative days, infinity, and zero division.
 */
export function averageDailySpend(totalPaise: number, days: number): number {
  if (!Number.isFinite(totalPaise) || !Number.isFinite(days) || days <= 0 || totalPaise <= 0) {
    return 0;
  }
  return Math.round(totalPaise / days);
}

export function calculateDailyAverage(totalPaise: number, yearMonth: string): number {
  const days = elapsedDaysInMonth(yearMonth);
  return averageDailySpend(totalPaise, days);
}

/**
 * Calculate month-over-month change percentage.
 * Returns null when the previous month had zero or invalid spending.
 */
export function monthChangePercent(
  currentPaise: number,
  previousPaise: number
): number | null {
  if (!Number.isFinite(currentPaise) || !Number.isFinite(previousPaise) || previousPaise <= 0) {
    return null;
  }
  return ((currentPaise - previousPaise) / previousPaise) * 100;
}

export function calculateMonthOverMonthChange(
  currentPaise: number,
  previousPaise: number
): { percentageChange: number | null; differencePaise: number } {
  const safeCurrent = Number.isFinite(currentPaise) ? currentPaise : 0;
  const safePrevious = Number.isFinite(previousPaise) ? previousPaise : 0;

  return {
    percentageChange: monthChangePercent(safeCurrent, safePrevious),
    differencePaise: safeCurrent - safePrevious,
  };
}

/**
 * Sort category totals by amount (highest first) and compute percentages safely.
 */
export function rankCategoryTotals(
  totals: Omit<CategoryTotal, 'percentage'>[],
  overallTotalPaise: number
): CategoryTotal[] {
  if (!Array.isArray(totals)) return [];
  const safeTotal = Number.isFinite(overallTotalPaise) && overallTotalPaise > 0 ? overallTotalPaise : 0;

  return totals
    .map((t) => ({
      ...t,
      percentage: safeTotal > 0 ? ((t.totalPaise || 0) / safeTotal) * 100 : 0,
    }))
    .sort((a, b) => b.totalPaise - a.totalPaise);
}

/**
 * Fill in missing months with zero values for chart display.
 */
export function fillMonthlyTotals(
  months: string[],
  data: MonthlyTotal[]
): MonthlyTotal[] {
  if (!Array.isArray(months)) return [];
  const safeData = Array.isArray(data) ? data : [];
  const dataMap = new Map(safeData.map((d) => [d.yearMonth, d]));

  return months.map((month) => {
    const existing = dataMap.get(month);
    return existing ?? {
      yearMonth: month,
      totalPaise: 0,
      transactionCount: 0,
    };
  });
}
