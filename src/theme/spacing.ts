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

// Apple HIG Concentric Corner Radii (Section 1.C & 2.A)
// Formula: R_inner = max(0, R_outer - Padding)
export const borderRadius = {
  xs: 6,      // micro-badges, tags
  sm: 10,     // small pills, nested chips
  md: 12,     // buttons, inputs, segmented controls
  lg: 16,     // cards, inset grouped table rows
  xl: 20,     // outer container
  '2xl': 24,  // modal sheets, dialogs
  full: 9999, // pure circular buttons / avatars
} as const;

/**
 * Calculates the concentric inner border radius given an outer radius and internal padding.
 * Apple Concentric Harmony Formula: R_inner = max(0, R_outer - Padding)
 */
export function concentricRadius(outerRadius: number, padding: number): number {
  return Math.max(0, outerRadius - padding);
}

// Apple Physics-Based Motion Constants (Section 6.A)
export const springCurves = {
  // Snappy micro-interaction: buttons, toggles, hover/press states
  snappy: {
    mass: 1.0,
    stiffness: 400,
    damping: 28,
    durationMs: 220,
    bezier: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
  // Spatial navigation: sheets, modals, page push (critically damped, zero overshoot)
  navigation: {
    mass: 1.0,
    stiffness: 280,
    damping: 30,
    bezier: 'cubic-bezier(0.32, 0.72, 0, 1)',
  },
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;

