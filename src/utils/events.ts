// ===== Lightweight Event Emitter for Cross-Screen Sync =====
type Listener = () => void;

class AppEventEmitter {
  private listeners: Map<string, Set<Listener>> = new Map();

  on(event: string, listener: Listener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }

  emit(event: string): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((listener) => {
        try {
          listener();
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
  }
}

export const appEvents = new AppEventEmitter();

export const EVENTS = {
  EXPENSES_CHANGED: 'EXPENSES_CHANGED',
  CATEGORIES_CHANGED: 'CATEGORIES_CHANGED',
  BUDGETS_CHANGED: 'BUDGETS_CHANGED',
};
