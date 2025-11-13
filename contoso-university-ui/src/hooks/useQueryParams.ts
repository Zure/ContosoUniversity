import { useSearchParams } from 'react-router-dom';

/**
 * Type definitions for student list query parameters
 */
export type SortColumn = 'lastName' | 'firstName' | 'enrollmentDate' | 'enrollmentCount';
export type SortDirection = 'asc' | 'desc';

/**
 * Interface for query parameter state
 */
export interface QueryParamState {
  page: number;
  pageSize: number;
  search: string;
  sortBy: SortColumn;
  sortDir: SortDirection;
}

/**
 * Return type for useStudentListParams hook
 */
export interface UseStudentListParamsReturn extends QueryParamState {
  updateParams: (updates: Partial<QueryParamState>) => void;
}

/**
 * Custom hook for managing URL query parameters for the student list page
 * 
 * This hook provides a centralized way to read and update URL query parameters,
 * ensuring that filter, sort, and pagination state is synchronized with the URL.
 * This enables bookmarking, sharing links, and proper browser back/forward navigation.
 * 
 * @returns Object containing current param values and an updateParams function
 * 
 * @example
 * ```tsx
 * const { page, pageSize, search, sortBy, sortDir, updateParams } = useStudentListParams();
 * 
 * // Update search and reset to page 1
 * updateParams({ search: 'john', page: 1 });
 * 
 * // Toggle sort direction
 * updateParams({ sortDir: sortDir === 'asc' ? 'desc' : 'asc' });
 * ```
 */
export function useStudentListParams(): UseStudentListParamsReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse and validate page number
  const page = (() => {
    const pageParam = searchParams.get('page');
    const parsed = pageParam ? parseInt(pageParam, 10) : 1;
    return !isNaN(parsed) && parsed >= 1 ? parsed : 1;
  })();

  // Parse and validate page size
  const pageSize = (() => {
    const pageSizeParam = searchParams.get('pageSize');
    const parsed = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;
    const validSizes = [10, 25, 50, 100];
    return validSizes.includes(parsed) ? parsed : 10;
  })();

  // Parse search term (default to empty string)
  const search = searchParams.get('search') || '';

  // Parse and validate sort column
  const sortBy = (() => {
    const sortByParam = searchParams.get('sortBy');
    const validColumns: SortColumn[] = ['lastName', 'firstName', 'enrollmentDate', 'enrollmentCount'];
    return sortByParam && validColumns.includes(sortByParam as SortColumn)
      ? (sortByParam as SortColumn)
      : 'lastName';
  })();

  // Parse and validate sort direction
  const sortDir = (() => {
    const sortDirParam = searchParams.get('sortDir');
    return sortDirParam === 'desc' ? 'desc' : 'asc';
  })();

  /**
   * Update query parameters in the URL
   * 
   * Merges the provided updates with existing parameters and updates the URL.
   * Uses replace instead of push to avoid creating excessive history entries.
   * 
   * @param updates - Partial object containing parameter values to update
   */
  const updateParams = (updates: Partial<QueryParamState>) => {
    const newParams = new URLSearchParams(searchParams);

    // Apply updates
    if (updates.page !== undefined) {
      newParams.set('page', updates.page.toString());
    }
    if (updates.pageSize !== undefined) {
      newParams.set('pageSize', updates.pageSize.toString());
    }
    if (updates.search !== undefined) {
      if (updates.search) {
        newParams.set('search', updates.search);
      } else {
        newParams.delete('search');
      }
    }
    if (updates.sortBy !== undefined) {
      newParams.set('sortBy', updates.sortBy);
    }
    if (updates.sortDir !== undefined) {
      newParams.set('sortDir', updates.sortDir);
    }

    // Update URL without adding to history (replace instead of push)
    setSearchParams(newParams, { replace: true });
  };

  return {
    page,
    pageSize,
    search,
    sortBy,
    sortDir,
    updateParams,
  };
}
