// T094: Enrollment form component
import React, { useState, useEffect } from 'react';
import {
  getStudentsForEnrollment,
  getCoursesForEnrollment,
} from '../../services/api/enrollmentService';
import type { CreateEnrollment, UpdateEnrollment, GradeValue } from '../../types/enrollment';
import type { Student } from '../../types/student';
import type { Course } from '../../types/course';

const GRADES: GradeValue[] = ['A', 'B', 'C', 'D', 'F'];

interface EnrollmentFormProps {
  initialData?: UpdateEnrollment & { studentID?: number; courseID?: number };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
  isSubmitting = false,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    studentID: initialData?.studentID || 0,
    courseID: initialData?.courseID || 0,
    grade: initialData?.grade || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsData, coursesData] = await Promise.all([
        getStudentsForEnrollment(),
        getCoursesForEnrollment(),
      ]);
      setStudents(studentsData);
      setCourses(coursesData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isEdit) {
      if (!formData.studentID || formData.studentID === 0) {
        newErrors.studentID = 'Student is required';
      }

      if (!formData.courseID || formData.courseID === 0) {
        newErrors.courseID = 'Course is required';
      }
    }

    if (formData.grade && !GRADES.includes(formData.grade as GradeValue)) {
      newErrors.grade = 'Grade must be A, B, C, D, or F';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = isEdit
      ? ({
          grade: formData.grade || undefined,
        } as UpdateEnrollment)
      : ({
          studentID: formData.studentID,
          courseID: formData.courseID,
          grade: formData.grade || undefined,
        } as CreateEnrollment);

    await onSubmit(submitData);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Student Selection (Create only) */}
      {!isEdit && (
        <div>
          <label htmlFor="studentID" className="block text-sm font-medium text-gray-700">
            Student <span className="text-red-500">*</span>
          </label>
          <select
            id="studentID"
            value={formData.studentID}
            onChange={(e) => handleChange('studentID', parseInt(e.target.value))}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.studentID ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          >
            <option value="0">Select a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstMidName} {student.lastName}
              </option>
            ))}
          </select>
          {errors.studentID && (
            <p className="mt-1 text-sm text-red-600">{errors.studentID}</p>
          )}
        </div>
      )}

      {/* Course Selection (Create only) */}
      {!isEdit && (
        <div>
          <label htmlFor="courseID" className="block text-sm font-medium text-gray-700">
            Course <span className="text-red-500">*</span>
          </label>
          <select
            id="courseID"
            value={formData.courseID}
            onChange={(e) => handleChange('courseID', parseInt(e.target.value))}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.courseID ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          >
            <option value="0">Select a course</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseNumber} - {course.title}
              </option>
            ))}
          </select>
          {errors.courseID && (
            <p className="mt-1 text-sm text-red-600">{errors.courseID}</p>
          )}
        </div>
      )}

      {/* Grade */}
      <div>
        <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
          Grade
        </label>
        <select
          id="grade"
          value={formData.grade}
          onChange={(e) => handleChange('grade', e.target.value)}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.grade ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        >
          <option value="">No grade</option>
          {GRADES.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
        {errors.grade && <p className="mt-1 text-sm text-red-600">{errors.grade}</p>}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Grade' : 'Create Enrollment'}
        </button>
      </div>
    </form>
  );
};

export default EnrollmentForm;
