// ===== Apple SF Pro Typography Scale =====
import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", system-ui, sans-serif',
});

export const typography = {
  // Apple HIG Large Title (34pt, Bold, -0.022em tracking)
  largeTitle: {
    fontFamily,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 41,
    letterSpacing: -0.75,
  } as TextStyle,

  // Apple HIG Title 1 (28pt, Bold, -0.018em tracking)
  title1: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.5,
  } as TextStyle,

  // Apple HIG Title 2 (22pt, Semibold, -0.014em tracking)
  title2: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.3,
  } as TextStyle,

  // Apple HIG Title 3 (20pt, Semibold, -0.012em tracking)
  title3: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 25,
    letterSpacing: -0.24,
  } as TextStyle,

  // Apple HIG Headline (17pt, Semibold, -0.011em tracking)
  headline: {
    fontFamily,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.19,
  } as TextStyle,

  // Apple HIG Body (17pt, Regular, -0.011em tracking)
  body: {
    fontFamily,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.19,
  } as TextStyle,

  // Apple HIG Callout (16pt, Regular, -0.008em tracking)
  callout: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: -0.13,
  } as TextStyle,

  // Apple HIG Subhead (15pt, Regular, -0.006em tracking)
  subhead: {
    fontFamily,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.09,
  } as TextStyle,

  // Apple HIG Footnote (13pt, Regular, -0.002em tracking)
  footnote: {
    fontFamily,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: -0.03,
  } as TextStyle,

  // Apple HIG Caption 1 (12pt, Regular, 0 tracking)
  caption1: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0,
  } as TextStyle,

  // Apple HIG Caption 2 (11pt, Medium, +0.006em tracking)
  caption2: {
    fontFamily,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 13,
    letterSpacing: 0.07,
  } as TextStyle,

  // Numeric Alignment (Mandatory fontVariant: tabular-nums)
  amount: {
    fontFamily,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.19,
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
