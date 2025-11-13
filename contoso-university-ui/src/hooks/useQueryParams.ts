import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Sortable column identifiers that match the Student entity properties
 */
export type SortColumn = 'lastName' | 'firstName' | 'enrollmentDate' | 'enrollmentCount';

/**
 * Sort direction: ascending (A-Z, 0-9, oldest-newest) or descending (Z-A, 9-0, newest-oldest)
 */
export type SortDirection = 'asc' | 'desc';

/**
 * State derived from URL query parameters for the student list page.
 * This approach makes the page bookmarkable and enables browser back/forward navigation.
 * 
 * Educational note: Storing filter state in the URL instead of just component state
 * provides a better user experience:
 * - Users can bookmark filtered views
 * - Back/forward buttons work as expected
 * - Sharing URLs shares the exact view
 */
export interface QueryParamState {
  search: string;         // From ?search=term (default: '')
  sortBy: SortColumn;     // From ?sortBy=column (default: 'lastName')
  sortDir: SortDirection; // From ?sortDir=asc|desc (default: 'asc')
}

/**
 * Return type for the useStudentListParams hook
 */
export interface UseStudentListParamsReturn extends QueryParamState {
  updateParams: (updates: Partial<QueryParamState>) => void;
}

/**
 * Custom hook for managing URL query parameters for the student list page.
 * Provides type-safe access to query params with validation and default values.
 * 
 * Educational note: This hook centralizes URL query parameter logic, making it:
 * - Reusable across components
 * - Type-safe (TypeScript will catch invalid param names)
 * - Maintainable (changes to param logic happen in one place)
 * 
 * @returns Current query param state and an update function
 * 
 * @example
 * ```typescript
 * const { search, sortBy, sortDir, updateParams } = useStudentListParams();
 * 
 * // Update search and keep other params
 * updateParams({ search: 'john' });
 * 
 * // Update sort field and direction
 * updateParams({ sortBy: 'enrollmentDate', sortDir: 'desc' });
 * ```
 */
export function useStudentListParams(): UseStudentListParamsReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse search param with default value
  const search = searchParams.get('search') || '';

  // Parse sortBy param with validation and default value
  const sortByParam = searchParams.get('sortBy') || 'lastName';
  const validSortColumns: SortColumn[] = ['lastName', 'firstName', 'enrollmentDate', 'enrollmentCount'];
  const sortBy: SortColumn = validSortColumns.includes(sortByParam as SortColumn)
    ? (sortByParam as SortColumn)
    : 'lastName';

  // Parse sortDir param with validation and default value
  const sortDirParam = searchParams.get('sortDir') || 'asc';
  const sortDir: SortDirection = (sortDirParam === 'asc' || sortDirParam === 'desc')
    ? sortDirParam
    : 'asc';

  /**
   * Updates URL query parameters with new values.
   * Only updates the params provided, keeps others unchanged.
   * 
   * Educational note: useCallback memoizes this function to prevent
   * unnecessary re-renders in components that receive it as a prop.
   */
  const updateParams = useCallback((updates: Partial<QueryParamState>) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      // Update or remove search param
      if (updates.search !== undefined) {
        if (updates.search === '') {
          newParams.delete('search');
        } else {
          newParams.set('search', updates.search);
        }
      }

      // Update sortBy param
      if (updates.sortBy !== undefined) {
        newParams.set('sortBy', updates.sortBy);
      }

      // Update sortDir param
      if (updates.sortDir !== undefined) {
        newParams.set('sortDir', updates.sortDir);
      }

      return newParams;
    });
  }, [setSearchParams]);

  return {
    search,
    sortBy,
    sortDir,
    updateParams,
  };
}
