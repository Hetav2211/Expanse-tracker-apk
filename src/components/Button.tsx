// ===== Apple HIG Button Component =====
import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { useTheme } from '../theme';
import { triggerLightImpact } from '../utils/haptics';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const { theme } = useTheme();
  const { colors, borderRadius: br, spacing, typography, isDark } = theme;

  const handlePress = () => {
    if (disabled || loading) return;
    triggerLightImpact();
    onPress();
  };

  // Apple HIG Touch Target: Minimum 44pt height
  const sizeStyles: Record<string, { paddingH: number; text: TextStyle; height: number }> = {
    sm: { paddingH: spacing.md, text: typography.subhead, height: 44 },
    md: { paddingH: spacing.lg, text: typography.headline, height: 50 },
    lg: { paddingH: spacing.xl, text: typography.headline, height: 54 },
  };

  const s = sizeStyles[size];
  const radius = br.md; // 12px Apple standard button radius

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.buttonBase,
        {
          height: s.height,
          borderRadius: radius,
          paddingHorizontal: s.paddingH,
          // Touch Press: 6% dimming (opacity 0.94) and scale(0.97) (Section 6.B)
          opacity: disabled ? 0.45 : pressed ? 0.94 : 1,
          transform: [{ scale: pressed && !disabled && !loading ? 0.97 : 1 }],
        },
        // Variant styling
        variant === 'primary' && {
          backgroundColor: colors.primary,
        },
        variant === 'secondary' && {
          backgroundColor: colors.primaryLight,
        },
        variant === 'outline' && {
          backgroundColor: 'transparent',
          borderWidth: 0.5,
          borderColor: colors.border,
        },
        variant === 'ghost' && {
          backgroundColor: pressed ? colors.surfacePressed : 'transparent',
        },
        variant === 'danger' && {
          backgroundColor: colors.danger,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'primary' || variant === 'danger'
              ? '#FFFFFF'
              : colors.primary
          }
        />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <Text
            numberOfLines={1}
            style={[
              s.text,
              styles.buttonText,
              {
                color:
                  variant === 'primary' || variant === 'danger'
                    ? '#FFFFFF'
                    : variant === 'secondary'
                    ? colors.primary
                    : variant === 'ghost'
                    ? colors.textSecondary
                    : colors.primary,
              },
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
    alignSelf: 'stretch',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
  },
});
