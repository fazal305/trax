// Thin wrapper around localStorage: centralizes JSON (de)serialization and
// failure handling (quota exceeded, corrupted JSON, disabled storage) so
// reducers never touch `window.localStorage` directly.
export const storageService = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore — nothing meaningful to recover from a blocked removeItem.
    }
  },
};
