// ===== Apple HIG Empty State Component =====
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { Button } from './Button';
import { Inbox } from 'lucide-react-native';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  icon,
  title,
  description,
  actionTitle,
  onAction,
  style,
}: EmptyStateProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius: br, typography } = theme;

  return (
    <View style={[styles.container, { padding: spacing.xl }, style]}>
      {/* Apple Circular Icon Well */}
      <View
        style={[
          styles.iconSocket,
          {
            backgroundColor: colors.surfaceInset,
            borderRadius: br.full,
            borderWidth: 0.5,
            borderColor: colors.specularHairline,
            marginBottom: spacing.md,
          },
        ]}
      >
        {icon || <Inbox size={30} color={colors.textTertiary} strokeWidth={1.75} />}
      </View>

      <Text
        style={[
          typography.headline,
          { color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.xs },
        ]}
      >
        {title}
      </Text>

      {description ? (
        <Text
          style={[
            typography.subhead,
            { color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg, maxWidth: 280 },
          ]}
        >
          {description}
        </Text>
      ) : null}

      {actionTitle && onAction ? (
        <Button title={actionTitle} onPress={onAction} variant="primary" size="sm" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSocket: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
