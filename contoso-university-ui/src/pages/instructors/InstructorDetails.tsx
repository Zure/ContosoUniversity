// T146: Instructor details page
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useNotification } from '../../context/NotificationContext';
import { getInstructorById, deleteInstructor } from '../../services/api/instructorService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { Instructor } from '../../types/instructor';

const InstructorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInstructor();
  }, [id]);

  const fetchInstructor = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getInstructorById(parseInt(id));
      setInstructor(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load instructor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !instructor) return;

    if (!window.confirm(`Are you sure you want to delete instructor "${instructor.fullName}"?`)) {
      return;
    }

    try {
      await deleteInstructor(parseInt(id));
      success('Instructor deleted successfully');
      navigate('/instructors');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete instructor';
      showError(message);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !instructor) {
    return (
      <ErrorMessage
        message={error || 'Instructor not found'}
        onRetry={fetchInstructor}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Instructor Details</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View instructor information and course assignments
          </p>
        </div>
        <div className="flex space-x-3">
          <Button asChild>
            <Link to={`/instructors/edit/${instructor.id}`}>
              Edit
            </Link>
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
          >
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{instructor.fullName}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Last Name</dt>
              <dd className="mt-1 text-sm text-foreground">{instructor.lastName}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">First Name</dt>
              <dd className="mt-1 text-sm text-foreground">{instructor.firstMidName}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">Hire Date</dt>
              <dd className="mt-1 text-sm text-foreground">
                {formatDate(instructor.hireDate)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">Office Location</dt>
              <dd className="mt-1 text-sm text-foreground">
                {instructor.officeLocation || (
                  <span className="text-muted-foreground">Not assigned</span>
                )}
              </dd>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <dt className="text-sm font-medium text-muted-foreground mb-3">Course Assignments</dt>
            {instructor.courseAssignments.length === 0 ? (
              <dd className="text-sm text-muted-foreground">No courses assigned</dd>
            ) : (
              <dd className="space-y-2">
                {instructor.courseAssignments.map((course) => (
                  <div
                    key={course.courseId}
                    className="flex items-start justify-between p-3 bg-muted rounded-md"
                  >
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {course.courseNumber} - {course.courseTitle}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Department: {course.departmentName}
                      </div>
                    </div>
                    <Button asChild variant="link" size="sm">
                      <Link to={`/courses/${course.courseId}`}>
                        View →
                      </Link>
                    </Button>
                  </div>
                ))}
              </dd>
            )}
          </div>
        </CardContent>

        <CardFooter className="bg-muted">
          <Button asChild variant="link" className="px-0">
            <Link to="/instructors">
              ← Back to Instructors
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InstructorDetails;
