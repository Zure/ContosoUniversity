import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value
 * 
 * Delays updating the debounced value until after the specified delay period
 * has elapsed since the last time the input value changed. This is useful for
 * reducing the number of API calls when implementing search-as-you-type features.
 * 
 * @param value - The value to debounce (can be any type)
 * @param delay - Delay in milliseconds (e.g., 400 for 400ms)
 * @returns The debounced value (same type as input)
 * 
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 400);
 * 
 * useEffect(() => {
 *   // This will only run 400ms after the user stops typing
 *   fetchResults(debouncedSearchTerm);
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  // State to hold the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay expires
    // or if the component unmounts
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run effect when value or delay changes

  return debouncedValue;
}
