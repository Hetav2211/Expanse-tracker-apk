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

  // Apple HIG continuous squircle radius: 16px
  const borderRadiusValue = br.lg;

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
            borderColor: colors.specularHairline,
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
          // Specular hairline chamfered edge (0.5px, Section 1.A & 5.A)
          borderWidth: 0.5,
          borderColor: colors.specularHairline,
          // Dark Mode: NO drop shadow (elevation = luminance shift)
          // Light Mode: Subtle ambient elevation shadow
          shadowColor: isDark ? 'transparent' : colors.shadowColor,
          shadowOffset: { width: 0, height: isElevated ? 4 : 2 },
          shadowOpacity: isDark ? 0 : isElevated ? 0.08 : 0.05,
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

