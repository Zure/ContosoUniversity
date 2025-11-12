// T144: Create instructor page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InstructorForm from '../../components/features/InstructorForm';
import { useNotification } from '../../context/NotificationContext';
import { createInstructor } from '../../services/api/instructorService';
import type { CreateInstructor as CreateInstructorData } from '../../types/instructor';

const CreateInstructorPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateInstructorData) => {
    setIsSubmitting(true);
    try {
      await createInstructor(data);
      success('Instructor created successfully');
      navigate('/instructors');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create instructor';
      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/instructors');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Instructor</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter the instructor information below. All fields marked with * are required.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <InstructorForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default CreateInstructorPage;
