# Data Model & UI State

**Feature**: Student List Page Enhancement  
**Date**: November 13, 2025  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the data structures and UI state models for the enhanced Students list page. The UI uses a traditional table layout with shadcn/ui Table component for data display, search bar at the top, sortable column headers, action buttons (Edit/Delete) with icons in the rightmost column, and pagination controls at the bottom. All models are TypeScript interfaces that describe the shape of data in the React frontend. No backend models are changed.

---

## Core Domain Models (Existing)

These models already exist in the project and are **not modified** by this feature.

### Student

**Location**: `contoso-university-ui/src/types/student.ts`

```typescript
export interface Student {
  id: number;
  lastName: string;
  firstMidName: string;
  enrollmentDate: string; // ISO 8601 date string
  enrollmentCount: number;
  fullName: string; // Computed: "LastName, FirstMidName"
}
```

**Description**: Represents a student entity as returned by the API. Used for display in the table and details page.

---

### PaginatedResponse<T>

**Location**: `contoso-university-ui/src/types/api.ts`

```typescript
export interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
```

**Description**: Generic paginated response structure returned by the API. Used for all paginated list endpoints.

---

## UI State Models (New)

These models represent the state of the enhanced UI components and do not correspond to backend entities.

### SearchState

**Location**: `contoso-university-ui/src/pages/students/StudentList.tsx` (local state)

```typescript
interface SearchState {
  searchTerm: string; // Current value in search input (changes on every keystroke)
  debouncedSearchTerm: string; // Debounced value (changes after 400ms delay)
  isSearching: boolean; // True during debounce delay or API call
}
```

**Description**: Tracks the state of the search functionality, including the raw input value and the debounced value used for API calls.

**State Transitions**:

1. User types → `searchTerm` updates immediately, `isSearching` = true
2. 400ms after last keystroke → `debouncedSearchTerm` updates, API call triggered
3. API responds → `isSearching` = false

**Validation Rules**:

- `searchTerm`: Any string (no validation, empty string allowed)
- `debouncedSearchTerm`: Derived from `searchTerm` after delay
- `isSearching`: Boolean flag for loading indicators

---

### SortState

**Location**: `contoso-university-ui/src/pages/students/StudentList.tsx` (local state)

```typescript
type SortColumn =
  | "lastName"
  | "firstName"
  | "enrollmentDate"
  | "enrollmentCount";
type SortDirection = "asc" | "desc";

interface SortState {
  sortBy: SortColumn;
  sortDirection: SortDirection;
}
```

**Description**: Tracks which column is currently sorted and in which direction.

**State Transitions**:

1. User clicks unsorted column → `sortBy` = clicked column, `sortDirection` = 'asc'
2. User clicks same column (already sorted asc) → `sortDirection` = 'desc'
3. User clicks same column (already sorted desc) → `sortDirection` = 'asc' (toggle)
4. User clicks different column → `sortBy` = new column, `sortDirection` = 'asc'

**Default Values**:

- `sortBy`: 'lastName' (alphabetical by last name)
- `sortDirection`: 'asc' (A-Z)

**Validation Rules**:

- `sortBy`: Must be one of the four valid columns
- `sortDirection`: Must be 'asc' or 'desc'

---

### PaginationState

**Location**: `contoso-university-ui/src/hooks/usePagination.ts` (custom hook state)

```typescript
interface PaginationState {
  currentPage: number; // 1-based page number
  pageSize: number; // Number of items per page
  totalPages: number; // Calculated by backend
  totalCount: number; // Total items in dataset
  hasPrevious: boolean; // Can navigate to previous page
  hasNext: boolean; // Can navigate to next page
}
```

**Description**: Tracks pagination state including current position and metadata from the API response.

**State Transitions**:

1. User changes page size → `currentPage` resets to 1, API call with new `pageSize`
2. User clicks page number → `currentPage` updates to clicked page, API call
3. User clicks next/previous → `currentPage` increments/decrements, API call
4. Search/sort changes → `currentPage` resets to 1, API call with filters

**Validation Rules**:

- `currentPage`: Integer ≥ 1, ≤ `totalPages`
- `pageSize`: One of [10, 25, 50, 100] (preset options)
- `totalPages`, `totalCount`: Provided by API (read-only)
- `hasPrevious`: `currentPage > 1`
- `hasNext`: `currentPage < totalPages`

**Default Values**:

- `currentPage`: 1
- `pageSize`: 10
- `totalPages`: 0 (until first API response)
- `totalCount`: 0 (until first API response)

---

### DeleteDialogState

**Location**: `contoso-university-ui/src/pages/students/StudentList.tsx` (local state)

```typescript
interface DeleteDialogState {
  isOpen: boolean;
  studentId: number | null;
  studentName: string;
}
```

**Description**: Tracks the state of the delete confirmation dialog.

**State Transitions**:

1. User clicks "Delete" → `isOpen` = true, `studentId` and `studentName` set
2. User clicks "Cancel" or Escape → `isOpen` = false, `studentId` = null
3. User confirms deletion → API call, then `isOpen` = false after success

**Validation Rules**:

- `isOpen`: Boolean flag
- `studentId`: Required when `isOpen` is true, null otherwise
- `studentName`: Required when `isOpen` is true (used in confirmation message)

**Default Values**:

- `isOpen`: false
- `studentId`: null
- `studentName`: '' (empty string)

---

### ActionButtonState

**Location**: `contoso-university-ui/src/pages/students/StudentList.tsx` (local state)

```typescript
interface ActionButtonState {
  editingId: number | null; // ID of student being edited (for loading state)
  deletingId: number | null; // ID of student being deleted (for loading state)
}
```

**Description**: Tracks which action buttons are in a loading state to provide visual feedback during API operations.

**State Transitions**:

1. User clicks Edit → `editingId` = studentId, navigate triggered
2. User clicks Delete → Dialog opens (separate state)
3. User confirms delete → `deletingId` = studentId, API call initiated
4. API responds → `deletingId` = null, list refreshes

**Validation Rules**:

- `editingId`: null or valid student ID
- `deletingId`: null or valid student ID
- Only one action can be in progress at a time per student

**Default Values**:

- `editingId`: null
- `deletingId`: null

---

### QueryParamState

**Location**: `contoso-university-ui/src/hooks/useQueryParams.ts` (derived from URL)

```typescript
interface QueryParamState {
  page: number; // From ?page=N (default: 1)
  pageSize: number; // From ?pageSize=N (default: 10)
  search: string; // From ?search=term (default: '')
  sortBy: SortColumn; // From ?sortBy=column (default: 'lastName')
  sortDir: SortDirection; // From ?sortDir=asc|desc (default: 'asc')
}
```

**Description**: Represents the state extracted from URL query parameters. This state is the source of truth for bookmarkability and browser navigation.

**State Synchronization**:

- URL changes → `QueryParamState` updates → Component state updates → UI re-renders
- User interaction → Component state updates → URL updates (via `setSearchParams`)

**Validation Rules**:

- `page`: Parse as integer, default to 1 if invalid or missing
- `pageSize`: Parse as integer, validate against [10, 25, 50, 100], default to 10
- `search`: String, default to empty string if missing
- `sortBy`: Validate against SortColumn type, default to 'lastName'
- `sortDir`: Validate against 'asc' | 'desc', default to 'asc'

**Example URLs**:

```
/students?page=2&pageSize=25&search=john&sortBy=enrollmentDate&sortDir=desc
/students?search=smith
/students?page=5
```

---

## Component Props Interfaces

These interfaces define the shape of props passed to reusable components.

### SortableTableHeadProps

**Location**: `contoso-university-ui/src/components/common/SortableTableHead.tsx` (new component)

```typescript
interface SortableTableHeadProps {
  column: SortColumn;
  label: string;
  currentSort: SortColumn;
  currentDirection: SortDirection;
  onSort: (column: SortColumn) => void;
  className?: string; // Optional: for responsive visibility classes
}
```

**Description**: Props for a sortable table header cell with visual sort indicators.

**Usage Example**:

```typescript
<SortableTableHead
  column="lastName"
  label="Last Name"
  currentSort={sortBy}
  currentDirection={sortDirection}
  onSort={handleSort}
/>

// With responsive classes
<SortableTableHead
  column="firstName"
  label="First Name"
  currentSort={sortBy}
  currentDirection={sortDirection}
  onSort={handleSort}
  className="hidden md:table-cell"
/>
```

**Visual Behavior**:

- Shows ArrowUpDown icon when column is not sorted
- Shows ArrowUp icon when column is sorted ascending
- Shows ArrowDown icon when column is sorted descending
- Hover state indicates clickability
- Cursor changes to pointer on hover

---

### StudentDeleteDialogProps

**Location**: `contoso-university-ui/src/components/features/StudentDeleteDialog.tsx` (new component)

```typescript
interface StudentDeleteDialogProps {
  isOpen: boolean;
  studentName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean; // Optional: shows loading state on confirm button
}
```

**Description**: Props for the delete confirmation dialog.

**Usage Example**:

```typescript
<StudentDeleteDialog
  isOpen={deleteDialog.isOpen}
  studentName={deleteDialog.studentName}
  onConfirm={handleConfirmDelete}
  onCancel={handleCancelDelete}
  isDeleting={isDeleting}
/>
```

---

### EnhancedPaginationProps

**Location**: `contoso-university-ui/src/components/common/Pagination.tsx` (modified existing component)

```typescript
interface EnhancedPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  hasPrevious: boolean;
  hasNext: boolean;
}
```

**Description**: Props for the enhanced pagination component with page jumping and size selection.

**Usage Example**:

```typescript
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  pageSize={pageSize}
  totalCount={totalCount}
  onPageChange={setCurrentPage}
  onPageSizeChange={handlePageSizeChange}
  hasPrevious={hasPrevious}
  hasNext={hasNext}
/>
```

---

## Custom Hook Return Types

These interfaces define the shape of values returned by custom hooks.

### UseDebounceReturn<T>

**Location**: `contoso-university-ui/src/hooks/useDebounce.ts` (new hook)

```typescript
function useDebounce<T>(value: T, delay: number): T;
```

**Description**: Generic debounce hook that delays updating a value until after a specified delay.

**Usage Example**:

```typescript
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearchTerm = useDebounce(searchTerm, 400);

useEffect(() => {
  // Fetch students with debouncedSearchTerm
}, [debouncedSearchTerm]);
```

---

### UseStudentListParamsReturn

**Location**: `contoso-university-ui/src/hooks/useQueryParams.ts` (new hook)

```typescript
interface UseStudentListParamsReturn {
  page: number;
  pageSize: number;
  search: string;
  sortBy: SortColumn;
  sortDir: SortDirection;
  updateParams: (updates: Partial<QueryParamState>) => void;
}
```

**Description**: Hook for managing URL query parameters for the student list page.

**Usage Example**:

```typescript
const { page, pageSize, search, sortBy, sortDir, updateParams } =
  useStudentListParams();

// Update search and reset to page 1
updateParams({ search: "john", page: 1 });

// Update sort
updateParams({ sortBy: "enrollmentDate", sortDir: "desc" });
```

---

### UsePaginationReturn

**Location**: `contoso-university-ui/src/hooks/usePagination.ts` (existing, to be modified)

```typescript
interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setPaginationData: (data: {
    totalCount: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  }) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  resetPagination: () => void;
}
```

**Description**: Hook for managing pagination state. Existing hook with minor modifications to support page size changes.

**Modification Required**: Ensure `setPageSize` resets `currentPage` to 1 (already implemented in current version).

---

## API Request/Response Types (Existing, No Changes)

The following API contract types already exist and support all requirements. No modifications needed.

### GET /api/students Request

```typescript
interface GetStudentsRequest {
  pageNumber: number; // 1-based page number
  pageSize: number; // Items per page (1-100)
  searchString?: string; // Optional: filter by name
  sortBy?: string; // NEW: sort column (if backend supports)
  sortDirection?: string; // NEW: 'asc' or 'desc' (if backend supports)
}
```

**Note**: `sortBy` and `sortDirection` parameters will be added to the API if backend enhancement is implemented (see research.md, Research Task 2). If not implemented, sorting will be client-side for the current page only.

### GET /api/students Response

```typescript
interface GetStudentsResponse {
  data: Student[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
```

**Description**: Paginated response with student data and metadata. Type alias: `PaginatedResponse<Student>`.

---

## State Flow Diagram

```
User Actions → Component State → URL Query Params → API Request → API Response → Component State → UI Update

Example: User searches for "john"
1. User types "john" in search input
2. searchTerm state updates immediately → "john"
3. After 400ms debounce → debouncedSearchTerm → "john"
4. useEffect triggers → updateParams({ search: "john", page: 1 })
5. URL updates → ?search=john&page=1
6. API call → GET /api/students?pageNumber=1&pageSize=10&searchString=john
7. API response → { data: [...], totalCount: 5, ... }
8. students state updates → UI re-renders with filtered results
```

---

## Validation & Constraints Summary

| Field                    | Type           | Constraints                                                        | Default    |
| ------------------------ | -------------- | ------------------------------------------------------------------ | ---------- |
| `currentPage`            | number         | ≥ 1, ≤ totalPages                                                  | 1          |
| `pageSize`               | number         | One of [10, 25, 50, 100]                                           | 10         |
| `searchTerm`             | string         | Any string                                                         | '' (empty) |
| `sortBy`                 | SortColumn     | 'lastName' \| 'firstName' \| 'enrollmentDate' \| 'enrollmentCount' | 'lastName' |
| `sortDirection`          | SortDirection  | 'asc' \| 'desc'                                                    | 'asc'      |
| `deleteDialog.studentId` | number \| null | null when closed, valid ID when open                               | null       |
| `deleteDialog.isOpen`    | boolean        | true \| false                                                      | false      |

---

## Entity Relationships

```
StudentList (Page Component)
├── SearchState (local state)
│   ├── searchTerm → useDebounce → debouncedSearchTerm
│   └── Triggers API call on debounced value change
├── SortState (local state)
│   ├── sortBy + sortDirection
│   └── Passed to API request (if backend supports)
├── PaginationState (usePagination hook)
│   ├── currentPage + pageSize → API request
│   └── totalPages + totalCount + hasPrevious + hasNext ← API response
├── DeleteDialogState (local state)
│   ├── isOpen + studentId + studentName
│   └── Controls StudentDeleteDialog component visibility
└── QueryParamState (useQueryParams hook)
    ├── Derived from URL query parameters
    ├── Synced with component state
    └── Enables bookmarkability + browser navigation
```

---

## Table Layout Structure

The StudentList page uses a traditional table layout with the following structure:

```typescript
// Page Layout
<div className="container mx-auto px-4 py-8">
  {/* Header */}
  <h1 className="text-2xl font-bold mb-6">Students</h1>

  {/* Search Bar */}
  <div className="mb-4">
    <Input placeholder="Search students by name..." />
  </div>

  {/* Results Summary */}
  <div className="text-sm text-muted-foreground mb-4">
    Showing 1-10 of 50 students
  </div>

  {/* Table */}
  <Table>
    <TableHeader>
      <TableRow>
        <SortableTableHead column="lastName" label="Last Name" />
        <SortableTableHead
          column="firstName"
          label="First Name"
          className="hidden md:table-cell"
        />
        <SortableTableHead
          column="enrollmentDate"
          label="Enrollment Date"
          className="hidden lg:table-cell"
        />
        <SortableTableHead
          column="enrollmentCount"
          label="Enrollments"
          className="hidden lg:table-cell"
        />
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {students.map((student) => (
        <TableRow key={student.id}>
          <TableCell>{student.lastName}</TableCell>
          <TableCell className="hidden md:table-cell">
            {student.firstMidName}
          </TableCell>
          <TableCell className="hidden lg:table-cell">
            {student.enrollmentDate}
          </TableCell>
          <TableCell className="hidden lg:table-cell">
            {student.enrollmentCount}
          </TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Edit ${student.fullName}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Delete ${student.fullName}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>

  {/* Pagination */}
  <Pagination
    currentPage={1}
    totalPages={5}
    pageSize={10}
    totalCount={50}
    onPageChange={handlePageChange}
    onPageSizeChange={handlePageSizeChange}
    hasPrevious={false}
    hasNext={true}
  />
</div>
```

### Table Column Specification

| Column | Header          | Data                      | Sortable | Responsive Class       | Always Visible                  |
| ------ | --------------- | ------------------------- | -------- | ---------------------- | ------------------------------- |
| 1      | Last Name       | `student.lastName`        | ✅ Yes   | -                      | ✅ Yes                          |
| 2      | First Name      | `student.firstMidName`    | ✅ Yes   | `hidden md:table-cell` | ❌ No (hidden on mobile)        |
| 3      | Enrollment Date | `student.enrollmentDate`  | ✅ Yes   | `hidden lg:table-cell` | ❌ No (hidden on mobile/tablet) |
| 4      | Enrollments     | `student.enrollmentCount` | ✅ Yes   | `hidden lg:table-cell` | ❌ No (hidden on mobile/tablet) |
| 5      | Actions         | Edit/Delete buttons       | ❌ No    | -                      | ✅ Yes                          |

### Responsive Behavior

- **Mobile (< 768px)**: Show Last Name and Actions only
- **Tablet (768px - 1023px)**: Show Last Name, First Name, and Actions
- **Desktop (≥ 1024px)**: Show all columns

### Action Button Specification

```typescript
// Edit Button
<Button
  variant="ghost"
  size="sm"
  onClick={() => handleEdit(student.id)}
  aria-label={`Edit ${student.fullName}`}
>
  <Pencil className="h-4 w-4" />
</Button>

// Delete Button
<Button
  variant="ghost"
  size="sm"
  onClick={() => handleDeleteClick(student.id, student.fullName)}
  aria-label={`Delete ${student.fullName}`}
>
  <Trash2 className="h-4 w-4" />
</Button>
```

### Sort Indicator Icons

- **Unsorted**: `<ArrowUpDown className="h-4 w-4" />` - Both arrows, gray color
- **Ascending**: `<ArrowUp className="h-4 w-4" />` - Up arrow, primary color
- **Descending**: `<ArrowDown className="h-4 w-4" />` - Down arrow, primary color

---

## Summary

This data model defines:

- **5 UI state models**: SearchState, SortState, PaginationState, DeleteDialogState, ActionButtonState
- **3 component prop interfaces**: SortableTableHeadProps, StudentDeleteDialogProps, EnhancedPaginationProps
- **3 custom hook interfaces**: UseDebounceReturn, UseStudentListParamsReturn, UsePaginationReturn
- **1 URL state model**: QueryParamState (derived from query parameters)

**Key Principles**:

- No backend models changed (uses existing Student and PaginatedResponse)
- All state is TypeScript-typed for type safety
- State is normalized (single source of truth)
- URL query parameters are the source of truth for filters/sorting/pagination
- Local state manages UI concerns (dialog visibility, debouncing)
- Traditional table layout with shadcn/ui Table component
- Action buttons with icons in rightmost column
- Sortable column headers with visual indicators
- Responsive design hides less critical columns on smaller screens
