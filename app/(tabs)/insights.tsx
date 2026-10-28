// ===== Apple HIG Insights Screen =====
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { AppSafeAreaView } from '../../src/components/AppSafeAreaView';
import { useTheme, concentricRadius } from '../../src/theme';
import { useDashboard } from '../../src/hooks/useDashboard';
import { formatINR } from '../../src/utils/currency';
import { getCurrentYearMonth } from '../../src/utils/dates';
import { MonthSelector } from '../../src/components/MonthSelector';
import { Card } from '../../src/components/Card';
import { BarChart } from '../../src/components/BarChart';
import { EmptyState } from '../../src/components/EmptyState';
import { PieChart, Sparkles } from 'lucide-react-native';

export default function InsightsScreen() {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius: br, typography, isDark } = theme;

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentYearMonth());
  const [chartRange, setChartRange] = useState<3 | 6 | 12>(6);

  const {
    summary,
    trends,
    categoryTotals,
    refreshing,
    refresh,
  } = useDashboard(selectedMonth, chartRange);

  return (
    <AppSafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.centerContainer}>
        {/* Apple Large Title Header */}
        <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.md }]}>
          <Text style={[typography.caption2, { color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase' }]}>
            Analytics
          </Text>
          <Text style={[typography.title1, { color: colors.textPrimary }]}>
            Insights
          </Text>
        </View>

        {/* Month Switcher */}
        <View style={{ paddingHorizontal: spacing.md }}>
          <MonthSelector currentMonth={selectedMonth} onChangeMonth={setSelectedMonth} />
        </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { padding: spacing.lg, gap: spacing.md }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Trend Bar Chart Card */}
        <Card variant="default">
          <BarChart
            data={trends}
            selectedRange={chartRange}
            onChangeRange={setChartRange}
            activeMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
          />
        </Card>

        {/* Category Breakdown Card */}
        <Card variant="default">
          <View style={[styles.cardHeader, { marginBottom: spacing.md }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View
                style={[
                  styles.headerIconSocket,
                  {
                    backgroundColor: colors.primaryLight,
                    borderRadius: br.sm,
                    borderWidth: 0.5,
                    borderColor: colors.specularHairline,
                  },
                ]}
              >
                <PieChart size={15} color={colors.primary} strokeWidth={2.2} />
              </View>
              <Text style={[typography.headline, { color: colors.textPrimary }]}>
                Category Breakdown
              </Text>
            </View>
            <Text style={[typography.footnote, { color: colors.textTertiary, fontVariant: ['tabular-nums'] }]}>
              {categoryTotals.length} categories
            </Text>
          </View>

          {categoryTotals.length === 0 ? (
            <EmptyState
              title="No spending data"
              description="Record expenses this month to see your category breakdown."
            />
          ) : (
            <View style={{ gap: spacing.sm }}>
              {categoryTotals.map((item, idx) => (
                <React.Fragment key={item.categoryId}>
                  <View style={[styles.catRow, { paddingVertical: 4 }]}>
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
                      <Text style={styles.catEmoji}>{item.category.emoji}</Text>
                    </View>

                    <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
                      <View style={styles.catTopLine}>
                        <Text style={[typography.subhead, { color: colors.textPrimary, fontWeight: '600' }]}>
                          {item.category.name}
                        </Text>
                        <Text style={[typography.subhead, { color: colors.textPrimary, fontWeight: '600', fontVariant: ['tabular-nums'] }]}>
                          {formatINR(item.totalPaise)}
                        </Text>
                      </View>

                      {/* Apple Progress Bar */}
                      <View
                        style={[
                          styles.barTrack,
                          {
                            backgroundColor: colors.surfaceInset,
                            borderRadius: br.full,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.barFill,
                            {
                              width: `${Math.min(item.percentage, 100)}%`,
                              backgroundColor: colors.primary,
                              borderRadius: br.full,
                            },
                          ]}
                        />
                      </View>

                      <View style={styles.catBottomLine}>
                        <Text style={[typography.caption2, { color: colors.textTertiary }]}>
                          {item.transactionCount} {item.transactionCount === 1 ? 'expense' : 'expenses'}
                        </Text>
                        <Text style={[typography.caption2, { color: colors.textSecondary, fontWeight: '600', fontVariant: ['tabular-nums'] }]}>
                          {item.percentage.toFixed(1)}%
                        </Text>
                      </View>
                    </View>
                  </View>

                  {idx < categoryTotals.length - 1 && (
                    <View
                      style={[
                        styles.separator,
                        {
                          backgroundColor: colors.separator,
                          marginLeft: 38 + spacing.sm,
                        },
                      ]}
                    />
                  )}
                </React.Fragment>
              ))}
            </View>
          )}
        </Card>

        {/* Spending Highlights */}
        {summary && (
          <Card variant="elevated">
            <View style={[styles.cardHeader, { marginBottom: spacing.md }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View
                  style={[
                    styles.headerIconSocket,
                    {
                      backgroundColor: colors.warningLight,
                      borderRadius: br.sm,
                    },
                  ]}
                >
                  <Sparkles size={15} color={colors.warning} strokeWidth={2.2} />
                </View>
                <Text style={[typography.headline, { color: colors.textPrimary }]}>
                  Monthly Highlights
                </Text>
              </View>
            </View>

            <View style={{ gap: spacing.sm }}>
              <View
                style={[
                  styles.highlightWell,
                  {
                    backgroundColor: colors.surfaceInset,
                    borderRadius: concentricRadius(br.lg, spacing.xs),
                    borderWidth: 0.5,
                    borderColor: colors.specularHairline,
                    padding: spacing.md,
                  },
                ]}
              >
                <Text style={[typography.caption1, { color: colors.textSecondary }]}>
                  Average Daily Spend
                </Text>
                <Text style={[typography.title2, { color: colors.textPrimary, marginTop: 4, fontVariant: ['tabular-nums'] }]}>
                  {formatINR(summary.dailyAveragePaise, false)}
                </Text>
              </View>

              {summary.topCategory ? (
                <View
                  style={[
                    styles.highlightWell,
                    {
                      backgroundColor: colors.surfaceInset,
                      borderRadius: concentricRadius(br.lg, spacing.xs),
                      borderWidth: 0.5,
                      borderColor: colors.specularHairline,
                      padding: spacing.md,
                    },
                  ]}
                >
                  <Text style={[typography.caption1, { color: colors.textSecondary }]}>
                    Largest Spending Area
                  </Text>
                  <Text style={[typography.headline, { color: colors.textPrimary, marginTop: 4 }]}>
                    {summary.topCategory.categoryEmoji} {summary.topCategory.categoryName}{' '}
                    <Text style={{ fontVariant: ['tabular-nums'], color: colors.primary }}>
                      ({formatINR(summary.topCategory.totalPaise, false)})
                    </Text>
                  </Text>
                </View>
              ) : null}
            </View>
          </Card>
        )}
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
    marginBottom: 4,
  },
  content: {
    paddingBottom: 40,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIconSocket: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catRow: {
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
  catTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  catBottomLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  barTrack: {
    height: 6,
    width: '100%',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
  },
  highlightWell: {},
  separator: {
    height: 0.5,
  },
});
