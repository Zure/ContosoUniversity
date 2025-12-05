/**
 * Theme Type Definitions for Dark Mode Support
 *
 * This module defines the TypeScript types used throughout the theme system.
 * The theme supports three modes: explicit light, explicit dark, or following
 * the user's operating system preference (system).
 */

/**
 * User-selectable theme mode.
 * - 'light': Force light theme regardless of system preference
 * - 'dark': Force dark theme regardless of system preference
 * - 'system': Follow operating system preference
 */
export type ThemeMode = "light" | "dark" | "system";

/**
 * The actual theme being displayed.
 * This is the resolved value after considering system preference.
 * When ThemeMode is 'system', this reflects the OS preference.
 */
export type ResolvedTheme = "light" | "dark";

/**
 * Theme context value exposed to components via useTheme() hook.
 */
export interface ThemeContextValue {
  /** Current user-selected theme mode */
  theme: ThemeMode;

  /** Resolved theme after applying system preference logic */
  resolvedTheme: ResolvedTheme;

  /** Update the theme mode - also persists to localStorage */
  setTheme: (theme: ThemeMode) => void;
}

/**
 * Props for the ThemeProvider component.
 */
export interface ThemeProviderProps {
  /** Child components that will have access to theme context */
  children: React.ReactNode;

  /** Default theme mode when no preference is stored (defaults to 'system') */
  defaultTheme?: ThemeMode;

  /** localStorage key for persisting theme preference (defaults to 'theme') */
  storageKey?: string;
}
