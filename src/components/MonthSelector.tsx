// ===== Apple HIG Month Selector Component =====
import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
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

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const triggerSlide = (direction: 'left' | 'right') => {
    const startX = direction === 'left' ? -14 : 14;
    slideAnim.setValue(startX);
    fadeAnim.setValue(0.2);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        mass: 0.8,
        stiffness: 400,
        damping: 26,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 160,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  };

  const handlePrev = () => {
    triggerLightImpact();
    triggerSlide('left');
    onChangeMonth(getPreviousMonth(currentMonth));
  };

  const handleNext = () => {
    triggerLightImpact();
    triggerSlide('right');
    onChangeMonth(getNextMonth(currentMonth));
  };

  const handleResetToCurrent = () => {
    triggerMediumImpact();
    triggerSlide(currentMonth > currentActualMonth ? 'left' : 'right');
    onChangeMonth(currentActualMonth);
  };

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.sm, marginVertical: spacing.xs }]}>
      {/* Previous Month Chevron */}
      <TouchableOpacity
        onPress={handlePrev}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Previous month"
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={[
          styles.chevronButton,
          {
            backgroundColor: colors.surfaceInset,
            borderRadius: br.full,
            borderWidth: 0.5,
            borderColor: colors.specularHairline,
          },
        ]}
      >
        <ChevronLeft size={18} color={colors.textPrimary} />
      </TouchableOpacity>

      {/* Current Month Capsule with Fluid Transition */}
      <TouchableOpacity
        onPress={handleResetToCurrent}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Month selector: ${formatMonthYear(currentMonth)}. Tap to reset to current month.`}
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
              : colors.specularHairline,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.animatedContent,
            {
              transform: [{ translateX: slideAnim }],
              opacity: fadeAnim,
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
                fontVariant: ['tabular-nums'],
              },
            ]}
          >
            {formatMonthYear(currentMonth)}
          </Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Next Month Chevron */}
      <TouchableOpacity
        onPress={handleNext}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Next month"
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={[
          styles.chevronButton,
          {
            backgroundColor: colors.surfaceInset,
            borderRadius: br.full,
            borderWidth: 0.5,
            borderColor: colors.specularHairline,
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
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  animatedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
