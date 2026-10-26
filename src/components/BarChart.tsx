// ===== Apple HIG Spending Trend Bar Chart Component =====
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { useTheme } from '../theme';
import { MonthlyTrend } from '../types';
import { formatRupeesCompact, formatRupees } from '../utils/currency';
import { triggerSelection, triggerLightImpact } from '../utils/haptics';

export interface BarChartProps {
  data: MonthlyTrend[];
  selectedRange: 3 | 6 | 12;
  onChangeRange: (range: 3 | 6 | 12) => void;
  activeMonth?: string;
  onSelectMonth?: (yearMonth: string) => void;
}

export function BarChart({
  data,
  selectedRange,
  onChangeRange,
  activeMonth,
  onSelectMonth,
}: BarChartProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius: br, typography, isDark } = theme;
  const [selectedBar, setSelectedBar] = useState<MonthlyTrend | null>(null);

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - spacing.lg * 2 - spacing.md * 2;
  const chartHeight = 160;
  const paddingBottom = 28;
  const paddingTop = 24;
  const usableHeight = chartHeight - paddingBottom - paddingTop;

  const maxPaise = Math.max(...data.map((d) => d.totalPaise), 100000);

  const barCount = data.length || 1;
  const barGap = 8;
  const totalGaps = (barCount - 1) * barGap;
  const barWidth = Math.max(Math.min((chartWidth - totalGaps) / barCount, 36), 14);

  const handleBarTap = (item: MonthlyTrend) => {
    triggerSelection();
    setSelectedBar(item);
    if (onSelectMonth) {
      onSelectMonth(item.yearMonth);
    }
  };

  return (
    <View style={styles.container}>
      {/* iOS Segmented Control Header */}
      <View style={[styles.headerRow, { marginBottom: spacing.sm }]}>
        <Text style={[typography.headline, { color: colors.textPrimary }]}>
          Spending Trend
        </Text>

        <View
          style={[
            styles.segmentedControl,
            {
              backgroundColor: colors.surfaceInset,
              borderRadius: br.sm,
              padding: 2,
            },
          ]}
        >
          {([3, 6, 12] as const).map((r) => {
            const isActive = selectedRange === r;
            return (
              <TouchableOpacity
                key={r}
                onPress={() => {
                  triggerLightImpact();
                  onChangeRange(r);
                }}
                activeOpacity={0.7}
                style={[
                  styles.segmentBtn,
                  {
                    backgroundColor: isActive ? colors.surface : 'transparent',
                    borderRadius: br.xs,
                    shadowColor: isDark ? 'transparent' : '#000000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: isActive && !isDark ? 0.08 : 0,
                    shadowRadius: 2,
                    elevation: isActive && !isDark ? 1 : 0,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.caption2,
                    {
                      color: isActive ? colors.textPrimary : colors.textTertiary,
                      fontWeight: isActive ? '600' : '400',
                      paddingHorizontal: spacing.sm,
                      paddingVertical: 3,
                    },
                  ]}
                >
                  {r}M
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Selected Month Callout */}
      {selectedBar ? (
        <View
          style={[
            styles.tooltipBox,
            {
              backgroundColor: colors.surfaceInset,
              borderRadius: br.xs,
              paddingHorizontal: spacing.sm,
              paddingVertical: 3,
              marginBottom: spacing.xs,
            },
          ]}
        >
          <Text style={[typography.caption2, { color: colors.textSecondary }]}>
            {selectedBar.monthLabel}:
          </Text>
          <Text
            style={[
              typography.caption1,
              { color: colors.primary, fontWeight: '600', fontVariant: ['tabular-nums'] },
            ]}
          >
            {formatRupees(selectedBar.totalPaise)}
          </Text>
        </View>
      ) : null}

      {/* SVG Apple Health Style Bars */}
      <View style={styles.chartWrapper}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Baseline Grid Line (0.5px hairline) */}
          <Line
            x1="0"
            y1={chartHeight - paddingBottom}
            x2={chartWidth}
            y2={chartHeight - paddingBottom}
            stroke={colors.border}
            strokeWidth="0.5"
          />

          {data.map((item, index) => {
            const barHeight = (item.totalPaise / maxPaise) * usableHeight;
            const x = index * (barWidth + barGap) + (chartWidth - (barCount * barWidth + totalGaps)) / 2;
            const y = chartHeight - paddingBottom - Math.max(barHeight, 4);
            const isHighlight = item.yearMonth === activeMonth || item.yearMonth === selectedBar?.yearMonth;
            const shortMonth = item.monthLabel.split(' ')[0].substring(0, 3);

            return (
              <G key={item.yearMonth} onPress={() => handleBarTap(item)}>
                {/* Touch surface */}
                <Rect
                  x={x - 4}
                  y={paddingTop}
                  width={barWidth + 8}
                  height={usableHeight + paddingBottom}
                  fill="transparent"
                />

                {/* Amount on top of bar */}
                {barHeight > 20 && (
                  <SvgText
                    x={x + barWidth / 2}
                    y={y - 5}
                    fill={isHighlight ? colors.primary : colors.textTertiary}
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {formatRupeesCompact(item.totalPaise)}
                  </SvgText>
                )}

                {/* Apple Rounded Bar */}
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 4)}
                  rx={4}
                  ry={4}
                  fill={isHighlight ? colors.primary : isDark ? '#2C2C2E' : 'rgba(0, 122, 255, 0.2)'}
                />

                {/* Month Name */}
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight - 8}
                  fill={isHighlight ? colors.primary : colors.textSecondary}
                  fontSize="11"
                  fontWeight={isHighlight ? '600' : '400'}
                  textAnchor="middle"
                >
                  {shortMonth}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  segmentedControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
