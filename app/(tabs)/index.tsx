// ===== Apple HIG Dashboard Screen =====
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { AppSafeAreaView } from '../../src/components/AppSafeAreaView';
import { useRouter } from 'expo-router';
import { Plus, ArrowUpRight, ArrowDownRight, AlertTriangle } from 'lucide-react-native';
import { useTheme, concentricRadius } from '../../src/theme';
import { useDashboard } from '../../src/hooks/useDashboard';
import { getCurrentYearMonth, getRelativeDayLabel } from '../../src/utils/dates';
import { formatINR } from '../../src/utils/currency';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { MonthSelector } from '../../src/components/MonthSelector';
import { BarChart } from '../../src/components/BarChart';
import { EmptyState } from '../../src/components/EmptyState';
import { triggerMediumImpact } from '../../src/utils/haptics';

export default function DashboardScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, borderRadius: br, typography, isDark } = theme;

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentYearMonth());
  const [chartRange, setChartRange] = useState<3 | 6 | 12>(6);

  const {
    summary,
    trends,
    categoryTotals,
    overallBudgetStatus,
    recentExpenses,
    refreshing,
    refresh,
  } = useDashboard(selectedMonth, chartRange);

  const handleAddExpense = () => {
    triggerMediumImpact();
    router.push('/expense/new');
  };

  return (
    <AppSafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.centerContainer}>
        {/* Apple Large Title Header */}
        <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.md }]}>
          <View>
            <Text style={[typography.caption2, { color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase' }]}>
              Overview
            </Text>
            <Text style={[typography.title1, { color: colors.textPrimary }]}>
              Expenses
            </Text>
          </View>

          {/* Apple Primary Action Button */}
          <TouchableOpacity
            onPress={handleAddExpense}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Add new expense"
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { padding: spacing.lg, gap: spacing.md }]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
        {/* Main Spend Hero Card */}
        <Card variant="elevated">
          <Text style={[typography.subhead, { color: colors.textSecondary }]}>
            Total Spent this Month
          </Text>
          <Text style={[typography.amountLarge, { color: colors.textPrimary, marginVertical: spacing.xs }]}>
            {formatINR(summary?.totalPaise ?? 0)}
          </Text>

          {/* Sub Stats Row */}
          <View style={[styles.metaRow, { marginTop: spacing.xs, gap: spacing.sm }]}>
            {summary?.monthOverMonthChangePercent !== null &&
            summary?.monthOverMonthChangePercent !== undefined ? (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      summary.monthOverMonthChangePercent > 0 ? colors.dangerLight : colors.successLight,
                    borderRadius: br.full,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: 3,
                  },
                ]}
              >
                {summary.monthOverMonthChangePercent > 0 ? (
                  <ArrowUpRight size={13} color={colors.danger} strokeWidth={2.5} />
                ) : (
                  <ArrowDownRight size={13} color={colors.success} strokeWidth={2.5} />
                )}
                <Text
                  style={[
                    typography.caption1,
                    {
                      color:
                        summary.monthOverMonthChangePercent > 0 ? colors.danger : colors.success,
                      fontWeight: '600',
                      marginLeft: 2,
                      fontVariant: ['tabular-nums'],
                    },
                  ]}
                >
                  {Math.abs(summary.monthOverMonthChangePercent).toFixed(1)}% vs last mo
                </Text>
              </View>
            ) : null}

            <Text style={[typography.footnote, { color: colors.textTertiary, fontVariant: ['tabular-nums'] }]}>
              {summary?.transactionCount ?? 0} transactions
            </Text>
          </View>

          {/* Daily average & Top Category */}
          <View
            style={[
              styles.dailyBurnBox,
              {
                backgroundColor: colors.surfaceInset,
                borderRadius: concentricRadius(br.lg, spacing.xs),
                borderWidth: 0.5,
                borderColor: colors.specularHairline,
                padding: spacing.md,
                marginTop: spacing.md,
              },
            ]}
          >
            <View>
              <Text style={[typography.caption1, { color: colors.textSecondary }]}>
                Daily Average
              </Text>
              <Text style={[typography.headline, { color: colors.textPrimary, fontVariant: ['tabular-nums'] }]}>
                {formatINR(summary?.dailyAveragePaise ?? 0, false)} / day
              </Text>
            </View>

            {summary?.topCategory ? (
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[typography.caption1, { color: colors.textSecondary }]}>
                  Top Category
                </Text>
                <Text style={[typography.headline, { color: colors.textPrimary }]}>
                  {summary.topCategory.categoryEmoji} {summary.topCategory.categoryName}
                </Text>
              </View>
            ) : null}
          </View>
        </Card>

        {/* Budget Progress Meter */}
        {overallBudgetStatus ? (
          <Card variant="default">
            <View style={styles.budgetHeader}>
              <View>
                <Text style={[typography.subhead, { color: colors.textSecondary }]}>
                  Monthly Budget
                </Text>
                <Text style={[typography.headline, { color: colors.textPrimary, fontVariant: ['tabular-nums'] }]}>
                  {formatINR(overallBudgetStatus.spentPaise, false)} of{' '}
                  {formatINR(overallBudgetStatus.budget.amountPaise, false)}
                </Text>
              </View>

              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: overallBudgetStatus.isExceeded
                      ? colors.dangerLight
                      : overallBudgetStatus.percentUsed >= 80
                      ? colors.warningLight
                      : colors.successLight,
                    borderRadius: br.full,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: 3,
                  },
                ]}
              >
                {overallBudgetStatus.isExceeded && (
                  <AlertTriangle size={12} color={colors.danger} style={{ marginRight: 4 }} />
                )}
                <Text
                  style={[
                    typography.caption1,
                    {
                      color: overallBudgetStatus.isExceeded
                        ? colors.danger
                        : overallBudgetStatus.percentUsed >= 80
                        ? colors.warning
                        : colors.success,
                      fontWeight: '600',
                      fontVariant: ['tabular-nums'],
                    },
                  ]}
                >
                  {Math.round(overallBudgetStatus.percentUsed)}%
                </Text>
              </View>
            </View>

            {/* Apple Progress Bar */}
            <View
              style={[
                styles.progressBarTrack,
                {
                  backgroundColor: colors.surfaceInset,
                  borderRadius: br.full,
                  marginTop: spacing.md,
                },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min(overallBudgetStatus.percentUsed, 100)}%`,
                    backgroundColor: overallBudgetStatus.isExceeded
                      ? colors.danger
                      : overallBudgetStatus.percentUsed >= 80
                      ? colors.warning
                      : colors.success,
                    borderRadius: br.full,
                  },
                ]}
              />
            </View>

            <View style={[styles.budgetFooter, { marginTop: spacing.xs }]}>
              <Text style={[typography.footnote, { color: colors.textTertiary, fontVariant: ['tabular-nums'] }]}>
                {overallBudgetStatus.isExceeded
                  ? `Over by ${formatINR(Math.abs(overallBudgetStatus.remainingPaise), false)}`
                  : `${formatINR(overallBudgetStatus.remainingPaise, false)} remaining`}
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/budgets')}
                accessibilityRole="button"
                accessibilityLabel="Manage monthly budgets"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={[typography.footnote, { color: colors.primary, fontWeight: '600' }]}>
                  Manage
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        ) : (
          <Card
            variant="default"
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <View style={{ flex: 1, marginRight: spacing.md }}>
              <Text style={[typography.headline, { color: colors.textPrimary }]}>
                No Monthly Budget
              </Text>
              <Text style={[typography.footnote, { color: colors.textSecondary }]}>
                Set a budget to track spending limits and get warnings.
              </Text>
            </View>
            <Button
              title="Set Budget"
              size="sm"
              variant="secondary"
              onPress={() => router.push('/budgets')}
            />
          </Card>
        )}

        {/* Trend Bar Chart */}
        <Card variant="default">
          <BarChart
            data={trends}
            selectedRange={chartRange}
            onChangeRange={setChartRange}
            activeMonth={selectedMonth}
            onSelectMonth={(m) => setSelectedMonth(m)}
          />
        </Card>

        {/* Top Spending Categories */}
        {categoryTotals.length > 0 ? (
          <Card variant="default">
            <View style={[styles.sectionHeader, { marginBottom: spacing.md }]}>
              <Text style={[typography.headline, { color: colors.textPrimary }]}>
                Top Categories
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/insights')}
                accessibilityRole="button"
                accessibilityLabel="View category insights details"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={[typography.subhead, { color: colors.primary, fontWeight: '600' }]}>
                  Details
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: spacing.md }}>
              {categoryTotals.slice(0, 4).map((item) => (
                <View key={item.categoryId} style={styles.catItem}>
                  <View
                    style={[
                      styles.catIconWell,
                      {
                        backgroundColor: colors.surfaceInset,
                        borderRadius: br.sm,
                      },
                    ]}
                  >
                    <Text style={styles.catEmoji}>{item.category.emoji}</Text>
                  </View>

                  <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
                    <View style={styles.catLabelRow}>
                      <Text style={[typography.subhead, { color: colors.textPrimary, fontWeight: '600' }]}>
                        {item.category.name}
                      </Text>
                      <Text style={[typography.subhead, { color: colors.textPrimary, fontWeight: '600', fontVariant: ['tabular-nums'] }]}>
                        {formatINR(item.totalPaise, false)}
                      </Text>
                    </View>

                    {/* Apple Progress Bar */}
                    <View
                      style={[
                        styles.catMiniTrack,
                        {
                          backgroundColor: colors.surfaceInset,
                          borderRadius: br.full,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.catMiniFill,
                          {
                            width: `${Math.min(item.percentage, 100)}%`,
                            backgroundColor: colors.primary,
                            borderRadius: br.full,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        ) : null}

        {/* Recent Transactions List */}
        <Card variant="default">
          <View style={[styles.sectionHeader, { marginBottom: spacing.md }]}>
            <Text style={[typography.headline, { color: colors.textPrimary }]}>
              Recent Expenses
            </Text>
            {recentExpenses.length > 0 && (
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/transactions')}
                accessibilityRole="button"
                accessibilityLabel="View all transactions"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={[typography.subhead, { color: colors.primary, fontWeight: '600' }]}>
                  View All
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {recentExpenses.length === 0 ? (
            <EmptyState
              title="No expenses yet"
              description="Tap + Add to record your first expense."
              actionTitle="+ Add Expense"
              onAction={handleAddExpense}
            />
          ) : (
            <View style={{ gap: 0 }}>
              {recentExpenses.map((exp, idx) => (
                <React.Fragment key={exp.id}>
                  <TouchableOpacity
                    onPress={() => router.push(`/expense/${exp.id}`)}
                    activeOpacity={0.6}
                    accessibilityRole="button"
                    accessibilityLabel={`${exp.category.name}, ${formatINR(exp.amountPaise)} on ${getRelativeDayLabel(exp.expenseDate)}`}
                    style={[styles.recentRow, { paddingVertical: spacing.sm }]}
                  >
                    <View
                      style={[
                        styles.catIconWell,
                        {
                          backgroundColor: colors.surfaceInset,
                          borderRadius: br.sm,
                          borderWidth: 0.5,
                          borderColor: colors.specularHairline,
                        },
                      ]}
                    >
                      <Text style={styles.recentEmoji}>{exp.category.emoji}</Text>
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
                        {getRelativeDayLabel(exp.expenseDate)}
                        {exp.merchant ? ` • ${exp.merchant}` : ''}
                        {exp.paymentMethod ? ` • ${exp.paymentMethod.toUpperCase()}` : ''}
                      </Text>
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
                  {idx < recentExpenses.length - 1 && (
                    <View
                      style={[
                        styles.separator,
                        {
                          backgroundColor: colors.separator,
                          marginLeft: 40 + spacing.sm, // Inset separator past leading icon
                        },
                      ]}
                    />
                  )}
                </React.Fragment>
              ))}
            </View>
          )}
        </Card>
      </ScrollView>
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyBurnBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  progressBarTrack: {
    height: 6,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catItem: {
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
  catLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  catMiniTrack: {
    height: 5,
    width: '100%',
    overflow: 'hidden',
  },
  catMiniFill: {
    height: '100%',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentEmoji: {
    fontSize: 20,
  },
  separator: {
    height: 0.5,
  },
});
