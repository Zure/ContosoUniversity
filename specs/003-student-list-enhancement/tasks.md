# Tasks: Student List Page Enhancement

**Input**: Design documents from `/specs/010-student-list-enhancement/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/ui-components.md, quickstart.md

**Tests**: This feature does NOT include automated tests (manual testing only per project standards)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**UI Layout**: Traditional table approach using shadcn/ui Table component for data display, search bar at top with Input component, action buttons with icons (Edit/Delete) in rightmost column, sortable column headers with indicators, and standard pagination controls at bottom.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `contoso-university-ui/src/`
- **Backend**: `ContosoUniversity/` (no changes required for this feature)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare development environment and verify prerequisites

- [x] T001 Verify frontend dev server running: `cd contoso-university-ui && npm run dev`
- [x] T002 Verify backend API running: `cd ContosoUniversity && dotnet run`
- [x] T003 Verify SQL Server container running (Docker or Podman)
- [x] T004 Review existing StudentList.tsx implementation in contoso-university-ui/src/pages/students/StudentList.tsx
- [x] T005 Review existing shadcn/ui components: Button, Input, Dialog, Select, Table in contoso-university-ui/src/components/ui/
- [x] T006 Verify lucide-react icons available (ArrowUp, ArrowDown, ArrowUpDown, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Search, X, Pencil, Trash2)

**Checkpoint**: Development environment ready, existing code reviewed

---

## Phase 2: Foundational (Custom Hooks - Blocking Prerequisites)

**Purpose**: Create reusable hooks that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until these hooks are complete

- [x] T007 [P] Create useDebounce hook in contoso-university-ui/src/hooks/useDebounce.ts
- [x] T008 [P] Create useStudentListParams hook for URL query param management in contoso-university-ui/src/hooks/useQueryParams.ts
- [x] T009 Verify existing usePagination hook in contoso-university-ui/src/hooks/usePagination.ts (confirm setPageSize resets to page 1)

**Checkpoint**: Foundation ready - all custom hooks available for user stories

---

## Phase 3: User Story 1 - Real-Time Search (Priority: P1) 🎯 MVP

**Goal**: Enable real-time filtering of student list by name with debounced input

**Independent Test**: Type in search field and observe immediate filtering (after 400ms debounce) without clicking search button. Clear search and verify full list restores.

### Implementation for User Story 1

- [x] T010 [US1] Add search input state to StudentList.tsx: searchInput, debouncedSearch (using useDebounce hook)
- [x] T011 [US1] Add search bar at top of page in StudentList.tsx using shadcn/ui Input component with Search icon from lucide-react
- [x] T012 [US1] Implement controlled Input with value={searchInput} and placeholder="Search students by name..."
- [x] T013 [US1] Implement handleSearchChange handler in StudentList.tsx to update searchInput on keystroke
- [x] T014 [US1] Update useEffect in StudentList.tsx to trigger fetchStudents when debouncedSearch changes
- [x] T015 [US1] Add clear button (X icon) to search input when searchInput is not empty
- [x] T016 [US1] Update handleSearchClear handler in StudentList.tsx to reset searchInput and update URL params
- [x] T017 [US1] Synchronize search state with URL query params using useStudentListParams hook in StudentList.tsx
- [x] T018 [US1] Update results summary below search bar to show filtered count when search is active
- [x] T019 [US1] Add loading indicator during debounce period in StudentList.tsx
- [x] T020 [US1] Update empty state in table body to show "No students found matching '[term]'" when search has no results

**Checkpoint**: Real-time search fully functional - can search students by name with debouncing

---

## Phase 4: User Story 2 - Column Sorting (Priority: P1)

**Goal**: Enable sorting student list by clicking column headers (Last Name, First Name, Enrollment Date, Enrollments)

**Independent Test**: Click column headers and verify list re-sorts. Click same header twice to toggle ascending/descending. Verify arrow icons show current sort state.

### Implementation for User Story 2

- [x] T021 [P] [US2] Create SortableTableHead component in contoso-university-ui/src/components/common/SortableTableHead.tsx with icons (ArrowUp, ArrowDown, ArrowUpDown)
- [x] T022 [US2] Add sort state to StudentList.tsx: sortBy, sortDirection (using useStudentListParams for URL sync)
- [x] T023 [US2] Implement handleSort function in StudentList.tsx to toggle sort direction and update URL params
- [x] T024 [US2] Replace TableHead elements with SortableTableHead for: Last Name, First Name, Enrollment Date, Enrollments columns
- [x] T025 [US2] Style SortableTableHead to show sort indicator icons: ArrowUp (asc), ArrowDown (desc), ArrowUpDown (unsorted)
- [x] T026 [US2] Update fetchStudents function in StudentList.tsx to pass sortBy and sortDirection to API (if backend supports)
- [x] T027 [US2] If backend doesn't support sorting: Implement client-side sorting with useMemo in StudentList.tsx
- [x] T028 [US2] Synchronize sort state with URL query params in StudentList.tsx
- [x] T029 [US2] Ensure search + sort work together (sorting applies to filtered results) in StudentList.tsx
- [x] T030 [US2] Add hover state to sortable column headers for better UX

**Checkpoint**: Column sorting fully functional - can sort by any column with visual indicators

---

## Phase 5: User Story 3 - Enhanced Action Buttons (Priority: P2)

**Goal**: Add confirmation dialog for delete action with accessibility features

**Independent Test**: Click Delete button, verify confirmation dialog shows student name. Test Cancel, Escape key, and Confirm actions. Verify keyboard navigation works.

### Implementation for User Story 3

- [x] T031 [P] [US3] Create StudentDeleteDialog component in contoso-university-ui/src/components/features/StudentDeleteDialog.tsx
- [x] T032 [US3] Add delete dialog state to StudentList.tsx: deleteDialog { isOpen, studentId, studentName }, isDeleting
- [x] T033 [US3] Add Actions column as rightmost column in Table with TableHead "Actions"
- [x] T034 [US3] Add Edit button in Actions column: Button variant="ghost" size="sm" with Pencil icon from lucide-react
- [x] T035 [US3] Add Delete button in Actions column: Button variant="ghost" size="sm" with Trash2 icon from lucide-react
- [x] T036 [US3] Implement handleEditClick handler to navigate to student edit page
- [x] T037 [US3] Implement handleDeleteClick handler in StudentList.tsx to open dialog with student details
- [x] T038 [US3] Implement handleDeleteConfirm handler in StudentList.tsx to call deleteStudent API and refresh list
- [x] T039 [US3] Implement handleDeleteCancel handler in StudentList.tsx to close dialog
- [x] T040 [US3] Update Delete button to call handleDeleteClick instead of window.confirm
- [x] T041 [US3] Add StudentDeleteDialog component to StudentList.tsx render (at end of component)
- [x] T042 [US3] Handle edge case: If deleting last student on page, navigate to previous page in StudentList.tsx
- [x] T043 [US3] Add loading state to delete button in StudentDeleteDialog (spinner during API call)
- [x] T044 [US3] Add ARIA labels to action buttons: aria-label="Edit {studentName}" and "Delete {studentName}"
- [x] T045 [US3] Style action buttons with proper spacing and hover states
- [x] T046 [US3] Test keyboard navigation: Tab through buttons, Enter to activate, Escape to close dialog

**Checkpoint**: Delete confirmation dialog fully functional with accessibility support

---

## Phase 6: User Story 4 - Improved Pagination Experience (Priority: P2)

**Goal**: Enhance pagination with page number buttons, page jumping, and page size selector

**Independent Test**: Navigate using page numbers, first/last buttons, and change page size. Verify correct pages load and disabled states work.

### Implementation for User Story 4

- [x] T047 [US4] Place pagination controls at bottom of table (below TableBody) in StudentList.tsx
- [x] T048 [US4] Add getPageNumbers function to Pagination.tsx for ellipsis logic (show first, last, current ± 1 with ellipsis)
- [x] T049 [US4] Add page size selector (Select component) to Pagination.tsx with label "Items per page:" and options [10, 25, 50, 100]
- [x] T050 [US4] Add onPageSizeChange prop and handler to Pagination.tsx
- [x] T051 [US4] Add first page button with ChevronsLeft icon to Pagination.tsx
- [x] T052 [US4] Add previous page button with ChevronLeft icon to Pagination.tsx
- [x] T053 [US4] Add page number buttons to Pagination.tsx (using getPageNumbers result)
- [x] T054 [US4] Add next page button with ChevronRight icon to Pagination.tsx
- [x] T055 [US4] Add last page button with ChevronsRight icon to Pagination.tsx
- [x] T056 [US4] Style current page button with variant="default", others with variant="outline" in Pagination.tsx
- [x] T057 [US4] Disable first/previous buttons when hasPrevious is false, last/next when hasNext is false
- [x] T058 [US4] Update StudentList.tsx to pass onPageSizeChange handler to Pagination component
- [x] T059 [US4] Implement handlePageSizeChange in StudentList.tsx to update URL params and reset to page 1
- [x] T060 [US4] Synchronize pageSize with URL query params in StudentList.tsx
- [x] T061 [US4] Update responsive layout in Pagination.tsx: stack controls on mobile, row on desktop

**Checkpoint**: Enhanced pagination fully functional with page jumping and size selection

---

## Phase 7: User Story 5 - Results Summary and Feedback (Priority: P3)

**Goal**: Display clear results summary showing current range, total count, and active filters

**Independent Test**: View results summary, apply filters, change pages, verify summary updates correctly showing range and filter status.

### Implementation for User Story 5

- [x] T062 [US5] Place results summary between search bar and table in StudentList.tsx
- [x] T063 [US5] Calculate results range in StudentList.tsx: startIndex = (currentPage - 1) \* pageSize + 1, endIndex = min(startIndex + students.length - 1, totalCount)
- [x] T064 [US5] Update results summary text in StudentList.tsx to show "Showing {startIndex}-{endIndex} of {totalCount} students"
- [x] T065 [US5] Add filtered indicator to results summary when search is active: "(filtered by '{searchTerm}')"
- [x] T066 [US5] Show loading indicator in results area during data fetch in StudentList.tsx
- [x] T067 [US5] Update results summary styling with text-sm and text-muted-foreground classes
- [x] T068 [US5] Handle edge case: When totalCount is 0, show "No students found" instead of "Showing 0-0"

**Checkpoint**: Results summary fully functional with filter indicators

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

### Responsive Design & Accessibility

- [x] T069 [P] Make Table responsive: add overflow-x-auto wrapper for horizontal scrolling on small screens
- [x] T070 [P] Add responsive classes to table columns: hide First Name on mobile (md:table-cell), hide Enrollment Date and Enrollments on mobile/tablet (lg:table-cell)
- [x] T071 [P] Keep Last Name and Actions columns always visible for essential data
- [x] T072 [P] Adjust action buttons size for mobile: use icon-only on small screens if needed
- [x] T073 [P] Test keyboard navigation: Tab through all interactive elements, Enter/Space to activate
- [x] T074 [P] Verify WCAG 2.1 AA compliance: focus indicators visible (3:1 contrast), ARIA labels present
- [x] T075 [P] Test responsive breakpoints: 320px (mobile), 640px (tablet), 1024px (desktop)
- [x] T076 [P] Ensure table remains usable and readable at all breakpoints

### Performance Optimization

- [x] T077 [P] Memoize TableRow rendering with React.memo in StudentList.tsx
- [x] T078 [P] Use useMemo for sorted/filtered student list in StudentList.tsx
- [x] T079 [P] Use useCallback for event handlers passed to child components in StudentList.tsx
- [x] T080 Verify debounce working: Only 1 API call after typing stops (400ms delay)
- [x] T081 Test with 1000 students: Verify no lag, <500ms filter response time

### URL State Management

- [x] T082 Initialize state from URL query params on mount in StudentList.tsx
- [x] T083 Update URL when state changes: search, sort, page, pageSize
- [x] T084 Test browser back/forward buttons: Verify state restores correctly
- [x] T085 Test bookmarkability: Copy URL, paste in new tab, verify state restored

### Error Handling & Edge Cases

- [x] T086 [P] Handle network failure during fetch: Show error message with retry button in StudentList.tsx
- [x] T087 [P] Handle delete failure: Show error message, keep student in list in StudentList.tsx
- [x] T088 [P] Handle invalid URL params: Apply defaults, no crash in useStudentListParams hook
- [x] T089 [P] Handle rapid typing: Verify debounce cancels previous timers in useDebounce hook
- [x] T090 [P] Handle empty search results: Show helpful message in table body
- [x] T091 [P] Handle page out of bounds: Navigate to last valid page when pageSize changes

### Code Quality

- [x] T092 [P] Add TypeScript types for all state and props in StudentList.tsx
- [x] T093 [P] Add explanatory comments for educational value in all new components
- [x] T094 [P] Remove any console.log statements and unused imports
- [x] T095 [P] Verify consistent code style: Tailwind classes, component patterns
- [x] T096 [P] Ensure proper Table component structure: Table > TableHeader > TableRow > TableHead and Table > TableBody > TableRow > TableCell
- [ ] T097 Run quickstart.md manual testing checklist: Search, Sort, Pagination, Delete, URL persistence, Accessibility, Responsive

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User Story 1 (Real-Time Search) - P1 priority
  - User Story 2 (Column Sorting) - P1 priority (can start after Foundational)
  - User Story 3 (Enhanced Action Buttons) - P2 priority (can start after Foundational)
  - User Story 4 (Improved Pagination) - P2 priority (can start after Foundational)
  - User Story 5 (Results Summary) - P3 priority (can start after Foundational)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (Phase 2) - useDebounce, useStudentListParams hooks
- **User Story 2 (P1)**: Depends on Foundational (Phase 2) - useStudentListParams hook. Independent of US1.
- **User Story 3 (P2)**: Depends on Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P2)**: Depends on Foundational (Phase 2) - usePagination hook. Independent of other stories.
- **User Story 5 (P3)**: Depends on US1 (search state) and US4 (pagination state) to display correct summary

### Within Each User Story

- US1: State → Handlers → UI updates → URL sync → Loading/empty states
- US2: Component creation (parallel) → State → Handlers → Table integration → URL sync
- US3: Component creation (parallel) → State → Handlers → Integration → Accessibility
- US4: Component enhancements → State → Handlers → Integration → Responsive
- US5: Calculations → UI updates → Edge cases

### Parallel Opportunities

- **Phase 1 (Setup)**: All verification tasks can run in parallel
- **Phase 2 (Foundational)**: T007 and T008 can run in parallel (different files)
- **Within User Stories**:
  - US2: T019 (component creation) can run parallel to T020 (state setup)
  - US3: T027 (component creation) can run parallel to T028-T031 (handlers)
  - All Polish tasks marked [P] can run in parallel (different concerns)

---

## Parallel Example: Foundational Phase

```bash
# These hooks can be created simultaneously by different developers:
Task: "Create useDebounce hook in contoso-university-ui/src/hooks/useDebounce.ts"
Task: "Create useStudentListParams hook in contoso-university-ui/src/hooks/useQueryParams.ts"
```

## Parallel Example: User Story 2

```bash
# Component and state can be developed in parallel:
Task: "Create SortableTableHead component in contoso-university-ui/src/components/common/SortableTableHead.tsx"
Task: "Add sort state to StudentList.tsx"
```

## Parallel Example: Polish Phase

```bash
# All polish tasks affect different aspects and can run in parallel:
Task: "Add responsive classes to table columns in StudentList.tsx"
Task: "Stack action buttons vertically on mobile in StudentList.tsx"
Task: "Memoize StudentRow component with React.memo"
Task: "Add TypeScript types for all state and props"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

Since both US1 and US2 are P1 priority, the MVP includes both:

1. Complete Phase 1: Setup (verify environment)
2. Complete Phase 2: Foundational (CRITICAL - create hooks)
3. Complete Phase 3: User Story 1 (real-time search)
4. Complete Phase 4: User Story 2 (column sorting)
5. **STOP and VALIDATE**: Test search + sort together
6. Deploy/demo if ready

**Value Delivered**: Administrators can quickly find and organize students - the two most common workflows.

### Incremental Delivery

1. **Foundation** (Phases 1-2) → Hooks ready
2. **MVP** (Phases 3-4) → Search + Sort working → Deploy/Demo
3. **Enhanced UX** (Phases 5-6) → Add delete dialog + pagination → Deploy/Demo
4. **Polish** (Phases 7-8) → Add summary + optimize → Deploy/Demo

Each delivery adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers (after Foundational phase completes):

1. **Team completes Setup + Foundational together** (required)
2. **Parallel execution** (once hooks are ready):
   - Developer A: User Story 1 (Search) - Tasks T010-T018
   - Developer B: User Story 2 (Sorting) - Tasks T019-T026
   - Developer C: User Story 3 (Delete Dialog) - Tasks T027-T037
3. Stories complete and integrate independently
4. Team reconvenes for Polish phase

---

## Task Summary

**Total Tasks**: 97

- **Phase 1 (Setup)**: 6 tasks
- **Phase 2 (Foundational)**: 3 tasks (BLOCKING)
- **Phase 3 (US1 - Search)**: 11 tasks
- **Phase 4 (US2 - Sorting)**: 10 tasks
- **Phase 5 (US3 - Action Buttons)**: 16 tasks
- **Phase 6 (US4 - Pagination)**: 15 tasks
- **Phase 7 (US5 - Summary)**: 7 tasks
- **Phase 8 (Polish)**: 29 tasks

**Parallel Opportunities**: 30 tasks marked [P] can run in parallel within their phase

**Independent Stories**: US1, US2, US3, US4 are independently testable. US5 depends on US1 + US4 for state.

**Estimated Time** (from quickstart.md):

- Foundational: 30 min
- US1 (Search): 30 min
- US2 (Sorting): 45 min
- US3 (Delete): 30 min
- US4 (Pagination): 45 min
- US5 (Summary): 15 min
- Polish: 30 min
- **Total**: ~3-3.5 hours

**MVP Scope**: Phases 1-4 (Setup + Foundation + US1 + US2) = ~1.5 hours

---

## Notes

- [P] tasks = different files/concerns, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No automated tests (manual testing per project standards)
- Commit after each logical task group
- Stop at any checkpoint to validate story independently
- Follow quickstart.md for detailed code examples and troubleshooting
- Reference research.md for technical decision rationale
- Reference contracts/ui-components.md for component specifications
