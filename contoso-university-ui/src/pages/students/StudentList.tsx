// Student list page with card-based grid layout
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getStudents, deleteStudent } from '../../services/api/studentService';
import { useNotification } from '../../context/NotificationContext';
import { usePagination } from '../../hooks/usePagination';
import { useDebounce } from '../../hooks/useDebounce';
import { useStudentListParams } from '../../hooks/useQueryParams';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StudentCard from '../../components/features/StudentCard';
import { StudentDeleteDialog } from '../../components/features/StudentDeleteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, X, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import type { Student } from '../../types/student';
import type { SortColumn, SortDirection } from '../../hooks/useQueryParams';

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get query params from URL for bookmarkability
  const { search: urlSearch, sortBy, sortDir, updateParams } = useStudentListParams();
  
  // Local search input state (updates immediately on keystroke)
  const [searchInput, setSearchInput] = useState(urlSearch);
  
  // Debounced search term (updates 400ms after user stops typing)
  const debouncedSearch = useDebounce(searchInput, 400);
  
  // Loading state during debounce period
  const [isSearching, setIsSearching] = useState(false);
  
  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    studentId: number | null;
    studentName: string;
  }>({
    isOpen: false,
    studentId: null,
    studentName: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Load more state for infinite scroll pattern
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const { success, error: showError } = useNotification();

  const {
    currentPage,
    pageSize,
    totalPages,
    totalCount,
    hasPrevious,
    hasNext,
    setCurrentPage,
    setPaginationData,
  } = usePagination({ initialPageSize: 12 }); // Fixed page size of 12 for grid optimization (4 rows × 3 columns)

  const hasMoreStudents = currentPage < totalPages;

  /**
   * Fetch students with optional append mode for Load More functionality
   * @param appendMode - If true, append new students to existing array; if false, replace array
   */
  const fetchStudents = async (appendMode = false) => {
    try {
      if (appendMode) {
        setIsLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await getStudents(currentPage, pageSize, debouncedSearch || undefined);
      
      if (appendMode) {
        // Append new students to existing array for Load More
        setStudents(prev => [...prev, ...response.data]);
      } else {
        // Replace students array for initial load or filter changes
        setStudents(response.data);
      }
      
      setPaginationData({
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        hasPrevious: response.hasPrevious,
        hasNext: response.hasNext,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load students';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
      setIsSearching(false);
      setIsLoadingMore(false);
    }
  };

  // Fetch students when page or debounced search changes
  useEffect(() => {
    const isAppendMode = currentPage > 1;
    fetchStudents(isAppendMode);
  }, [currentPage, pageSize, debouncedSearch]);

  // Reset to first page and clear accumulated students when search/sort changes
  useEffect(() => {
    if (debouncedSearch !== urlSearch) {
      updateParams({ search: debouncedSearch });
      setCurrentPage(1);
      setStudents([]); // Clear accumulated students for fresh search
    }
  }, [debouncedSearch]);

  // Show searching indicator while debouncing
  useEffect(() => {
    if (searchInput !== debouncedSearch) {
      setIsSearching(true);
    }
  }, [searchInput]);

  // Initialize search input from URL on mount
  useEffect(() => {
    setSearchInput(urlSearch);
  }, []);

  /**
   * Event handlers memoized with useCallback to prevent unnecessary re-renders
   * of child components (StudentCard) when these handlers are passed as props
   */
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    updateParams({ search: '' });
    setCurrentPage(1);
    setStudents([]); // Clear accumulated students for fresh search
  }, [updateParams, setCurrentPage]);

  const handleSortChange = useCallback((value: SortColumn) => {
    updateParams({ sortBy: value });
    setCurrentPage(1);
    setStudents([]); // Clear accumulated students for fresh sort
  }, [updateParams, setCurrentPage]);

  const handleSortDirectionToggle = useCallback(() => {
    const newDirection: SortDirection = sortDir === 'asc' ? 'desc' : 'asc';
    updateParams({ sortDir: newDirection });
    setCurrentPage(1);
    setStudents([]); // Clear accumulated students for fresh sort
  }, [sortDir, updateParams, setCurrentPage]);

  /**
   * Load more students (increment page to append next batch)
   */
  const handleLoadMore = useCallback(() => {
    setCurrentPage(currentPage + 1);
  }, [currentPage, setCurrentPage]);

  /**
   * Client-side sorting of students
   * Educational note: This sorts the data received from the API in the browser.
   * For large datasets, server-side sorting would be more efficient, but for
   * our use case with paginated data (typically 10-50 students per page),
   * client-side sorting provides instant feedback without additional API calls.
   */
  const sortedStudents = useMemo(() => {
    if (!students || students.length === 0) return [];

    return [...students].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      // Get values based on sort column
      switch (sortBy) {
        case 'lastName':
          aValue = a.lastName.toLowerCase();
          bValue = b.lastName.toLowerCase();
          break;
        case 'firstName':
          aValue = a.firstMidName.toLowerCase();
          bValue = b.firstMidName.toLowerCase();
          break;
        case 'enrollmentDate':
          aValue = new Date(a.enrollmentDate).getTime();
          bValue = new Date(b.enrollmentDate).getTime();
          break;
        case 'enrollmentCount':
          aValue = a.enrollmentCount;
          bValue = b.enrollmentCount;
          break;
        default:
          return 0;
      }

      // Compare values
      if (aValue < bValue) return sortDir === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [students, sortBy, sortDir]);

  /**
   * Open delete confirmation dialog
   */
  const handleDeleteClick = (id: number, firstName: string, lastName: string) => {
    setDeleteDialog({
      isOpen: true,
      studentId: id,
      studentName: `${firstName} ${lastName}`,
    });
  };

  /**
   * Cancel delete operation
   */
  const handleDeleteCancel = () => {
    setDeleteDialog({
      isOpen: false,
      studentId: null,
      studentName: '',
    });
  };

  /**
   * Confirm and execute delete operation
   */
  const handleDeleteConfirm = async () => {
    if (!deleteDialog.studentId) return;

    try {
      setIsDeleting(true);
      await deleteStudent(deleteDialog.studentId);
      success('Student deleted successfully');
      
      // Close dialog
      handleDeleteCancel();
      
      // If deleting last student on page and not on first page, go to previous page
      if (students.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        // Otherwise refresh current page
        fetchStudents();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete student';
      showError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && students.length === 0) {
    return <LoadingSpinner message="Loading students..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">
            Manage student records and enrollments
          </p>
        </div>
        <Button asChild>
          <Link to="/students/create">
            <Plus className="mr-2 h-4 w-4" />
            Create New Student
          </Link>
        </Button>
      </div>

      {/* Search and Sort Filter Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by name..."
                className="pr-10"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastName">Last Name</SelectItem>
                  <SelectItem value="firstName">First Name</SelectItem>
                  <SelectItem value="enrollmentDate">Enrollment Date</SelectItem>
                  <SelectItem value="enrollmentCount">Enrollments</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Direction Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={handleSortDirectionToggle}
                aria-label={`Sort ${sortDir === 'asc' ? 'descending' : 'ascending'}`}
              >
                {sortDir === 'asc' ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Clear Search Button */}
            {debouncedSearch && (
              <Button type="button" variant="outline" onClick={handleClearSearch}>
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {error && <ErrorMessage message={error} onRetry={fetchStudents} className="mb-6" />}

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {students.length} of {totalCount} students
        {debouncedSearch && ` (filtered by "${debouncedSearch}")`}
      </div>

      {/* Student Cards Grid */}
      {sortedStudents.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              {debouncedSearch 
                ? `No students found matching "${debouncedSearch}". Try a different search term.`
                : 'No students found. Create your first student to get started.'}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onDelete={() => handleDeleteClick(student.id, student.firstMidName, student.lastName)}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {sortedStudents.length > 0 && hasMoreStudents && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="w-full sm:w-auto min-w-[200px]"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading more...
              </>
            ) : (
              <>
                Load More
                <span className="ml-2 text-xs text-muted-foreground">
                  ({students.length} of {totalCount})
                </span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <StudentDeleteDialog
        isOpen={deleteDialog.isOpen}
        studentName={deleteDialog.studentName}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default StudentList;
