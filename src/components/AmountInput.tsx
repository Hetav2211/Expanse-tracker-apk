import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Platform,
} from 'react-native';
import { useTheme } from '../theme';
import { triggerLightImpact } from '../utils/haptics';
import { cleanAmountInput } from '../utils/currency';

export interface AmountInputProps {
  value: string; // Rupees string (e.g. "450" or "450.50")
  onChangeValue: (val: string) => void;
  error?: string;
  containerStyle?: ViewStyle;
  showQuickPills?: boolean;
}

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000];

export function AmountInput({
  value,
  onChangeValue,
  error,
  containerStyle,
  showQuickPills = true,
}: AmountInputProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius: br, typography, isDark } = theme;
  const inputRef = useRef<TextInput>(null);

  const handleQuickAdd = (addVal: number) => {
    triggerLightImpact();
    const current = parseFloat(value) || 0;
    const next = current + addVal;
    onChangeValue(next.toString());
  };

  const handleChangeText = (text: string) => {
    const sanitized = cleanAmountInput(text);
    onChangeValue(sanitized);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text
        style={[
          typography.subhead,
          { color: colors.textSecondary, marginBottom: spacing.xs, fontWeight: '500' },
        ]}
      >
        Amount
      </Text>

      {/* Apple HIG Clean Surface Well with Precise Alignment and Direct Focus */}
      <View
        style={[
          styles.inputBox,
          {
            backgroundColor: colors.inputBg,
            borderRadius: br.lg,
            paddingHorizontal: spacing.lg,
            borderWidth: error ? 1 : 0.5,
            borderColor: error ? colors.danger : colors.specularHairline,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => inputRef.current?.focus()}
          activeOpacity={0.7}
          accessibilityRole="none"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 8 }}
          style={styles.currencyButton}
        >
          <Text
            style={[
              styles.currencySymbol,
              {
                fontFamily: typography.amountLarge.fontFamily,
                color: colors.primary,
              },
            ]}
          >
            ₹
          </Text>
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={handleChangeText}
          placeholder="0"
          placeholderTextColor={colors.textTertiary}
          keyboardType="decimal-pad"
          inputMode="decimal"
          autoFocus={false}
          autoCorrect={false}
          spellCheck={false}
          autoCapitalize="none"
          selectionColor={colors.primary}
          style={[
            styles.textInput,
            {
              fontFamily: typography.amountLarge.fontFamily,
              color: colors.textPrimary,
              ...(Platform.OS === 'ios' ? { fontVariant: ['tabular-nums'] as any } : {}),
            },
          ]}
        />
      </View>

      {error ? (
        <Text
          style={[
            typography.caption1,
            { color: colors.danger, marginTop: spacing.xs, fontWeight: '500' },
          ]}
        >
          {error}
        </Text>
      ) : null}

      {/* Apple Standard Quick Action Chips */}
      {showQuickPills ? (
        <View style={[styles.quickPillsRow, { marginTop: spacing.md, gap: spacing.sm }]}>
          {QUICK_AMOUNTS.map((amt) => (
            <TouchableOpacity
              key={amt}
              onPress={() => handleQuickAdd(amt)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Add ${amt} rupees`}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              style={[
                styles.quickPill,
                {
                  backgroundColor: colors.surfaceInset,
                  borderRadius: br.sm,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  borderWidth: 0.5,
                  borderColor: colors.specularHairline,
                },
              ]}
            >
              <Text
                style={[
                  typography.caption1,
                  { color: colors.textPrimary, fontWeight: '600', fontVariant: ['tabular-nums'] },
                ]}
              >
                +{amt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
  },
  currencyButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '700',
    marginRight: 8,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  textInput: {
    flex: 1,
    height: 54,
    fontSize: 32,
    fontWeight: '700',
    padding: 0,
    margin: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          outlineWidth: 0,
        } as any)
      : {}),
  },
  quickPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickPill: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
  },
});

