// ===== Centralized Haptics Manager =====
import * as Haptics from 'expo-haptics';

// In-memory preference (default false so user is not annoyed by constant vibrations on mobile)
let hapticsEnabled = false;

export function setHapticsEnabled(enabled: boolean): void {
  hapticsEnabled = enabled;
}

export function isHapticsEnabled(): boolean {
  return hapticsEnabled;
}

/**
 * Trigger subtle tap feedback only if enabled
 */
export function triggerLightImpact(): void {
  if (!hapticsEnabled) return;
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  } catch {}
}

/**
 * Trigger medium impact (e.g. for key actions)
 */
export function triggerMediumImpact(): void {
  if (!hapticsEnabled) return;
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  } catch {}
}

/**
 * Trigger selection feedback (e.g. tab/chip selection)
 */
export function triggerSelection(): void {
  if (!hapticsEnabled) return;
  try {
    Haptics.selectionAsync().catch(() => {});
  } catch {}
}

/**
 * Trigger success notification (e.g. on successful save)
 */
export function triggerSuccess(): void {
  if (!hapticsEnabled) return;
  try {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  } catch {}
}

/**
 * Trigger error notification
 */
export function triggerError(): void {
  if (!hapticsEnabled) return;
  try {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  } catch {}
}
