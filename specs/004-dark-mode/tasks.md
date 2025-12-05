# Tasks: Dark Mode Theme Support

**Input**: Design documents from `/specs/004-dark-mode/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: No automated tests requested in specification. Manual testing via quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `contoso-university-ui/src/`
- **HTML**: `contoso-university-ui/index.html`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add required shadcn/ui component and create type definitions

- [x] T001 Add shadcn/ui dropdown-menu component by running `npx shadcn@latest add dropdown-menu` in contoso-university-ui/
- [x] T002 [P] Create theme type definitions in contoso-university-ui/src/types/theme.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create ThemeContext provider and useTheme hook that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create ThemeProvider component in contoso-university-ui/src/context/ThemeContext.tsx with theme state, localStorage read/write, and system preference detection
- [x] T004 Create useTheme custom hook in contoso-university-ui/src/hooks/useTheme.ts that wraps ThemeContext consumption
- [x] T005 Wrap application with ThemeProvider in contoso-university-ui/src/components/layout/AppLayout.tsx

**Checkpoint**: Foundation ready - ThemeProvider wraps app, useTheme hook available for components

---

## Phase 3: User Story 1 - Toggle Dark Mode Manually (Priority: P1) 🎯 MVP

**Goal**: Users can click a toggle button to switch between light and dark themes instantly

**Independent Test**: Click the theme toggle in the navigation bar. Select "Dark" - UI should switch to dark colors. Select "Light" - UI should switch to light colors.

### Implementation for User Story 1

- [x] T006 [US1] Create ThemeToggle component in contoso-university-ui/src/components/common/ThemeToggle.tsx using DropdownMenu with Light/Dark/System options and Sun/Moon icons
- [x] T007 [US1] Add ThemeToggle to Navigation component in contoso-university-ui/src/components/layout/Navigation.tsx in the header right side

**Checkpoint**: Users can toggle between light and dark mode using the dropdown menu in the navigation bar

---

## Phase 4: User Story 2 - Persist Theme Preference (Priority: P1)

**Goal**: Theme preference is saved to localStorage and restored on subsequent visits

**Independent Test**: Select "Dark" mode, close the browser tab, reopen the application - dark mode should be automatically applied.

### Implementation for User Story 2

- [x] T008 [US2] Add FOUC prevention script to contoso-university-ui/index.html before </head> that reads localStorage and applies .dark class synchronously
- [x] T009 [US2] Verify ThemeContext persists theme to localStorage on every setTheme call (already in T003, verify working)

**Checkpoint**: Theme persists across browser sessions. No flash of wrong theme on page load.

---

## Phase 5: User Story 3 - Respect System Preference (Priority: P2)

**Goal**: First-time visitors see the theme matching their OS preference. "System" option follows OS changes.

**Independent Test**: Set OS to dark mode, clear localStorage, reload app - should show dark theme. Change OS preference while app is open with "System" selected - app should update.

### Implementation for User Story 3

- [x] T010 [US3] Add system preference change listener in ThemeContext (contoso-university-ui/src/context/ThemeContext.tsx) using matchMedia addEventListener
- [x] T011 [US3] Ensure FOUC script in index.html respects system preference when no localStorage value exists

**Checkpoint**: App detects and follows OS theme preference. System mode updates when OS preference changes.

---

## Phase 6: User Story 4 - Accessible Theme Toggle (Priority: P2)

**Goal**: Theme toggle is fully keyboard accessible and works with screen readers

**Independent Test**: Use only keyboard (Tab to navigate, Enter/Space to activate, Arrow keys to select option). Verify focus is visible and screen reader announces options.

### Implementation for User Story 4

- [x] T012 [US4] Add sr-only label "Toggle theme" to ThemeToggle button in contoso-university-ui/src/components/common/ThemeToggle.tsx
- [x] T013 [US4] Add icons (Sun, Moon, Monitor) and labels to each DropdownMenuItem for clarity
- [x] T014 [US4] Verify keyboard navigation works (Tab to button, Enter to open, Arrow to select, Escape to close) - shadcn/ui DropdownMenu handles this by default

**Checkpoint**: Theme toggle is fully accessible via keyboard and screen reader

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation

- [x] T015 [P] Test all pages (Students, Courses, Instructors, Departments, Statistics) in both light and dark modes for visual correctness
- [x] T016 [P] Verify all shadcn/ui components (Button, Input, Table, Card, Dialog, Select) display correctly in dark mode
- [x] T017 Run through quickstart.md validation checklist in specs/004-dark-mode/quickstart.md
- [x] T018 Add educational comments explaining theme detection and persistence logic in ThemeContext.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup ─────────────────┐
                                │
Phase 2: Foundational ◀─────────┘
         (ThemeContext, useTheme)
                │
                ▼
    ┌───────────┴───────────┐
    │                       │
    ▼                       ▼
Phase 3: US1 (Toggle)   Phase 4: US2 (Persist)
    │                       │
    └───────────┬───────────┘
                │
    ┌───────────┴───────────┐
    │                       │
    ▼                       ▼
Phase 5: US3 (System)   Phase 6: US4 (A11y)
    │                       │
    └───────────┬───────────┘
                │
                ▼
Phase 7: Polish
```

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 (Foundational) - Creates toggle UI
- **User Story 2 (P1)**: Depends on Phase 2 (Foundational) - Adds FOUC prevention
- **User Story 3 (P2)**: Depends on US1 & US2 - Enhances system preference handling
- **User Story 4 (P2)**: Depends on US1 - Enhances toggle accessibility

### Within Each User Story

- Component creation before integration
- Core functionality before enhancements

### Parallel Opportunities

- T001 and T002 can run in parallel (different outputs)
- T015 and T016 can run in parallel (different testing areas)
- US1 and US2 can be developed in parallel after Phase 2

---

## Parallel Execution Examples

### Phase 1 (Setup)

```bash
# These can run in parallel:
Task T001: "Add shadcn/ui dropdown-menu component"
Task T002: "Create theme type definitions"
```

### Phase 7 (Polish)

```bash
# These can run in parallel:
Task T015: "Test all pages in both light and dark modes"
Task T016: "Verify all shadcn/ui components display correctly"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T005)
3. Complete Phase 3: User Story 1 - Toggle (T006-T007)
4. Complete Phase 4: User Story 2 - Persist (T008-T009)
5. **STOP and VALIDATE**: Test toggle and persistence
6. Deploy/demo if ready - users can toggle and persist dark mode!

### Incremental Delivery

1. MVP (US1 + US2) → Basic dark mode with persistence ✅
2. Add US3 (System) → First-time experience improved ✅
3. Add US4 (A11y) → Fully accessible ✅
4. Polish → Production ready ✅

---

## Notes

- [P] tasks = different files, no dependencies
- [US#] label maps task to specific user story for traceability
- Total tasks: 18
- Parallel opportunities: 4 (T001+T002, T015+T016)
- MVP scope: Phase 1-4 (User Stories 1 and 2) = 9 tasks
- No automated tests required per spec
- Manual validation via quickstart.md
