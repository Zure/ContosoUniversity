// Course details page
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useNotification } from '../../context/NotificationContext';
import { getCourseById, deleteCourse } from '../../services/api/courseService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { Course } from '../../types/course';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getCourseById(parseInt(id));
      setCourse(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !course) return;

    const confirmMessage = course.enrollmentCount > 0
      ? `This course has ${course.enrollmentCount} enrollment(s). Are you sure you want to delete it?`
      : 'Are you sure you want to delete this course?';

    if (!window.confirm(confirmMessage)) return;

    try {
      await deleteCourse(parseInt(id));
      success('Course deleted successfully');
      navigate('/courses');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete course';
      showError(message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !course) {
    return (
      <ErrorMessage
        message={error || 'Course not found'}
        onRetry={fetchCourse}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Course Details</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View course information and manage enrollments
          </p>
        </div>
        <div className="flex space-x-3">
          <Button asChild>
            <Link to={`/courses/edit/${course.courseId}`}>
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
          <CardTitle>{course.title}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Course #{course.courseNumber}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Course Number</dt>
              <dd className="mt-1 text-sm text-foreground">{course.courseNumber}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">Credits</dt>
              <dd className="mt-1 text-sm text-foreground">{course.credits}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">Department</dt>
              <dd className="mt-1 text-sm text-foreground">{course.departmentName}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">Enrollments</dt>
              <dd className="mt-1 text-sm text-foreground">
                {course.enrollmentCount} student{course.enrollmentCount !== 1 ? 's' : ''}
              </dd>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <dt className="text-sm font-medium text-muted-foreground mb-2">Title</dt>
            <dd className="text-sm text-foreground">{course.title}</dd>
          </div>
        </CardContent>

        <CardFooter className="bg-muted">
          <Button asChild variant="link" className="px-0">
            <Link to="/courses">
              ← Back to Courses
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CourseDetailsPage;
