// Course list page with pagination, search, and department filtering
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses, deleteCourse, getDepartments } from '../../services/api/courseService';
import { useNotification } from '../../context/NotificationContext';
import { usePagination } from '../../hooks/usePagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import type { Course, Department } from '../../types/course';

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchString, setSearchString] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<number | undefined>();
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

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [currentPage, pageSize, searchString, selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Failed to load departments:', err);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCourses(
        currentPage,
        pageSize,
        selectedDepartment,
        searchString || undefined
      );
      setCourses(response.data);
      setPaginationData({
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        hasPrevious: response.hasPrevious,
        hasNext: response.hasNext,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load courses';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchString(searchInput);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchString('');
    setSelectedDepartment(undefined);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDepartment(value ? parseInt(value) : undefined);
    setCurrentPage(1);
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete ${title}?`)) {
      return;
    }

    try {
      await deleteCourse(id);
      success(`Successfully deleted ${title}`);
      fetchCourses();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete course';
      showError(message);
    }
  };

  if (loading && courses.length === 0) {
    return <LoadingSpinner message="Loading courses..." />;
  }

  const hasFilters = searchString || selectedDepartment;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
        <Link
          to="/courses/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create New Course
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <select
            value={selectedDepartment || ''}
            onChange={handleDepartmentChange}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.departmentId} value={dept.departmentId}>
                {dept.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
          {hasFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchCourses} className="mb-6" />}

      {/* Results summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {courses.length} of {totalCount} courses
        {searchString && ` (filtered by "${searchString}")`}
        {selectedDepartment &&
          ` (department: ${departments.find((d) => d.departmentId === selectedDepartment)?.name})`}
      </div>

      {/* Courses table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credits
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enrollments
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  {hasFilters ? 'No courses found matching your filters.' : 'No courses found.'}
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.courseId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {course.courseNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.credits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.departmentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.enrollmentCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      to={`/courses/${course.courseId}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Details
                    </Link>
                    <Link
                      to={`/courses/edit/${course.courseId}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(course.courseId, course.title)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
          />
        </div>
      )}
    </div>
  );
};

export default CourseList;
