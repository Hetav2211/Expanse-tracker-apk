// ===== useBudgets Hook (Apple Principal QA: Lifecycle & Race Condition Guards) =====
import { useState, useEffect, useCallback, useRef } from 'react';
import { BudgetStatus, MonthlyBudget } from '../types';
import {
  getBudgetsForMonth,
  getOverallBudget,
  setCategoryBudget,
  deleteBudget,
  getBudgetStatuses,
} from '../db/budgetRepository';
import { appEvents, EVENTS } from '../utils/events';
import { getCurrentYearMonth } from '../utils/dates';

export function useBudgets(yearMonth: string = getCurrentYearMonth()) {
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([]);
  const [statuses, setStatuses] = useState<BudgetStatus[]>([]);
  const [overallStatus, setOverallStatus] = useState<BudgetStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // Concurrency & Lifecycle Guards
  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchBudgets = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;

    try {
      if (!isMountedRef.current) return;
      setLoading(true);

      const [allBudgets, allStatuses] = await Promise.all([
        getBudgetsForMonth(yearMonth),
        getBudgetStatuses(yearMonth),
      ]);

      if (!isMountedRef.current || currentRequestId !== requestIdRef.current) {
        return;
      }

      setBudgets(allBudgets);
      setStatuses(allStatuses);

      const overall = allStatuses.find((s) => s.budget.categoryId === null) || null;
      setOverallStatus(overall);
    } catch (error) {
      if (!isMountedRef.current || currentRequestId !== requestIdRef.current) return;
      console.error('Error fetching budgets:', error);
    } finally {
      if (isMountedRef.current && currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [yearMonth]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  // Re-fetch when budgets or expenses change
  useEffect(() => {
    const handleUpdate = () => {
      if (isMountedRef.current) {
        fetchBudgets();
      }
    };

    const unsubBudgets = appEvents.on(EVENTS.BUDGETS_CHANGED, handleUpdate);
    const unsubExpenses = appEvents.on(EVENTS.EXPENSES_CHANGED, handleUpdate);
    return () => {
      unsubBudgets();
      unsubExpenses();
    };
  }, [fetchBudgets]);

  const saveBudget = async (categoryId: string | null, amountPaise: number) => {
    await setCategoryBudget(yearMonth, categoryId, amountPaise);
    appEvents.emit(EVENTS.BUDGETS_CHANGED);
  };

  const removeBudget = async (id: string) => {
    await deleteBudget(id);
    appEvents.emit(EVENTS.BUDGETS_CHANGED);
  };

  return {
    budgets,
    statuses,
    overallStatus,
    categoryStatuses: statuses.filter((s) => s.budget.categoryId !== null),
    loading,
    refresh: fetchBudgets,
    saveBudget,
    removeBudget,
  };
}
