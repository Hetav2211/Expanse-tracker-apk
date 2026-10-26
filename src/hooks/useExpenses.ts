// ===== useExpenses Hook (Apple Principal QA: Lifecycle & Race Condition Guards) =====
import { useState, useEffect, useCallback, useRef } from 'react';
import { ExpenseWithCategory, PaymentMethod } from '../types';
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseById,
} from '../db/expenseRepository';
import { appEvents, EVENTS } from '../utils/events';

export interface UseExpensesFilter {
  yearMonth?: string;
  categoryId?: string;
  paymentMethod?: PaymentMethod;
  searchQuery?: string;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
}

export function useExpenses(initialFilters: UseExpensesFilter = {}) {
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UseExpensesFilter>(initialFilters);

  // Concurrency & Task Cancellation guards (Section 1B)
  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchExpenses = useCallback(async (isRefresh = false) => {
    const currentRequestId = ++requestIdRef.current;

    try {
      if (!isMountedRef.current) return;
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await getExpenses({
        yearMonth: filters.yearMonth,
        categoryId: filters.categoryId,
        paymentMethod: filters.paymentMethod,
        searchQuery: filters.searchQuery,
        sortBy: filters.sortBy || 'date',
        sortOrder: filters.sortOrder || 'desc',
      });

      // Discard stale out-of-order async responses or unmounted component updates
      if (!isMountedRef.current || currentRequestId !== requestIdRef.current) {
        return;
      }

      setExpenses(data);
    } catch (err) {
      if (!isMountedRef.current || currentRequestId !== requestIdRef.current) return;
      console.error('Error fetching expenses:', err);
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
    } finally {
      if (isMountedRef.current && currentRequestId === requestIdRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Synchronized cache eviction & refresh on database changes
  useEffect(() => {
    const unsubscribe = appEvents.on(EVENTS.EXPENSES_CHANGED, () => {
      if (isMountedRef.current) {
        fetchExpenses();
      }
    });
    return unsubscribe;
  }, [fetchExpenses]);

  const addExpense = async (data: {
    amountPaise: number;
    categoryId: string;
    expenseDate: string;
    note?: string | null;
    merchant?: string | null;
    paymentMethod?: PaymentMethod | null;
  }) => {
    const id = await createExpense(data);
    appEvents.emit(EVENTS.EXPENSES_CHANGED);
    return id;
  };

  const editExpense = async (id: string, data: {
    amountPaise: number;
    categoryId: string;
    expenseDate: string;
    note?: string | null;
    merchant?: string | null;
    paymentMethod?: PaymentMethod | null;
  }) => {
    await updateExpense(id, data);
    appEvents.emit(EVENTS.EXPENSES_CHANGED);
  };

  const removeExpense = async (id: string) => {
    await deleteExpense(id);
    appEvents.emit(EVENTS.EXPENSES_CHANGED);
  };

  const updateFilters = (newFilters: Partial<UseExpensesFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    expenses,
    loading,
    refreshing,
    error,
    filters,
    refresh: () => fetchExpenses(true),
    addExpense,
    editExpense,
    removeExpense,
    updateFilters,
    getExpenseById,
  };
}
