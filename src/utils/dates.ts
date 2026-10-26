// ===== Date Utilities (Apple Principal QA: Defensive Date Safety) =====
import {
  format,
  parse,
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
  differenceInDays,
  isValid,
  isSameMonth,
  getDaysInMonth,
} from 'date-fns';

/** Today's date as YYYY-MM-DD local string */
export function todayDateString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/** Current year-month as YYYY-MM */
export function currentYearMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

/** Parse a YYYY-MM-DD string to a local Date with fallback */
export function parseDateString(dateStr: string): Date {
  if (!dateStr || typeof dateStr !== 'string') return new Date();
  try {
    const parsed = parse(dateStr, 'yyyy-MM-dd', new Date());
    return isValid(parsed) ? parsed : new Date();
  } catch {
    return new Date();
  }
}

/** Parse a YYYY-MM string to the first day of that month with fallback */
export function parseYearMonth(yearMonth: string): Date {
  if (!yearMonth || typeof yearMonth !== 'string') return new Date();
  try {
    const parsed = parse(yearMonth, 'yyyy-MM', new Date());
    return isValid(parsed) ? parsed : new Date();
  } catch {
    return new Date();
  }
}

/** Format date for display: "24 Oct 2026", safe against RangeError */
export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const date = parseDateString(dateStr);
  try {
    return isValid(date) ? format(date, 'd MMM yyyy') : dateStr;
  } catch {
    return dateStr;
  }
}

/** Format date for short display: "24 Oct" */
export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '';
  const date = parseDateString(dateStr);
  try {
    return isValid(date) ? format(date, 'd MMM') : dateStr;
  } catch {
    return dateStr;
  }
}

/** Format month for display: "October 2026" */
export function formatMonthDisplay(yearMonth: string): string {
  if (!yearMonth) return '';
  const date = parseYearMonth(yearMonth);
  try {
    return isValid(date) ? format(date, 'MMMM yyyy') : yearMonth;
  } catch {
    return yearMonth;
  }
}

/** Format month short: "Oct '26" */
export function formatMonthShort(yearMonth: string): string {
  if (!yearMonth) return '';
  const date = parseYearMonth(yearMonth);
  try {
    return isValid(date) ? format(date, "MMM ''yy") : yearMonth;
  } catch {
    return yearMonth;
  }
}

/** Format month for chart labels: "Oct" */
export function formatMonthLabel(yearMonth: string): string {
  if (!yearMonth) return '';
  const date = parseYearMonth(yearMonth);
  try {
    return isValid(date) ? format(date, 'MMM') : yearMonth;
  } catch {
    return yearMonth;
  }
}

/** Get previous month YYYY-MM */
export function previousMonth(yearMonth: string): string {
  const date = parseYearMonth(yearMonth);
  return format(subMonths(date, 1), 'yyyy-MM');
}

/** Get next month YYYY-MM */
export function nextMonth(yearMonth: string): string {
  const date = parseYearMonth(yearMonth);
  return format(addMonths(date, 1), 'yyyy-MM');
}

/** Get start date of month as YYYY-MM-DD */
export function monthStartDate(yearMonth: string): string {
  const date = parseYearMonth(yearMonth);
  return format(startOfMonth(date), 'yyyy-MM-dd');
}

/** Get end date of month as YYYY-MM-DD */
export function monthEndDate(yearMonth: string): string {
  const date = parseYearMonth(yearMonth);
  return format(endOfMonth(date), 'yyyy-MM-dd');
}

/** Get elapsed days in a month (up to today if current month) */
export function elapsedDaysInMonth(yearMonth: string): number {
  const monthDate = parseYearMonth(yearMonth);
  const today = new Date();

  if (isSameMonth(monthDate, today)) {
    return today.getDate();
  }

  // Past or future month: return total days
  return getDaysInMonth(monthDate);
}

/** Get total days in a month */
export function totalDaysInMonth(yearMonth: string): number {
  const date = parseYearMonth(yearMonth);
  return getDaysInMonth(date);
}

/** Get last N months as YYYY-MM strings (including current) */
export function getLastNMonths(n: number, fromMonth?: string): string[] {
  const count = Math.max(1, Math.min(n, 24)); // clamp between 1 and 24 months
  const start = fromMonth ? parseYearMonth(fromMonth) : new Date();
  const months: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    months.push(format(subMonths(start, i), 'yyyy-MM'));
  }
  return months;
}

/** Validate a YYYY-MM-DD date string */
export function isValidDateString(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  try {
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    return isValid(date) && format(date, 'yyyy-MM-dd') === dateStr;
  } catch {
    return false;
  }
}

/** Validate a YYYY-MM string */
export function isValidYearMonth(yearMonth: string): boolean {
  if (!yearMonth || typeof yearMonth !== 'string' || !/^\d{4}-\d{2}$/.test(yearMonth)) return false;
  try {
    const date = parse(yearMonth, 'yyyy-MM', new Date());
    return isValid(date) && format(date, 'yyyy-MM') === yearMonth;
  } catch {
    return false;
  }
}

/** Get relative day label: "Today", "Yesterday", or date */
export function getRelativeDayLabel(dateStr: string): string {
  if (!dateStr) return '';
  const today = todayDateString();
  if (dateStr === today) return 'Today';

  const todayDate = parseDateString(today);
  const date = parseDateString(dateStr);
  const diff = differenceInDays(todayDate, date);
  if (diff === 1) return 'Yesterday';

  return formatDateDisplay(dateStr);
}

/** Extract YYYY-MM from a YYYY-MM-DD date string */
export function dateToYearMonth(dateStr: string): string {
  if (!dateStr || typeof dateStr !== 'string') return currentYearMonth();
  return dateStr.substring(0, 7);
}

export const getCurrentYearMonth = currentYearMonth;
export const getPreviousMonth = previousMonth;
export const getNextMonth = nextMonth;
export const formatMonthYear = formatMonthDisplay;
export const formatDisplayDate = formatDateDisplay;
export const getRecentMonths = (n: number) => getLastNMonths(n);
