import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../src/theme';
import { getDatabase } from '../src/db/database';
import { ErrorBoundary as SafeErrorBoundary } from '../src/components/ErrorBoundary';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontError) console.error('Font error:', fontError);
  }, [fontError]);

  useEffect(() => {
    async function init() {
      try {
        await getDatabase();
        setDbReady(true);
      } catch (e) {
        console.error('Failed to initialize database:', e);
        setDbReady(true); // Allow app to open anyway
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (fontsLoaded && dbReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, dbReady]);

  if (!fontsLoaded || !dbReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SafeErrorBoundary fallbackTitle="Application Error" fallbackMessage="The application encountered an unexpected state. Tap below to reload.">
          <NavigationStack />
        </SafeErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function NavigationStack() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="expense/new"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="expense/[id]"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="categories/index"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="budgets/index"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </>
  );
}
