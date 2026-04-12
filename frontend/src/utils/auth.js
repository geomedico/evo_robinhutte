/**
 * Secure token storage utilities
 * Uses sessionStorage by default for better security (cleared on browser close)
 * Tokens are only accessible to same-origin scripts
 */

const TOKEN_KEY = "evo_token";

// Use sessionStorage for security (auto-clears on browser close)
// For persistent login, consider HTTP-only cookies with backend support
const storage = window.sessionStorage;

export const getToken = () => {
  try {
    return storage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) {
      storage.setItem(TOKEN_KEY, token);
    } else {
      storage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Storage unavailable (private browsing, etc.)
  }
};

export const removeToken = () => {
  try {
    storage.removeItem(TOKEN_KEY);
  } catch {
    // Storage unavailable
  }
};

// Migrate from localStorage if exists (one-time migration)
export const migrateFromLocalStorage = () => {
  try {
    const oldToken = localStorage.getItem(TOKEN_KEY);
    if (oldToken) {
      storage.setItem(TOKEN_KEY, oldToken);
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore migration errors
  }
};
