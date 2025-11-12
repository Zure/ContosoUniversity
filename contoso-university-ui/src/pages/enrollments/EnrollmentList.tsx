// T093: Enrollment list page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePagination } from '../../hooks/usePagination';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import {
  getEnrollments,
  deleteEnrollment,
  getStudentsForEnrollment,
  getCoursesForEnrollment,
} from '../../services/api/enrollmentService';
import type { Enrollment } from '../../types/enrollment';
import type { Student } from '../../types/student';
import type { Course } from '../../types/course';

const EnrollmentList: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(0);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(0);
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
    goToFirstPage,
  } = usePagination();

  useEffect(() => {
    fetchStudentsAndCourses();
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [currentPage, pageSize, selectedStudentId, selectedCourseId]);

  const fetchStudentsAndCourses = async () => {
    try {
      const [studentsData, coursesData] = await Promise.all([
        getStudentsForEnrollment(),
        getCoursesForEnrollment(),
      ]);
      setStudents(studentsData);
      setCourses(coursesData);
    } catch (err) {
      console.error('Failed to load filter data:', err);
    }
  };

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);

      const studentFilter = selectedStudentId > 0 ? selectedStudentId : undefined;
      const courseFilter = selectedCourseId > 0 ? selectedCourseId : undefined;

      const data = await getEnrollments(
        currentPage,
        pageSize,
        studentFilter,
        courseFilter
      );

      setEnrollments(data.data);
      setPaginationData({
        totalCount: data.totalCount,
        totalPages: data.totalPages,
        hasPrevious: data.hasPrevious,
        hasNext: data.hasNext,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStudentId(parseInt(e.target.value));
    goToFirstPage();
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourseId(parseInt(e.target.value));
    goToFirstPage();
  };

  const handleClearFilters = () => {
    setSelectedStudentId(0);
    setSelectedCourseId(0);
    goToFirstPage();
  };

  const handleDelete = async (id: number, studentName: string, courseTitle: string) => {
    if (!window.confirm(`Remove ${studentName} from ${courseTitle}?`)) {
      return;
    }

    try {
      await deleteEnrollment(id);
      success('Enrollment deleted successfully');
      fetchEnrollments();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete enrollment';
      showError(message);
    }
  };

  if (loading && enrollments.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchEnrollments} />;
  }

  const hasFilters = selectedStudentId > 0 || selectedCourseId > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enrollments</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage student course enrollments and grades
          </p>
        </div>
        <Link
          to="/enrollments/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create New Enrollment
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="studentFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Student
            </label>
            <select
              id="studentFilter"
              value={selectedStudentId}
              onChange={handleStudentChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="0">All Students</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstMidName} {student.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="courseFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Course
            </label>
            <select
              id="courseFilter"
              value={selectedCourseId}
              onChange={handleCourseChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="0">All Courses</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseNumber} - {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {enrollments.length} of {totalCount} enrollment(s)
        {selectedStudentId > 0 && (
          <span className="ml-2">
            for student: {students.find((s) => s.id === selectedStudentId)?.firstMidName}{' '}
            {students.find((s) => s.id === selectedStudentId)?.lastName}
          </span>
        )}
        {selectedCourseId > 0 && (
          <span className="ml-2">
            in course: {courses.find((c) => c.courseId === selectedCourseId)?.title}
          </span>
        )}
      </div>

      {/* Enrollments table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No enrollments found
                </td>
              </tr>
            ) : (
              enrollments.map((enrollment) => (
                <tr key={enrollment.enrollmentID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/students/${enrollment.studentID}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {enrollment.studentName}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/courses/${enrollment.courseID}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {enrollment.courseTitle}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {enrollment.grade ? (
                      <span className="px-2 py-1 text-sm font-semibold bg-gray-100 rounded">
                        {enrollment.grade}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">No grade</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <Link
                      to={`/enrollments/edit/${enrollment.enrollmentID}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit Grade
                    </Link>
                    <button
                      onClick={() =>
                        handleDelete(
                          enrollment.enrollmentID,
                          enrollment.studentName,
                          enrollment.courseTitle
                        )
                      }
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
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default EnrollmentList;
