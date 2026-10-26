// ===== useDashboard Hook (Apple Principal QA: Lifecycle & Race Condition Guards) =====
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CategoryTotal,
  DashboardSummary,
  ExpenseWithCategory,
  MonthlyTrend,
  BudgetStatus,
} from '../types';
import {
  getExpenses,
  getMonthlyTotal,
  getMonthlyTotals,
  getCategoryTotals,
} from '../db/expenseRepository';
import { getBudgetStatuses } from '../db/budgetRepository';
import {
  calculateDailyAverage,
  calculateMonthOverMonthChange,
} from '../utils/aggregates';
import {
  getCurrentYearMonth,
  getPreviousMonth,
  getRecentMonths,
  formatMonthYear,
} from '../utils/dates';
import { appEvents, EVENTS } from '../utils/events';

export function useDashboard(yearMonth: string = getCurrentYearMonth(), trendMonthsCount: 3 | 6 | 12 = 6) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trends, setTrends] = useState<MonthlyTrend[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [overallBudgetStatus, setOverallBudgetStatus] = useState<BudgetStatus | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<ExpenseWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Concurrency & Lifecycle Guards
  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    const currentRequestId = ++requestIdRef.current;

    try {
      if (!isMountedRef.current) return;
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const prevMonth = getPreviousMonth(yearMonth);
      const monthsList = getRecentMonths(trendMonthsCount);

      // Fetch all required data in parallel
      const [
        currentMonthStats,
        prevMonthStats,
        monthlyTotalsData,
        catTotalsData,
        budgetStatusesData,
        recentExpensesData,
      ] = await Promise.all([
        getMonthlyTotal(yearMonth),
        getMonthlyTotal(prevMonth),
        getMonthlyTotals(monthsList),
        getCategoryTotals(yearMonth),
        getBudgetStatuses(yearMonth),
        getExpenses({ limit: 5, sortBy: 'date', sortOrder: 'desc' }),
      ]);

      // Guard against stale out-of-order execution or unmounted view
      if (!isMountedRef.current || currentRequestId !== requestIdRef.current) {
        return;
      }

      // Daily average
      const dailyAveragePaise = calculateDailyAverage(currentMonthStats.totalPaise, yearMonth);

      // Month-over-month comparison
      const momChange = calculateMonthOverMonthChange(
        currentMonthStats.totalPaise,
        prevMonthStats.totalPaise
      );

      // Top category
      const topCat = catTotalsData.length > 0 ? catTotalsData[0] : null;

      // Overall budget
      const overall = budgetStatusesData.find((b) => b.budget.categoryId === null) || null;
      setOverallBudgetStatus(overall);

      // Formatted summary
      const dashboardSummary: DashboardSummary = {
        totalPaise: currentMonthStats.totalPaise,
        transactionCount: currentMonthStats.transactionCount,
        dailyAveragePaise,
        topCategory: topCat
          ? {
              categoryId: topCat.categoryId,
              categoryName: topCat.category.name,
              categoryEmoji: topCat.category.emoji,
              totalPaise: topCat.totalPaise,
            }
          : null,
        monthOverMonthChangePercent: momChange.percentageChange,
        previousMonthTotalPaise: prevMonthStats.totalPaise,
      };

      setSummary(dashboardSummary);

      // Category totals with percentages
      const overallTotal = currentMonthStats.totalPaise;
      const formattedCatTotals: CategoryTotal[] = catTotalsData.map((c) => ({
        ...c,
        percentage: overallTotal > 0 ? (c.totalPaise / overallTotal) * 100 : 0,
      }));
      setCategoryTotals(formattedCatTotals);

      // Historical trends aligned with monthsList
      const totalMap = new Map(monthlyTotalsData.map((d) => [d.yearMonth, d.totalPaise]));
      const formattedTrends: MonthlyTrend[] = monthsList.map((m) => ({
        yearMonth: m,
        monthLabel: formatMonthYear(m),
        totalPaise: totalMap.get(m) ?? 0,
      }));
      setTrends(formattedTrends);

      setRecentExpenses(recentExpensesData);
    } catch (err) {
      if (!isMountedRef.current || currentRequestId !== requestIdRef.current) return;
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      if (isMountedRef.current && currentRequestId === requestIdRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [yearMonth, trendMonthsCount]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Synchronized updates
  useEffect(() => {
    const handleUpdate = () => {
      if (isMountedRef.current) {
        fetchDashboardData();
      }
    };

    const unsubExpenses = appEvents.on(EVENTS.EXPENSES_CHANGED, handleUpdate);
    const unsubCategories = appEvents.on(EVENTS.CATEGORIES_CHANGED, handleUpdate);
    const unsubBudgets = appEvents.on(EVENTS.BUDGETS_CHANGED, handleUpdate);

    return () => {
      unsubExpenses();
      unsubCategories();
      unsubBudgets();
    };
  }, [fetchDashboardData]);

  return {
    summary,
    trends,
    categoryTotals,
    overallBudgetStatus,
    recentExpenses,
    loading,
    refreshing,
    error,
    refresh: () => fetchDashboardData(true),
  };
}
