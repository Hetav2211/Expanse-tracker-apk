// ===== Apple HIG Surface Card Component =====
import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../theme';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'inset' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  style,
  variant = 'default',
  padding = 'md',
}: CardProps) {
  const { theme } = useTheme();
  const { colors, borderRadius: br, spacing, isDark } = theme;

  const paddingValue =
    padding === 'none'
      ? 0
      : padding === 'sm'
      ? spacing.sm
      : padding === 'lg'
      ? spacing.xl
      : spacing.lg;

  const borderRadiusValue = br.lg; // 16px Apple continuous radius

  if (variant === 'inset') {
    return (
      <View
        style={[
          styles.cardBase,
          {
            backgroundColor: colors.surfaceInset,
            borderRadius: borderRadiusValue,
            padding: paddingValue,
            borderWidth: 0.5,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  if (variant === 'outlined') {
    return (
      <View
        style={[
          styles.cardBase,
          {
            backgroundColor: colors.surface,
            borderRadius: borderRadiusValue,
            padding: paddingValue,
            borderWidth: 0.5,
            borderColor: colors.border,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  const isElevated = variant === 'elevated';
  const backgroundColor = isElevated ? colors.surfaceElevated : colors.surface;

  return (
    <View
      style={[
        styles.cardBase,
        {
          backgroundColor,
          borderRadius: borderRadiusValue,
          padding: paddingValue,
          // Specular hairline rim light
          borderWidth: 0.5,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
          // Dark Mode: NO drop shadow (elevation = luminance shift)
          // Light Mode: Subtle diffused shadow
          shadowColor: isDark ? 'transparent' : '#000000',
          shadowOffset: { width: 0, height: isElevated ? 4 : 2 },
          shadowOpacity: isDark ? 0 : isElevated ? 0.07 : 0.04,
          shadowRadius: isElevated ? 14 : 10,
          elevation: isDark ? 0 : isElevated ? 2 : 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  cardBase: {
    width: '100%',
    overflow: 'hidden',
  },
});
