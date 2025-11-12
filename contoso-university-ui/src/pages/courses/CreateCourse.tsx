// Create new course page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseForm from '../../components/features/CourseForm';
import { useNotification } from '../../context/NotificationContext';
import { createCourse } from '../../services/api/courseService';
import type { CreateCourse } from '../../types/course';

const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateCourse) => {
    setIsSubmitting(true);
    try {
      await createCourse(data);
      success('Course created successfully');
      navigate('/courses');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create course';
      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/courses');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter the course information below. All fields marked with * are required.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <CourseForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default CreateCoursePage;
