// T159: Statistics API service
import apiClient from './client';
import type { EnrollmentDateGroup } from '../../types/statistics';

/**
 * Get enrollment statistics grouped by date
 */
export const getEnrollmentByDate = async (): Promise<EnrollmentDateGroup[]> => {
  const response = await apiClient.get<EnrollmentDateGroup[]>(
    '/statistics/enrollment-by-date'
  );
  return response.data;
};
