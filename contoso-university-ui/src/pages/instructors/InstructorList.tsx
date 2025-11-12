// T142: Instructor list page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePagination } from '../../hooks/usePagination';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import { getInstructors, deleteInstructor } from '../../services/api/instructorService';
import type { Instructor } from '../../types/instructor';

const InstructorList: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchString, setSearchString] = useState('');
  const { success, error: showError } = useNotification();

  const {
    currentPage,
    pageSize,
    totalPages,
    hasPrevious,
    hasNext,
    setCurrentPage,
    setPaginationData,
    goToFirstPage,
  } = usePagination();

  useEffect(() => {
    fetchInstructors();
  }, [currentPage, pageSize, searchString]);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getInstructors(currentPage, pageSize, searchString || undefined);

      setInstructors(data.data);
      setPaginationData({
        totalCount: data.totalCount,
        totalPages: data.totalPages,
        hasPrevious: data.hasPrevious,
        hasNext: data.hasNext,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load instructors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchString(searchInput);
    goToFirstPage();
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchString('');
    goToFirstPage();
  };

  const handleDelete = async (id: number, fullName: string) => {
    if (!window.confirm(`Are you sure you want to delete instructor "${fullName}"?`)) {
      return;
    }

    try {
      await deleteInstructor(id);
      success('Instructor deleted successfully');
      fetchInstructors();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete instructor';
      showError(errorMessage);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && instructors.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Instructors</h1>
        <Link to="/instructors/create" className="btn btn-primary">
          Add New Instructor
        </Link>
      </div>

      <div className="search-bar">
        <div className="search-controls">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
          />
          <button onClick={handleSearch} className="btn btn-secondary">
            Search
          </button>
          {searchString && (
            <button onClick={handleClearSearch} className="btn btn-outline">
              Clear
            </button>
          )}
        </div>
        {searchString && (
          <div className="search-info">
            Showing results for: <strong>{searchString}</strong>
          </div>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Hire Date</th>
              <th>Office</th>
              <th>Courses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  {searchString ? 'No instructors found matching your search.' : 'No instructors found.'}
                </td>
              </tr>
            ) : (
              instructors.map((instructor) => (
                <tr key={instructor.id}>
                  <td>
                    <Link to={`/instructors/${instructor.id}`}>
                      {instructor.fullName}
                    </Link>
                  </td>
                  <td>{formatDate(instructor.hireDate)}</td>
                  <td>{instructor.officeLocation || '—'}</td>
                  <td>
                    {instructor.courseAssignments.length > 0 ? (
                      <div className="course-list">
                        {instructor.courseAssignments.map((course) => (
                          <div key={course.courseId} className="course-item">
                            {course.courseNumber} {course.courseTitle}
                            <span className="text-muted"> ({course.departmentName})</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">No courses assigned</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/instructors/edit/${instructor.id}`} className="btn btn-sm btn-secondary">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(instructor.id, instructor.fullName)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default InstructorList;
