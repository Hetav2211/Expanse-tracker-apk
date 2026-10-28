// ===== Apple HIG Safe Area Container (Guaranteed Cross-Platform Notch & Status Bar Insets) =====
import React from 'react';
import { View, StyleSheet, Platform, StatusBar, ViewStyle, StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface AppSafeAreaViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

/**
 * Robust cross-platform safe area container.
 * Solves React Native's core SafeAreaView limitation on Android where status bar insets
 * are ignored, causing headers ("Cancel", "Done", screen titles) to hide under the status bar.
 */
export function AppSafeAreaView({
  children,
  style,
  edges = ['top', 'bottom', 'left', 'right'],
}: AppSafeAreaViewProps) {
  const insets = useSafeAreaInsets();

  // On Android, status bar height is typically 24dp to 48dp (depending on camera punch-hole/notch)
  const androidStatusBar = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;
  
  const topPadding = edges.includes('top')
    ? Math.max(insets?.top || 0, androidStatusBar)
    : 0;
  const bottomPadding = edges.includes('bottom') ? (insets?.bottom || 0) : 0;
  const leftPadding = edges.includes('left') ? (insets?.left || 0) : 0;
  const rightPadding = edges.includes('right') ? (insets?.right || 0) : 0;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: topPadding,
          paddingBottom: bottomPadding,
          paddingLeft: leftPadding,
          paddingRight: rightPadding,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
