// Student list page with pagination and search
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudents, deleteStudent } from '../../services/api/studentService';
import { useNotification } from '../../context/NotificationContext';
import { usePagination } from '../../hooks/usePagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, X } from 'lucide-react';
import type { Student } from '../../types/student';

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchString, setSearchString] = useState('');
  const [searchInput, setSearchInput] = useState('');
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
  } = usePagination({ initialPageSize: 10 });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStudents(currentPage, pageSize, searchString || undefined);
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

  useEffect(() => {
    fetchStudents();
  }, [currentPage, pageSize, searchString]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchString(searchInput);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchString('');
    setCurrentPage(1);
  };

  const handleDelete = async (id: number, fullName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${fullName}?`)) {
      return;
    }

    try {
      await deleteStudent(id);
      success(`Successfully deleted ${fullName}`);
      fetchStudents();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete student';
      showError(message);
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

      {/* Search Card */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name..."
              />
            </div>
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            {searchString && (
              <Button type="button" variant="outline" onClick={handleClearSearch}>
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {error && <ErrorMessage message={error} onRetry={fetchStudents} className="mb-6" />}

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {students.length} of {totalCount} students
        {searchString && ` (filtered by "${searchString}")`}
      </div>

      {/* Students Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            View and manage all enrolled students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Last Name</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Enrollment Date</TableHead>
                <TableHead>Enrollments</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {searchString ? 'No students found matching your search.' : 'No students found.'}
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.lastName}</TableCell>
                  <TableCell>{student.firstMidName}</TableCell>
                  <TableCell>{new Date(student.enrollmentDate).toLocaleDateString()}</TableCell>
                  <TableCell>{student.enrollmentCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/students/${student.id}`}>Details</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/students/edit/${student.id}`}>Edit</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(student.id, student.fullName)}
                        className="text-destructive hover:text-destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      )}
    </div>
  );
};

export default StudentList;
