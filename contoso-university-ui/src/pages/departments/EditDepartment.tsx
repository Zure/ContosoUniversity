// T123: Edit department page
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DepartmentForm from '../../components/features/DepartmentForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useNotification } from '../../context/NotificationContext';
import { getDepartmentById, updateDepartment } from '../../services/api/departmentService';
import { Card, CardContent } from '@/components/ui/card';
import type { Department, UpdateDepartment } from '../../types/course';

const EditDepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (data: UpdateDepartment) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updateDepartment(parseInt(id), data);
      success('Department updated successfully');
      navigate('/departments');
    } catch (error: any) {
      if (error.response?.status === 409) {
        showError(
          'This department has been modified by another user. Please refresh and try again.'
        );
        fetchDepartment();
      } else {
        const message = error.response?.data?.message || 'Failed to update department';
        showError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/departments');
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Edit Department</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update the department information below. All fields marked with * are required.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
        <DepartmentForm
          initialData={department}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEdit={true}
          isSubmitting={isSubmitting}
        />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditDepartmentPage;
