// ===== Apple HIG Fluid Segmented Control Component =====
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { useTheme } from '../theme';
import { triggerSelection } from '../utils/haptics';

export interface SegmentedControlOption<T extends string | number> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ size: number; color: string; style?: any }>;
  accessibilityLabel?: string;
}

export interface SegmentedControlProps<T extends string | number> {
  options: SegmentedControlOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  style?: StyleProp<ViewStyle>;
  size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string | number>({
  options,
  selectedValue,
  onSelect,
  style,
  size = 'md',
}: SegmentedControlProps<T>) {
  const { theme } = useTheme();
  const { colors, borderRadius: br, typography, isDark } = theme;

  const [containerWidth, setContainerWidth] = useState(0);
  const selectedIndex = Math.max(
    0,
    options.findIndex((opt) => opt.value === selectedValue)
  );

  const padding = size === 'sm' ? 2 : 3;
  const isSm = size === 'sm';
  const availableWidth = containerWidth > 0 ? containerWidth - padding * 2 : 0;
  const itemWidth = availableWidth > 0 ? availableWidth / options.length : 0;

  // Fluid spring animation driver for the sliding pill
  const animatedTranslateX = useRef(new Animated.Value(0)).current;
  const isInitialized = useRef(false);

  useEffect(() => {
    if (itemWidth > 0) {
      const targetX = selectedIndex * itemWidth;
      if (!isInitialized.current) {
        animatedTranslateX.setValue(targetX);
        isInitialized.current = true;
      } else {
        Animated.spring(animatedTranslateX, {
          toValue: targetX,
          mass: 1.0,
          stiffness: 350,
          damping: 28,
          useNativeDriver: Platform.OS !== 'web',
        }).start();
      }
    }
  }, [selectedIndex, itemWidth, animatedTranslateX]);

  const handleSelect = (val: T) => {
    if (val !== selectedValue) {
      triggerSelection();
      onSelect(val);
    }
  };

  return (
    <View
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceInset,
          borderRadius: isSm ? br.sm : br.md,
          padding,
          borderWidth: 0.5,
          borderColor: colors.specularHairline,
        },
        style,
      ]}
    >
      {/* Animated Sliding Pill Indicator */}
      {itemWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.slidingPill,
            {
              width: itemWidth,
              top: padding,
              bottom: padding,
              left: padding,
              borderRadius: isSm ? br.xs : br.sm,
              backgroundColor: colors.surface,
              borderWidth: 0.5,
              borderColor: colors.specularHairline,
              shadowColor: isDark ? 'transparent' : colors.shadowColor,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isDark ? 0 : 0.08,
              shadowRadius: 2,
              elevation: isDark ? 0 : 1,
              transform: [{ translateX: animatedTranslateX }],
            },
          ]}
        />
      )}

      {/* Segment Option Buttons */}
      <View style={styles.buttonsRow}>
        {options.map((opt) => {
          const isSelected = opt.value === selectedValue;
          const Icon = opt.icon;

          return (
            <TouchableOpacity
              key={String(opt.value)}
              onPress={() => handleSelect(opt.value)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={opt.accessibilityLabel || opt.label}
              style={[
                styles.button,
                {
                  minHeight: isSm ? 28 : 36,
                  paddingVertical: isSm ? 4 : 6,
                  paddingHorizontal: isSm ? 6 : 10,
                },
              ]}
            >
              {Icon && (
                <Icon
                  size={isSm ? 13 : 15}
                  color={isSelected ? colors.primary : colors.textTertiary}
                  style={{ marginRight: 5 }}
                />
              )}
              <Text
                style={[
                  isSm ? typography.caption2 : typography.footnote,
                  {
                    color: isSelected ? colors.textPrimary : colors.textSecondary,
                    fontWeight: isSelected ? '600' : '500',
                  },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  slidingPill: {
    position: 'absolute',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
