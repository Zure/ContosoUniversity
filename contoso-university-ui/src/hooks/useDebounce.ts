import { useState, useEffect } from 'react';

/**
 * Debounces a value by delaying its update until after a specified delay.
 * Useful for search inputs to avoid excessive API calls.
 * 
 * Educational note: This pattern prevents unnecessary API calls during rapid user input.
 * For example, if a user types "john", without debouncing we'd make 4 API calls (j, jo, joh, john).
 * With a 400ms debounce, we only make 1 API call after the user stops typing.
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (typically 300-500ms for search)
 * @returns The debounced value
 * 
 * @example
 * ```typescript
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 400);
 * 
 * useEffect(() => {
 *   // This effect only runs 400ms after the user stops typing
 *   fetchStudents(debouncedSearchTerm);
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value changes before delay expires
    // This is the key to debouncing - we cancel the previous timer
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run effect when value or delay changes

  return debouncedValue;
}
