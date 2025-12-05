# Research: Dark Mode Theme Support

**Feature**: 004-dark-mode  
**Date**: 2025-12-05  
**Status**: Complete

## Research Questions

### 1. How to implement theme toggling with shadcn/ui?

**Decision**: Use shadcn/ui `DropdownMenu` component for a 3-option theme selector (Light, Dark, System)

**Rationale**:

- shadcn/ui officially recommends using DropdownMenu for theme toggles (see shadcn/ui docs)
- Provides accessibility out of the box (keyboard navigation, ARIA labels)
- Allows for 3 options (Light/Dark/System) instead of just binary toggle
- Consistent with project's design system standards (Constitution Principle IX)

**Alternatives Considered**:

- Simple Button toggle: Rejected - only supports 2 states, no "System" option
- Custom dropdown: Rejected - reinventing what shadcn/ui already provides
- Switch component: Rejected - semantically incorrect for 3 options

**Implementation Pattern**:

```tsx
// ThemeToggle using DropdownMenu
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
    <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
    <DropdownMenuItem onClick={() => setTheme("system")}>
      System
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### 2. How to detect system color scheme preference?

**Decision**: Use `window.matchMedia('(prefers-color-scheme: dark)')` API

**Rationale**:

- Native browser API with excellent support (all evergreen browsers)
- Provides both initial detection and change listener
- No external dependencies required

**Implementation Pattern**:

```typescript
// Detect system preference
const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

// Listen for system preference changes
useEffect(() => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = (e: MediaQueryListEvent) => {
    if (theme === "system") {
      applyTheme(e.matches ? "dark" : "light");
    }
  };
  mediaQuery.addEventListener("change", handleChange);
  return () => mediaQuery.removeEventListener("change", handleChange);
}, [theme]);
```

**Browser Support**:

- Chrome 76+, Firefox 67+, Safari 12.1+, Edge 79+ (all within "latest 2 versions" requirement)

---

### 3. How to persist theme preference in localStorage?

**Decision**: Store theme mode ('light' | 'dark' | 'system') in localStorage with key `theme`

**Rationale**:

- localStorage persists across browser sessions (unlike sessionStorage)
- Synchronous API allows reading before React hydration (prevents FOUC)
- Simple key-value storage, no need for complex serialization

**Implementation Pattern**:

```typescript
const THEME_KEY = "theme";

// Read with fallback
const getStoredTheme = (): Theme => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage may be unavailable (private browsing, etc.)
  }
  return "system"; // Default to system preference
};

// Write with error handling
const setStoredTheme = (theme: Theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Silently fail if localStorage unavailable
  }
};
```

**Edge Cases Handled**:

- localStorage disabled → Falls back to 'system'
- Invalid stored value → Falls back to 'system'
- Storage quota exceeded → Silently continues with current theme

---

### 4. How to prevent "Flash of Unstyled Content" (FOUC)?

**Decision**: Add inline script in `index.html` that runs before React hydration

**Rationale**:

- Script runs synchronously before any content renders
- Can read localStorage and apply `.dark` class immediately
- No visual flash because theme is applied before first paint

**Implementation Pattern**:

```html
<!-- In index.html, before </head> -->
<script>
  (function () {
    const theme = localStorage.getItem("theme");
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = theme === "dark" || (theme !== "light" && systemDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  })();
</script>
```

**Why `<html>` element**:

- Tailwind's dark mode applies via `dark:` prefix
- Classes on `<html>` affect entire document
- Consistent with shadcn/ui's recommended approach

---

### 5. How to structure the Theme Context?

**Decision**: Create `ThemeContext` with provider and custom `useTheme` hook

**Rationale**:

- React Context is the constitutional standard for global state (Principle VII)
- Custom hook provides clean API and TypeScript autocomplete
- Single source of truth for theme state across all components

**Implementation Pattern**:

```typescript
// types/theme.ts
export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

// context/ThemeContext.tsx
interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
}

// hooks/useTheme.ts
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

---

### 6. What icons to use for the theme toggle?

**Decision**: Use `Sun` and `Moon` icons from lucide-react (already installed)

**Rationale**:

- lucide-react is already a project dependency
- Sun/Moon are universally recognized symbols for light/dark mode
- Consistent with shadcn/ui examples and industry standards

**Icon States**:

- Light mode active → Sun icon visible
- Dark mode active → Moon icon visible
- System mode → Show icon matching current resolved theme

---

## Dependencies to Add

| Dependency                    | Version | Purpose                | How to Add                            |
| ----------------------------- | ------- | ---------------------- | ------------------------------------- |
| @radix-ui/react-dropdown-menu | ^2.x    | DropdownMenu primitive | `npx shadcn@latest add dropdown-menu` |

**Note**: lucide-react, @radix-ui/react-slot, class-variance-authority already installed.

---

## Summary

All research questions resolved. The implementation will:

1. Add shadcn/ui `DropdownMenu` component
2. Create `ThemeContext` with provider and `useTheme` hook
3. Build `ThemeToggle` component using DropdownMenu
4. Add inline script to `index.html` to prevent FOUC
5. Integrate toggle into Navigation component
6. Use localStorage for persistence with graceful fallback
7. Detect system preference with `matchMedia` API
