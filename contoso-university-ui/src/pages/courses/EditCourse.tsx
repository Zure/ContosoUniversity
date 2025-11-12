// Edit course page
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CourseForm from '../../components/features/CourseForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useNotification } from '../../context/NotificationContext';
import { getCourseById, updateCourse } from '../../services/api/courseService';
import type { Course, UpdateCourse } from '../../types/course';

const EditCoursePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (data: UpdateCourse) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updateCourse(parseInt(id), data);
      success('Course updated successfully');
      navigate('/courses');
    } catch (error: any) {
      if (error.response?.status === 409) {
        showError(
          'This course has been modified by another user. Please refresh and try again.'
        );
        fetchCourse(); // Reload to get latest data
      } else {
        const message = error.response?.data?.message || 'Failed to update course';
        showError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/courses');
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update the course information below. All fields marked with * are required.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <CourseForm
          initialData={{
            courseNumber: course.courseNumber,
            title: course.title,
            credits: course.credits,
            departmentId: course.departmentId,
            rowVersion: course.rowVersion,
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

export default EditCoursePage;
