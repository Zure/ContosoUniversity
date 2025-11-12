// Instructor API service
import apiClient from './client';
import type { PaginatedResponse } from '../../types/api';
import type { Instructor, CreateInstructor, UpdateInstructor } from '../../types/instructor';

/**
 * Get paginated list of instructors with optional search
 */
export const getInstructors = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  searchString?: string
): Promise<PaginatedResponse<Instructor>> => {
  const params = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });

  if (searchString) {
    params.append('searchString', searchString);
  }

  const response = await apiClient.get<PaginatedResponse<Instructor>>(
    `/instructors?${params.toString()}`
  );
  return response.data;
};

/**
 * Get a single instructor by ID
 */
export const getInstructorById = async (id: number): Promise<Instructor> => {
  const response = await apiClient.get<Instructor>(`/instructors/${id}`);
  return response.data;
};

/**
 * Create a new instructor
 */
export const createInstructor = async (instructor: CreateInstructor): Promise<Instructor> => {
  const response = await apiClient.post<Instructor>('/instructors', instructor);
  return response.data;
};

/**
 * Update an existing instructor
 */
export const updateInstructor = async (
  id: number,
  instructor: UpdateInstructor
): Promise<Instructor> => {
  const response = await apiClient.put<Instructor>(`/instructors/${id}`, instructor);
  return response.data;
};

/**
 * Delete an instructor
 */
export const deleteInstructor = async (id: number): Promise<void> => {
  await apiClient.delete(`/instructors/${id}`);
};
