// ===== useCategories Hook (Apple Principal QA: Lifecycle & Race Condition Guards) =====
import { useState, useEffect, useCallback, useRef } from 'react';
import { Category, CategoryGroup } from '../types';
import {
  getAllCategories,
  getCategoriesGrouped,
  createCategory,
  updateCategory,
  archiveCategory,
  restoreCategory,
} from '../db/categoryRepository';
import { appEvents, EVENTS } from '../utils/events';

export function useCategories(includeArchived = false) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [groupedCategories, setGroupedCategories] = useState<CategoryGroup[]>([]);
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

  const fetchCategories = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;

    try {
      if (!isMountedRef.current) return;
      setLoading(true);

      const [all, grouped] = await Promise.all([
        getAllCategories(includeArchived),
        getCategoriesGrouped(includeArchived),
      ]);

      if (!isMountedRef.current || currentRequestId !== requestIdRef.current) {
        return;
      }

      setCategories(all);
      setGroupedCategories(grouped);
    } catch (error) {
      if (!isMountedRef.current || currentRequestId !== requestIdRef.current) return;
      console.error('Error fetching categories:', error);
    } finally {
      if (isMountedRef.current && currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [includeArchived]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const unsubscribe = appEvents.on(EVENTS.CATEGORIES_CHANGED, () => {
      if (isMountedRef.current) {
        fetchCategories();
      }
    });
    return unsubscribe;
  }, [fetchCategories]);

  const addCategory = async (data: {
    name: string;
    emoji: string;
    iconName: string;
    groupName: string;
  }) => {
    const id = await createCategory(data);
    appEvents.emit(EVENTS.CATEGORIES_CHANGED);
    return id;
  };

  const editCategory = async (id: string, data: {
    name?: string;
    emoji?: string;
    iconName?: string;
    groupName?: string;
  }) => {
    await updateCategory(id, data);
    appEvents.emit(EVENTS.CATEGORIES_CHANGED);
  };

  const archive = async (id: string) => {
    await archiveCategory(id);
    appEvents.emit(EVENTS.CATEGORIES_CHANGED);
  };

  const restore = async (id: string) => {
    await restoreCategory(id);
    appEvents.emit(EVENTS.CATEGORIES_CHANGED);
  };

  return {
    categories,
    groupedCategories,
    loading,
    refresh: fetchCategories,
    addCategory,
    editCategory,
    archiveCategory: archive,
    restoreCategory: restore,
  };
}
