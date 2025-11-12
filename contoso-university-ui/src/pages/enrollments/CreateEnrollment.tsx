// T096: Create enrollment page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EnrollmentForm from '../../components/features/EnrollmentForm';
import { useNotification } from '../../context/NotificationContext';
import { createEnrollment } from '../../services/api/enrollmentService';
import type { CreateEnrollment } from '../../types/enrollment';

const CreateEnrollmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateEnrollment) => {
    setIsSubmitting(true);
    try {
      await createEnrollment(data);
      success('Enrollment created successfully');
      navigate('/enrollments');
    } catch (error: any) {
      if (error.response?.status === 409) {
        showError('Student is already enrolled in this course');
      } else {
        const message = error.response?.data?.message || 'Failed to create enrollment';
        showError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/enrollments');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Enrollment</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enroll a student in a course. You can assign a grade now or later.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <EnrollmentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default CreateEnrollmentPage;
