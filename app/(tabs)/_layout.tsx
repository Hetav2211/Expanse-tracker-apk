import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, ReceiptText, TrendingUp, Settings } from 'lucide-react-native';
import { useTheme } from '../../src/theme';
import { Platform, StyleSheet } from 'react-native';

export default function TabLayout() {
  const { theme } = useTheme();
  const { colors, typography, isDark } = theme;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.separator,
          borderTopWidth: 0.5,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          // Dark mode: NO drop shadow
          // Light mode: None (0.5px hairline separation is Apple standard)
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          ...typography.caption2,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarAccessibilityLabel: 'Dashboard Tab',
          tabBarIcon: ({ color }) => <LayoutDashboard size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarAccessibilityLabel: 'Transactions History Tab',
          tabBarIcon: ({ color }) => <ReceiptText size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarAccessibilityLabel: 'Analytics & Insights Tab',
          tabBarIcon: ({ color }) => <TrendingUp size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarAccessibilityLabel: 'App Settings & Preferences Tab',
          tabBarIcon: ({ color }) => <Settings size={22} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}
