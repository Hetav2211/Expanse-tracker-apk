// ===== Apple HIG Transactions Screen =====
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Plus, ArrowUpDown, X } from 'lucide-react-native';
import { useTheme } from '../../src/theme';
import { useExpenses } from '../../src/hooks/useExpenses';
import { useCategories } from '../../src/hooks/useCategories';
import { formatINR } from '../../src/utils/currency';
import { getRelativeDayLabel, getCurrentYearMonth } from '../../src/utils/dates';
import { MonthSelector } from '../../src/components/MonthSelector';
import { Input } from '../../src/components/Input';
import { EmptyState } from '../../src/components/EmptyState';
import { Card } from '../../src/components/Card';
import { ExpenseWithCategory, PaymentMethod } from '../../src/types';
import { triggerLightImpact, triggerSelection } from '../../src/utils/haptics';

export default function TransactionsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, borderRadius: br, typography, isDark } = theme;

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentYearMonth());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const { categories } = useCategories();

  const { expenses, loading, refreshing, refresh } = useExpenses({
    yearMonth: selectedMonth,
    categoryId: selectedCategory,
    paymentMethod: selectedPaymentMethod,
    searchQuery: searchQuery.trim().length > 0 ? searchQuery.trim() : undefined,
    sortBy,
    sortOrder,
  });

  // Group transactions by date
  const groupedExpenses = useMemo(() => {
    const groups: { date: string; displayLabel: string; totalPaise: number; items: ExpenseWithCategory[] }[] = [];
    const map = new Map<string, { totalPaise: number; items: ExpenseWithCategory[] }>();

    for (const exp of expenses) {
      const existing = map.get(exp.expenseDate);
      if (existing) {
        existing.totalPaise += exp.amountPaise;
        existing.items.push(exp);
      } else {
        map.set(exp.expenseDate, {
          totalPaise: exp.amountPaise,
          items: [exp],
        });
      }
    }

    map.forEach((val, date) => {
      groups.push({
        date,
        displayLabel: getRelativeDayLabel(date),
        totalPaise: val.totalPaise,
        items: val.items,
      });
    });

    return groups;
  }, [expenses]);

  const toggleSort = () => {
    triggerLightImpact();
    if (sortBy === 'date' && sortOrder === 'desc') {
      setSortBy('amount');
      setSortOrder('desc');
    } else if (sortBy === 'amount' && sortOrder === 'desc') {
      setSortBy('amount');
      setSortOrder('asc');
    } else {
      setSortBy('date');
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    triggerLightImpact();
    setSearchQuery('');
    setSelectedCategory(undefined);
    setSelectedPaymentMethod(undefined);
  };

  const hasActiveFilters = Boolean(searchQuery || selectedCategory || selectedPaymentMethod);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Apple Large Title Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.md }]}>
        <View>
          <Text style={[typography.caption2, { color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase' }]}>
            History
          </Text>
          <Text style={[typography.title1, { color: colors.textPrimary }]}>
            Transactions
          </Text>
        </View>

        {/* Apple Primary Action Button */}
        <TouchableOpacity
          onPress={() => router.push('/expense/new')}
          activeOpacity={0.7}
          style={[
            styles.addButton,
            {
              backgroundColor: colors.primary,
              borderRadius: br.full,
              paddingHorizontal: spacing.md,
              paddingVertical: 8,
            },
          ]}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={[typography.subhead, { color: '#FFFFFF', fontWeight: '600' }]}>
            Add
          </Text>
        </TouchableOpacity>
      </View>

      {/* Month Switcher */}
      <View style={{ paddingHorizontal: spacing.md }}>
        <MonthSelector currentMonth={selectedMonth} onChangeMonth={setSelectedMonth} />
      </View>

      {/* Search & Sort Controls */}
      <View style={[styles.filterBar, { paddingHorizontal: spacing.lg, marginTop: spacing.xs }]}>
        <View style={{ flex: 1, marginRight: spacing.sm }}>
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search note or merchant..."
            leftIcon={<Search size={15} color={colors.textTertiary} />}
            showClear
            onClear={() => setSearchQuery('')}
          />
        </View>

        {/* Clean Apple Sort Button */}
        <TouchableOpacity
          onPress={toggleSort}
          activeOpacity={0.7}
          style={[
            styles.sortBtn,
            {
              backgroundColor: colors.inputBg,
              borderRadius: br.md,
              paddingHorizontal: spacing.md,
              borderWidth: 0.5,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            },
          ]}
        >
          <ArrowUpDown size={14} color={colors.textPrimary} style={{ marginRight: 4 }} />
          <Text style={[typography.subhead, { color: colors.textPrimary, fontWeight: '500' }]}>
            {sortBy === 'date' ? 'Date' : sortOrder === 'desc' ? 'High' : 'Low'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips Horizontal Scroll */}
      <View style={{ marginVertical: spacing.xs }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.chipsContainer, { paddingHorizontal: spacing.lg, gap: spacing.xs }]}
        >
          {hasActiveFilters && (
            <TouchableOpacity
              onPress={clearFilters}
              activeOpacity={0.7}
              style={[
                styles.filterChip,
                {
                  backgroundColor: colors.dangerLight,
                  borderRadius: br.full,
                },
              ]}
            >
              <X size={12} color={colors.danger} style={{ marginRight: 4 }} />
              <Text style={[typography.caption1, { color: colors.danger, fontWeight: '600' }]}>
                Clear
              </Text>
            </TouchableOpacity>
          )}

          {/* Categories Quick Filter */}
          {categories.slice(0, 10).map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => {
                  triggerSelection();
                  setSelectedCategory(isSelected ? undefined : cat.id);
                }}
                activeOpacity={0.7}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceInset,
                    borderRadius: br.full,
                  },
                ]}
              >
                <Text style={{ marginRight: 4, fontSize: 13 }}>{cat.emoji}</Text>
                <Text
                  style={[
                    typography.caption1,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textPrimary,
                      fontWeight: isSelected ? '600' : '400',
                    },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Inset Grouped List with 120Hz ProMotion Virtualization (Section 2C) */}
      <FlatList
        data={groupedExpenses}
        keyExtractor={(item) => item.date}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: spacing.lg, paddingBottom: 40 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              title={hasActiveFilters ? 'No matching expenses' : 'No expenses this month'}
              description={
                hasActiveFilters
                  ? 'Try clearing your filters or search terms.'
                  : 'Start adding expenses to track your financial activity.'
              }
              actionTitle={hasActiveFilters ? 'Clear Filters' : '+ Add Expense'}
              onAction={hasActiveFilters ? clearFilters : () => router.push('/expense/new')}
            />
          ) : undefined
        }
        renderItem={({ item }) => (
          <View style={{ marginBottom: spacing.md }}>
            {/* Group Header */}
            <View style={[styles.dateGroupHeader, { marginBottom: spacing.xs, paddingHorizontal: 4 }]}>
              <Text style={[typography.footnote, { color: colors.textSecondary, fontWeight: '600' }]}>
                {item.displayLabel}
              </Text>
              <Text style={[typography.footnote, { color: colors.textTertiary, fontWeight: '600', fontVariant: ['tabular-nums'] }]}>
                {formatINR(item.totalPaise)}
              </Text>
            </View>

            {/* Inset Grouped Cell Container */}
            <Card variant="default" padding="none">
              {item.items.map((exp, idx) => (
                <React.Fragment key={exp.id}>
                  <TouchableOpacity
                    onPress={() => router.push(`/expense/${exp.id}`)}
                    activeOpacity={0.6}
                    style={[styles.expenseItem, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}
                  >
                    {/* Category Icon */}
                    <View
                      style={[
                        styles.catIconWell,
                        {
                          backgroundColor: colors.surfaceInset,
                          borderRadius: br.sm,
                        },
                      ]}
                    >
                      <Text style={styles.catEmoji}>{exp.category.emoji}</Text>
                    </View>

                    <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
                      <Text
                        numberOfLines={1}
                        style={[typography.headline, { color: colors.textPrimary, fontSize: 16 }]}
                      >
                        {exp.category.name}
                      </Text>

                      <Text
                        numberOfLines={1}
                        style={[typography.footnote, { color: colors.textSecondary }]}
                      >
                        {exp.merchant ? `${exp.merchant}` : ''}
                        {exp.merchant && exp.note ? ' • ' : ''}
                        {exp.note ? exp.note : ''}
                      </Text>

                      {exp.paymentMethod ? (
                        <View
                          style={[
                            styles.payMethodBadge,
                            {
                              backgroundColor: colors.surfaceInset,
                              borderRadius: br.xs,
                              marginTop: 3,
                              alignSelf: 'flex-start',
                              paddingHorizontal: 6,
                              paddingVertical: 1,
                            },
                          ]}
                        >
                          <Text style={[typography.caption2, { color: colors.textTertiary, fontWeight: '600' }]}>
                            {exp.paymentMethod.toUpperCase()}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <Text
                      style={[
                        typography.headline,
                        { color: colors.textPrimary, fontSize: 16, fontVariant: ['tabular-nums'] },
                      ]}
                    >
                      {formatINR(exp.amountPaise)}
                    </Text>
                  </TouchableOpacity>

                  {/* Indented hairline separator (skipping leading icon) */}
                  {idx < item.items.length - 1 && (
                    <View
                      style={[
                        styles.separator,
                        {
                          backgroundColor: colors.separator,
                          marginLeft: 38 + spacing.md + spacing.sm,
                        },
                      ]}
                    />
                  )}
                </React.Fragment>
              ))}
            </Card>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortBtn: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsContainer: {
    paddingVertical: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  listContent: {
    paddingTop: 8,
  },
  dateGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catIconWell: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catEmoji: {
    fontSize: 20,
  },
  payMethodBadge: {},
  separator: {
    height: 0.5,
  },
});
