import React from 'react';
import { TableHead } from '@/components/ui/table';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import type { SortColumn, SortDirection } from '@/hooks/useQueryParams';

/**
 * Props for the SortableTableHead component
 */
export interface SortableTableHeadProps {
  column: SortColumn;
  label: string;
  currentSort: SortColumn;
  currentDirection: SortDirection;
  onSort: (column: SortColumn) => void;
  className?: string;
}

/**
 * Sortable table header cell component
 * 
 * This component renders a clickable table header with visual sort indicators.
 * It shows different icons based on the current sort state:
 * - ArrowUpDown: Column is not sorted
 * - ArrowUp: Column is sorted ascending
 * - ArrowDown: Column is sorted descending
 * 
 * @example
 * ```tsx
 * <SortableTableHead
 *   column="lastName"
 *   label="Last Name"
 *   currentSort={sortBy}
 *   currentDirection={sortDirection}
 *   onSort={handleSort}
 * />
 * ```
 */
export const SortableTableHead: React.FC<SortableTableHeadProps> = ({
  column,
  label,
  currentSort,
  currentDirection,
  onSort,
  className = '',
}) => {
  const isSorted = currentSort === column;

  // Determine which icon to display
  const SortIcon = isSorted
    ? currentDirection === 'asc'
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  // Generate accessible label
  const ariaLabel = isSorted
    ? `Sort by ${label} ${currentDirection === 'asc' ? 'descending' : 'ascending'}`
    : `Sort by ${label} ascending`;

  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer select-none"
        aria-label={ariaLabel}
      >
        <span>{label}</span>
        <SortIcon
          className={`h-4 w-4 ${isSorted ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
          aria-hidden="true"
        />
      </button>
    </TableHead>
  );
};
