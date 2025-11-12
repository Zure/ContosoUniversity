// T143: Instructor form component
import React, { useState, useEffect } from 'react';
import { getCourses } from '../../services/api/courseService';
import type { Instructor } from '../../types/instructor';
import type { Course } from '../../types/course';

interface InstructorFormProps {
  initialData?: Instructor;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;
}

const InstructorForm: React.FC<InstructorFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
  isSubmitting = false,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    lastName: initialData?.lastName || '',
    firstMidName: initialData?.firstMidName || '',
    hireDate: initialData?.hireDate
      ? new Date(initialData.hireDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    officeLocation: initialData?.officeLocation || '',
    courseIDs: initialData?.courseAssignments.map(c => c.courseId) || [] as number[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // Fetch all courses without pagination for dropdown
      const data = await getCourses(1, 1000);
      setCourses(data.data);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 1 || formData.lastName.length > 50) {
      newErrors.lastName = 'Last name must be between 1 and 50 characters';
    }

    if (!formData.firstMidName.trim()) {
      newErrors.firstMidName = 'First name is required';
    } else if (formData.firstMidName.length < 1 || formData.firstMidName.length > 50) {
      newErrors.firstMidName = 'First name must be between 1 and 50 characters';
    }

    if (!formData.hireDate) {
      newErrors.hireDate = 'Hire date is required';
    }

    if (formData.officeLocation && formData.officeLocation.length > 50) {
      newErrors.officeLocation = 'Office location must not exceed 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      lastName: formData.lastName.trim(),
      firstMidName: formData.firstMidName.trim(),
      hireDate: formData.hireDate,
      officeLocation: formData.officeLocation.trim() || undefined,
      courseIDs: formData.courseIDs,
    };

    await onSubmit(submitData);
  };

  const handleCourseToggle = (courseId: number) => {
    setFormData(prev => ({
      ...prev,
      courseIDs: prev.courseIDs.includes(courseId)
        ? prev.courseIDs.filter(id => id !== courseId)
        : [...prev.courseIDs, courseId]
    }));
  };

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="lastName" className="required">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className={errors.lastName ? 'error' : ''}
          disabled={isSubmitting}
          maxLength={50}
        />
        {errors.lastName && <span className="error-message">{errors.lastName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="firstMidName" className="required">
          First Name
        </label>
        <input
          type="text"
          id="firstMidName"
          value={formData.firstMidName}
          onChange={(e) => setFormData({ ...formData, firstMidName: e.target.value })}
          className={errors.firstMidName ? 'error' : ''}
          disabled={isSubmitting}
          maxLength={50}
        />
        {errors.firstMidName && <span className="error-message">{errors.firstMidName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="hireDate" className="required">
          Hire Date
        </label>
        <input
          type="date"
          id="hireDate"
          value={formData.hireDate}
          onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
          className={errors.hireDate ? 'error' : ''}
          disabled={isSubmitting}
        />
        {errors.hireDate && <span className="error-message">{errors.hireDate}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="officeLocation">
          Office Location
        </label>
        <input
          type="text"
          id="officeLocation"
          value={formData.officeLocation}
          onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
          className={errors.officeLocation ? 'error' : ''}
          disabled={isSubmitting}
          maxLength={50}
          placeholder="e.g., Smith Hall 123"
        />
        {errors.officeLocation && <span className="error-message">{errors.officeLocation}</span>}
      </div>

      <div className="form-group">
        <label>Course Assignments</label>
        <div className="checkbox-group">
          {courses.length === 0 ? (
            <p className="text-muted">No courses available</p>
          ) : (
            courses.map((course) => (
              <div key={course.courseId} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`course-${course.courseId}`}
                  checked={formData.courseIDs.includes(course.courseId)}
                  onChange={() => handleCourseToggle(course.courseId)}
                  disabled={isSubmitting}
                />
                <label htmlFor={`course-${course.courseId}`}>
                  {course.courseNumber} - {course.title} ({course.departmentName})
                </label>
              </div>
            ))
          )}
        </div>
        <p className="form-help">
          Select the courses this instructor will teach
        </p>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Instructor' : 'Create Instructor'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default InstructorForm;
