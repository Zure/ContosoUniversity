// T161: Statistics page
import React from 'react';
import EnrollmentStatistics from '../components/features/statistics/EnrollmentStatistics';

const StatisticsPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Statistics Dashboard</h1>
        <p className="mt-2 text-gray-600">
          View enrollment trends and university statistics
        </p>
      </div>

      <div className="space-y-8">
        <EnrollmentStatistics />
      </div>
    </div>
  );
};

export default StatisticsPage;
