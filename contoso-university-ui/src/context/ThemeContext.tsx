/**
 * Theme Context for Dark Mode Support
 *
 * This module provides a React Context for managing the application's color theme.
 * It handles:
 * - Reading/writing theme preference to localStorage
 * - Detecting system color scheme preference via matchMedia API
 * - Listening for system preference changes when in 'system' mode
 * - Applying the appropriate CSS class to the document root element
 *
 * Educational Notes:
 * - The theme is applied by adding/removing the 'dark' class on <html>
 * - Tailwind CSS uses this class to activate dark: variant styles
 * - localStorage provides persistence across browser sessions
 * - matchMedia API detects OS-level dark mode preference
 */

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type {
  ThemeMode,
  ResolvedTheme,
  ThemeContextValue,
  ThemeProviderProps,
} from "@/types/theme";

// Default configuration values
const DEFAULT_THEME: ThemeMode = "system";
const DEFAULT_STORAGE_KEY = "theme";

/**
 * React Context for theme state.
 * Use the useTheme() hook to access this context in components.
 */
export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

/**
 * Safely read from localStorage with error handling.
 *
 * Why error handling? localStorage can throw in private browsing mode
 * or when storage quota is exceeded. We gracefully fall back to defaults.
 */
function getStoredTheme(storageKey: string): ThemeMode | null {
  try {
    const stored = localStorage.getItem(storageKey);
    // Validate that stored value is a valid ThemeMode
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage may be unavailable (private browsing, etc.)
    console.warn("Could not access localStorage for theme preference");
  }
  return null;
}

/**
 * Safely write to localStorage with error handling.
 */
function setStoredTheme(storageKey: string, theme: ThemeMode): void {
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // Silently fail if localStorage unavailable or quota exceeded
    console.warn("Could not save theme preference to localStorage");
  }
}

/**
 * Detect the operating system's color scheme preference.
 *
 * Uses the matchMedia API to check the 'prefers-color-scheme' media query.
 * This reflects the user's OS-level dark mode setting.
 */
function getSystemTheme(): ResolvedTheme {
  // Guard for SSR or environments without matchMedia
  if (typeof window === "undefined" || !window.matchMedia) {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Apply the resolved theme to the document by toggling the 'dark' class.
 *
 * The 'dark' class on <html> activates Tailwind's dark: variant styles.
 * This is applied to documentElement (html) rather than body for proper
 * scoping of CSS variables defined in :root and .dark selectors.
 */
function applyThemeToDocument(resolvedTheme: ResolvedTheme): void {
  const root = document.documentElement;
  if (resolvedTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/**
 * ThemeProvider component that manages theme state and provides context.
 *
 * Usage:
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * Configuration options:
 * - defaultTheme: Initial theme when no preference is stored (default: 'system')
 * - storageKey: localStorage key for persistence (default: 'theme')
 */
export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = DEFAULT_STORAGE_KEY,
}: ThemeProviderProps) {
  // Initialize theme from localStorage or use default
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return getStoredTheme(storageKey) ?? defaultTheme;
  });

  // Calculate the resolved theme (actual theme being displayed)
  const resolvedTheme = useMemo<ResolvedTheme>(() => {
    if (theme === "system") {
      return getSystemTheme();
    }
    return theme;
  }, [theme]);

  // Memoized setter that also persists to localStorage
  const setTheme = useCallback(
    (newTheme: ThemeMode) => {
      setStoredTheme(storageKey, newTheme);
      setThemeState(newTheme);
    },
    [storageKey]
  );

  // Apply theme to document whenever resolved theme changes
  useEffect(() => {
    applyThemeToDocument(resolvedTheme);
  }, [resolvedTheme]);

  // Listen for system preference changes when in 'system' mode
  // This allows the app to update immediately when the user changes their OS theme
  useEffect(() => {
    // Only listen when in 'system' mode
    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent) => {
      // Apply the new system preference
      applyThemeToDocument(event.matches ? "dark" : "light");
    };

    // Modern browsers use addEventListener
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
