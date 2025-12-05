# Implementation Plan: Dark Mode Theme Support

**Branch**: `004-dark-mode` | **Date**: 2025-12-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-dark-mode/spec.md`

## Summary

Add a dark mode toggle to the Contoso University React application. The design system already includes complete dark mode CSS variables in `globals.css` (`:root` for light, `.dark` for dark). This feature requires creating a theme context for state management, a dropdown toggle component using shadcn/ui, integrating into the navigation header, and handling persistence/system preference detection.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.x  
**Primary Dependencies**: React, shadcn/ui (DropdownMenu), Tailwind CSS 4.x, lucide-react (icons)  
**Storage**: localStorage (browser) for theme persistence  
**Testing**: Manual testing (no automated test framework currently configured)  
**Target Platform**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)  
**Project Type**: Web application (frontend only - no backend changes required)  
**Performance Goals**: Theme switch < 200ms, no flash of wrong theme on load  
**Constraints**: Must work offline, graceful fallback when localStorage unavailable  
**Scale/Scope**: Single React SPA with ~10 pages, all using shadcn/ui components

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Requirement                               | Status                             |
| ------------------------------------ | ----------------------------------------- | ---------------------------------- |
| I. Spec-Driven Development           | Spec created before implementation        | ✅ PASS                            |
| II. Educational Clarity              | Code must be readable and well-commented  | ✅ Will include comments           |
| III. Cross-Platform Compatibility    | Works on macOS and Windows                | ✅ Browser-only, platform-agnostic |
| IV. AI-Assisted Development          | Copilot-friendly patterns                 | ✅ Standard React patterns         |
| V. Incremental Modernization         | Independent, testable feature             | ✅ No breaking changes             |
| VII. React & Frontend Best Practices | Functional components, hooks, Context API | ✅ Using useContext, custom hook   |
| VIII. Frontend-Backend Separation    | Frontend-only feature                     | ✅ No backend changes              |
| IX. Design System Standards          | Use shadcn/ui components                  | ✅ Using DropdownMenu              |

**Gate Result**: ✅ ALL GATES PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/004-dark-mode/
├── plan.md              # This file
├── research.md          # Phase 0 output - shadcn/ui patterns, localStorage API
├── data-model.md        # Phase 1 output - Theme type definitions
├── quickstart.md        # Phase 1 output - Testing instructions
├── contracts/           # N/A - No API contracts (frontend-only feature)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
contoso-university-ui/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── dropdown-menu.tsx    # NEW: shadcn/ui DropdownMenu component
│   │   ├── layout/
│   │   │   ├── Navigation.tsx       # MODIFY: Add ThemeToggle to header
│   │   │   └── AppLayout.tsx        # MODIFY: Wrap with ThemeProvider
│   │   └── common/
│   │       └── ThemeToggle.tsx      # NEW: Theme dropdown component
│   ├── context/
│   │   └── ThemeContext.tsx         # NEW: Theme state management
│   ├── hooks/
│   │   └── useTheme.ts              # NEW: Custom hook for theme access
│   ├── types/
│   │   └── theme.ts                 # NEW: Theme type definitions
│   └── index.html                   # MODIFY: Add script to prevent FOUC
```

**Structure Decision**: Frontend-only feature following existing project structure. New files added to `context/`, `hooks/`, `components/common/`, and `components/ui/` directories per constitution guidelines.

## Complexity Tracking

> No constitution violations - table intentionally left empty

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| —         | —          | —                                    |
