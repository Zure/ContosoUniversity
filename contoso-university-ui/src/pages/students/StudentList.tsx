// Student list page with pagination, search, and sorting
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudents, deleteStudent } from '@/services/api/studentService';
import { useNotification } from '@/context/NotificationContext';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { useStudentListParams } from '@/hooks/useQueryParams';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import Pagination from '@/components/common/Pagination';
import { SortableTableHead } from '@/components/common/SortableTableHead';
import { StudentDeleteDialog } from '@/components/features/StudentDeleteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, X, Pencil, Trash2 } from 'lucide-react';
import type { Student } from '@/types/student';
import type { SortColumn } from '@/hooks/useQueryParams';

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    studentId: null as number | null,
    studentName: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get URL query parameters
  const { page, pageSize, search, sortBy, sortDir, updateParams } = useStudentListParams();
  
  // Local state for search input (updates on every keystroke)
  const [searchInput, setSearchInput] = useState(search);
  
  // Debounced search term (updates after 400ms of inactivity)
  const debouncedSearch = useDebounce(searchInput, 400);
  
  const { success, error: showError } = useNotification();

  const {
    currentPage,
    pageSize: paginationPageSize,
    totalPages,
    totalCount,
    hasPrevious,
    hasNext,
    setCurrentPage,
    setPaginationData,
  } = usePagination({ initialPageSize: pageSize, initialPage: page });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStudents(currentPage, paginationPageSize, debouncedSearch || undefined);
      setStudents(response.data);
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
    }
  };

  // Fetch students when debounced search, page, or page size changes
  useEffect(() => {
    fetchStudents();
  }, [currentPage, paginationPageSize, debouncedSearch]);

  // Sync debounced search with URL and reset to page 1
  useEffect(() => {
    if (debouncedSearch !== search) {
      updateParams({ search: debouncedSearch, page: 1 });
      setCurrentPage(1);
    }
  }, [debouncedSearch]);

  // Sync URL page/pageSize with pagination state
  useEffect(() => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [page]);

  // Handle search input change (real-time, no form submission needed)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle clear search button
  const handleSearchClear = () => {
    setSearchInput('');
    updateParams({ search: '', page: 1 });
    setCurrentPage(1);
  };

  // Handle column sort
  const handleSort = (column: SortColumn) => {
    const newDirection = sortBy === column && sortDir === 'asc' ? 'desc' : 'asc';
    updateParams({ sortBy: column, sortDir: newDirection });
  };

  // Client-side sort students (since backend doesn't support sorting yet)
  const sortedStudents = React.useMemo(() => {
    const sorted = [...students];
    sorted.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

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

      if (aValue < bValue) return sortDir === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [students, sortBy, sortDir]);

  // Handle delete button click - open confirmation dialog
  const handleDeleteClick = (id: number, fullName: string) => {
    setDeleteDialog({
      isOpen: true,
      studentId: id,
      studentName: fullName,
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteDialog.studentId) return;

    try {
      setIsDeleting(true);
      await deleteStudent(deleteDialog.studentId);
      success(`Successfully deleted ${deleteDialog.studentName}`);
      
      // Close dialog
      setDeleteDialog({ isOpen: false, studentId: null, studentName: '' });
      
      // If we deleted the last student on the current page, go to previous page
      if (students.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        // Refresh the list
        fetchStudents();
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete student';
      showError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, studentId: null, studentName: '' });
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    updateParams({ pageSize: size, page: 1 });
    setCurrentPage(1);
  };

  if (loading && students.length === 0) {
    return <LoadingSpinner message="Loading students..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search students by name..."
          className="pl-10 pr-10"
        />
        {searchInput && (
          <button
            type="button"
            onClick={handleSearchClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchStudents} className="mb-6" />}

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            Showing {students.length > 0 ? ((currentPage - 1) * paginationPageSize + 1) : 0}-
            {Math.min(currentPage * paginationPageSize, totalCount)} of {totalCount} students
            {debouncedSearch && ` (filtered by "${debouncedSearch}")`}
          </>
        )}
      </div>

      {/* Students Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead
                column="lastName"
                label="Last Name"
                currentSort={sortBy}
                currentDirection={sortDir}
                onSort={handleSort}
              />
              <SortableTableHead
                column="firstName"
                label="First Name"
                currentSort={sortBy}
                currentDirection={sortDir}
                onSort={handleSort}
                className="hidden md:table-cell"
              />
              <SortableTableHead
                column="enrollmentDate"
                label="Enrollment Date"
                currentSort={sortBy}
                currentDirection={sortDir}
                onSort={handleSort}
                className="hidden lg:table-cell"
              />
              <SortableTableHead
                column="enrollmentCount"
                label="Enrollments"
                currentSort={sortBy}
                currentDirection={sortDir}
                onSort={handleSort}
                className="hidden lg:table-cell"
              />
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {loading && students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <LoadingSpinner message="Loading students..." />
              </TableCell>
            </TableRow>
          ) : students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                {debouncedSearch ? `No students found matching "${debouncedSearch}"` : 'No students found.'}
              </TableCell>
            </TableRow>
          ) : (
            sortedStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.lastName}</TableCell>
                <TableCell className="hidden md:table-cell">{student.firstMidName}</TableCell>
                <TableCell className="hidden lg:table-cell">{new Date(student.enrollmentDate).toLocaleDateString()}</TableCell>
                <TableCell className="hidden lg:table-cell">{student.enrollmentCount}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      aria-label={`Edit ${student.fullName}`}
                    >
                      <Link to={`/students/edit/${student.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(student.id, student.fullName)}
                      aria-label={`Delete ${student.fullName}`}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && !loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={paginationPageSize}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <StudentDeleteDialog
        isOpen={deleteDialog.isOpen}
        studentName={deleteDialog.studentName}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default StudentList;
