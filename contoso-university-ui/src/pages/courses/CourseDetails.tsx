// Course details page
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useNotification } from '../../context/NotificationContext';
import { getCourseById, deleteCourse } from '../../services/api/courseService';
import type { Course } from '../../types/course';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getCourseById(parseInt(id));
      setCourse(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !course) return;

    const confirmMessage = course.enrollmentCount > 0
      ? `This course has ${course.enrollmentCount} enrollment(s). Are you sure you want to delete it?`
      : 'Are you sure you want to delete this course?';

    if (!window.confirm(confirmMessage)) return;

    try {
      await deleteCourse(parseInt(id));
      success('Course deleted successfully');
      navigate('/courses');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete course';
      showError(message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !course) {
    return (
      <ErrorMessage
        message={error || 'Course not found'}
        onRetry={fetchCourse}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Details</h1>
          <p className="mt-2 text-sm text-gray-600">
            View course information and manage enrollments
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/courses/edit/${course.courseId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
          <p className="mt-1 text-sm text-gray-600">Course #{course.courseNumber}</p>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Course Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{course.courseNumber}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Credits</dt>
              <dd className="mt-1 text-sm text-gray-900">{course.credits}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Department</dt>
              <dd className="mt-1 text-sm text-gray-900">{course.departmentName}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Enrollments</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {course.enrollmentCount} student{course.enrollmentCount !== 1 ? 's' : ''}
              </dd>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <dt className="text-sm font-medium text-gray-500 mb-2">Title</dt>
            <dd className="text-sm text-gray-900">{course.title}</dd>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <Link
            to="/courses"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            ← Back to Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
