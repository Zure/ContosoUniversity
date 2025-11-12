// T117: Department API service
import axiosInstance from './client';
import type { PaginatedResponse } from '../../types/api';
import type { Department, CreateDepartment, UpdateDepartment } from '../../types/course';

/**
 * Get departments with optional search
 */
export const getDepartments = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  searchString?: string
): Promise<PaginatedResponse<Department>> => {
  const params = new URLSearchParams();
  params.append('pageNumber', pageNumber.toString());
  params.append('pageSize', pageSize.toString());
  
  if (searchString) {
    params.append('searchString', searchString);
  }

  const response = await axiosInstance.get<PaginatedResponse<Department>>(
    `/departments?${params.toString()}`
  );
  return response.data;
};

/**
 * Get department by ID
 */
export const getDepartmentById = async (id: number): Promise<Department> => {
  const response = await axiosInstance.get<Department>(`/departments/${id}`);
  return response.data;
};

/**
 * Create a new department
 */
export const createDepartment = async (department: CreateDepartment): Promise<Department> => {
  const response = await axiosInstance.post<Department>('/departments', department);
  return response.data;
};

/**
 * Update a department
 */
export const updateDepartment = async (
  id: number,
  department: UpdateDepartment
): Promise<Department> => {
  const response = await axiosInstance.put<Department>(`/departments/${id}`, department);
  return response.data;
};

/**
 * Delete a department
 */
export const deleteDepartment = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/departments/${id}`);
};

/**
 * Get all instructors for department administrator dropdown
 */
export const getInstructorsForDepartment = async (): Promise<any[]> => {
  // Simplified - will be replaced with proper instructor service in Phase 7
  const response = await axiosInstance.get('/instructors?pageSize=1000');
  return response.data.data || [];
};
