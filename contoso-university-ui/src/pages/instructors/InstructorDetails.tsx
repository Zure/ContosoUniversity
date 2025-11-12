// T146: Instructor details page
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useNotification } from '../../context/NotificationContext';
import { getInstructorById, deleteInstructor } from '../../services/api/instructorService';
import type { Instructor } from '../../types/instructor';

const InstructorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInstructor();
  }, [id]);

  const fetchInstructor = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getInstructorById(parseInt(id));
      setInstructor(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load instructor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !instructor) return;

    if (!window.confirm(`Are you sure you want to delete instructor "${instructor.fullName}"?`)) {
      return;
    }

    try {
      await deleteInstructor(parseInt(id));
      success('Instructor deleted successfully');
      navigate('/instructors');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete instructor';
      showError(message);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !instructor) {
    return (
      <ErrorMessage
        message={error || 'Instructor not found'}
        onRetry={fetchInstructor}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructor Details</h1>
          <p className="mt-2 text-sm text-gray-600">
            View instructor information and course assignments
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/instructors/edit/${instructor.id}`}
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
          <h2 className="text-xl font-semibold text-gray-900">{instructor.fullName}</h2>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{instructor.lastName}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">First Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{instructor.firstMidName}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Hire Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(instructor.hireDate)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Office Location</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {instructor.officeLocation || (
                  <span className="text-gray-400">Not assigned</span>
                )}
              </dd>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <dt className="text-sm font-medium text-gray-500 mb-3">Course Assignments</dt>
            {instructor.courseAssignments.length === 0 ? (
              <dd className="text-sm text-gray-400">No courses assigned</dd>
            ) : (
              <dd className="space-y-2">
                {instructor.courseAssignments.map((course) => (
                  <div
                    key={course.courseId}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {course.courseNumber} - {course.courseTitle}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Department: {course.departmentName}
                      </div>
                    </div>
                    <Link
                      to={`/courses/${course.courseId}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View →
                    </Link>
                  </div>
                ))}
              </dd>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <Link
            to="/instructors"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            ← Back to Instructors
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetails;
