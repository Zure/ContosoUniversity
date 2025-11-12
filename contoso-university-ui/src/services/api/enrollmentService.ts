// T092: Enrollment API service
import axiosInstance from './client';
import type { PaginatedResponse } from '../../types/api';
import type { Enrollment, CreateEnrollment, UpdateEnrollment } from '../../types/enrollment';
import type { Student } from '../../types/student';
import type { Course } from '../../types/course';

/**
 * Get enrollments with optional filtering
 */
export const getEnrollments = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  studentId?: number,
  courseId?: number
): Promise<PaginatedResponse<Enrollment>> => {
  const params = new URLSearchParams();
  params.append('pageNumber', pageNumber.toString());
  params.append('pageSize', pageSize.toString());
  
  if (studentId !== undefined) {
    params.append('studentId', studentId.toString());
  }
  
  if (courseId !== undefined) {
    params.append('courseId', courseId.toString());
  }

  const response = await axiosInstance.get<PaginatedResponse<Enrollment>>(
    `/enrollments?${params.toString()}`
  );
  return response.data;
};

/**
 * Get enrollment by ID
 */
export const getEnrollmentById = async (id: number): Promise<Enrollment> => {
  const response = await axiosInstance.get<Enrollment>(`/enrollments/${id}`);
  return response.data;
};

/**
 * Create a new enrollment
 */
export const createEnrollment = async (enrollment: CreateEnrollment): Promise<Enrollment> => {
  const response = await axiosInstance.post<Enrollment>('/enrollments', enrollment);
  return response.data;
};

/**
 * Update an enrollment (primarily for grade updates)
 */
export const updateEnrollment = async (
  id: number,
  enrollment: UpdateEnrollment
): Promise<Enrollment> => {
  const response = await axiosInstance.put<Enrollment>(`/enrollments/${id}`, enrollment);
  return response.data;
};

/**
 * Delete an enrollment
 */
export const deleteEnrollment = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/enrollments/${id}`);
};

/**
 * Get all students for enrollment dropdown
 */
export const getStudentsForEnrollment = async (): Promise<Student[]> => {
  const response = await axiosInstance.get<PaginatedResponse<Student>>(
    '/students?pageSize=1000'
  );
  return response.data.data;
};

/**
 * Get all courses for enrollment dropdown
 */
export const getCoursesForEnrollment = async (): Promise<Course[]> => {
  const response = await axiosInstance.get<PaginatedResponse<Course>>(
    '/courses?pageSize=1000'
  );
  return response.data.data;
};
