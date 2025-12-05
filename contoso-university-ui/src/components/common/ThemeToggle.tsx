/**
 * ThemeToggle Component
 *
 * A dropdown menu button that allows users to switch between light, dark,
 * and system color themes. Uses shadcn/ui DropdownMenu for accessibility
 * and consistent styling.
 *
 * Accessibility Features (via shadcn/ui):
 * - Keyboard navigation: Tab to focus, Enter/Space to open, Arrow keys to navigate
 * - Screen reader support: Announces current state and available options
 * - Focus management: Returns focus to trigger after selection
 * - Escape to close without selection
 *
 * Usage:
 * ```tsx
 * <ThemeToggle />
 * ```
 */

import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          {/* Sun icon: visible in light mode, hidden in dark mode */}
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          {/* Moon icon: hidden in light mode, visible in dark mode */}
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          {/* Screen reader only label for accessibility */}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
