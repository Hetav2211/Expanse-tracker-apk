// ===== Spacing Scale (Apple 4pt/8pt Grid) =====

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

// Apple HIG Concentric Corner Radii
// Rule: R_outer = R_inner + Padding
export const borderRadius = {
  xs: 6,      // micro-badges, tags
  sm: 10,     // small pills, nested chips
  md: 12,     // buttons, inputs, segmented controls
  lg: 16,     // cards, inset grouped table rows
  xl: 20,     // outer container (12 inner + 8 padding = 20 outer)
  '2xl': 24,  // modal sheets, dialogs
  full: 9999, // pure circular buttons / avatars
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
