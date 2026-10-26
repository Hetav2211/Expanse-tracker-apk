// ===== Apple HIG Month Selector Component =====
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { useTheme } from '../theme';
import {
  formatMonthYear,
  getPreviousMonth,
  getNextMonth,
  getCurrentYearMonth,
} from '../utils/dates';
import { triggerLightImpact, triggerMediumImpact } from '../utils/haptics';

export interface MonthSelectorProps {
  currentMonth: string; // YYYY-MM
  onChangeMonth: (yearMonth: string) => void;
}

export function MonthSelector({ currentMonth, onChangeMonth }: MonthSelectorProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius: br, typography, isDark } = theme;

  const currentActualMonth = getCurrentYearMonth();
  const isCurrentMonth = currentMonth === currentActualMonth;

  const handlePrev = () => {
    triggerLightImpact();
    onChangeMonth(getPreviousMonth(currentMonth));
  };

  const handleNext = () => {
    triggerLightImpact();
    onChangeMonth(getNextMonth(currentMonth));
  };

  const handleResetToCurrent = () => {
    triggerMediumImpact();
    onChangeMonth(currentActualMonth);
  };

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.sm, marginVertical: spacing.xs }]}>
      {/* Previous Month Chevron */}
      <TouchableOpacity
        onPress={handlePrev}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={[
          styles.chevronButton,
          {
            backgroundColor: colors.surfaceInset,
            borderRadius: br.full,
            borderWidth: 0.5,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
          },
        ]}
      >
        <ChevronLeft size={18} color={colors.textPrimary} />
      </TouchableOpacity>

      {/* Current Month Capsule */}
      <TouchableOpacity
        onPress={handleResetToCurrent}
        activeOpacity={0.7}
        style={[
          styles.monthCapsule,
          {
            backgroundColor: isCurrentMonth ? colors.primaryLight : colors.surfaceInset,
            borderRadius: br.full,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
            borderWidth: 0.5,
            borderColor: isCurrentMonth
              ? 'transparent'
              : isDark
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.04)',
          },
        ]}
      >
        <Calendar size={15} color={isCurrentMonth ? colors.primary : colors.textSecondary} />
        <Text
          style={[
            typography.subhead,
            {
              color: isCurrentMonth ? colors.primary : colors.textPrimary,
              fontWeight: '600',
            },
          ]}
        >
          {formatMonthYear(currentMonth)}
        </Text>
      </TouchableOpacity>

      {/* Next Month Chevron */}
      <TouchableOpacity
        onPress={handleNext}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={[
          styles.chevronButton,
          {
            backgroundColor: colors.surfaceInset,
            borderRadius: br.full,
            borderWidth: 0.5,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
          },
        ]}
      >
        <ChevronRight size={18} color={colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  chevronButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 40,
  },
});
