// T122: Create department page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DepartmentForm from '../../components/features/DepartmentForm';
import { useNotification } from '../../context/NotificationContext';
import { createDepartment } from '../../services/api/departmentService';
import type { CreateDepartment } from '../../types/course';

const CreateDepartmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateDepartment) => {
    setIsSubmitting(true);
    try {
      await createDepartment(data);
      success('Department created successfully');
      navigate('/departments');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create department';
      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/departments');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Department</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter the department information below. All fields marked with * are required.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <DepartmentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default CreateDepartmentPage;
