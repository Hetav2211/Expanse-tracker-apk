// ===== Apple HIG Input Component =====
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';
import { X } from 'lucide-react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  onClear?: () => void;
  showClear?: boolean;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  value,
  onClear,
  showClear = false,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius: br, typography, isDark } = theme;
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text
          style={[
            typography.subhead,
            { color: colors.textSecondary, marginBottom: spacing.xs, fontWeight: '500' },
          ]}
        >
          {label}
        </Text>
      ) : null}

      {/* Apple Level 3 Surface Input Field */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.inputBg,
            borderRadius: br.md,
            paddingHorizontal: spacing.md,
            borderWidth: 1,
            borderColor: hasError
              ? colors.danger
              : isFocused
              ? colors.primary
              : 'transparent',
          },
        ]}
      >
        {leftIcon ? <View style={{ marginRight: spacing.sm }}>{leftIcon}</View> : null}

        <TextInput
          value={value}
          placeholderTextColor={colors.textTertiary}
          onFocus={(e) => {
            setIsFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          style={[
            styles.input,
            typography.body,
            { color: colors.textPrimary },
            style,
          ]}
          {...rest}
        />

        {showClear && value && value.length > 0 && onClear ? (
          <TouchableOpacity
            onPress={onClear}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={[
              styles.clearBtn,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
                borderRadius: br.full,
              },
            ]}
          >
            <X size={12} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}

        {rightIcon ? <View style={{ marginLeft: spacing.sm }}>{rightIcon}</View> : null}
      </View>

      {hasError ? (
        <Text
          style={[
            typography.caption1,
            { color: colors.danger, marginTop: spacing.xxs, fontWeight: '500' },
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  clearBtn: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
