// T160: Enrollment statistics component
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage';
import { getEnrollmentByDate } from '../../../services/api/statisticsService';
import type { EnrollmentDateGroup } from '../../../types/statistics';

const EnrollmentStatistics: React.FC = () => {
  const [data, setData] = useState<EnrollmentDateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await getEnrollmentByDate();
      setData(stats);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load enrollment statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTotalStudents = (): number => {
    return data.reduce((sum, item) => sum + item.studentCount, 0);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchStatistics} />;
  }

  return (
    <div className="enrollment-statistics">
      <div className="stats-header">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Enrollment Statistics
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Student enrollments grouped by enrollment date
        </p>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No enrollment data available
        </div>
      ) : (
        <>
          <div className="stats-summary mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Total Students:</span>
              <span className="text-2xl font-bold text-blue-600">
                {getTotalStudents()}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-700 font-medium">Enrollment Dates:</span>
              <span className="text-lg font-semibold text-blue-600">
                {data.length}
              </span>
            </div>
          </div>

          <div className="stats-table bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number of Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => {
                  const total = getTotalStudents();
                  const percentage = total > 0 ? ((item.studentCount / total) * 100).toFixed(1) : '0.0';
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatDate(item.enrollmentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.studentCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span>{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default EnrollmentStatistics;
