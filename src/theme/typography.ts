// ===== Apple SF Pro Typography Scale =====
import type { TextStyle } from 'react-native';

let fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", system-ui, sans-serif';
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Platform } = require('react-native');
  if (Platform && Platform.select) {
    fontFamily = Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", system-ui, sans-serif',
    });
  }
} catch {
  // Fallback in Node test environments where react-native runtime is not present
}

export const typography = {
  // Apple HIG Large Title (34px, Bold, -0.022em tracking = -0.75px)
  largeTitle: {
    fontFamily,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 41,
    letterSpacing: -0.75,
  } as TextStyle,

  // Apple HIG Title 1 (28px, Bold, -0.018em tracking = -0.50px)
  title1: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.5,
  } as TextStyle,

  // Apple HIG Title 2 (22px, Semibold, -0.014em tracking = -0.30px)
  title2: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.3,
  } as TextStyle,

  // Apple HIG Title 3 (20px, Semibold, -0.012em tracking = -0.24px)
  title3: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 25,
    letterSpacing: -0.24,
  } as TextStyle,

  // Apple HIG Headline (17px, Semibold, -0.024em tracking = -0.41px)
  headline: {
    fontFamily,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.41,
  } as TextStyle,

  // Apple HIG Body (17px, Regular, -0.024em tracking = -0.41px)
  body: {
    fontFamily,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.41,
  } as TextStyle,

  // Apple HIG Callout (16px, Regular, -0.020em tracking = -0.32px)
  callout: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: -0.32,
  } as TextStyle,

  // Apple HIG Subheadline (15px, Regular, -0.016em tracking = -0.24px)
  subheadline: {
    fontFamily,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.24,
  } as TextStyle,

  // Alias for backward compatibility
  subhead: {
    fontFamily,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.24,
  } as TextStyle,

  // Apple HIG Footnote (13px, Regular, -0.006em tracking = -0.08px)
  footnote: {
    fontFamily,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: -0.08,
  } as TextStyle,

  // Apple HIG Caption 1 (12px, Regular, 0 tracking = 0px)
  caption1: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0,
  } as TextStyle,

  // Apple HIG Caption 2 (11px, Medium, +0.006em tracking = +0.07px)
  caption2: {
    fontFamily,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 13,
    letterSpacing: 0.07,
  } as TextStyle,

  // Numeric Alignment (Mandatory fontVariant: tabular-nums for financial metrics)
  amount: {
    fontFamily,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.41,
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
  } as TextStyle,

  amountLarge: {
    fontFamily,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 41,
    letterSpacing: -0.75,
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
  } as TextStyle,

  // Backward-compatibility aliases
  displayLarge: {
    fontFamily,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 41,
    letterSpacing: -0.75,
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
  } as TextStyle,

  displayMedium: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
  } as TextStyle,

  h1: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.5,
  } as TextStyle,

  h2: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.3,
  } as TextStyle,

  h3: {
    fontFamily,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.19,
  } as TextStyle,

  bodyLarge: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: -0.13,
  } as TextStyle,

  bodySmall: {
    fontFamily,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: -0.03,
  } as TextStyle,

  label: {
    fontFamily,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.09,
  } as TextStyle,

  labelSmall: {
    fontFamily,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0,
  } as TextStyle,

  caption: {
    fontFamily,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 13,
    letterSpacing: 0.07,
  } as TextStyle,
} as const;

export type Typography = typeof typography;
