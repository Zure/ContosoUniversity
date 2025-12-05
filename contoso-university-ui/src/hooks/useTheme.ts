/**
 * useTheme Hook
 *
 * Custom hook that provides access to the theme context.
 * This is the primary way components should interact with the theme system.
 *
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   const { theme, resolvedTheme, setTheme } = useTheme();
 *
 *   return (
 *     <button onClick={() => setTheme('dark')}>
 *       Current theme: {resolvedTheme}
 *     </button>
 *   );
 * }
 * ```
 *
 * Returns:
 * - theme: The user's selected mode ('light' | 'dark' | 'system')
 * - resolvedTheme: The actual theme being displayed ('light' | 'dark')
 * - setTheme: Function to change the theme mode
 */

import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import type { ThemeContextValue } from "@/types/theme";

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      "useTheme must be used within a ThemeProvider. " +
        "Make sure to wrap your application with <ThemeProvider> in AppLayout."
    );
  }

  return context;
}
