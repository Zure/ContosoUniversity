# Data Model: Dark Mode Theme Support

**Feature**: 004-dark-mode  
**Date**: 2025-12-05  
**Status**: Complete

## Overview

This feature is frontend-only and uses browser localStorage for persistence. No database entities or API changes are required.

## TypeScript Type Definitions

### Theme Types

```typescript
// src/types/theme.ts

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
 */
export type ResolvedTheme = "light" | "dark";

/**
 * Theme context value exposed to components.
 */
export interface ThemeContextValue {
  /** Current user-selected theme mode */
  theme: ThemeMode;

  /** Resolved theme after applying system preference logic */
  resolvedTheme: ResolvedTheme;

  /** Update the theme mode */
  setTheme: (theme: ThemeMode) => void;
}

/**
 * Props for the ThemeProvider component.
 */
export interface ThemeProviderProps {
  /** Child components that will have access to theme context */
  children: React.ReactNode;

  /** Default theme mode when no preference is stored */
  defaultTheme?: ThemeMode;

  /** localStorage key for persisting theme preference */
  storageKey?: string;
}
```

## State Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Theme State Machine                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐    setTheme('dark')    ┌──────────┐               │
│  │  LIGHT   │ ───────────────────────▶│   DARK   │               │
│  │  mode    │◀─────────────────────── │   mode   │               │
│  └──────────┘    setTheme('light')   └──────────┘               │
│       │                                    │                     │
│       │ setTheme('system')                 │ setTheme('system')  │
│       ▼                                    ▼                     │
│  ┌─────────────────────────────────────────────────┐            │
│  │                  SYSTEM mode                      │            │
│  │  ┌─────────────────────────────────────────┐     │            │
│  │  │  Resolved by OS preference:              │     │            │
│  │  │  - prefers-color-scheme: dark → DARK    │     │            │
│  │  │  - prefers-color-scheme: light → LIGHT  │     │            │
│  │  └─────────────────────────────────────────┘     │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Storage Schema

### localStorage

| Key     | Type                            | Default    | Description                |
| ------- | ------------------------------- | ---------- | -------------------------- |
| `theme` | `'light' \| 'dark' \| 'system'` | `'system'` | User's selected theme mode |

**Example stored values**:

```json
// User selected dark mode explicitly
{"theme": "dark"}

// User selected to follow system preference
{"theme": "system"}
```

## CSS Class Application

The theme is applied by adding/removing the `dark` class on the `<html>` element:

| Theme Mode | System Preference | Class on `<html>` | Resulting Theme |
| ---------- | ----------------- | ----------------- | --------------- |
| `light`    | (ignored)         | (none)            | Light           |
| `dark`     | (ignored)         | `dark`            | Dark            |
| `system`   | light             | (none)            | Light           |
| `system`   | dark              | `dark`            | Dark            |

## Validation Rules

| Rule                     | Validation                   | Fallback                |
| ------------------------ | ---------------------------- | ----------------------- |
| Invalid stored value     | Check against allowed values | Default to `'system'`   |
| localStorage unavailable | Try/catch around access      | Use `'system'` mode     |
| matchMedia unavailable   | Check for API existence      | Assume light preference |

## Relationships

```
┌─────────────────┐     provides     ┌─────────────────┐
│  ThemeProvider  │ ───────────────▶ │  ThemeContext   │
└─────────────────┘                  └─────────────────┘
         │                                   │
         │ wraps                             │ consumed by
         ▼                                   ▼
┌─────────────────┐                  ┌─────────────────┐
│   AppLayout     │                  │   useTheme()    │
└─────────────────┘                  └─────────────────┘
                                             │
                                             │ used in
                                             ▼
                                     ┌─────────────────┐
                                     │  ThemeToggle    │
                                     └─────────────────┘
```

## No Backend Changes

This feature requires no backend modifications:

- No database schema changes
- No API endpoints
- No server-side rendering considerations
- Pure client-side implementation
