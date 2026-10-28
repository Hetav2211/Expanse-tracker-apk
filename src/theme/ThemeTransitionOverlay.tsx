// ===== Apple HIG Smooth Appearance Transition Overlay =====
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Animated, Platform, Easing } from 'react-native';
import { useTheme } from './index';
import { lightColors, darkColors } from './colors';

export function ThemeTransitionOverlay() {
  const { theme } = useTheme();
  const { isDark } = theme;

  const prevIsDarkRef = useRef<boolean | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [outgoingBg, setOutgoingBg] = useState<string>('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // On Web: inject hardware-accelerated CSS transition once
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'apple-theme-transition-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          body, #root, [data-theme-transition] {
            transition: background-color 220ms cubic-bezier(0.22, 1, 0.36, 1),
                        border-color 220ms cubic-bezier(0.22, 1, 0.36, 1);
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  useEffect(() => {
    // Initial mount - don't trigger transition
    if (prevIsDarkRef.current === null) {
      prevIsDarkRef.current = isDark;
      return;
    }

    if (prevIsDarkRef.current !== isDark) {
      const wasDark = prevIsDarkRef.current;
      prevIsDarkRef.current = isDark;

      // Previous background color to crossfade from
      const prevColor = wasDark ? darkColors.background : lightColors.background;
      setOutgoingBg(prevColor);
      setTransitioning(true);

      fadeAnim.setValue(1);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 220, // 220ms Apple Snappy transition duration
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        setTransitioning(false);
      });
    }
  }, [isDark, fadeAnim]);

  if (!transitioning || !outgoingBg) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        styles.overlay,
        {
          backgroundColor: outgoingBg,
          opacity: fadeAnim,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    zIndex: 999999,
  },
});
