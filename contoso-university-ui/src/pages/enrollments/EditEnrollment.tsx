// T097: Edit enrollment page (grade editing)
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EnrollmentForm from '../../components/features/EnrollmentForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useNotification } from '../../context/NotificationContext';
import { getEnrollmentById, updateEnrollment } from '../../services/api/enrollmentService';
import type { Enrollment, UpdateEnrollment } from '../../types/enrollment';

const EditEnrollmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEnrollment();
  }, [id]);

  const fetchEnrollment = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getEnrollmentById(parseInt(id));
      setEnrollment(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load enrollment');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateEnrollment) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updateEnrollment(parseInt(id), data);
      success('Grade updated successfully');
      navigate('/enrollments');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update enrollment';
      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/enrollments');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !enrollment) {
    return (
      <ErrorMessage
        message={error || 'Enrollment not found'}
        onRetry={fetchEnrollment}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Enrollment Grade</h1>
        <p className="mt-2 text-sm text-gray-600">
          Student: <span className="font-medium">{enrollment.studentName}</span>
          <br />
          Course: <span className="font-medium">{enrollment.courseTitle}</span>
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <EnrollmentForm
          initialData={{
            studentID: enrollment.studentID,
            courseID: enrollment.courseID,
            grade: enrollment.grade,
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEdit={true}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditEnrollmentPage;
