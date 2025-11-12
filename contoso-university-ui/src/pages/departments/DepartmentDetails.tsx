// T124: Department details page
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useNotification } from '../../context/NotificationContext';
import { getDepartmentById, deleteDepartment } from '../../services/api/departmentService';
import type { Department } from '../../types/course';

const DepartmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartment();
  }, [id]);

  const fetchDepartment = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getDepartmentById(parseInt(id));
      setDepartment(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load department');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !department) return;

    if (department.courseCount > 0) {
      showError(
        `Cannot delete department "${department.name}". It has ${department.courseCount} course(s) assigned.`
      );
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the "${department.name}" department?`)) {
      return;
    }

    try {
      await deleteDepartment(parseInt(id));
      success('Department deleted successfully');
      navigate('/departments');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete department';
      showError(message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !department) {
    return (
      <ErrorMessage
        message={error || 'Department not found'}
        onRetry={fetchDepartment}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Details</h1>
          <p className="mt-2 text-sm text-gray-600">
            View department information and assigned courses
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/departments/edit/${department.departmentId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={department.courseCount > 0}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{department.name}</h2>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Budget</dt>
              <dd className="mt-1 text-sm text-gray-900">
                ${department.budget.toLocaleString()}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Start Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(department.startDate).toLocaleDateString()}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Administrator</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {department.administratorName || (
                  <span className="text-gray-400">Not assigned</span>
                )}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Courses</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {department.courseCount} course{department.courseCount !== 1 ? 's' : ''}
              </dd>
            </div>
          </div>

          {department.courseCount > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <Link
                  to={`/courses?departmentId=${department.departmentId}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View courses in this department →
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <Link
            to="/departments"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            ← Back to Departments
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailsPage;
