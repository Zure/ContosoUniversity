// T145: Edit instructor page
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InstructorForm from '../../components/features/InstructorForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useNotification } from '../../context/NotificationContext';
import { getInstructorById, updateInstructor } from '../../services/api/instructorService';
import type { Instructor, UpdateInstructor as UpdateInstructorData } from '../../types/instructor';

const EditInstructorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (data: UpdateInstructorData) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updateInstructor(parseInt(id), data);
      success('Instructor updated successfully');
      navigate('/instructors');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update instructor';
      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/instructors');
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Instructor</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update the instructor information below. All fields marked with * are required.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <InstructorForm
          initialData={instructor}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEdit={true}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditInstructorPage;
