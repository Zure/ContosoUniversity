// T119: Department form component
import React, { useState, useEffect } from 'react';
import { getInstructorsForDepartment } from '../../services/api/departmentService';
import type { CreateDepartment, UpdateDepartment, Department } from '../../types/course';

interface Instructor {
  id: number;
  firstMidName: string;
  lastName: string;
}

interface DepartmentFormProps {
  initialData?: Department;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
  isSubmitting = false,
}) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    budget: initialData?.budget || 0,
    startDate: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    instructorId: initialData?.instructorId || 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const data = await getInstructorsForDepartment();
      setInstructors(data);
    } catch (err) {
      console.error('Failed to load instructors:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3 || formData.name.length > 50) {
      newErrors.name = 'Name must be between 3 and 50 characters';
    }

    if (formData.budget < 0) {
      newErrors.budget = 'Budget must be a positive number';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
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
          name: formData.name.trim(),
          budget: formData.budget,
          startDate: formData.startDate,
          instructorId: formData.instructorId > 0 ? formData.instructorId : undefined,
          rowVersion: initialData?.rowVersion,
        } as UpdateDepartment)
      : ({
          name: formData.name.trim(),
          budget: formData.budget,
          startDate: formData.startDate,
          instructorId: formData.instructorId > 0 ? formData.instructorId : undefined,
        } as CreateDepartment);

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
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          }`}
          maxLength={50}
          disabled={isSubmitting}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Budget */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
          Budget <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="budget"
          value={formData.budget}
          onChange={(e) => handleChange('budget', parseFloat(e.target.value) || 0)}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.budget ? 'border-red-300' : 'border-gray-300'
          }`}
          min="0"
          step="0.01"
          disabled={isSubmitting}
        />
        {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
      </div>

      {/* Start Date */}
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Start Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="startDate"
          value={formData.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.startDate ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
        {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
      </div>

      {/* Administrator */}
      <div>
        <label htmlFor="instructorId" className="block text-sm font-medium text-gray-700">
          Administrator
        </label>
        <select
          id="instructorId"
          value={formData.instructorId}
          onChange={(e) => handleChange('instructorId', parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          disabled={isSubmitting}
        >
          <option value="0">No administrator</option>
          {instructors.map((instructor) => (
            <option key={instructor.id} value={instructor.id}>
              {instructor.firstMidName} {instructor.lastName}
            </option>
          ))}
        </select>
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
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Department' : 'Create Department'}
        </button>
      </div>
    </form>
  );
};

export default DepartmentForm;
