// ===== Apple Human Interface Guidelines (HIG) Color Palettes =====
// Conforming to Apple First-Party UI/UX Architecture (Principal Level)

export const lightColors = {
  // Apple HIG Light Surfaces (Table 3.A)
  // Level 0: Primary Canvas Background (Grouped)
  background: '#F2F2F7',
  // Level 1: Secondary Container (Card / Grouped Cell)
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  // Level 2: Tertiary Input Well / Nested Well
  surfaceMuted: '#F2F2F7',
  surfaceInset: '#F2F2F7',
  surfacePressed: 'rgba(0, 0, 0, 0.06)',
  card: '#FFFFFF',
  inputBg: '#F2F2F7',
  // Level 3: Floating / Popover / Pill
  surfaceFloating: 'rgba(255, 255, 255, 0.82)',

  // Specular Hairline (Chamfered edge rim light - Section 1.A)
  specularHairline: 'rgba(0, 0, 0, 0.06)',

  // Legacy neumorphic stubs (transparent so no neumorphic shadows render)
  neuLight: 'transparent',
  neuDark: 'transparent',
  borderHighlight: 'transparent',
  borderShadow: 'transparent',

  // Semantic Foreground Hierarchy (4-Tier Opacity System - Section 3.B)
  textPrimary: '#000000',                     // 100% opacity
  textSecondary: 'rgba(60, 60, 67, 0.60)',    // 60% opacity
  textTertiary: 'rgba(60, 60, 67, 0.30)',     // 30% opacity
  textQuaternary: 'rgba(60, 60, 67, 0.18)',   // 18% opacity
  quaternaryFill: 'rgba(60, 60, 67, 0.18)',   // 18% opacity
  textInverse: '#FFFFFF',

  // Primary System Tint (Apple iOS System Blue)
  primary: '#007AFF',
  primaryLight: 'rgba(0, 122, 255, 0.12)',
  primaryDark: '#0056B3',

  // Semantic Colors (Apple HIG Standard)
  success: '#34C759',
  successLight: 'rgba(52, 199, 89, 0.12)',
  warning: '#FF9500',
  warningLight: 'rgba(255, 149, 0, 0.12)',
  danger: '#FF3B30',
  dangerLight: 'rgba(255, 59, 48, 0.12)',
  info: '#007AFF',
  infoLight: 'rgba(0, 122, 255, 0.12)',

  // Additional Apple HIG Accent Tints
  purple: '#AF52DE',
  indigo: '#5856D6',
  teal: '#5AC8FA',
  mint: '#00C7BE',
  yellow: '#FFCC00',

  // Borders & Separators (0.5pt Apple hairline)
  border: 'rgba(60, 60, 67, 0.18)',
  borderLight: 'rgba(60, 60, 67, 0.08)',
  divider: 'rgba(60, 60, 67, 0.20)',
  separator: 'rgba(60, 60, 67, 0.29)',

  // Shadow (Subtle diffused light-mode ambient elevation shadow, Section 5.A)
  shadowColor: 'rgba(0, 0, 0, 0.06)',

  // Tab Bar (Frosted glass appearance)
  tabBarBackground: 'rgba(249, 249, 249, 0.88)',
  tabBarBorder: 'rgba(60, 60, 67, 0.20)',
  tabBarActive: '#007AFF',
  tabBarInactive: 'rgba(60, 60, 67, 0.45)',

  // Status bar
  statusBarStyle: 'dark-content' as 'dark-content' | 'light-content',

  // Charts
  chartBar: '#007AFF',
  chartBarSecondary: 'rgba(0, 122, 255, 0.35)',
  chartGrid: 'rgba(60, 60, 67, 0.08)',
  chartLabel: 'rgba(60, 60, 67, 0.60)',
};

export const darkColors = {
  // Apple HIG Dark Surfaces (Elevation = Luminance - Table 3.A)
  // Level 0: Pure OLED Canvas
  background: '#000000',
  // Level 1: Elevated Card / Inset Grouped Cell
  surface: '#1C1C1E',
  // Level 2: Popover / Modal Sheet / Tertiary Input Well
  surfaceElevated: '#2C2C2E',
  surfaceMuted: '#2C2C2E',
  // Level 2: Nested input well
  surfaceInset: '#2C2C2E',
  surfacePressed: 'rgba(255, 255, 255, 0.08)',
  card: '#1C1C1E',
  inputBg: '#2C2C2E',
  // Level 3: Floating / Popover / Pill (Blurred optical glass)
  surfaceFloating: 'rgba(44, 44, 46, 0.78)',

  // Specular Hairline (0.5px top rim light - Section 1.A & 5.A)
  specularHairline: 'rgba(255, 255, 255, 0.12)',

  // Legacy neumorphic stubs (transparent)
  neuLight: 'transparent',
  neuDark: 'transparent',
  borderHighlight: 'transparent',
  borderShadow: 'transparent',

  // Semantic Foreground Hierarchy (4-Tier Opacity System - Section 3.B)
  textPrimary: '#FFFFFF',                     // 100% opacity
  textSecondary: 'rgba(235, 235, 245, 0.60)', // 60% opacity
  textTertiary: 'rgba(235, 235, 245, 0.30)',  // 30% opacity
  textQuaternary: 'rgba(235, 235, 245, 0.18)',// 18% opacity
  quaternaryFill: 'rgba(235, 235, 245, 0.18)',// 18% opacity
  textInverse: '#000000',

  // Primary System Tint (Apple Dark Mode System Blue)
  primary: '#0A84FF',
  primaryLight: 'rgba(10, 132, 255, 0.18)',
  primaryDark: '#409CFF',

  // Semantic Colors (Apple Dark Mode HIG Standard)
  success: '#30D158',
  successLight: 'rgba(48, 209, 88, 0.18)',
  warning: '#FF9F0A',
  warningLight: 'rgba(255, 159, 10, 0.18)',
  danger: '#FF453A',
  dangerLight: 'rgba(255, 69, 58, 0.18)',
  info: '#0A84FF',
  infoLight: 'rgba(10, 132, 255, 0.18)',

  // Additional Apple HIG Accent Tints (Dark)
  purple: '#BF5AF2',
  indigo: '#5E5CE6',
  teal: '#64D2FF',
  mint: '#66D4CF',
  yellow: '#FFD60A',

  // Borders & Separators (0.5pt Apple hairline)
  border: 'rgba(84, 84, 88, 0.45)',
  borderLight: 'rgba(255, 255, 255, 0.08)',
  divider: 'rgba(84, 84, 88, 0.55)',
  separator: 'rgba(84, 84, 88, 0.65)',

  // Shadow (Apple Dark Mode uses NO drop shadows; elevation is luminance shift)
  shadowColor: 'transparent',

  // Tab Bar (Frosted glass appearance)
  tabBarBackground: 'rgba(28, 28, 30, 0.88)',
  tabBarBorder: 'rgba(84, 84, 88, 0.50)',
  tabBarActive: '#0A84FF',
  tabBarInactive: 'rgba(235, 235, 245, 0.45)',

  // Status bar
  statusBarStyle: 'light-content' as 'dark-content' | 'light-content',

  // Charts
  chartBar: '#0A84FF',
  chartBarSecondary: 'rgba(10, 132, 255, 0.35)',
  chartGrid: 'rgba(84, 84, 88, 0.20)',
  chartLabel: 'rgba(235, 235, 245, 0.60)',
};

export type ThemeColors = typeof lightColors;

