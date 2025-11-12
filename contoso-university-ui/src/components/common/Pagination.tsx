// T069: Pagination component with Button components and design system
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasPrevious: boolean;
  hasNext: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasPrevious,
  hasNext,
  className = '',
}) => {
  // Generate page numbers to display
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near start
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className={cn(
        'flex items-center justify-between border-t border-border px-4 sm:px-0',
        className
      )}
      aria-label="Pagination"
    >
      <div className="flex w-0 flex-1">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious}
          variant="ghost"
          size="sm"
          className="border-t-2 border-transparent pr-1 pt-4"
          aria-label="Previous page"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
      </div>
      <div className="hidden md:flex gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex items-center px-4 pt-4 text-sm font-medium text-muted-foreground"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isCurrent = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              variant={isCurrent ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'border-t-2 pt-4',
                isCurrent ? 'border-primary' : 'border-transparent'
              )}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {pageNum}
            </Button>
          );
        })}
      </div>
      <div className="flex w-0 flex-1 justify-end">
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          variant="ghost"
          size="sm"
          className="border-t-2 border-transparent pl-1 pt-4"
          aria-label="Next page"
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
};

export default Pagination;
